# CHANGELOG v1.6.7 - Modal API Fix

## Fixed
- **CRITICAL**: Fixed modal API calls not working - handlers are now global variables
- **SCOPE**: Changed whoisHandler, ipInfoHandler, dnsRecordsHandler from const to window.global
- **DEBUG**: Added comprehensive debug logs for modal confirm and handlers execution
- **VALIDATION**: Added elements validation on startup

## Technical Changes
- Modified popup-main.js: Made handlers global for modal access
- Enhanced debug logging in all handlers
- Added elements existence check on init

## Test Results Expected
✅ WHOIS modal → enter domain → right panel shows result
✅ IP Info modal → enter domain/IP → right panel shows result  
✅ DNS Records modal → enter domain → right panel + record selector
✅ All API calls working as before v1.6.6
