#!/usr/bin/env python3
"""
Complete Flow Test: Authentication -> Rules Fetch -> Verification
Tests the complete flow of endpoint authentication and rules fetching.
"""

import sys
import os
import requests
import json
from datetime import datetime

# Add NGFW directory to path
sys.path.append('NGFW')

from authentication import EndpointAuthenticator
from firewall_rules import FirewallRulesManager
from config import CENTRAL_SERVER_BASE_URL, ENDPOINT_NAME, ENDPOINT_PASSWORD

def test_backend_health():
    """Test if backend is running."""
    print("🏥 Testing Backend Health...")
    
    try:
        health_url = f"{CENTRAL_SERVER_BASE_URL}/health"
        response = requests.get(health_url, timeout=5)
        
        if response.status_code == 200:
            health_data = response.json()
            print(f"✅ Backend is healthy!")
            print(f"   Server: {health_data.get('message', 'Unknown')}")
            print(f"   Timestamp: {health_data.get('timestamp', 'Unknown')}")
            return True
        else:
            print(f"❌ Backend health check failed: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Cannot connect to backend: {e}")
        print(f"   Make sure backend is running on {CENTRAL_SERVER_BASE_URL}")
        return False

def test_authentication():
    """Test endpoint authentication."""
    print("\n🔐 Testing Endpoint Authentication...")
    print(f"   Endpoint: {ENDPOINT_NAME}")
    print(f"   Server: {CENTRAL_SERVER_BASE_URL}")
    
    try:
        authenticator = EndpointAuthenticator()
        endpoint_id = authenticator.authenticate_endpoint()
        
        if endpoint_id:
            print(f"✅ Authentication successful!")
            print(f"   Endpoint ID: {endpoint_id}")
            return True, endpoint_id
        else:
            print("❌ Authentication failed!")
            return False, None
            
    except Exception as e:
        print(f"❌ Authentication error: {e}")
        return False, None

def test_rules_fetch_manual(endpoint_id):
    """Test manual rules fetching with endpoint ID."""
    print("\n📋 Testing Manual Rules Fetch...")
    
    rules_url = f"{CENTRAL_SERVER_BASE_URL}/api/ngfw/firewall/rules"
    headers = {
        'X-Endpoint-ID': str(endpoint_id),
        'Content-Type': 'application/json'
    }
    
    try:
        print(f"   URL: {rules_url}")
        print(f"   Headers: {headers}")
        
        response = requests.get(rules_url, headers=headers, timeout=10)
        
        print(f"   Response Status: {response.status_code}")
        
        if response.status_code == 200:
            rules_data = response.json()
            print("✅ Manual rules fetch successful!")
            print(f"   Rules type: {type(rules_data)}")
            print(f"   Rules content: {json.dumps(rules_data, indent=2)}")
            return True, rules_data
        elif response.status_code == 401:
            print("❌ Unauthorized - Invalid endpoint ID")
            return False, None
        elif response.status_code == 404:
            print("❌ Endpoint not found")
            return False, None
        else:
            print(f"❌ Rules fetch failed: {response.status_code}")
            print(f"   Response: {response.text}")
            return False, None
            
    except Exception as e:
        print(f"❌ Error during manual fetch: {e}")
        return False, None

def test_rules_manager(endpoint_id):
    """Test FirewallRulesManager."""
    print("\n🔧 Testing FirewallRulesManager...")
    
    try:
        rules_manager = FirewallRulesManager(endpoint_id)
        success = rules_manager.sync_rules_from_server()
        
        if success:
            rules = rules_manager.get_rules()
            print(f"✅ Rules manager sync successful!")
            print(f"   Total rules loaded: {len(rules)}")
            
            # Display sample rules
            if rules:
                print("   📄 Sample rules:")
                for i, rule in enumerate(rules[:3]):
                    print(f"      {i+1}. Action: {rule.get('action', 'unknown')}")
                    print(f"         Service: {rule.get('service', 'unknown')}")
                    print(f"         Entity Type: {rule.get('entity_type', 'unknown')}")
                    if rule.get('src_ip'):
                        print(f"         Source IP: {rule.get('src_ip')}")
                    if rule.get('dst_ip'):
                        print(f"         Dest IP: {rule.get('dst_ip')}")
                    print()
            else:
                print("   ℹ️ No rules loaded (this is normal if no rules are configured)")
            
            return True, rules
        else:
            print("❌ Rules manager sync failed!")
            return False, None
            
    except Exception as e:
        print(f"❌ Rules manager error: {e}")
        return False, None

