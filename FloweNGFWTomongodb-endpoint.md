Based on your detailed **NGFW system flow**, you are describing how a **centralized server** interacts with distributed **endpoints** (client machines) for authentication, data collection, rule synchronization, packet/domain filtering, and logging.

Here’s the **corrected version** of the full system flow — with **consistent and properly named endpoints**, **standard RESTful conventions**, and aligned to the idea of **endpoint coordination with a centralized server**.

---

# ✅ Corrected NGFW System Flow (Centralized Server Coordination)

---

## 1. Endpoint Registration & Initialization Flow

### 1.1 Endpoint Authentication

🔹 **Purpose:** Endpoint authenticates itself to the centralized server.

**Request:**

```
POST /api/endpoints/authenticate
{
  "endpoint_name": "<hostname>",
  "password": "<endpoint_password>"
}
```

**Response:**

```
{
  "status": "success",
  "endpoint_id": "507f1f77bcf86cd799439011"
}
```

---

### 1.2 Application & Process Information Submission

🔹 **Purpose:** Send all running processes and their network connections to the central server.

**Request:**

```
POST /api/endpoints/applications
{
  "endpoint_id": "507f1f77bcf86cd799439011",
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
}
```

**Response:**

```
{
  "status": "success",
  "message": "Application information saved"
}
```

---

## 2. Firewall Rule Synchronization Flow

### 2.1 Fetch Firewall Rules for Endpoint

🔹 **Purpose:** Get latest rules from the server for a specific endpoint.

**Request:**

```
GET /api/firewall/rules
Headers:
  X-Endpoint-ID: 507f1f77bcf86cd799439011
  X-Endpoint-Password: <endpoint_password>
```

**Response:**

```json
{
  "chrome.exe": [
    {
      "entity_type": "ip",
      "source_ip": "192.168.1.14",
      "destination_ip": "104.18.37.186",
      "source_port": 49778,
      "destination_port": 443,
      "action": "deny"
    },
    {
      "entity_type": "domain",
      "domain_name": "netflix.com",
      "action": "allow"
    }
  ],
  "msedgewebview2.exe": [
    {
      "entity_type": "domain",
      "domain_name": "netflix.com",
      "action": "deny"
    }
  ]
}
```

---

## 3. Packet Logging Flow

### 3.1 Log Allowed Packet

**Request:**

```
POST /api/logs
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
  "endpointId": "507f1f77bcf86cd799439012",
  "applicationId": "507f1f77bcf86cd799439013",
  "timestamp": "2025-05-28T17:32:24.425170Z"
}
```

---

### 3.2 Log Blocked Packet

**Request:**

```
POST /api/logs
{
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
  "endpointId": "507f1f77bcf86cd799439012",
  "applicationId": "507f1f77bcf86cd799439013",
  "timestamp": "2025-05-28T17:32:24.425170Z"
}
```

**Response (both cases):**

```json
{
  "status": "success",
  "message": "Log received",
  "validation_results": [
    {
      "is_valid": true,
      "log_data": {...},
      "validation_details": {
        "type": "valid",
        "level": "valid",
        "message": "valid",
        "details": "valid",
        "timestamp": "valid"
      }
    }
  ]
}
```

---

## 4. Domain Filtering Log Flow

### 4.1 Log Allowed Domain Access

**Request:**

```
POST /api/logs
{
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
  "endpointId": "507f1f77bcf86cd799439015",
  "applicationId": "507f1f77bcf86cd799439016",
  "timestamp": "2025-05-28T17:19:08.123456Z"
}
```

---

### 4.2 Log Blocked Domain Access

**Request:**

```
POST /api/logs
{
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
  "endpointId": "507f1f77bcf86cd799439012",
  "applicationId": "507f1f77bcf86cd799439013",
  "timestamp": "2025-05-28T17:19:06.487416Z"
}
```

**Response (both cases):**
_Same as packet logging response above._

---

## 5. Batch Logging Flow

### 5.1 Submit Multiple Logs

**Request:**

```
POST /api/logs/batch
{
  "logs": [
    {
      "type": "firewall",
      "level": "info",
      "message": "Packet allowed",
      "details": {...},
      "userId": "507f1f77bcf86cd799439011",
      "endpointId": "507f1f77bcf86cd799439012",
      "applicationId": "507f1f77bcf86cd799439013",
      "timestamp": "2025-05-28T17:32:24.425170Z"
    },
    {
      "type": "firewall",
      "level": "warning",
      "message": "Domain blocked",
      "details": {...},
      "userId": "507f1f77bcf86cd799439011",
      "endpointId": "507f1f77bcf86cd799439012",
      "applicationId": "507f1f77bcf86cd799439013",
      "timestamp": "2025-05-28T17:32:25.425170Z"
    }
  ]
}
```

**Response:**

```json
{
  "status": "success",
  "message": "Processed 2 logs, 2 valid",
  "total_logs": 2,
  "valid_logs": 2,
  "invalid_logs": 0,
  "validation_results": [
```

```
{
  "is_valid": true,
  "log_data": {...}
},
{
  "is_valid": true,
  "log_data": {...}
}
```

]
}

```

---

## 6. Fetch Log Statistics

**Request:**
```

GET /api/logs/stats

````

**Response:**
```json
{
  "status": "success",
  "stats": {
    "total_logs": 42,
    "by_type": { "firewall": 42 },
    "by_level": { "info": 28, "warning": 14 },
    "by_message": {
      "Packet allowed": 25,
      "Packet blocked": 10,
      "Domain allowed": 3,
      "Domain blocked": 4
    },
    "recent_logs": [
      {
        "log_data": {
          "type": "firewall",
          "level": "warning",
          "message": "Domain blocked",
          "details": {...},
          "timestamp": "2025-05-28T17:45:00.000Z"
        },
        "received_at": "2025-05-28T17:45:01.000Z",
        "is_valid": true
      }
    ]
  }
}
````

---

### 🔁 Summary of Updated Endpoints

| Purpose                     | Endpoint                      | Method |
| --------------------------- | ----------------------------- | ------ |
| Authenticate endpoint       | `/api/endpoints/authenticate` | POST   |
| Submit running applications | `/api/endpoints/applications` | POST   |
| Fetch rules                 | `/api/firewall/rules`         | GET    |
| Log single firewall event   | `/api/logs`                   | POST   |
| Log multiple events         | `/api/logs/batch`             | POST   |
| Fetch log statistics        | `/api/logs/stats`             | GET    |

---

Would you like this as a **Postman Collection file** or **OpenAPI spec** next?
