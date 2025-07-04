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
  width: 200px !important;
  background: #fff !important;
  border: 1px solid #e9ecef !important;
  border-radius: 6px !important;
  box-shadow: 0 2px 8px rgba(0,0,0,0.13) !important;
  z-index: 2147483647 !important;
  font-size: 11px !important;
  color: #333 !important;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif !important;
}
#tenten-ip-widget-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
  color: #fff !important;
  padding: 6px 10px !important;
  display: flex !important;
  justify-content: space-between !important;
  align-items: center !important;
  border-radius: 6px 6px 0 0 !important;
  font-size: 11px !important;
}
#tenten-ip-widget-content {
  padding: 8px 10px 6px 10px !important;
}
.tenten-ip-row {
  display: flex; justify-content: space-between; align-items: center;
  margin-bottom: 4px;
}
.tenten-ip-label {
  color: #495057; font-weight: 600; font-size: 10px;
}
.tenten-ip-value {
  color: #333; font-family: 'Consolas', monospace; font-size: 10px;
  margin-left: 8px; word-break: break-all;
}
#tenten-ip-refresh {
  width: 100%; margin-top: 4px; padding: 3px 0; font-size: 10px;
  background: #f8f9fa; border: 1px solid #e9ecef; border-radius: 3px;
  cursor: pointer; color: #333;
}
#tenten-ip-refresh:hover { background: #e9ecef; }
`;
    document.head.appendChild(style);

    // HTML
    const widget = document.createElement('div');
    widget.id = 'tenten-ip-widget';
    widget.innerHTML = `
      <div id="tenten-ip-widget-header">
        <span>🌐 IP & Server</span>
        <button id="tenten-ip-refresh" title="Refresh">🔄</button>
      </div>
      <div id="tenten-ip-widget-content">
        <div class="tenten-ip-row"><span class="tenten-ip-label">IP:</span><span class="tenten-ip-value" id="tenten-ipv4">...</span></div>
        <div class="tenten-ip-row"><span class="tenten-ip-label">Server:</span><span class="tenten-ip-value" id="tenten-server">...</span></div>
      </div>
    `;
    document.body.appendChild(widget);

    // Drag
    let drag = false, startX, startY, startLeft, startTop;
    widget.querySelector('#tenten-ip-widget-header').addEventListener('mousedown', e => {
      drag = true;
      startX = e.clientX; startY = e.clientY;
      const rect = widget.getBoundingClientRect();
      startLeft = rect.left; startTop = rect.top;
      document.body.style.userSelect = 'none';
    });
    document.addEventListener('mousemove', e => {
      if (!drag) return;
      let l = startLeft + (e.clientX - startX);
      let t = startTop + (e.clientY - startY);
      l = Math.max(0, Math.min(l, window.innerWidth - widget.offsetWidth));
      t = Math.max(0, Math.min(t, window.innerHeight - widget.offsetHeight));
      widget.style.left = l + 'px';
      widget.style.top = t + 'px';
      widget.style.right = 'auto';
      widget.style.bottom = 'auto';
    });
    document.addEventListener('mouseup', () => { drag = false; document.body.style.userSelect = ''; });

    // Fetch IP & Server
    async function updateIpInfo() {
      const ipEl = document.getElementById('tenten-ipv4');
      const serverEl = document.getElementById('tenten-server');
      ipEl.textContent = '...';
      serverEl.textContent = '...';
      try {
        // Get IPv4
        const domain = window.location.hostname;
        const dns = await fetch(`https://dns.google/resolve?name=${domain}&type=A`);
        const data = await dns.json();
        let ip = null;
        if (data.Answer && Array.isArray(data.Answer)) {
          ip = data.Answer.find(a => a.type === 1 && /^\d+\.\d+\.\d+\.\d+$/.test(a.data));
          ip = ip ? ip.data : null;
        }
        ipEl.textContent = ip || 'Not found';
        // Get server header
        let server = '';
        try {
          const resp = await fetch(window.location.origin, { method: 'HEAD' });
          server = resp.headers.get('Server') || '';
        } catch {}
        serverEl.textContent = server || 'Unknown';
      } catch (e) {
        ipEl.textContent = 'Error';
        serverEl.textContent = 'Error';
      }
    }
    updateIpInfo();
    document.getElementById('tenten-ip-refresh').onclick = updateIpInfo;
})();
