@echo off
echo ============================
echo   macweb.dev Local Server
echo ============================
echo.
echo Starting local server at http://localhost:8080
echo Press Ctrl+C to stop the server.
echo.
python -m http.server 8080
pause
