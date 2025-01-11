import logging
from traffic_interceptor import capture_traffic
from policy_manager import evaluate_policy
from dns_resolver import resolve_dns
from anomaly_detection import detect_anomalies
from communication import send_to_server
from optimizer import optimize_performance

logging.basicConfig(filename="../logs/agent.log", level=logging.INFO)

def main():
    logging.info("Starting endpoint-agent...")
    optimize_performance()
    traffic_data = capture_traffic()
    for traffic in traffic_data:
        action = evaluate_policy(traffic)
        dns = resolve_dns(traffic["source"])
        anomaly = detect_anomalies(traffic)
        data_to_send = {
            "traffic": traffic,
            "policy_action": action,
            "dns": dns,
            "anomaly": anomaly
        }
        send_to_server(data_to_send)

if __name__ == "__main__":
    main()
