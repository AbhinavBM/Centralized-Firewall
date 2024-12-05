#!/bin/bash

# Check if the script is run as root
if [ "$EUID" -ne 0 ]; then
    echo "Please run this script as root (use sudo)."
    exit 1
fi

# Install required system dependencies
install_dependencies() {
    echo "Updating package list..."
    apt update

    echo "Installing required dependencies: python3, pip3, clang, llvm, bpfcc-tools, iptables..."
    apt install -y python3 python3-pip clang llvm bpfcc-tools linux-headers-$(uname -r) iptables python3-venv

    echo "Installing development libraries for netfilterqueue..."
    apt install -y libnfnetlink-dev libnetfilter-queue-dev

    echo "All system dependencies installed successfully."
}

# Set up Python virtual environment and install Python packages
setup_python_environment() {
    echo "Setting up Python virtual environment..."

    # Create a virtual environment
    VENV_PATH=$(pwd)/venv
    python3 -m venv $VENV_PATH

    # Activate the virtual environment
    source $VENV_PATH/bin/activate

    echo "Installing required Python libraries: netfilterqueue, scapy, requests, bcc..."
    pip install netfilterqueue scapy requests bcc

    echo "Python dependencies installed successfully."
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
ExecStart=$(pwd)/venv/bin/python3 $(pwd)/endpoint_firewall.py
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

# Add iptables rule to forward packets to NFQUEUE
setup_iptables() {
    echo "Adding iptables rule to forward packets to NFQUEUE..."
    iptables -I INPUT -j NFQUEUE --queue-num 0
    echo "Iptables rule added successfully."
}

# Main function
main() {
    echo "Starting installation process for Linux endpoint..."

    install_dependencies
    setup_python_environment
    setup_iptables
    setup_service

    echo "Installation complete. The endpoint firewall service is now running and will start automatically on boot."
}

main
