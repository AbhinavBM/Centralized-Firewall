# Centralized Firewall System Setup Verification

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Verifying System Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

$errors = 0

# Check Node.js
Write-Host ""
Write-Host "[1/8] Checking Node.js installation..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✓ Node.js found: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Node.js not found. Please install Node.js 14+" -ForegroundColor Red
    $errors++
}

# Check Python
Write-Host "[2/8] Checking Python installation..." -ForegroundColor Yellow
try {
    $pythonVersion = python --version
    Write-Host "✓ Python found: $pythonVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Python not found. Please install Python 3.7+" -ForegroundColor Red
    $errors++
}

# Check pip
Write-Host "[3/8] Checking pip installation..." -ForegroundColor Yellow
try {
    $pipVersion = pip --version
    Write-Host "✓ pip found: $pipVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ pip not found. Please install pip" -ForegroundColor Red
    $errors++
}

# Check environment files
Write-Host "[4/8] Checking environment files..." -ForegroundColor Yellow
if (Test-Path "NGFW\.env") {
    Write-Host "✓ NGFW .env file exists" -ForegroundColor Green
} else {
    Write-Host "✗ NGFW .env file missing" -ForegroundColor Red
    $errors++
}

if (Test-Path "mongodb-backend\src\.env") {
    Write-Host "✓ Backend .env file exists" -ForegroundColor Green
} else {
    Write-Host "✗ Backend .env file missing" -ForegroundColor Red
    $errors++
}

if (Test-Path "frontend-new\.env") {
    Write-Host "✓ Frontend .env file exists" -ForegroundColor Green
} else {
    Write-Host "✗ Frontend .env file missing" -ForegroundColor Red
    $errors++
}

# Check dependencies
Write-Host "[5/8] Checking Node.js dependencies..." -ForegroundColor Yellow
if (Test-Path "mongodb-backend\node_modules") {
    Write-Host "✓ Backend dependencies installed" -ForegroundColor Green
} else {
    Write-Host "⚠ Backend dependencies not installed. Run: cd mongodb-backend && npm install" -ForegroundColor Yellow
}

if (Test-Path "frontend-new\node_modules") {
    Write-Host "✓ Frontend dependencies installed" -ForegroundColor Green
} else {
    Write-Host "⚠ Frontend dependencies not installed. Run: cd frontend-new && npm install" -ForegroundColor Yellow
}

# Check Python dependencies
Write-Host "[6/8] Checking Python dependencies..." -ForegroundColor Yellow
try {
    python -c "import psutil, pydivert, requests, aiohttp" 2>$null
    Write-Host "✓ Core Python dependencies available" -ForegroundColor Green
} catch {
    Write-Host "⚠ Some Python dependencies missing. Run: cd NGFW && pip install -r requirements.txt" -ForegroundColor Yellow
}

# Check mitmproxy
Write-Host "[7/8] Checking mitmproxy installation..." -ForegroundColor Yellow
try {
    $mitmproxyVersion = mitmproxy --version 2>$null
    Write-Host "✓ mitmproxy found" -ForegroundColor Green
} catch {
    Write-Host "⚠ mitmproxy not found. Run: pip install mitmproxy" -ForegroundColor Yellow
}

# Check Administrator privileges
Write-Host "[8/8] Checking Administrator privileges..." -ForegroundColor Yellow
if (([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")) {
    Write-Host "✓ Running with Administrator privileges" -ForegroundColor Green
} else {
    Write-Host "⚠ Not running as Administrator. NGFW requires admin rights for packet interception" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Verification Complete" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

if ($errors -eq 0) {
    Write-Host ""
    Write-Host "🎉 System is ready to run!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "1. Run: .\start-system.ps1 (as Administrator)" -ForegroundColor White
    Write-Host "2. Open: http://localhost:3000 (Frontend)" -ForegroundColor White
    Write-Host "3. Test: .\test-system.bat" -ForegroundColor White
} else {
    Write-Host ""
    Write-Host "❌ Please fix the errors above before running the system" -ForegroundColor Red
}

Write-Host ""
Read-Host "Press Enter to continue..."
