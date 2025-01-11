import json

def evaluate_policy(traffic_data):
    with open("../configs/policies.json") as f:
        policies = json.load(f)
    # Dummy policy evaluation
    return "ALLOW" if policies["default_policy"] == "ALLOW" else "DENY"
