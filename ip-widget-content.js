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
  font-size: 16px !important;
  flex-shrink: 0 !important;
  display: inline-block !important;
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
          <span id="tenten-flag"></span>
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
      flagEl.textContent = '';
      flagEl.title = '';
      
      try {
        // Get IPv4 address
        const domain = window.location.hostname;
        const dnsResponse = await fetch(`https://dns.google/resolve?name=${domain}&type=A`);
        const dnsData = await dnsResponse.json();
        
        let ipv4 = null;
        if (dnsData.Answer && Array.isArray(dnsData.Answer)) {
          const ipRecord = dnsData.Answer.find(record => 
            record.type === 1 && /^\d+\.\d+\.\d+\.\d+$/.test(record.data)
          );
          ipv4 = ipRecord ? ipRecord.data : null;
        }
        
        // Display IP
        ipEl.textContent = ipv4 || 'Not found';
        
        // Get country flag from IP
        if (ipv4 && /^\d+\.\d+\.\d+\.\d+$/.test(ipv4)) {
          try {
            const geoResponse = await fetch(`https://ipapi.co/${ipv4}/json/`);
            const geoData = await geoResponse.json();
            
            if (geoData.country_code) {
              const flag = countryCodeToFlag(geoData.country_code);
              flagEl.textContent = flag;
              flagEl.title = geoData.country_name || geoData.country_code;
            }
          } catch (geoError) {
            console.log('Could not fetch geo info:', geoError);
          }
        }
        
        // Get server info
        let serverInfo = 'Unknown';
        try {
          const serverResponse = await fetch(window.location.origin, { method: 'HEAD' });
          const serverHeader = serverResponse.headers.get('Server');
          if (serverHeader) {
            serverInfo = serverHeader;
          }
        } catch (serverError) {
          console.log('Could not fetch server info:', serverError);
        }
        
        serverEl.textContent = serverInfo;
        
      } catch (error) {
        console.error('Error updating IP info:', error);
        ipEl.textContent = 'Error';
        serverEl.textContent = 'Error';
      }
    }
    
    // Convert country code to flag emoji
    function countryCodeToFlag(countryCode) {
      if (!countryCode || countryCode.length !== 2) return '';
      const codePoints = countryCode
        .toUpperCase()
        .split('')
        .map(char => 127397 + char.charCodeAt());
      return String.fromCodePoint(...codePoints);
    }
    
    // Initialize
    updateIpInfo();
})();
