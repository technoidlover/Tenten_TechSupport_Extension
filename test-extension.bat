@echo off
echo ==========================================
echo   Tenten Extension - Quick Test Script
echo ==========================================
echo.
echo 1. Testing IP Widget...
echo.

REM Open test files
echo Opening test files...
start "" "test-ip-widget.html"
timeout /t 2 /nobreak >nul

echo Opening example websites for testing...
start "" "https://google.com"
timeout /t 1 /nobreak >nul
start "" "https://github.com"
timeout /t 1 /nobreak >nul

echo.
echo ==========================================
echo   Test Instructions:
echo ==========================================
echo 1. Load extension in Chrome (Developer Mode)
echo 2. Check IP widget appears on all websites
echo 3. Test dragging widget by header
echo 4. Test refresh button in header
echo 5. Test double-click header to reset position
echo 6. Verify country flag shows next to IP
echo 7. Check no layout issues when dragging
echo.
echo Extension folder: %~dp0
echo.
echo Press any key to exit...
pause >nul
