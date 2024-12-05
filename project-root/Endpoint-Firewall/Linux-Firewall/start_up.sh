#!/bin/bash

# Check if the script is run as root
if [ "$EUID" -ne 0 ]; then
    echo "Please run this script as root (use sudo)."
    exit 1
fi

# Install required dependencies
install_dependencies() {
    echo "Updating package list..."
    apt update

    echo "Installing required dependencies: python3, pip3, clang, llvm, bpfcc-tools, iptables..."
    apt install -y python3 python3-pip clang llvm bpfcc-tools linux-headers-$(uname -r) iptables

    echo "Installing Python libraries: netfilterqueue, scapy, requests, bcc..."
    pip3 install netfilterqueue scapy requests bcc

    echo "All dependencies installed successfully."
}

# Create a systemd service file for the endpoint
setup_service() {
    echo "Creating systemd service for the endpoint..."

    SERVICE_FILE="/etc/systemd/system/firewall_endpoint.service"
    cat <<EOL > $SERVICE_FILE
[Unit]
Description=Endpoint Firewall Service
After=network.target

[Service]
Type=simple
ExecStart=/usr/bin/python3 $(pwd)/endpoint_firewall.py
WorkingDirectory=$(pwd)
Restart=always
User=root

[Install]
WantedBy=multi-user.target
EOL

    echo "Reloading systemd daemon..."
    systemctl daemon-reload

    echo "Enabling the endpoint service to start on boot..."
    systemctl enable firewall_endpoint.service

    echo "Starting the endpoint service..."
    systemctl start firewall_endpoint.service

    echo "Endpoint service setup complete."
}

# Main function
main() {
    echo "Starting installation process for Linux endpoint..."

    install_dependencies
    setup_service

    echo "Installation complete. The endpoint firewall service is now running and will start automatically on boot."
}

main
 