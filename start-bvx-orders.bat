@echo off
cd /D "%~dp0"
ECHO Checking if there is newer version:
git pull

ECHO Installing dependencies (maybe needed):
call npm i

ECHO Starting bvx-orders local server
npm run start
PAUSE
