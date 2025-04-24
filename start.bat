@echo off
echo JSON-server ishga tushiryapti...
start /b npx json-server --watch db.json --port 3001

echo Frontend ishga tushiryapti...
cd frontend
call npm run preview

pause
