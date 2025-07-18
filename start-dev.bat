@echo off
echo 🚀 Abrindo Backend e Site em abas no Windows Terminal...

wt -w 0 new-tab -d ./backend cmd /k "npm run start:dev" ^

; new-tab -d ./site cmd /k "npm run dev"