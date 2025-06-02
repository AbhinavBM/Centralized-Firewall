@echo off
echo ========================================
echo  Centralized Firewall System Setup
echo ========================================

echo.
echo [1/6] Installing Python dependencies for NGFW...
cd NGFW
pip install -r requirements.txt
pip install mitmproxy
cd ..

echo.
echo [2/6] Installing Node.js dependencies for MongoDB backend...
cd mongodb-backend
npm install
cd ..

echo.
echo [3/6] Installing Node.js dependencies for Frontend...
cd frontend-new
npm install
cd ..

echo.
echo [4/6] Setting up environment files...

REM Create NGFW .env file
echo # NGFW Central Server Integration Configuration > NGFW\.env
echo CENTRAL_SERVER_URL=http://localhost:5000 >> NGFW\.env
echo ENDPOINT_NAME=RitvikBaby >> NGFW\.env
echo ENDPOINT_PASSWORD=Ritvik@1234 >> NGFW\.env
echo LOG_LEVEL=INFO >> NGFW\.env
echo ENABLE_DEBUG_LOGGING=false >> NGFW\.env
echo MITMPROXY_HOST=127.0.0.1 >> NGFW\.env
echo MITMPROXY_PORT=8080 >> NGFW\.env

REM Create Frontend .env file
echo REACT_APP_API_URL=http://localhost:5000/api > frontend-new\.env
echo REACT_APP_WS_URL=ws://localhost:5000/ws >> frontend-new\.env
echo SKIP_PREFLIGHT_CHECK=true >> frontend-new\.env
echo TSC_COMPILE_ON_ERROR=true >> frontend-new\.env
echo ESLINT_NO_DEV_ERRORS=true >> frontend-new\.env

echo.
echo [5/6] Creating endpoint in database...
cd mongodb-backend
node src/scripts/create-ritvikbaby-endpoint.js
cd ..

echo.
echo [6/6] Setup complete!
echo.
echo ========================================
echo  Setup completed successfully!
echo ========================================
echo.
echo Next steps:
echo 1. Run: start-system.bat
echo 2. Open browser to http://localhost:3000 for frontend
echo 3. Backend API will be at http://localhost:5000
echo.
pause
