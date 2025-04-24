@echo off
echo Kutubxonalar yangilanmoqda...

REM Kutubxonalar o‘rnatilmoqda (frontend papkada)
cd frontend
call npm install

REM Qayta build qilish
echo Frontend qayta build qilinmoqda...
call npm run build

cd ..

echo JSON-server ishga tushiryapti...
start /b npx json-server --watch db.json --port 3001

echo Frontend ishga tushiryapti...
cd frontend
call npm run preview

pause
