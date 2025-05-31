# NGFW System cURL Commands

## Base Configuration

```bash
export BASE_URL="http://localhost:3000/api"
export ENDPOINT_ID=""  # Will be set after authentication
export ENDPOINT_PASSWORD="Ritvik@1234"
```

---

## 1. 🔐 Endpoint Authentication

```bash
curl -X POST "${BASE_URL}/endpoints/authenticate" \
  -H "Content-Type: application/json" \
  -d '{
    "endpoint_name": "RitvikBaby",
    "password": "Ritvik@1234"
  }'
```

**Expected Response:**

```json
{
  "status": "success",
  "endpoint_id": "507f1f77bcf86cd799439011"
}
```

---

## 2. 📱 Submit Applications

```bash
# Set ENDPOINT_ID from previous response
export ENDPOINT_ID="507f1f77bcf86cd799439011"

curl -X POST "${BASE_URL}/endpoints/applications" \
  -H "Content-Type: application/json" \
  -d '{
    "endpoint_id": "'${ENDPOINT_ID}'",
    "applications": {
      "chrome.exe": {
        "description": "Web browser",
        "status": "running",
        "associated_ips": [
          {
            "source_ip": "192.168.1.14",
            "destination_ip": "172.217.163.132"
          }
        ],
        "source_ports": [49775, 49776],
        "destination_ports": [443]
      },
      "msedgewebview2.exe": {
        "description": "Edge WebView component",
        "status": "running",
        "associated_ips": [
          {
            "source_ip": "127.0.0.1",
            "destination_ip": "127.0.0.1"
          }
        ],
        "source_ports": [59555],
        "destination_ports": [59555]
      }
    }
  }'
```

---

## 3. 🛡️ Fetch Firewall Rules

```bash
curl -X GET "${BASE_URL}/firewall/rules" \
  -H "X-Endpoint-ID: ${ENDPOINT_ID}" \
  -H "X-Endpoint-Password: ${ENDPOINT_PASSWORD}"
```

---

## 4. 📝 Log Allowed Packet

```bash
curl -X POST "${BASE_URL}/logs" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "firewall",
    "level": "info",
    "message": "Packet allowed",
    "details": {
      "firewall_action": "allow",
      "source_ip": "192.168.1.14",
      "destination_ip": "172.217.163.132",
      "source_port": 49775,
      "destination_port": 443,
      "protocol": "TCP",
      "source_service": "Chrome",
      "destination_service": "HTTPS",
      "matched_rule": {
        "action": "allow",
        "service": "HTTPS",
        "process_name": "chrome.exe"
      }
    },
    "userId": "507f1f77bcf86cd799439011",
    "endpointId": "'${ENDPOINT_ID}'",
    "applicationId": "507f1f77bcf86cd799439013",
    "timestamp": "'$(date -u +%Y-%m-%dT%H:%M:%S.%3NZ)'"
  }'
```

---

## 5. 🚫 Log Blocked Packet

```bash
curl -X POST "${BASE_URL}/logs" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "firewall",
    "level": "warning",
    "message": "Packet blocked",
    "details": {
      "firewall_action": "block",
      "source_ip": "192.168.1.14",
      "destination_ip": "104.18.37.186",
      "source_port": 49778,
      "destination_port": 443,
      "protocol": "TCP",
      "source_service": "Chrome",
      "destination_service": "HTTPS",
      "matched_rule": {
        "action": "deny",
        "service": "HTTPS",
        "process_name": "chrome.exe"
      }
    },
    "userId": "507f1f77bcf86cd799439011",
    "endpointId": "'${ENDPOINT_ID}'",
    "applicationId": "507f1f77bcf86cd799439013",
    "timestamp": "'$(date -u +%Y-%m-%dT%H:%M:%S.%3NZ)'"
  }'
```

---

## 6. ✅ Log Allowed Domain

```bash
curl -X POST "${BASE_URL}/logs" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "firewall",
    "level": "info",
    "message": "Domain allowed",
    "details": {
      "allowed_domain": "google.com",
      "user_agent": "Chrome/91.0.4472.124",
      "source_ip": "192.168.1.14",
      "firewall_action": "allow",
      "reason": "Domain in whitelist"
    },
    "userId": "507f1f77bcf86cd799439014",
    "endpointId": "'${ENDPOINT_ID}'",
    "applicationId": "507f1f77bcf86cd799439016",
    "timestamp": "'$(date -u +%Y-%m-%dT%H:%M:%S.%3NZ)'"
  }'
```

---

## 7. ❌ Log Blocked Domain

```bash
curl -X POST "${BASE_URL}/logs" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "firewall",
    "level": "warning",
    "message": "Domain blocked",
    "details": {
      "blocked_domain": "facebook.com",
      "user_agent": "Mozilla/5.0",
      "source_ip": "192.168.1.14",
      "firewall_action": "block",
      "reason": "Domain not in whitelist"
    },
    "userId": "507f1f77bcf86cd799439011",
    "endpointId": "'${ENDPOINT_ID}'",
    "applicationId": "507f1f77bcf86cd799439013",
    "timestamp": "'$(date -u +%Y-%m-%dT%H:%M:%S.%3NZ)'"
  }'
```

---

## 8. 📦 Batch Log Submission

```bash
curl -X POST "${BASE_URL}/logs/batch" \
  -H "Content-Type: application/json" \
  -d '{
    "logs": [
      {
        "type": "firewall",
        "level": "info",
        "message": "Packet allowed",
        "details": {
          "firewall_action": "allow",
          "source_ip": "192.168.1.14",
          "destination_ip": "172.217.163.132",
          "source_port": 49775,
          "destination_port": 443,
          "protocol": "TCP"
        },
        "userId": "507f1f77bcf86cd799439011",
        "endpointId": "'${ENDPOINT_ID}'",
        "applicationId": "507f1f77bcf86cd799439013",
        "timestamp": "'$(date -u +%Y-%m-%dT%H:%M:%S.%3NZ)'"
      },
      {
        "type": "firewall",
        "level": "warning",
        "message": "Domain blocked",
        "details": {
          "blocked_domain": "malicious-site.com",
          "firewall_action": "block",
          "reason": "Domain blacklisted"
        },
        "userId": "507f1f77bcf86cd799439011",
        "endpointId": "'${ENDPOINT_ID}'",
        "applicationId": "507f1f77bcf86cd799439013",
        "timestamp": "'$(date -u +%Y-%m-%dT%H:%M:%S.%3NZ)'"
      }
    ]
  }'
```

---

## 9. 📊 Get Log Statistics

```bash
curl -X GET "${BASE_URL}/logs/stats"
```
