@echo off
echo ========================================
echo  Starting Centralized Firewall System
echo ========================================

echo.
echo Starting all components...
echo.

REM Start MongoDB Backend
echo [1/4] Starting MongoDB Backend Server...
start "MongoDB Backend" cmd /k "cd mongodb-backend && npm start"
timeout /t 3

REM Start Frontend
echo [2/4] Starting Frontend Dashboard...
start "Frontend Dashboard" cmd /k "cd frontend-new && npm run dev"
timeout /t 3

REM Start Mitmproxy for Domain Blocking
echo [3/4] Starting Mitmproxy for Domain Blocking...
start "Mitmproxy Domain Blocker" cmd /k "cd NGFW && mitmproxy -s mitmproxy_domain_blocker.py --listen-port 8080"
timeout /t 5

REM Start Integrated NGFW
echo [4/4] Starting Integrated NGFW (Run as Administrator)...
echo.
echo ========================================
echo  IMPORTANT: NGFW REQUIRES ADMIN RIGHTS
echo ========================================
echo.
echo The NGFW will start in a new window with admin privileges.
echo Please allow the elevation prompt when it appears.
echo.
start "Integrated NGFW" powershell -Command "Start-Process cmd -ArgumentList '/k cd NGFW && python main_integrated_firewall.py' -Verb RunAs"

echo.
echo ========================================
echo  System Started Successfully!
echo ========================================
echo.
echo Access Points:
echo - Frontend Dashboard: http://localhost:3000
echo - Backend API: http://localhost:5000
echo - Mitmproxy Web Interface: http://localhost:8081
echo.
echo Components Running:
echo [✓] MongoDB Backend (Port 5000)
echo [✓] Frontend Dashboard (Port 3000) 
echo [✓] Mitmproxy Domain Blocker (Port 8080)
echo [✓] Integrated NGFW (Admin Mode)
echo.
echo To stop the system, close all command windows or run: stop-system.bat
echo.
pause
