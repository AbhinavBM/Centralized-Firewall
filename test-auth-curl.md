# Test Endpoint Authentication with Hashed Passwords

## 1. Create Endpoint via Frontend API

First, login to get JWT token:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123"
  }'
```

If admin user doesn't exist, create it:
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123",
    "role": "admin"
  }'
```

Create endpoint with hashed password:
```bash
curl -X POST http://localhost:5000/api/endpoints \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -d '{
    "hostname": "SERVER 01",
    "ipAddress": "192.168.1.101",
    "os": "Windows Server 2022",
    "status": "pending",
    "password": "Abhi@1234"
  }'
```

## 2. Test NGFW Authentication

Test with correct credentials:
```bash
curl -X POST http://localhost:5000/api/endpoints/authenticate \
  -H "Content-Type: application/json" \
  -d '{
    "endpoint_name": "SERVER 01",
    "password": "Abhi@1234"
  }'
```

Test with wrong password:
```bash
curl -X POST http://localhost:5000/api/endpoints/authenticate \
  -H "Content-Type: application/json" \
  -d '{
    "endpoint_name": "SERVER 01",
    "password": "WrongPassword"
  }'
```

## Expected Results

### Successful Authentication:
```json
{
  "status": "success",
  "endpoint_id": "60f7b3b3b3b3b3b3b3b3b3b3"
}
```

### Failed Authentication:
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

## What Changed

1. **Endpoint Model** - Added bcrypt hashing for passwords
2. **NGFW Controller** - Updated to use `comparePassword()` method
3. **NGFW Firewall Controller** - Updated password comparison
4. **Authentication.py** - Updated with your credentials

## Password Flow

1. **Frontend creates endpoint** → Password gets hashed automatically by Mongoose pre-save hook
2. **NGFW authenticates** → Plain text password compared with hashed password using bcrypt
3. **Authentication succeeds** → Endpoint status updated to 'online'
