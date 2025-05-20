#!/bin/bash

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate

# Remove the existing virtual environment packages
echo "Cleaning up existing packages..."
pip uninstall -y flask flask-restful flask-cors werkzeug

# Install specific versions of packages to ensure compatibility
echo "Installing compatible packages..."
pip install flask==2.2.3 werkzeug==2.2.3 flask-restful==0.3.9 flask-cors==3.0.10
pip install requests==2.28.2 websocket-client==1.5.1 python-dotenv==1.0.0 pymongo==4.3.3 pyjwt==2.6.0 schedule==1.1.0

# Create necessary directories
echo "Creating necessary directories..."
mkdir -p data logs

# Run the application
echo "Running the application..."
python3 app.py
