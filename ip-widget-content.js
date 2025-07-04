// Tenten IP Widget - Minimal, robust version
(function() {
    if (window.tentenIpWidgetInjected) return;
    window.tentenIpWidgetInjected = true;

    // CSS
    const style = document.createElement('style');
    style.textContent = `
#tenten-ip-widget {
  position: fixed !important;
  bottom: 18px !important;
  right: 18px !important;
  width: 220px !important;
  max-width: 220px !important;
  background: #fff !important;
  border: 1px solid #e9ecef !important;
  border-radius: 6px !important;
  box-shadow: 0 2px 8px rgba(0,0,0,0.13) !important;
  z-index: 2147483647 !important;
  font-size: 13px !important;
  color: #333 !important;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif !important;
  overflow: hidden !important;
  top: auto !important;
  left: auto !important;
}
#tenten-ip-widget-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
  color: #fff !important;
  padding: 6px 10px !important;
  display: flex !important;
  justify-content: space-between !important;
  align-items: center !important;
  border-radius: 6px 6px 0 0 !important;
  font-size: 12px !important;
  cursor: default !important;
  user-select: none !important;
}
#tenten-ip-widget-content {
  padding: 10px 12px 8px 12px !important;
}
.tenten-ip-row {
  display: flex !important; 
  align-items: center !important;
  margin-bottom: 6px !important;
  min-height: 16px !important;
}
.tenten-ip-label {
  color: #495057 !important; 
  font-weight: 700 !important; 
  font-size: 12px !important;
  flex-shrink: 0 !important;
  width: 50px !important;
}
.tenten-ip-value {
  color: #333 !important; 
  font-family: 'Consolas', monospace !important; 
  font-size: 12px !important;
  font-weight: 600 !important;
  margin-left: 8px !important; 
  word-break: break-all !important;
  flex: 1 !important;
}
#tenten-header-refresh {
  background: rgba(255,255,255,0.2) !important;
  border: 1px solid rgba(255,255,255,0.3) !important;
  border-radius: 3px !important;
  color: #fff !important;
  cursor: pointer !important;
  font-size: 11px !important;
  padding: 2px 6px !important;
  margin-left: 6px !important;
  white-space: nowrap !important;
  flex-shrink: 0 !important;
}
#tenten-header-refresh:hover {
  background: rgba(255,255,255,0.3) !important;
}
#tenten-header-close {
  background: rgba(255,255,255,0.2) !important;
  border: 1px solid rgba(255,255,255,0.3) !important;
  border-radius: 3px !important;
  color: #fff !important;
  cursor: pointer !important;
  font-size: 11px !important;
  padding: 2px 6px !important;
  margin-left: 4px !important;
  white-space: nowrap !important;
  flex-shrink: 0 !important;
}
#tenten-header-close:hover {
  background: rgba(255,100,100,0.4) !important;
}
#tenten-flag {
  margin-left: 8px !important; 
  width: 16px !important;
  height: 12px !important;
  flex-shrink: 0 !important;
  display: inline-block !important;
  object-fit: cover !important;
  border-radius: 2px !important;
  vertical-align: middle !important;
}
`;
    document.head.appendChild(style);

    // HTML
    const widget = document.createElement('div');
    widget.id = 'tenten-ip-widget';
    widget.innerHTML = `
      <div id="tenten-ip-widget-header">
        <span>🌐 IP & Server</span>
        <div>
          <button id="tenten-header-refresh" title="Refresh">🔄</button>
          <button id="tenten-header-close" title="Close">✕</button>
        </div>
      </div>
      <div id="tenten-ip-widget-content">
        <div class="tenten-ip-row">
          <span class="tenten-ip-label">IP:</span>
          <span class="tenten-ip-value" id="tenten-ipv4">...</span>
          <img id="tenten-flag" alt="Flag" style="display: none;">
        </div>
        <div class="tenten-ip-row">
          <span class="tenten-ip-label">Server:</span>
          <span class="tenten-ip-value" id="tenten-server">...</span>
        </div>
      </div>
    `;
    document.body.appendChild(widget);

    // Close button functionality
    document.getElementById('tenten-header-close').onclick = () => {
      widget.remove();
      // Reset injection flag so widget can be recreated if needed
      window.tentenIpWidgetInjected = false;
    };

    // Refresh button functionality
    document.getElementById('tenten-header-refresh').onclick = updateIpInfo;

    // Fetch IP & Server info
    async function updateIpInfo() {
      const ipEl = document.getElementById('tenten-ipv4');
      const serverEl = document.getElementById('tenten-server');
      const flagEl = document.getElementById('tenten-flag');
      
      // Reset to loading state
      ipEl.textContent = '...';
      serverEl.textContent = '...';
      flagEl.style.display = 'none';
      flagEl.title = '';
      
      try {
        // Get IPv4 address
        const domain = window.location.hostname;
        console.log('Looking up IP for domain:', domain);
        
        const dnsResponse = await fetch(`https://dns.google/resolve?name=${domain}&type=A`);
        const dnsData = await dnsResponse.json();
        console.log('DNS response:', dnsData);
        
        let ipv4 = null;
        if (dnsData.Answer && Array.isArray(dnsData.Answer)) {
          const ipRecord = dnsData.Answer.find(record => 
            record.type === 1 && /^\d+\.\d+\.\d+\.\d+$/.test(record.data)
          );
          ipv4 = ipRecord ? ipRecord.data : null;
          console.log('Found IPv4:', ipv4);
        }
        
        // Display IP
        ipEl.textContent = ipv4 || 'Not found';
        console.log('IP displayed:', ipv4 || 'Not found');
        
        // Get country flag from IP
        if (ipv4 && /^\d+\.\d+\.\d+\.\d+$/.test(ipv4)) {
          try {
            console.log('Fetching geo info for IP:', ipv4);
            
            // Try multiple geo APIs for better success rate
            let geoData = null;
            
            // First try: ipapi.co (HTTPS, reliable)
            try {
              const response1 = await fetch(`https://ipapi.co/${ipv4}/json/`);
              const data1 = await response1.json();
              if (data1.country_code) {
                geoData = { country_code: data1.country_code, country_name: data1.country_name };
                console.log('Got geo data from ipapi.co:', geoData);
              }
            } catch (e) {
              console.log('ipapi.co failed:', e);
            }
            
            // Second try: ipinfo.io (if first failed)
            if (!geoData) {
              try {
                const response2 = await fetch(`https://ipinfo.io/${ipv4}/json`);
                const data2 = await response2.json();
                if (data2.country) {
                  geoData = { country_code: data2.country, country_name: data2.country };
                  console.log('Got geo data from ipinfo.io:', geoData);
                }
              } catch (e) {
                console.log('ipinfo.io failed:', e);
              }
            }
            
            // Third try: ip-api.com (HTTP only, may be blocked on HTTPS sites)
            if (!geoData) {
              try {
                const response3 = await fetch(`http://ip-api.com/json/${ipv4}`);
                const data3 = await response3.json();
                if (data3.status === 'success' && data3.countryCode) {
                  geoData = { country_code: data3.countryCode, country_name: data3.country };
                  console.log('Got geo data from ip-api.com:', geoData);
                }
              } catch (e) {
                console.log('ip-api.com failed (likely blocked by HTTPS):', e);
              }
            }
            
            // Set flag image if we got data
            if (geoData && geoData.country_code) {
              const countryCode = geoData.country_code.toUpperCase();
              console.log('Setting flag image for country:', countryCode);
              
              // Get extension URL for flag image
              const flagUrl = chrome.runtime.getURL(`flags/${countryCode}.png`);
              console.log('Flag URL:', flagUrl);
              
              flagEl.src = flagUrl;
              flagEl.alt = `${countryCode} Flag`;
              flagEl.title = geoData.country_name || countryCode;
              flagEl.style.display = 'inline-block';
              
              // Handle image load error
              flagEl.onerror = function() {
                console.log('Flag image not found for:', countryCode);
                // Try unknown flag as fallback
                const unknownFlagUrl = chrome.runtime.getURL('flags/_unknown.png');
                flagEl.src = unknownFlagUrl;
                flagEl.alt = 'Unknown Flag';
                flagEl.title = geoData.country_name || 'Unknown Country';
              };
              
              flagEl.onload = function() {
                console.log('Flag image loaded successfully for:', countryCode);
              };
              
            } else {
              console.log('No geo data found for IP:', ipv4);
              // Set unknown flag
              const unknownFlagUrl = chrome.runtime.getURL('flags/_unknown.png');
              flagEl.src = unknownFlagUrl;
              flagEl.alt = 'Unknown Flag';
              flagEl.title = 'Unknown Country';
              flagEl.style.display = 'inline-block';
            }
            
          } catch (geoError) {
            console.error('All geo APIs failed:', geoError);
            // Set unknown flag for error
            const unknownFlagUrl = chrome.runtime.getURL('flags/_unknown.png');
            flagEl.src = unknownFlagUrl;
            flagEl.alt = 'Unknown Flag';
            flagEl.title = 'Geo API Error';
            flagEl.style.display = 'inline-block';
          }
        } else {
          console.log('Invalid IP for geo lookup:', ipv4);
          // Set unknown flag for invalid IP
          const unknownFlagUrl = chrome.runtime.getURL('flags/_unknown.png');
          flagEl.src = unknownFlagUrl;
          flagEl.alt = 'Unknown Flag';
          flagEl.title = 'Invalid IP';
          flagEl.style.display = 'inline-block';
        }
        
        // Get server info
        let serverInfo = 'Unknown';
        try {
          console.log('Fetching server info for:', window.location.origin);
          const serverResponse = await fetch(window.location.origin, { method: 'HEAD' });
          const serverHeader = serverResponse.headers.get('Server');
          console.log('Server header:', serverHeader);
          if (serverHeader) {
            serverInfo = serverHeader;
          }
        } catch (serverError) {
          console.log('Could not fetch server info:', serverError);
        }
        
        serverEl.textContent = serverInfo;
        console.log('Server displayed:', serverInfo);
        
      } catch (error) {
        console.error('Error updating IP info:', error);
        ipEl.textContent = 'Error';
        serverEl.textContent = 'Error';
      }
    }
    
    // Initialize
    updateIpInfo();
})();
