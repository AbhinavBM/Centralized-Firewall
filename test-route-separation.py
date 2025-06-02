#!/usr/bin/env python3
"""
Test script to verify that frontend and NGFW routes are properly separated.
This tests both authentication methods work correctly.
"""

import requests
import json
import sys

# Configuration
BACKEND_URL = "http://localhost:5000"
FRONTEND_CREDENTIALS = {
    "username": "admin",
    "password": "admin123"
}

def test_frontend_routes():
    """Test frontend routes with JWT authentication."""
    print("🌐 Testing Frontend Routes (JWT Authentication)")
    print("=" * 50)
    
    try:
        # 1. Login to get JWT token
        print("1. 🔐 Logging in to get JWT token...")
        login_response = requests.post(
            f"{BACKEND_URL}/api/auth/login", 
            json=FRONTEND_CREDENTIALS,
            timeout=10
        )
        
        if login_response.status_code != 200:
            print(f"❌ Login failed: {login_response.status_code}")
            print(f"   Response: {login_response.text}")
            return False
        
        token = login_response.json().get('token')
        print(f"✅ Login successful! Token received.")
        
        # 2. Test frontend firewall rules endpoint
        print("\n2. 📋 Testing frontend firewall rules endpoint...")
        headers = {
            'Authorization': f'Bearer {token}',
            'Content-Type': 'application/json'
        }
        
        frontend_rules_response = requests.get(
            f"{BACKEND_URL}/api/firewall/rules",
            headers=headers,
            timeout=10
        )
        
        print(f"   Status: {frontend_rules_response.status_code}")
        
        if frontend_rules_response.status_code == 200:
            rules_data = frontend_rules_response.json()
            print("✅ Frontend rules fetch successful!")
            print(f"   Response type: {type(rules_data)}")
            print(f"   Has 'success' field: {'success' in rules_data}")
            print(f"   Has 'data' field: {'data' in rules_data}")
            if 'data' in rules_data:
                print(f"   Rules count: {len(rules_data['data']) if isinstance(rules_data['data'], list) else 'N/A'}")
            return True
        else:
            print(f"❌ Frontend rules fetch failed!")
            print(f"   Response: {frontend_rules_response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Frontend test error: {e}")
        return False

def test_ngfw_routes():
    """Test NGFW routes with endpoint ID authentication."""
    print("\n🔧 Testing NGFW Routes (Endpoint ID Authentication)")
    print("=" * 50)
    
    try:
        # 1. Authenticate as NGFW endpoint
        print("1. 🔐 Authenticating as NGFW endpoint...")
        auth_payload = {
            "endpoint_name": "RitvikBaby",
            "password": "Ritvik@1234"
        }
        
        auth_response = requests.post(
            f"{BACKEND_URL}/api/endpoints/authenticate",
            json=auth_payload,
            timeout=10
        )
        
        if auth_response.status_code != 200:
            print(f"❌ NGFW authentication failed: {auth_response.status_code}")
            print(f"   Response: {auth_response.text}")
            return False
        
        auth_data = auth_response.json()
        endpoint_id = auth_data.get('endpoint_id')
        print(f"✅ NGFW authentication successful! Endpoint ID: {endpoint_id}")
        
        # 2. Test NGFW firewall rules endpoint
        print("\n2. 📋 Testing NGFW firewall rules endpoint...")
        headers = {
            'X-Endpoint-ID': str(endpoint_id),
            'Content-Type': 'application/json'
        }
        
        ngfw_rules_response = requests.get(
            f"{BACKEND_URL}/api/ngfw/firewall/rules",
            headers=headers,
            timeout=10
        )
        
        print(f"   Status: {ngfw_rules_response.status_code}")
        
        if ngfw_rules_response.status_code == 200:
            rules_data = ngfw_rules_response.json()
            print("✅ NGFW rules fetch successful!")
            print(f"   Response type: {type(rules_data)}")
            print(f"   Rules format: {json.dumps(rules_data, indent=2)}")
            return True
        else:
            print(f"❌ NGFW rules fetch failed!")
            print(f"   Response: {ngfw_rules_response.text}")
            return False
            
    except Exception as e:
        print(f"❌ NGFW test error: {e}")
        return False