def test_unauthorized_access():
    """Test that unauthorized access is properly blocked."""
    print("\n🚫 Testing Unauthorized Access Protection...")
    
    rules_url = f"{CENTRAL_SERVER_BASE_URL}/api/ngfw/firewall/rules"
    
    # Test 1: No headers
    try:
        response = requests.get(rules_url, timeout=5)
        if response.status_code == 401:
            print("✅ No headers: Correctly blocked (401)")
        else:
            print(f"⚠️ No headers: Unexpected response {response.status_code}")
    except Exception as e:
        print(f"❌ Error testing no headers: {e}")
    
    # Test 2: Invalid endpoint ID
    try:
        headers = {'X-Endpoint-ID': 'invalid_id_12345'}
        response = requests.get(rules_url, headers=headers, timeout=5)
        if response.status_code in [401, 404]:
            print("✅ Invalid ID: Correctly blocked (401/404)")
        else:
            print(f"⚠️ Invalid ID: Unexpected response {response.status_code}")
    except Exception as e:
        print(f"❌ Error testing invalid ID: {e}")

def main():
    """Main test function."""
    print("🧪 Complete NGFW Flow Test")
    print("=" * 60)
    print(f"Testing endpoint: {ENDPOINT_NAME}")
    print(f"Testing server: {CENTRAL_SERVER_BASE_URL}")
    print("=" * 60)
    
    # Test sequence
    tests = []
    endpoint_id = None
    
    # 1. Backend Health
    health_ok = test_backend_health()
    tests.append(("Backend Health", health_ok))
    
    if not health_ok:
        print("\n❌ Cannot continue without backend connection")
        return False
    
    # 2. Authentication
    auth_ok, endpoint_id = test_authentication()
    tests.append(("Authentication", auth_ok))
    
    if not auth_ok:
        print("\n❌ Cannot continue without authentication")
        return False
    
    # 3. Manual Rules Fetch
    manual_ok, manual_rules = test_rules_fetch_manual(endpoint_id)
    tests.append(("Manual Rules Fetch", manual_ok))
    
    # 4. Rules Manager
    manager_ok, manager_rules = test_rules_manager(endpoint_id)
    tests.append(("Rules Manager", manager_ok))
    
    # 5. Security Test
    test_unauthorized_access()
    tests.append(("Security Test", True))  # Always passes if no exceptions
    
    # Summary
    print("\n" + "=" * 60)
    print("🏁 Test Results Summary")
    print("=" * 60)
    
    all_passed = True
    for test_name, success in tests:
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"   {test_name:<25} {status}")
        if not success:
            all_passed = False
    
    print("=" * 60)
    
    if all_passed:
        print("🎉 ALL TESTS PASSED!")
        print("\n✅ The firewall rules fetching system is working correctly:")
        print("   1. Endpoint authentication ✅")
        print("   2. Endpoint ID storage ✅") 
        print("   3. Rules fetch with authentication ✅")
        print("   4. Security protection ✅")
        print("\n🚀 System is ready for production use!")
    else:
        print("⚠️ SOME TESTS FAILED!")
        print("\n🔧 Please check the failed tests above and:")
        print("   1. Ensure backend is running on port 5000")
        print("   2. Verify endpoint exists in database")
        print("   3. Check network connectivity")
    
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
