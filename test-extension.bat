@echo off
echo =======================================
echo Tenten Extension Development Test
echo =======================================
echo.
echo 1. Checking files...
if not exist "manifest.json" (
    echo ERROR: manifest.json not found!
    pause
    exit /b 1
)

if not exist "popup.html" (
    echo ERROR: popup.html not found!
    pause
    exit /b 1
)

if not exist "background.js" (
    echo ERROR: background.js not found!
    pause
    exit /b 1
)

echo All files found!
echo.

echo 2. Checking manifest version...
findstr /i "version" manifest.json
echo.

echo 3. Extension ready for loading in Chrome!
echo.
echo =======================================
echo INSTRUCTIONS:
echo =======================================
echo 1. Open Chrome and go to: chrome://extensions/
echo 2. Enable "Developer mode" (top-right toggle)
echo 3. Click "Load unpacked"
echo 4. Select this folder: %CD%
echo 5. Click extension icon to open popup
echo 6. Test WHOIS and IP Info functions
echo 7. Check browser console (F12) for logs
echo =======================================
echo.
echo Press any key to open Chrome Extensions page...
pause >nul

start chrome://extensions/

echo.
echo Extension development folder: %CD%
echo.
echo Press any key to exit...
pause >nul
