# Centralized Firewall System Stop Script

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Stopping Centralized Firewall System" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

Write-Host ""
Write-Host "Stopping all components..." -ForegroundColor Yellow

# Stop Node.js processes (Backend and Frontend)
Write-Host "[1/4] Stopping Node.js processes..." -ForegroundColor Yellow
Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force
Get-Process -Name "npm" -ErrorAction SilentlyContinue | Stop-Process -Force

# Stop Python processes (NGFW)
Write-Host "[2/4] Stopping Python processes..." -ForegroundColor Yellow
Get-Process -Name "python" -ErrorAction SilentlyContinue | Stop-Process -Force
Get-Process -Name "python3" -ErrorAction SilentlyContinue | Stop-Process -Force

# Stop Mitmproxy processes
Write-Host "[3/4] Stopping Mitmproxy processes..." -ForegroundColor Yellow
Get-Process -Name "mitmproxy" -ErrorAction SilentlyContinue | Stop-Process -Force
Get-Process -Name "mitmdump" -ErrorAction SilentlyContinue | Stop-Process -Force

# Close PowerShell windows (optional - be careful with this)
Write-Host "[4/4] Cleaning up..." -ForegroundColor Yellow
# Note: We don't automatically close PowerShell windows as it might close the current session

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  System Stopped Successfully!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "All components have been terminated." -ForegroundColor Green
Write-Host "You may manually close any remaining PowerShell windows." -ForegroundColor Yellow
Write-Host ""

# Wait for user input
Read-Host "Press Enter to continue..."
