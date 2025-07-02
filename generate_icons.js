/* Simple placeholder icon generator */
/* Run this in browser console to generate base64 icons */

function createIcon(size) {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    
    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, size, size);
    gradient.addColorStop(0, '#667eea');
    gradient.addColorStop(1, '#764ba2');
    
    // Draw circle background
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(size/2, size/2, size/2 - 2, 0, 2 * Math.PI);
    ctx.fill();
    
    // Draw DNS network symbol
    ctx.strokeStyle = 'white';
    ctx.fillStyle = 'white';
    ctx.lineWidth = size/32;
    
    const center = size/2;
    const nodeRadius = size/16;
    const outerRadius = size/4;
    
    // Central node
    ctx.beginPath();
    ctx.arc(center, center, nodeRadius, 0, 2 * Math.PI);
    ctx.fill();
    
    // Connection lines and outer nodes
    const positions = [
        [-outerRadius, -outerRadius],
        [outerRadius, -outerRadius],
        [-outerRadius, outerRadius],
        [outerRadius, outerRadius]
    ];
    
    positions.forEach(([x, y]) => {
        // Draw line
        ctx.beginPath();
        ctx.moveTo(center, center);
        ctx.lineTo(center + x, center + y);
        ctx.stroke();
        
        // Draw outer node
        ctx.beginPath();
        ctx.arc(center + x, center + y, nodeRadius * 0.75, 0, 2 * Math.PI);
        ctx.fill();
    });
    
    // Draw DNS text
    ctx.font = `bold ${size/8}px Arial`;
    ctx.textAlign = 'center';
    ctx.fillText('DNS', center, center + size/3);
    
    return canvas.toDataURL('image/png');
}

// Generate icons
console.log('16x16:', createIcon(16));
console.log('32x32:', createIcon(32));
console.log('48x48:', createIcon(48));
console.log('128x128:', createIcon(128));
