import json

def resolve_dns(ip_address):
    with open("../cache/dns_cache.json") as f:
        dns_cache = json.load(f)
    return dns_cache.get(ip_address, "Unknown")
