import requests
import logging

def send_to_server(data):
    logging.info("Sending data to server...")
    response = requests.post("http://example.com/api", json=data)
    return response.status_code