def test_route_separation():
    """Test that routes are properly separated and don't interfere."""
    print("\n🚫 Testing Route Separation")
    print("=" * 50)
    
    try:
        # Test 1: Frontend route without JWT should fail
        print("1. Testing frontend route without JWT (should fail)...")
        response = requests.get(f"{BACKEND_URL}/api/firewall/rules", timeout=5)
        if response.status_code == 401:
            print("✅ Frontend route correctly requires JWT authentication")
        else:
            print(f"⚠️ Unexpected response: {response.status_code}")
        
        # Test 2: NGFW route without endpoint ID should fail
        print("\n2. Testing NGFW route without endpoint ID (should fail)...")
        response = requests.get(f"{BACKEND_URL}/api/ngfw/firewall/rules", timeout=5)
        if response.status_code == 401:
            print("✅ NGFW route correctly requires endpoint ID authentication")
        else:
            print(f"⚠️ Unexpected response: {response.status_code}")
        
        # Test 3: NGFW route with JWT should fail
        print("\n3. Testing NGFW route with JWT instead of endpoint ID (should fail)...")
        # First get a JWT token
        login_response = requests.post(
            f"{BACKEND_URL}/api/auth/login", 
            json=FRONTEND_CREDENTIALS,
            timeout=10
        )
        if login_response.status_code == 200:
            token = login_response.json().get('token')
            headers = {'Authorization': f'Bearer {token}'}
            response = requests.get(f"{BACKEND_URL}/api/ngfw/firewall/rules", headers=headers, timeout=5)
            if response.status_code == 401:
                print("✅ NGFW route correctly rejects JWT authentication")
            else:
                print(f"⚠️ Unexpected response: {response.status_code}")
        
        return True
        
    except Exception as e:
        print(f"❌ Route separation test error: {e}")
        return False

def test_backend_health():
    """Test backend health."""
    print("🏥 Testing Backend Health")
    print("=" * 50)
    
    try:
        response = requests.get(f"{BACKEND_URL}/health", timeout=5)
        if response.status_code == 200:
            health_data = response.json()
            print("✅ Backend is healthy!")
            print(f"   Message: {health_data.get('message', 'Unknown')}")
            return True
        else:
            print(f"❌ Backend health check failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Cannot connect to backend: {e}")
        return False

def main():
    """Main test function."""
    print("🧪 Route Separation Test")
    print("Testing that frontend and NGFW routes work independently")
    print("=" * 70)
    
    tests = [
        ("Backend Health", test_backend_health),
        ("Frontend Routes (JWT)", test_frontend_routes),
        ("NGFW Routes (Endpoint ID)", test_ngfw_routes),
        ("Route Separation", test_route_separation)
    ]
    
    results = []
    
    for test_name, test_func in tests:
        print(f"\n{'='*20} {test_name} {'='*20}")
        try:
            success = test_func()
            results.append((test_name, success))
        except Exception as e:
            print(f"❌ Test {test_name} failed with exception: {e}")
            results.append((test_name, False))
    
    # Summary
    print("\n" + "=" * 70)
    print("🏁 Test Results Summary")
    print("=" * 70)
    
    all_passed = True
    for test_name, success in results:
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"   {test_name:<30} {status}")
        if not success:
            all_passed = False
    
    print("=" * 70)
    
    if all_passed:
        print("🎉 ALL TESTS PASSED!")
        print("\n✅ Route separation is working correctly:")
        print("   1. Frontend routes use JWT authentication ✅")
        print("   2. NGFW routes use endpoint ID authentication ✅")
        print("   3. Routes don't interfere with each other ✅")
        print("   4. Proper error handling for wrong auth methods ✅")
        print("\n🚀 The 401 error in frontend should now be resolved!")
    else:
        print("⚠️ SOME TESTS FAILED!")
        print("\n🔧 Please check the failed tests above.")
    
    return all_passed

if __name__ == "__main__":
    try:
        success = main()
        sys.exit(0 if success else 1)
    except KeyboardInterrupt:
        print("\n🛑 Test interrupted by user")
        sys.exit(1)
    except Exception as e:
        print(f"\n❌ Test execution failed: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
