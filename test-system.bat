@echo off
echo ========================================
echo  Testing Centralized Firewall System
echo ========================================

echo.
echo [1/5] Testing MongoDB Backend Health...
curl -s http://localhost:5000/health
if %errorlevel% equ 0 (
    echo [✓] Backend is responding
) else (
    echo [✗] Backend is not responding
)

echo.
echo [2/5] Testing Frontend Accessibility...
curl -s http://localhost:3000 > nul
if %errorlevel% equ 0 (
    echo [✓] Frontend is accessible
) else (
    echo [✗] Frontend is not accessible
)

echo.
echo [3/5] Testing Mitmproxy Status...
curl -s http://localhost:8081 > nul
if %errorlevel% equ 0 (
    echo [✓] Mitmproxy web interface is running
) else (
    echo [✗] Mitmproxy web interface is not accessible
)

echo.
echo [4/5] Testing NGFW Integration...
cd NGFW
python test_integration.py
cd ..

echo.
echo [5/5] Testing Domain Blocking...
echo Testing domain blocking functionality...
echo You can manually test by:
echo 1. Configure browser proxy to 127.0.0.1:8080
echo 2. Try accessing blocked domains
echo 3. Check mitmproxy logs for blocking activity

echo.
echo ========================================
echo  Test Summary
echo ========================================
echo.
echo Manual verification steps:
echo 1. Open http://localhost:3000 - Frontend Dashboard
echo 2. Open http://localhost:5000/health - Backend Health
echo 3. Open http://localhost:8081 - Mitmproxy Web Interface
echo 4. Check NGFW console for authentication status
echo.
pause
