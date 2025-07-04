# 🐛 DEBUG COUNTRY FLAG ISSUE

## 🔍 Problem Analysis
Cờ quốc gia không hiển thị có thể do:
1. **API CORS Issues** - Geo APIs bị block
2. **Network Errors** - API không accessible
3. **Invalid Country Codes** - Conversion function lỗi
4. **CSS Issues** - Flag element bị ẩn
5. **JavaScript Errors** - Code lỗi không chạy

## 🧪 Debug Steps

### Step 1: Check Extension Console
1. Open Chrome DevTools (F12)
2. Go to **Console** tab
3. Load any website with extension active
4. Look for debug logs:
   - "Looking up IP for domain: ..."
   - "DNS response: ..."
   - "Found IPv4: ..."
   - "Fetching geo info for IP: ..."
   - "Got geo data from [API]: ..."
   - "Converting country code to flag: ..."
   - "Flag set successfully: ..."

### Step 2: Test with Debug Page
1. Open `debug-flag-test.html`
2. Load extension
3. Check console output on debug page
4. Run manual tests:
   - Flag conversion test
   - API test with known IP (8.8.8.8)
   - Current site test

### Step 3: Manual API Test
Test APIs manually in DevTools Console:
```javascript
// Test flag conversion
function countryCodeToFlag(countryCode) {
    const codePoints = countryCode.toUpperCase().split('').map(char => 127397 + char.charCodeAt());
    return String.fromCodePoint(...codePoints);
}

// Test with US
console.log('US flag:', countryCodeToFlag('US'));

// Test API
fetch('http://ip-api.com/json/8.8.8.8')
    .then(r => r.json())
    .then(data => console.log('API test:', data));
```

### Step 4: Check Network Tab
1. Open DevTools → Network tab
2. Reload page with extension
3. Look for failed requests to:
   - `dns.google` (DNS lookup)
   - `ip-api.com` (geo lookup)
   - `ipapi.co` (geo lookup)
   - `ipinfo.io` (geo lookup)

## 🔧 Quick Fixes

### Fix 1: Force Show Flag (Test)
Temporarily force show flag for testing:
```javascript
// Add this to updateIpInfo() after IP display
flagEl.textContent = '🇺🇸'; // Force US flag
flagEl.title = 'Test Flag';
```

### Fix 2: Check Element Visibility
```javascript
// Check if flag element exists and is visible
const flagEl = document.getElementById('tenten-flag');
console.log('Flag element:', flagEl);
console.log('Flag styles:', window.getComputedStyle(flagEl));
```

### Fix 3: Alternative Flag Method
```javascript
// Use different flag method
function getCountryFlag(countryCode) {
    const flags = {
        'US': '🇺🇸', 'VN': '🇻🇳', 'JP': '🇯🇵', 'GB': '🇬🇧',
        'DE': '🇩🇪', 'FR': '🇫🇷', 'CA': '🇨🇦', 'AU': '🇦🇺'
    };
    return flags[countryCode.toUpperCase()] || '🌍';
}
```

## 🎯 Expected Debug Output

### Normal Working Flow:
```
Looking up IP for domain: example.com
DNS response: {Answer: [{data: "93.184.216.34", type: 1}]}
Found IPv4: 93.184.216.34
IP displayed: 93.184.216.34
Fetching geo info for IP: 93.184.216.34
Got geo data from ip-api.com: {country_code: "US", country_name: "United States"}
Converting country code to flag: US → [127482, 127480] → 🇺🇸
Flag set successfully: 🇺🇸
```

### Error Cases:
```
All geo APIs failed: Error: Failed to fetch
No geo data found for IP: 93.184.216.34
Invalid IP for geo lookup: null
```

## 📋 Debug Checklist

- [ ] Extension loaded correctly
- [ ] Console shows debug logs
- [ ] IP lookup working (shows real IP)
- [ ] Geo API calls happening
- [ ] At least one geo API succeeds
- [ ] Country code received
- [ ] Flag conversion working
- [ ] Flag element updated
- [ ] Flag visible in widget

## 🚀 Next Steps

1. **Run debug-flag-test.html** and check console
2. **Check Network tab** for failed requests
3. **Test manual flag conversion** in console
4. **Check if geo APIs are blocked** by network/firewall
5. **Test with different IPs** (8.8.8.8, 1.1.1.1)

---

**If all else fails, we can use a static flag mapping table as fallback!**
