// DEBUG: Force Enable DNS Button
// Add this code to checkTentenPageStatus function after line where button is enabled

function forceEnableDnsButton() {
    console.log('=== FORCE ENABLE DNS BUTTON v1.6.4 ===');
    
    const dnsBtn = document.getElementById('dnsAutomation');
    if (!dnsBtn) {
        console.error('DNS Button not found!');
        return;
    }
    
    // Remove ALL possible blocking
    dnsBtn.classList.remove('disabled');
    dnsBtn.removeAttribute('disabled');
    dnsBtn.style.pointerEvents = 'auto';
    dnsBtn.style.opacity = '1';
    dnsBtn.style.filter = 'none';
    dnsBtn.style.cursor = 'pointer';
    dnsBtn.style.background = '';
    dnsBtn.disabled = false;
    
    // Check computed styles
    const computedStyle = window.getComputedStyle(dnsBtn);
    console.log('=== DNS Button State Check ===');
    console.log('Has disabled class:', dnsBtn.classList.contains('disabled'));
    console.log('Disabled attribute:', dnsBtn.hasAttribute('disabled'));
    console.log('Style pointer-events:', dnsBtn.style.pointerEvents);
    console.log('Style opacity:', dnsBtn.style.opacity);
    console.log('Style cursor:', dnsBtn.style.cursor);
    console.log('Computed pointer-events:', computedStyle.pointerEvents);
    console.log('Computed opacity:', computedStyle.opacity);
    console.log('Computed cursor:', computedStyle.cursor);
    
    // Test click event
    dnsBtn.addEventListener('click', function() {
        console.log('DNS Button clicked successfully!');
    });
    
    console.log('✅ Force enable complete');
}

// Call this function after enabling button in checkTentenPageStatus
// forceEnableDnsButton();
