import socket
import os
from threading import Thread
from time import sleep

# Simulated constants
SIMULATED_POLICIES = [{"denied_ips": ["192.168.1.100", "10.0.0.1"]}]

# Fetch Policies from Server (Simulated)
def fetch_policies(endpoint_id):
    print(f"Simulating fetching policies for endpoint_id: {endpoint_id}")
    # Simulated response
    return SIMULATED_POLICIES

# Monitor Traffic - Simulated for Linux (or replace with actual eBPF logic)
def monitor_traffic_linux():
    print("Monitoring traffic (simulated)...")
    while True:
        # Simulate packet monitoring
        print("Simulated packet: 192.168.1.10 -> 192.168.1.20")
        sleep(5)

# Apply Firewall Rules
def apply_firewall_rules(policies):
    print("Applying firewall rules...")
    for policy in policies:
        for ip in policy.get("denied_ips", []):
            os.system(f"iptables -A INPUT -s {ip} -j DROP")
            print(f"Blocked IP {ip} using iptables")

# Heartbeat Signal (Simulated)
def send_heartbeat(endpoint_id):
    print(f"Simulating heartbeat for endpoint_id: {endpoint_id}")
    while True:
        print("Heartbeat sent (simulated)")
        sleep(30)  # Simulated heartbeat interval

# Main Function
def main():
    endpoint_id = 1  # Replace with the actual endpoint ID
    print("Starting the firewall endpoint script...")

    # Simulated fetching and applying policies
    policies = fetch_policies(endpoint_id)
    apply_firewall_rules(policies)

    # Start traffic monitoring and heartbeat in separate threads
    Thread(target=send_heartbeat, args=(endpoint_id,), daemon=True).start()
    monitor_traffic_linux()

if __name__ == "__main__":
    main()
