@echo off
cd /d "%~dp0"
call "node_modules\.bin\tsx.cmd" watch src/index.ts > "C:\Users\ultra\AppData\Local\Temp\opencode\apirun.log" 2>&1
