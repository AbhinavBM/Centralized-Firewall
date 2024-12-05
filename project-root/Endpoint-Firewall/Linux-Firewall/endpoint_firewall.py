import socket
import struct
from bcc import BPF
import os
from threading import Thread
from time import sleep
import requests

# Constants
API_BASE_URL = "https://api-server"  # Replace with actual API server URL
AUTH_TOKEN = "your_bearer_token"  # Replace with your actual token
HEADERS = {"Authorization": f"Bearer {AUTH_TOKEN}"}
NETWORK_INTERFACE = "eth0"  # Replace with the network interface to monitor

# eBPF Program
BPF_PROGRAM = """
#include <uapi/linux/bpf.h>
#include <linux/if_ether.h>
#include <linux/ip.h>
#include <linux/tcp.h>

BPF_PERF_OUTPUT(events);

struct packet_t {
    u32 src_ip;
    u32 dest_ip;
    u16 src_port;
    u16 dest_port;
    u8 protocol;
};

int monitor_packets(struct __sk_buff *skb) {
    struct ethhdr *eth = bpf_hdr_pointer(skb, 0, sizeof(*eth));
    if (!eth) return 0;

    // Only process IP packets
    if (eth->h_proto != htons(ETH_P_IP)) {
        return 0;
    }

    struct iphdr *ip = bpf_hdr_pointer(skb, sizeof(*eth), sizeof(*ip));
    if (!ip) return 0;

    // Collect packet data
    struct packet_t packet = {};
    packet.src_ip = ip->saddr;
    packet.dest_ip = ip->daddr;
    packet.protocol = ip->protocol;

    // If TCP, parse ports
    if (ip->protocol == IPPROTO_TCP) {
        struct tcphdr *tcp = bpf_hdr_pointer(skb, sizeof(*eth) + sizeof(*ip), sizeof(*tcp));
        if (!tcp) return 0;
        packet.src_port = tcp->source;
        packet.dest_port = tcp->dest;
    }

    // Submit packet data to user space
    events.perf_submit(skb, &packet, sizeof(packet));
    return 0;
}
"""

# Fetch Policies from Server
def fetch_policies(endpoint_id):
    url = f"{API_BASE_URL}/api/endpoints/{endpoint_id}/status"
    try:
        response = requests.put(url, json={"status": "online"}, headers=HEADERS)
        response.raise_for_status()
        print(f"Policies fetched successfully for endpoint_id: {endpoint_id}")
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Error fetching policies: {e}")
        return []

# Monitor Traffic - eBPF
def monitor_traffic_linux():
    print("Starting eBPF traffic monitoring...")

    # Initialize BPF with the program
    b = BPF(text=BPF_PROGRAM)
    function = b.load_func("monitor_packets", BPF.SOCKET_FILTER)

    # Attach BPF program to the network interface
    b.attach_raw_socket(function, NETWORK_INTERFACE)

    def handle_event(cpu, data, size):
        event = b["events"].event(data)

        # Convert IP addresses from binary to human-readable form
        src_ip = socket.inet_ntoa(struct.pack("=I", event.src_ip))
        dest_ip = socket.inet_ntoa(struct.pack("=I", event.dest_ip))

        # Convert ports from network to host byte order
        src_port = socket.ntohs(event.src_port)
        dest_port = socket.ntohs(event.dest_port)

        protocol = "TCP" if event.protocol == 6 else "OTHER"

        print(f"Packet: {src_ip}:{src_port} -> {dest_ip}:{dest_port} ({protocol})")

        # Upload traffic log
        send_traffic_log(
            endpoint_id=1,
            application_id="uuid-app-1",
            src_ip=src_ip,
            dest_ip=dest_ip,
            protocol=protocol,
        )

    # Open a perf buffer to receive packet data
    b["events"].open_perf_buffer(handle_event)

    print("Monitoring traffic on interface:", NETWORK_INTERFACE)
    while True:
        try:
            b.perf_buffer_poll()
        except KeyboardInterrupt:
            print("Stopping eBPF monitoring...")
            break

# Apply Firewall Rules
def apply_firewall_rules(policies):
    print("Applying firewall rules...")
    for policy in policies:
        for ip in policy.get("denied_ips", []):
            os.system(f"iptables -A INPUT -s {ip} -j DROP")
            print(f"Blocked IP {ip} using iptables")

# Send Traffic Logs to Server
def send_traffic_log(endpoint_id, application_id, src_ip, dest_ip, protocol):
    url = f"{API_BASE_URL}/api/traffic-logs"
    data = {
        "endpoint_id": endpoint_id,
        "application_id": application_id,
        "timestamp": "2024-11-25T10:00:00Z",  # Replace with actual timestamp
        "source_ip": src_ip,
        "destination_ip": dest_ip,
        "protocol": protocol,
        "status": "allowed",  # Change based on traffic analysis
        "traffic_type": "inbound",  # or 'outbound'
        "data_transferred": 2048  # Example size of data transferred
    }
    try:
        response = requests.post(url, json=data, headers=HEADERS)
        response.raise_for_status()
        print("Traffic log uploaded successfully.")
    except requests.exceptions.RequestException as e:
        print(f"Error uploading traffic log: {e}")

# Heartbeat Signal
def send_heartbeat(endpoint_id):
    url = f"{API_BASE_URL}/api/endpoints/{endpoint_id}/status"
    data = {"status": "online"}
    while True:
        try:
            response = requests.put(url, json=data, headers=HEADERS)
            response.raise_for_status()
            print("Heartbeat sent successfully.")
        except requests.exceptions.RequestException as e:
            print(f"Error sending heartbeat: {e}")
        sleep(30)

# Main Function
def main():
    endpoint_id = 1  # Replace with the actual endpoint ID
    print("Starting the firewall endpoint script...")

    # Fetch policies and apply them
    policies = fetch_policies(endpoint_id)
    apply_firewall_rules(policies)

    # Start traffic monitoring and heartbeat in separate threads
    Thread(target=send_heartbeat, args=(endpoint_id,), daemon=True).start()
    monitor_traffic_linux()

if __name__ == "__main__":
    main()
