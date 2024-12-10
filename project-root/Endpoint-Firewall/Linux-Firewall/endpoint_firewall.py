import os
from dotenv import load_dotenv
import socket
import struct
import requests
from time import sleep
from threading import Thread
from bcc import BPF
from datetime import datetime

# Load environment variables from .env file
load_dotenv()

# Constants loaded from .env file
END_ID = os.getenv("END_ID")
NETWORK_INTERFACE = os.getenv("NETWORK_INTERFACE")
API_BASE_URL = os.getenv("API_BASE_URL")
AUTH_TOKEN = os.getenv("AUTH_TOKEN")
INTERVAL_FETCH_RULES = int(os.getenv("INTERVAL_FETCH_RULES", 60))  # Default to 60 if not provided

HEADERS = {"Authorization": f"Bearer {AUTH_TOKEN}"}

# eBPF Program with a map for rules
BPF_PROGRAM = """
#include <uapi/linux/bpf.h>
#include <linux/if_ether.h>
#include <linux/ip.h>
#include <linux/tcp.h>
#include <linux/udp.h>
#include <string.h>

#define MAX_RULES 100

struct rule_t {
    u32 src_ip;
    u32 dest_ip;
    u16 src_port;
    u16 dest_port;
    u8 protocol;
    char action[10];  // "ACCEPT" or "DROP"
};

BPF_ARRAY(rules, struct rule_t, MAX_RULES);
BPF_PERF_OUTPUT(events);

struct packet_t {
    u32 src_ip;
    u32 dest_ip;
    u8 protocol;
    u16 src_port;
    u16 dest_port;
    char action[10];
};

int xdp_prog(struct xdp_md *ctx) {
    struct ethhdr *eth = bpf_hdr_pointer(ctx, 0, sizeof(*eth));
    if (!eth) return XDP_PASS;

    if (eth->h_proto != htons(ETH_P_IP)) {
        return XDP_PASS;  // Not an IP packet
    }

    struct iphdr *ip = bpf_hdr_pointer(ctx, sizeof(*eth), sizeof(*ip));
    if (!ip) return XDP_PASS;

    struct packet_t packet = {};
    packet.src_ip = ip->saddr;
    packet.dest_ip = ip->daddr;
    packet.protocol = ip->protocol;

    if (ip->protocol == IPPROTO_TCP || ip->protocol == IPPROTO_UDP) {
        struct tcphdr *tcp = bpf_hdr_pointer(ctx, sizeof(*eth) + sizeof(*ip), sizeof(*tcp));
        if (tcp) {
            packet.src_port = ntohs(tcp->source);
            packet.dest_port = ntohs(tcp->dest);
        }
    }

    // Iterate through rules map
    for (int i = 0; i < MAX_RULES; i++) {
        struct rule_t *rule = rules.lookup(&i);
        if (!rule) break;

        if (rule->src_ip == packet.src_ip &&
            rule->dest_ip == packet.dest_ip &&
            rule->src_port == packet.src_port &&
            rule->dest_port == packet.dest_port &&
            rule->protocol == packet.protocol) {
            memcpy(packet.action, rule->action, sizeof(packet.action));
            events.perf_submit(ctx, &packet, sizeof(packet));
            if (strncmp(rule->action, "DROP", 4) == 0) {
                return XDP_DROP;
            }
            return XDP_PASS;
        }
    }

    memcpy(packet.action, "ACCEPT", sizeof(packet.action));
    events.perf_submit(ctx, &packet, sizeof(packet));
    return XDP_PASS;
}
"""

# Function to send traffic log
def send_traffic_log(src_ip, dest_ip, src_port, dest_port, protocol, action, packet_data):
    url = f"{API_BASE_URL}/api/traffic-logs"
    timestamp = datetime.utcnow().isoformat()  # Get the current timestamp in ISO format
    data = {
        "endpoint_id": END_ID,
        "source_ip": src_ip,
        "destination_ip": dest_ip,
        "source_port": src_port,
        "destination_port": dest_port,
        "protocol": protocol,
        "action": action,
        "packet_data": packet_data.hex(),  # Encode packet data as hex
        "timestamp": timestamp  # Add timestamp field
    }
    try:
        response = requests.post(url, json=data, headers=HEADERS)
        response.raise_for_status()
        print(f"Traffic log uploaded successfully at {timestamp}.")
    except requests.exceptions.RequestException as e:
        print(f"Error uploading traffic log: {e}")

# Function to send alert when a packet is dropped
def send_alert(src_ip, dest_ip, src_port, dest_port, protocol, packet_data):
    url = f"{API_BASE_URL}/api/alerts"
    timestamp = datetime.utcnow().isoformat()  # Get the current timestamp in ISO format
    data = {
        "endpoint_id": END_ID,
        "src_ip": src_ip,
        "dest_ip": dest_ip,
        "src_port": src_port,
        "dest_port": dest_port,
        "protocol": protocol,
        "alert_type": "denied_packet",
        "message": "Packet was denied based on iptables rules.",
        "packet_data": packet_data.hex(),  # Encode packet data as hex
        "timestamp": timestamp  # Add timestamp field
    }
    try:
        response = requests.post(url, json=data, headers=HEADERS)
        response.raise_for_status()
        print(f"Alert sent successfully at {timestamp}.")
    except requests.exceptions.RequestException as e:
        print(f"Error sending alert: {e}")

# Event handler for eBPF events
def handle_event(cpu, data, size):
    event = b["events"].event(data)
    src_ip = socket.inet_ntoa(struct.pack("=I", event.src_ip))
    dest_ip = socket.inet_ntoa(struct.pack("=I", event.dest_ip))
    protocol = "TCP" if event.protocol == 6 else "UDP"
    action = event.action.decode('utf-8')
    src_port = event.src_port
    dest_port = event.dest_port

    print(f"Packet: {src_ip}:{src_port} -> {dest_ip}:{dest_port} ({protocol}) - {action}")

    Thread(target=send_traffic_log, args=(src_ip, dest_ip, src_port, dest_port, protocol, action)).start()
    if action == "DROP":
        Thread(target=send_alert, args=(src_ip, dest_ip, src_port, dest_port, protocol)).start()

# Fetch rules periodically
def fetch_rules():
    while True:
        try:
            response = requests.get(f"{API_BASE_URL}/api/rules", headers=HEADERS)
            response.raise_for_status()
            rules = response.json()

            # Update eBPF rules map
            bpf_map = b["rules"]
            for i, rule in enumerate(rules[:100]):  # Limit to MAX_RULES
                bpf_map[i] = (
                    socket.inet_aton(rule["src_ip"]),
                    socket.inet_aton(rule["dest_ip"]),
                    socket.htons(rule["src_port"]),
                    socket.htons(rule["dest_port"]),
                    rule["protocol"],
                    rule["action"].encode("utf-8"),
                )
            print("Rules updated.")
        except Exception as e:
            print(f"Error fetching rules: {e}")
        sleep(INTERVAL_FETCH_RULES)

# Main function
def main():
    global b
    b = BPF(text=BPF_PROGRAM)
    fn = b.load_func("xdp_prog", BPF.XDP)
    b.attach_xdp(NETWORK_INTERFACE, fn)

    Thread(target=fetch_rules).start()
    b["events"].open_perf_buffer(handle_event)

    try:
        while True:
            b.perf_buffer_poll()
    except KeyboardInterrupt:
        b.remove_xdp(NETWORK_INTERFACE)

if __name__ == "__main__":
    main()
