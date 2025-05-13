@echo off
echo JSON-server ishga tushiryapti...
start /b node server.js

echo Frontend ishga tushiryapti...
cd frontend
call npm run preview

pause
