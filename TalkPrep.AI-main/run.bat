@echo off
title TalkPrep.AI Launcher
echo ===================================================
echo             TalkPrep.AI Startup Launcher
echo ===================================================
echo.

:: Check for Node.js
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed or not in your PATH.
    echo Please install Node.js (v18 or higher) to run this application.
    pause
    exit /b 1
)

:: Install Backend Dependencies if needed
if not exist "backend\node_modules\" (
    echo [INFO] Installing backend dependencies...
    cd backend
    call npm.cmd install
    cd ..
) else (
    echo [INFO] Backend dependencies already installed.
)

:: Install Frontend Dependencies if needed
if not exist "frontend\node_modules\" (
    echo [INFO] Installing frontend dependencies...
    cd frontend
    call npm.cmd install
    cd ..
) else (
    echo [INFO] Frontend dependencies already installed.
)

echo.
echo [SUCCESS] Dependencies verified. Starting servers...
echo.
echo ---------------------------------------------------
echo  * BACKEND: running on http://127.0.0.1:5000
echo  * FRONTEND: running on http://localhost:5173
echo ---------------------------------------------------
echo.
echo Default Credentials:
echo   Candidate: user@talkprep.ai  / password123
echo   Admin:     admin@talkprep.ai / password123
echo.
echo Press any key to start the servers and open the app...
pause >nul

:: Launch Backend Server
start "TalkPrep Backend" cmd /k "cd backend && npm.cmd run dev"

:: Launch Frontend Server
start "TalkPrep Frontend" cmd /k "cd frontend && powershell -ExecutionPolicy Bypass -Command "npm run dev""

:: Wait 3 seconds and open the browser
timeout /t 3 /nobreak >nul
start http://localhost:5173/

exit
