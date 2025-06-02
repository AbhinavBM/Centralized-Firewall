@echo off
echo ========================================
echo  Stopping Centralized Firewall System
echo ========================================

echo.
echo Stopping all components...

REM Kill Node.js processes (Backend and Frontend)
echo [1/4] Stopping Node.js processes...
taskkill /f /im node.exe 2>nul
taskkill /f /im npm.cmd 2>nul

REM Kill Python processes (NGFW)
echo [2/4] Stopping Python processes...
taskkill /f /im python.exe 2>nul
taskkill /f /im python3.exe 2>nul

REM Kill Mitmproxy processes
echo [3/4] Stopping Mitmproxy processes...
taskkill /f /im mitmproxy.exe 2>nul
taskkill /f /im mitmdump.exe 2>nul

REM Close command windows
echo [4/4] Closing command windows...
taskkill /f /im cmd.exe /fi "WINDOWTITLE eq MongoDB Backend" 2>nul
taskkill /f /im cmd.exe /fi "WINDOWTITLE eq Frontend Dashboard" 2>nul
taskkill /f /im cmd.exe /fi "WINDOWTITLE eq Mitmproxy Domain Blocker" 2>nul
taskkill /f /im cmd.exe /fi "WINDOWTITLE eq Integrated NGFW" 2>nul

echo.
echo ========================================
echo  System Stopped Successfully!
echo ========================================
echo.
echo All components have been terminated.
echo.
pause
