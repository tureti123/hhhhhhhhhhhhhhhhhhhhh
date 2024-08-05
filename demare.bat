@echo off
cd /d "C:\Users\turet\OneDrive\Bureau\among legend2"
sc.exe start MongoDB
node cassec.mjs
node cassecmong.js
node "among legend script.mjs"
pause
