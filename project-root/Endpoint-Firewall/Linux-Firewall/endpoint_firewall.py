import netfilterqueue
import subprocess
import pickle
from scapy.all import IP
from threading import Thread
from time import sleep
import requests
import socket
import struct
from bcc import BPF

# Constants
MODEL_PATH = "/path/to/your_model.pkl"
NETWORK_INTERFACE = "eth0"  # Replace with your network interface
API_BASE_URL = "https://api-server"  # Replace with actual API server URL
AUTH_TOKEN = "your_bearer_token"  # Replace with your actual token
HEADERS = {"Authorization": f"Bearer {AUTH_TOKEN}"}

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

    // Submit packet data to user space
    events.perf_submit(skb, &packet, sizeof(packet));
    return 0;
}
"""

# Load ML Model
def load_model():
    print("Loading ML model...")
    with open(MODEL_PATH, "rb") as f:
        model = pickle.load(f)
    print("Model loaded successfully.")
    return model

# Check if IP exists in iptables
def check_iptables(ip):
    #For testing purpose only
    if ip=="192.168.138.1":
    	return True   
    try:
        result = subprocess.run(
            ["iptables", "-L", "-n", "-v"],
            stdout=subprocess.PIPE,
            text=True,
        )
        return ip in result.stdout
    except Exception as e:
        print(f"Error checking iptables: {e}")
        return False

# Add rule to iptables
def add_iptables_rule(ip, action="DROP"):
    try:
        subprocess.run(["iptables", "-A", "INPUT", "-s", ip, "-j", action], check=True)
        print(f"Added {action} rule for IP: {ip}")
    except subprocess.CalledProcessError as e:
        print(f"Failed to add iptables rule: {e}")

# Fetch policies from the API server
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

# Upload traffic logs to the API server
def send_traffic_log(endpoint_id, application_id, src_ip, dest_ip, protocol, status="allowed"):
    url = f"{API_BASE_URL}/api/traffic-logs"
    data = {
        "endpoint_id": endpoint_id,
        "application_id": application_id,
        "timestamp": "2024-11-25T10:00:00Z",  # Replace with actual timestamp
        "source_ip": src_ip,
        "destination_ip": dest_ip,
        "protocol": protocol,
        "status": status,
        "traffic_type": "inbound",
        "data_transferred": 2048,  # Example data size
    }
    try:
        response = requests.post(url, json=data, headers=HEADERS)
        response.raise_for_status()
        print("Traffic log uploaded successfully.")
    except requests.exceptions.RequestException as e:
        print(f"Error uploading traffic log: {e}")

# Send heartbeat signal to the API server
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

# Process packet and integrate with ML model
def process_packet(packet, model):
    scapy_packet = IP(packet.get_payload())
    src_ip = scapy_packet.src
    dest_ip = scapy_packet.dst
    protocol = scapy_packet.proto  # Protocol (6=TCP, 17=UDP, etc.)

    # Check if the IP already has a rule in iptables
    if check_iptables(src_ip):
        print(f"Rule exists for IP {src_ip}, bypassing ML model.")
        packet.accept()
        return

    # Analyze the packet with the ML model
    print(f"No rule for IP {src_ip}, analyzing with ML model.")
    features = [src_ip, dest_ip, protocol]  # Extend features as needed
    is_malicious = model.predict([features])[0]

    if is_malicious:
        print(f"Malicious packet from {src_ip}. Dropping and updating iptables.")
        add_iptables_rule(src_ip, action="DROP")
        send_traffic_log(1, "uuid-app-1", src_ip, dest_ip, "malicious", "denied")
        packet.drop()
    else:
        print(f"Safe packet from {src_ip}. Allowing and updating iptables.")
        add_iptables_rule(src_ip, action="ACCEPT")
        send_traffic_log(1, "uuid-app-1", src_ip, dest_ip, "safe", "allowed")
        packet.accept()

# Monitor traffic using eBPF
def monitor_traffic():
    print("Starting eBPF traffic monitoring...")
    b = BPF(text=BPF_PROGRAM)
    function = b.load_func("monitor_packets", BPF.SOCKET_FILTER)
    b.attach_raw_socket(function, NETWORK_INTERFACE)

    def handle_event(cpu, data, size):
        event = b["events"].event(data)
        src_ip = socket.inet_ntoa(struct.pack("=I", event.src_ip))
        dest_ip = socket.inet_ntoa(struct.pack("=I", event.dest_ip))
        protocol = "TCP" if event.protocol == 6 else ("UDP" if event.protocol == 17 else "OTHER")
        print(f"Packet: {src_ip} -> {dest_ip} ({protocol})")

    b["events"].open_perf_buffer(handle_event)

    print("Monitoring traffic on interface:", NETWORK_INTERFACE)
    while True:
        try:
            b.perf_buffer_poll()
        except KeyboardInterrupt:
            print("Stopping eBPF monitoring...")
            break

# Main Function
def main():
    endpoint_id = 1  # Replace with the actual endpoint ID
    print("Starting the packet processing script...")
    model = load_model()

    # Fetch policies and apply them
    policies = fetch_policies(endpoint_id)
    for policy in policies:
        for ip in policy.get("denied_ips", []):
            add_iptables_rule(ip, "DROP")

    # Start eBPF monitoring and heartbeat in separate threads
    Thread(target=monitor_traffic, daemon=True).start()
    Thread(target=send_heartbeat, args=(endpoint_id,), daemon=True).start()

    # Bind NFQUEUE for packet processing
    nfqueue = netfilterqueue.NetfilterQueue()
    nfqueue.bind(0, lambda packet: process_packet(packet, model))

    print("Listening for packets in NFQUEUE...")
    try:
        nfqueue.run()
    except KeyboardInterrupt:
        print("Stopping...")
    finally:
        nfqueue.unbind()

if __name__ == "__main__":
    main()
