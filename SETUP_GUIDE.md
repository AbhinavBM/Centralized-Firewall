# 🛡️ Centralized Firewall System - Complete Setup Guide

## 🚀 Quick Start (Recommended)

### **Step 1: Run Setup**
```bash
# Run as Administrator
setup-complete-system.bat
```

### **Step 2: Start System**
```bash
# Run as Administrator  
start-system.bat
```

### **Step 3: Test System**
```bash
test-system.bat
```

## 📋 Prerequisites

- **Windows 10/11** (required for PyDivert)
- **Node.js 14+** 
- **Python 3.7+**
- **Administrator privileges** (required for packet interception)
- **Internet connection** (for MongoDB Atlas)

## 🏗️ System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │  MongoDB        │    │     NGFW        │
│   Dashboard     │◄──►│   Backend       │◄──►│   Firewall      │
│  (Port 3000)    │    │  (Port 5000)    │    │  (Admin Mode)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │   Mitmproxy     │
                       │ Domain Blocker  │
                       │  (Port 8080)    │
                       └─────────────────┘
```

## 🔧 Manual Setup (Alternative)

### **1. Install Dependencies**

#### Python Dependencies
```bash
cd NGFW
pip install -r requirements.txt
pip install mitmproxy
```

#### Node.js Dependencies
```bash
# Backend
cd mongodb-backend
npm install

# Frontend  
cd ../frontend-new
npm install
```

### **2. Configure Environment Files**

#### NGFW Configuration (`NGFW/.env`)
```env
CENTRAL_SERVER_URL=http://localhost:5000
ENDPOINT_NAME=RitvikBaby
ENDPOINT_PASSWORD=Ritvik@1234
LOG_LEVEL=INFO
MITMPROXY_HOST=127.0.0.1
MITMPROXY_PORT=8080
```

#### Backend Configuration (`mongodb-backend/src/.env`)
```env
PORT=5000
MONGODB_URI=mongodb+srv://roadsidecoder:yCeoaaLmLmYgxpK1@cluster0.yhpeljt.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=centralized_firewall_jwt_secret_key_2024_secure
```

#### Frontend Configuration (`frontend-new/.env`)
```env
VITE_API_URL=http://localhost:5000/api
VITE_WS_URL=ws://localhost:5000/ws
```

### **3. Initialize Database**
```bash
cd mongodb-backend
node src/scripts/create-ritvikbaby-endpoint.js
```

### **4. Start Components**

#### Terminal 1: MongoDB Backend
```bash
cd mongodb-backend
npm start
```

#### Terminal 2: Frontend Dashboard
```bash
cd frontend-new
npm run dev
```

#### Terminal 3: Mitmproxy Domain Blocker
```bash
cd NGFW
mitmproxy -s mitmproxy_domain_blocker.py --listen-port 8080
```

#### Terminal 4: Integrated NGFW (Run as Administrator)
```bash
cd NGFW
python main_integrated_firewall.py
```

## 🌐 Access Points

- **Frontend Dashboard**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Backend Health**: http://localhost:5000/health
- **Mitmproxy Web Interface**: http://localhost:8081

## 🔒 Domain Blocking Setup

### **Configure Browser Proxy**
1. **Chrome/Edge**: Settings → Advanced → System → Open proxy settings
2. **Firefox**: Settings → Network Settings → Manual proxy configuration
3. **Set HTTP Proxy**: `127.0.0.1:8080`
4. **Set HTTPS Proxy**: `127.0.0.1:8080`

### **Install Mitmproxy Certificate**
1. Navigate to http://mitm.it with proxy enabled
2. Download certificate for your OS
3. Install certificate in browser/system

### **Test Domain Blocking**
- **Allowed domains**: Listed in `NGFW/whitelisted_domains.json`
- **Blocked domains**: All others (whitelist-only mode)
- **Check logs**: Mitmproxy console shows blocking activity

## 🧪 Testing & Verification

### **System Health Checks**
```bash
# Test all components
test-system.bat

# Individual tests
curl http://localhost:5000/health
curl http://localhost:3000
curl http://localhost:8081
```

### **NGFW Integration Test**
```bash
cd NGFW
python test_integration.py
```

### **Domain Blocking Test**
1. Configure browser proxy to `127.0.0.1:8080`
2. Try accessing `facebook.com` (should be blocked)
3. Try accessing `google.com` (should be allowed)
4. Check mitmproxy logs for activity

## 🛠️ Troubleshooting

### **Common Issues**

#### NGFW Fails to Start
- **Solution**: Run as Administrator
- **Check**: Windows Firewall permissions
- **Verify**: PyDivert installation

#### Domain Blocking Not Working
- **Check**: Browser proxy configuration
- **Verify**: Mitmproxy certificate installation
- **Test**: Access http://mitm.it

#### Backend Connection Errors
- **Check**: MongoDB Atlas connection
- **Verify**: Environment variables
- **Test**: Network connectivity

#### Frontend Build Errors
- **Solution**: Clear node_modules and reinstall
- **Check**: Node.js version compatibility
- **Verify**: Environment file configuration

### **Log Locations**
- **NGFW Logs**: Console output
- **Backend Logs**: `mongodb-backend/logs/`
- **Mitmproxy Logs**: Console output
- **Frontend Logs**: Browser console

## 🔄 System Management

### **Start System**
```bash
start-system.bat
```

### **Stop System**
```bash
stop-system.bat
```

### **Restart Individual Components**
```bash
# Restart backend
cd mongodb-backend && npm start

# Restart frontend  
cd frontend-new && npm run dev

# Restart NGFW (as admin)
cd NGFW && python main_integrated_firewall.py
```

## 📊 Features Overview

- ✅ **Centralized Management**: Web dashboard for firewall rules
- ✅ **Real-time Monitoring**: Live traffic and blocking logs  
- ✅ **Domain Blocking**: Whitelist-only proxy filtering
- ✅ **Packet Filtering**: Application-specific rules
- ✅ **Authentication**: Secure endpoint registration
- ✅ **Rule Synchronization**: Automatic rule updates
- ✅ **Logging**: Centralized event collection

## 🎯 Next Steps

1. **Configure Rules**: Use frontend dashboard to create firewall rules
2. **Monitor Traffic**: Check logs and analytics in dashboard
3. **Customize Domains**: Edit `whitelisted_domains.json` for allowed sites
4. **Add Endpoints**: Register additional firewall endpoints
5. **Performance Tuning**: Adjust configuration for your environment

---

**🔥 System is now ready for production use!**
