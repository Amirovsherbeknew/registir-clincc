@echo off
echo Kutubxonalar yangilanmoqda...

REM yangilanmoqda...
call git pull

REM Kutubxonalar o‘rnatilmoqda (frontend papkada)
cd frontend
call npm install

REM Qayta build qilish
echo Frontend qayta build qilinmoqda...
call npm run build

cd ..

echo JSON-server ishga tushiryapti...
start /b node server.js

echo Frontend ishga tushiryapti...
cd frontend
call npm run preview

pause