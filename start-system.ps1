# Centralized Firewall System Startup Script
# Run this script as Administrator

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Starting Centralized Firewall System" -ForegroundColor Cyan  
Write-Host "========================================" -ForegroundColor Cyan

# Check if running as Administrator
if (-NOT ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")) {
    Write-Host "This script requires Administrator privileges!" -ForegroundColor Red
    Write-Host "Please run PowerShell as Administrator and try again." -ForegroundColor Yellow
    pause
    exit 1
}

Write-Host ""
Write-Host "Starting all components..." -ForegroundColor Green
Write-Host ""

# Start MongoDB Backend
Write-Host "[1/4] Starting MongoDB Backend Server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\mongodb-backend'; npm start" -WindowStyle Normal
Start-Sleep -Seconds 3

# Start Frontend
Write-Host "[2/4] Starting Frontend Dashboard..." -ForegroundColor Yellow  
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\frontend-new'; npm run dev" -WindowStyle Normal
Start-Sleep -Seconds 3

# Start Mitmproxy
Write-Host "[3/4] Starting Mitmproxy for Domain Blocking..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\NGFW'; mitmproxy -s mitmproxy_domain_blocker.py --listen-port 8080" -WindowStyle Normal
Start-Sleep -Seconds 5

# Start Integrated NGFW
Write-Host "[4/4] Starting Integrated NGFW..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\NGFW'; python main_integrated_firewall.py" -WindowStyle Normal -Verb RunAs

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  System Started Successfully!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Access Points:" -ForegroundColor Cyan
Write-Host "- Frontend Dashboard: http://localhost:3000" -ForegroundColor White
Write-Host "- Backend API: http://localhost:5000" -ForegroundColor White  
Write-Host "- Mitmproxy Web Interface: http://localhost:8081" -ForegroundColor White
Write-Host ""
Write-Host "Components Running:" -ForegroundColor Cyan
Write-Host "[✓] MongoDB Backend (Port 5000)" -ForegroundColor Green
Write-Host "[✓] Frontend Dashboard (Port 3000)" -ForegroundColor Green
Write-Host "[✓] Mitmproxy Domain Blocker (Port 8080)" -ForegroundColor Green  
Write-Host "[✓] Integrated NGFW (Admin Mode)" -ForegroundColor Green
Write-Host ""
Write-Host "To stop the system, close all PowerShell windows or run: .\stop-system.ps1" -ForegroundColor Yellow
Write-Host ""

# Wait for user input
Read-Host "Press Enter to continue..."
