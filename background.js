// Background script - Service worker cho Chrome Extension
console.log('Tenten DNS Automation background script loaded');

// Xử lý installation
chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason === 'install') {
        console.log('Extension installed');
        
        // Mở trang hướng dẫn hoặc welcome page
        chrome.tabs.create({
            url: 'https://domain.tenten.vn'
        });
    }
});

// Xử lý messages từ content script và popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('=== Background received message ===');
    console.log('Message:', message);
    console.log('Sender:', sender);
    console.log('=====================================');
    
    if (message.action === 'whoisLookup') {
        console.log('Handling WHOIS lookup for domain:', message.domain);
        handleWhoisLookup(message.domain, sendResponse);
        return true; // Keep connection open for async response
    }
    
    if (message.action === 'ipInfo') {
        console.log('Handling IP Info lookup for host:', message.host);
        handleIpInfo(message.host, sendResponse);
        return true; // Keep connection open for async response
    }
    
    if (message.action === 'dnsLookup') {
        console.log('Handling DNS lookup for domain:', message.domain, 'type:', message.recordType);
        handleDnsLookup(message.domain, message.recordType, sendResponse);
        return true; // Keep connection open for async response
    }
    
    console.log('Unknown action:', message.action);
    
    // Luôn return true để giữ kết nối mở
    return true;
});

// Xử lý click vào extension icon
chrome.action.onClicked.addListener((tab) => {
    // Popup sẽ mở tự động, không cần xử lý gì thêm
    console.log('Extension icon clicked');
});

async function handleWhoisLookup(domain, sendResponse) {
    try {
        console.log('Fetching WHOIS for:', domain);
        
        // Step 1: Get homepage to extract CSRF token and cookies FIRST
        console.log('Step 1: Getting CSRF token and session from Tenten homepage...');
        
        const homepageResponse = await fetch('https://whois.tenten.vn/', {
            method: 'GET',
            headers: {
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.9,vi;q=0.8',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36',
                'Sec-Ch-Ua': '"Not)A;Brand";v="8", "Chromium";v="138", "Google Chrome";v="138"',
                'Sec-Ch-Ua-Mobile': '?0',
                'Sec-Ch-Ua-Platform': '"Windows"',
                'Sec-Fetch-Dest': 'document',
                'Sec-Fetch-Mode': 'navigate',
                'Sec-Fetch-Site': 'none',
                'Sec-Fetch-User': '?1',
                'Cache-Control': 'no-cache',
                'Pragma': 'no-cache'
            }
        });
        
        if (!homepageResponse.ok) {
            throw new Error(`Homepage request failed: ${homepageResponse.status}`);
        }
        
        // Extract all cookies from Set-Cookie headers
        const allCookies = [];
        
        // Get all Set-Cookie headers (there might be multiple)
        const responseHeaders = [...homepageResponse.headers.entries()];
        const setCookieHeaders = responseHeaders.filter(([name]) => name.toLowerCase() === 'set-cookie');
        
        for (const [, cookieValue] of setCookieHeaders) {
            // Extract just the name=value part before the first semicolon
            const cookiePart = cookieValue.split(';')[0].trim();
            if (cookiePart.includes('=')) {
                allCookies.push(cookiePart);
            }
        }
        
        console.log('Extracted cookies:', allCookies);
        
        // Extract CSRF token from HTML
        const htmlText = await homepageResponse.text();
        let csrfToken = '';
        
        console.log('HTML preview:', htmlText.substring(0, 500));
        
        // Try multiple patterns to find CSRF token
        const patterns = [
            /<meta\s+name=["']csrf-token["']\s+content=["']([^"']+)["']/i,
            /<meta\s+content=["']([^"']+)["']\s+name=["']csrf-token["']/i,
            /window\.Laravel\s*=\s*\{[^}]*csrf_token['"]\s*:\s*['"]([^'"]+)['"]/i,
            /_token['"]\s*[:=]\s*['"]([^'"]+)['"]/i,
            /csrf[_-]?token['"]\s*[:=]\s*['"]([^'"]+)['"]/i,
            /<input[^>]*name=["']_token["'][^>]*value=["']([^"']+)["']/i,
            /<meta\s+name=["']_token["']\s+content=["']([^"']+)["']/i
        ];
        
        for (const pattern of patterns) {
            const match = htmlText.match(pattern);
            if (match && match[1]) {
                csrfToken = match[1];
                console.log('Found CSRF token with pattern:', pattern.source);
                break;
            }
        }
        
        // If still no token, try extracting from XSRF-TOKEN cookie and decode it properly
        if (!csrfToken) {
            const xsrfCookie = allCookies.find(cookie => cookie.startsWith('XSRF-TOKEN='));
            if (xsrfCookie) {
                const tokenValue = xsrfCookie.split('=')[1];
                if (tokenValue) {
                    try {
                        // Laravel XSRF token is URL encoded, then base64 encoded JSON
                        const decodedToken = decodeURIComponent(tokenValue);
                        const tokenData = JSON.parse(atob(decodedToken));
                        if (tokenData && tokenData.value) {
                            csrfToken = tokenData.value;
                            console.log('Extracted CSRF token from XSRF-TOKEN cookie');
                        }
                    } catch (e) {
                        console.log('Failed to decode XSRF-TOKEN, trying raw value:', e);
                        // Try using the raw token value
                        csrfToken = decodeURIComponent(tokenValue);
                    }
                }
            }
        }
        
        console.log('CSRF token found:', csrfToken ? `Yes (${csrfToken.substring(0, 20)}...)` : 'No');
        
        // Step 2: Make WHOIS request with CSRF token and session cookies
        console.log('Step 2: Making WHOIS request with full session...');
        
        const whoisHeaders = {
            'Accept': 'application/json, text/html, */*',
            'Accept-Encoding': 'gzip, deflate, br, zstd',
            'Accept-Language': 'en-US,en;q=0.9,vi;q=0.8',
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'Origin': 'https://whois.tenten.vn',
            'Referer': 'https://whois.tenten.vn/',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36',
            'X-Requested-With': 'XMLHttpRequest',
            'Sec-Ch-Ua': '"Not)A;Brand";v="8", "Chromium";v="138", "Google Chrome";v="138"',
            'Sec-Ch-Ua-Mobile': '?0',
            'Sec-Ch-Ua-Platform': '"Windows"',
            'Sec-Fetch-Dest': 'empty',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Site': 'same-origin'
        };
        
        // Add CSRF token
        if (csrfToken) {
            whoisHeaders['X-CSRF-TOKEN'] = csrfToken;
        }
        
        // Add session cookies
        if (allCookies.length > 0) {
            whoisHeaders['Cookie'] = allCookies.join('; ');
        }
        
        console.log('Request headers:', Object.keys(whoisHeaders));
        console.log('CSRF token being sent:', csrfToken ? csrfToken.substring(0, 30) + '...' : 'None');
        console.log('Cookies being sent:', allCookies.length, 'cookies');
        
        const tentenResponse = await fetch('https://whois.tenten.vn/home/check-domain', {
            method: 'POST',
            headers: whoisHeaders,
            body: `domain=${encodeURIComponent(domain)}`
        });
        
        console.log('Tenten API response status:', tentenResponse.status);
        console.log('Response headers:', [...tentenResponse.headers.entries()]);
        
        if (tentenResponse.ok) {
            const contentType = tentenResponse.headers.get('content-type') || '';
            console.log('Response content-type:', contentType);
            
            const responseText = await tentenResponse.text();
            console.log('Response length:', responseText.length);
            console.log('Response preview:', responseText.substring(0, 300));
            
            // Try to parse as JSON first
            try {
                const jsonData = JSON.parse(responseText);
                console.log('Tenten JSON response:', jsonData);
                
                if (jsonData && (jsonData.whois_info || jsonData.success || jsonData.data || jsonData.domain_name)) {
                    const normalizedData = normalizeTentenData(jsonData);
                    sendResponse({ success: true, data: normalizedData, source: 'Tenten API' });
                    return;
                }
            } catch (jsonError) {
                console.log('Not JSON, trying to parse as HTML...');
            }
            
            // Parse as HTML if JSON parsing fails
            if (responseText.includes('Tên miền') || responseText.includes('Ngày đăng ký') || 
                responseText.includes('Ngày hết hạn') || responseText.includes('Chủ sở hữu')) {
                const parsedData = parseTentenHTML(responseText, domain);
                sendResponse({ success: true, data: parsedData, source: 'Tenten HTML' });
                return;
            }
            
            // If no recognizable data found but response is OK
            throw new Error('Response OK nhưng không tìm thấy thông tin WHOIS trong response');
        } else {
            // Get error details
            const errorText = await tentenResponse.text();
            console.log('Error response body:', errorText.substring(0, 500));
            
            if (tentenResponse.status === 419) {
                throw new Error('CSRF token mismatch - API Tenten yêu cầu xác thực session phức tạp hơn');
            } else {
                throw new Error(`API returned status ${tentenResponse.status}: ${tentenResponse.statusText}`);
            }
        }
        
    } catch (error) {
        console.error('WHOIS Error:', error);
        
        // Return fallback data with detailed error message
        const fallbackData = {
            domainName: domain,
            creationDate: 'Không có thông tin',
            expirationDate: 'Không có thông tin',
            registrantName: 'Không có thông tin',
            status: 'Không có thông tin',
            registrarName: 'Không có thông tin',
            nameServers: 'Không có thông tin'
        };
        
        let errorMessage = error.message;
        if (error.message.includes('419')) {
            errorMessage = 'Lỗi CSRF token - API Tenten có thể đã thay đổi cách xác thực';
        } else if (error.message.includes('Failed to fetch')) {
            errorMessage = 'Không thể kết nối đến API Tenten';
        }
        
        sendResponse({ 
            success: true, 
            data: fallbackData, 
            warning: `Lỗi API: ${errorMessage}`,
            source: 'Fallback'
        });
    }
}

function normalizeTentenData(data) {
    // Handle Tenten API response format
    console.log('Normalizing Tenten data:', data);
    
    // Check if it's the expected format with whois_info
    if (data.whois_info) {
        const whoisInfo = data.whois_info;
        
        // Process nameservers array
        let nameServers = 'N/A';
        if (whoisInfo.nameservers && Array.isArray(whoisInfo.nameservers) && whoisInfo.nameservers.length > 0) {
            nameServers = whoisInfo.nameservers.join(', ');
        }
        
        return {
            domainName: whoisInfo.domain_name || whoisInfo.domain || data.domain || 'N/A',
            creationDate: whoisInfo.creation_date || whoisInfo.registered_date || 'N/A',
            expirationDate: whoisInfo.expiration_date || whoisInfo.expires_date || 'N/A',
            registrantName: whoisInfo.registrant_name || whoisInfo.registrant_organization || whoisInfo.owner || 'N/A',
            status: whoisInfo.domain_status || whoisInfo.status || whoisInfo.flags || 'N/A',
            registrarName: whoisInfo.registrar_name || whoisInfo.registrar || whoisInfo.sponsor || 'N/A',
            nameServers: nameServers
        };
    }
    
    // Fallback to original logic for other formats
    const result = data.data || data;
    
    return {
        domainName: result.domain_name || result.domain || data.domain || 'N/A',
        creationDate: result.creation_date || result.registered_date || result.creationDate || 'N/A',
        expirationDate: result.expiration_date || result.expires_date || result.expirationDate || 'N/A',
        registrantName: result.registrant_name || result.registrant?.organization || result.owner || 'N/A',
        status: result.domain_status || result.status || result.flags || 'N/A',
        registrarName: result.registrar_name || result.registrar || result.sponsor || 'N/A',
        nameServers: result.name_servers || result.nameservers || result.dns_servers || 'N/A'
    };
}

function parseTentenHTML(htmlData, domain) {
    console.log('Parsing Tenten HTML response...');
    console.log('HTML preview (first 500 chars):', htmlData.substring(0, 500));
    
    // Debug: Print specific sections
    const statusSection = htmlData.match(/Cờ trạng thái[\s\S]{0,200}/i);
    if (statusSection) {
        console.log('Status section found:', statusSection[0]);
    }
    
    const nsSection = htmlData.match(/Nameservers[\s\S]{0,200}/i);
    if (nsSection) {
        console.log('Nameservers section found:', nsSection[0]);
    }
    
    const result = {
        domainName: domain,
        creationDate: 'N/A',
        expirationDate: 'N/A',
        registrantName: 'N/A',
        status: 'N/A',
        registrarName: 'N/A',
        nameServers: 'N/A'
    };
    
    // Extract domain name from link or header
    const domainMatch = htmlData.match(/<a[^>]*href="https?:\/\/([^"]+)"[^>]*class="link_whois"[^>]*>([^<]+)<\/a>/i) ||
                       htmlData.match(/Thông tin WHOIS tên miền[^>]*<strong[^>]*>([^<]+)<\/strong>/i);
    if (domainMatch) {
        result.domainName = (domainMatch[2] || domainMatch[1]).trim();
        console.log('Domain name extracted:', result.domainName);
    }
    
    // Specific patterns based on the real HTML structure you provided
    // Pattern: <td class="widthTD">Ngày đăng ký : </td><td>16/01/2025</td>
    
    // Registration date
    const regDateMatch = htmlData.match(/<td[^>]*>Ngày đăng ký\s*:\s*<\/td>\s*<td[^>]*>([^<]+)<\/td>/i);
    if (regDateMatch && regDateMatch[1]) {
        result.creationDate = regDateMatch[1].trim();
        console.log('Registration date found:', result.creationDate);
    }
    
    // Expiration date - can be wrapped in <strong>
    const expDateMatch = htmlData.match(/<td[^>]*>Ngày hết hạn\s*:\s*<\/td>\s*<td[^>]*>(?:<strong[^>]*>)?([^<]+)(?:<\/strong>)?<\/td>/i);
    if (expDateMatch && expDateMatch[1]) {
        result.expirationDate = expDateMatch[1].trim();
        console.log('Expiration date found:', result.expirationDate);
    }
    
    // Registrant name
    const registrantMatch = htmlData.match(/<td[^>]*>Chủ sở hữu tên miền\s*:\s*<\/td>\s*<td[^>]*>([^<]+)<\/td>/i);
    if (registrantMatch && registrantMatch[1]) {
        result.registrantName = registrantMatch[1].trim();
        console.log('Registrant found:', result.registrantName);
    }
    
    // Registrar
    const registrarMatch = htmlData.match(/<td[^>]*>Quản lý tại Nhà đăng ký\s*:\s*<\/td>\s*<td[^>]*>([^<]+)<\/td>/i);
    if (registrarMatch && registrarMatch[1]) {
        result.registrarName = registrarMatch[1].trim();
        console.log('Registrar found:', result.registrarName);
    }
    
    // Status flags - extract from ul/li structure
    // Pattern: <td><span>Cờ trạng thái ...:</span></td><td><ul><li>clientTransferProhibited</li></ul></td>
    const statusMatch = htmlData.match(/<td[^>]*><span[^>]*>Cờ trạng thái[^<]*<\/span>\s*<\/td>\s*<td[^>]*><ul>([\s\S]*?)<\/ul><\/td>/i);
    if (statusMatch && statusMatch[1]) {
        console.log('Status section found:', statusMatch[1]);
        const statusItems = statusMatch[1].match(/<li[^>]*>([^<]+)<\/li>/gi);
        if (statusItems && statusItems.length > 0) {
            const statuses = statusItems.map(item => {
                const match = item.match(/<li[^>]*>([^<]+)<\/li>/i);
                return match ? match[1].trim() : '';
            }).filter(status => status);
            
            if (statuses.length > 0) {
                result.status = statuses.join(', ');
                console.log('Status found:', result.status);
            }
        }
    } else {
        // Try broader pattern
        const altStatusMatch = htmlData.match(/Cờ trạng thái[\s\S]*?<ul>([\s\S]*?)<\/ul>/i);
        if (altStatusMatch && altStatusMatch[1]) {
            console.log('Status (fallback) section found:', altStatusMatch[1]);
            const statusItems = altStatusMatch[1].match(/<li[^>]*>([^<]+)<\/li>/gi);
            if (statusItems && statusItems.length > 0) {
                const statuses = statusItems.map(item => item.replace(/<[^>]*>/g, '').trim()).filter(status => status);
                if (statuses.length > 0) {
                    result.status = statuses.join(', ');
                    console.log('Status (fallback) found:', result.status);
                }
            }
        }
    }
    
    // Nameservers - extract from ul/li structure  
    // Pattern: <td><span>Nameservers ...:</span></td><td><ul><li>rayne.ns.cloudflare.com</li><li>zac.ns.cloudflare.com</li></ul></td>
    const nsMatch = htmlData.match(/<td[^>]*><span[^>]*>Nameservers[^<]*<\/span><\/td>\s*<td[^>]*><ul>([\s\S]*?)<\/ul><\/td>/i);
    if (nsMatch && nsMatch[1]) {
        console.log('Nameservers section found:', nsMatch[1]);
        const nsItems = nsMatch[1].match(/<li[^>]*>([^<]+)<\/li>/gi);
        if (nsItems && nsItems.length > 0) {
            const nameServers = nsItems.map(item => {
                const match = item.match(/<li[^>]*>([^<]+)<\/li>/i);
                return match ? match[1].trim() : '';
            }).filter(ns => ns);
            
            if (nameServers.length > 0) {
                result.nameServers = nameServers.join(', ');
                console.log('Nameservers found:', result.nameServers);
            }
        }
    } else {
        // Try broader pattern
        const altNsMatch = htmlData.match(/Nameservers[\s\S]*?<ul>([\s\S]*?)<\/ul>/i);
        if (altNsMatch && altNsMatch[1]) {
            console.log('Nameservers (fallback) section found:', altNsMatch[1]);
            const nsItems = altNsMatch[1].match(/<li[^>]*>([^<]+)<\/li>/gi);
            if (nsItems && nsItems.length > 0) {
                const nameServers = nsItems.map(item => item.replace(/<[^>]*>/g, '').trim()).filter(ns => ns);
                if (nameServers.length > 0) {
                    result.nameServers = nameServers.join(', ');
                    console.log('Nameservers (fallback) found:', result.nameServers);
                }
            }
        }
    }
    
    // Fallback patterns if the above don't work
    if (result.creationDate === 'N/A') {
        // Try simpler pattern
        const altRegDate = htmlData.match(/Ngày đăng ký[:\s]*([^\n\r<]+)/i);
        if (altRegDate && altRegDate[1]) {
            result.creationDate = altRegDate[1].trim();
            console.log('Registration date (fallback):', result.creationDate);
        }
    }
    
    if (result.expirationDate === 'N/A') {
        // Try simpler pattern
        const altExpDate = htmlData.match(/Ngày hết hạn[:\s]*([^\n\r<]+)/i);
        if (altExpDate && altExpDate[1]) {
            result.expirationDate = altExpDate[1].trim();
            console.log('Expiration date (fallback):', result.expirationDate);
        }
    }
    
    console.log('Final parsed result:', result);
    return result;
}

async function handleIpInfo(host, sendResponse) {
    try {
        console.log('Fetching IP Info for:', host);
        
        // Step 1: Get CSRF token from check-host.net homepage
        console.log('Step 1: Getting CSRF token from check-host.net...');
        
        const homepageResponse = await fetch('https://check-host.net/ip-info', {
            method: 'GET',
            headers: {
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.9,vi;q=0.8',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36',
                'Sec-Ch-Ua': '"Not)A;Brand";v="8", "Chromium";v="138", "Google Chrome";v="138"',
                'Sec-Ch-Ua-Mobile': '?0',
                'Sec-Ch-Ua-Platform': '"Windows"',
                'Sec-Fetch-Dest': 'document',
                'Sec-Fetch-Mode': 'navigate',
                'Sec-Fetch-Site': 'none',
                'Sec-Fetch-User': '?1',
                'Cache-Control': 'no-cache',
                'Pragma': 'no-cache'
            }
        });
        
        if (!homepageResponse.ok) {
            throw new Error(`Homepage request failed: ${homepageResponse.status}`);
        }
        
        const htmlText = await homepageResponse.text();
        
        // Extract CSRF token
        let csrfToken = '';
        const csrfMatch = htmlText.match(/name="csrf_token"\s+value="([^"]+)"/i);
        if (csrfMatch && csrfMatch[1]) {
            csrfToken = csrfMatch[1];
            console.log('Found CSRF token:', csrfToken.substring(0, 20) + '...');
        } else {
            throw new Error('Could not find CSRF token');
        }
        
        // Step 2: Make IP info request
        console.log('Step 2: Making IP info request...');
        
        const ipInfoResponse = await fetch(`https://check-host.net/ip-info?host=${encodeURIComponent(host)}&csrf_token=${encodeURIComponent(csrfToken)}`, {
            method: 'GET',
            headers: {
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.9,vi;q=0.8',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36',
                'Referer': 'https://check-host.net/ip-info',
                'Sec-Ch-Ua': '"Not)A;Brand";v="8", "Chromium";v="138", "Google Chrome";v="138"',
                'Sec-Ch-Ua-Mobile': '?0',
                'Sec-Ch-Ua-Platform': '"Windows"',
                'Sec-Fetch-Dest': 'document',
                'Sec-Fetch-Mode': 'navigate',
                'Sec-Fetch-Site': 'same-origin'
            }
        });
        
        console.log('IP Info API response status:', ipInfoResponse.status);
        
        if (ipInfoResponse.ok) {
            const responseText = await ipInfoResponse.text();
            console.log('Response length:', responseText.length);
            
            // Parse HTML response to extract IP info
            const parsedData = parseCheckHostHTML(responseText, host);
            sendResponse({ success: true, data: parsedData, source: 'Check-Host.net' });
            return;
        } else {
            throw new Error(`API returned status ${ipInfoResponse.status}: ${ipInfoResponse.statusText}`);
        }
        
    } catch (error) {
        console.error('IP Info Error:', error);
        
        // Return fallback data
        const fallbackData = {
            host: host,
            ipAddress: 'Không có thông tin',
            hostname: 'Không có thông tin',
            ipRange: 'Không có thông tin',
            isp: 'Không có thông tin',
            organization: 'Không có thông tin',
            country: 'Không có thông tin',
            region: 'Không có thông tin',
            city: 'Không có thông tin',
            timezone: 'Không có thông tin',
            localTime: 'Không có thông tin',
            postalCode: 'Không có thông tin'
        };
        
        sendResponse({ 
            success: true, 
            data: fallbackData, 
            warning: `Lỗi API: ${error.message}`,
            source: 'Fallback'
        });
    }
}

function parseCheckHostHTML(htmlData, host) {
    console.log('Parsing Check-Host HTML response...');
    
    const result = {
        host: host,
        ipAddress: 'N/A',
        hostname: 'N/A',
        ipRange: 'N/A',
        isp: 'N/A',
        organization: 'N/A',
        country: 'N/A',
        region: 'N/A',
        city: 'N/A',
        timezone: 'N/A',
        localTime: 'N/A',
        postalCode: 'N/A'
    };
    
    // Extract multiple IP info sections and combine data
    const ipInfoSections = htmlData.match(/<div class="ipinfo-item[^>]*"[^>]*>([\s\S]*?)<\/div>\s*<script/gi) || [];
    
    console.log(`Found ${ipInfoSections.length} IP info sections`);
    
    // Data from all sources to find most common values
    const allData = {
        ipAddress: [],
        hostname: [],
        ipRange: [],
        isp: [],
        organization: [],
        country: [],
        region: [],
        city: [],
        timezone: [],
        localTime: [],
        postalCode: []
    };
    
    for (const section of ipInfoSections) {
        // Extract table data from each section
        const tableRows = section.match(/<tr[^>]*>[\s\S]*?<\/tr>/gi) || [];
        
        for (const row of tableRows) {
            const cells = row.match(/<td[^>]*>([\s\S]*?)<\/td>/gi);
            if (!cells || cells.length < 2) continue;
            
            const label = cells[0].replace(/<[^>]*>/g, '').trim().toLowerCase();
            const value = cells[1].replace(/<[^>]*>/g, '').trim();
            
            if (!value || value === '') continue;
            
            // Map labels to data fields
            if (label.includes('ip address')) {
                allData.ipAddress.push(value);
            } else if (label.includes('host name') || label.includes('hostname')) {
                allData.hostname.push(value);
            } else if (label.includes('ip range')) {
                allData.ipRange.push(value.split(' ')[0]); // Take first part before CIDR
            } else if (label.includes('isp')) {
                allData.isp.push(value);
            } else if (label.includes('organization')) {
                allData.organization.push(value);
            } else if (label.includes('country')) {
                allData.country.push(value);
            } else if (label.includes('region')) {
                allData.region.push(value);
            } else if (label.includes('city')) {
                allData.city.push(value);
            } else if (label.includes('time zone')) {
                allData.timezone.push(value);
            } else if (label.includes('local time')) {
                allData.localTime.push(value);
            } else if (label.includes('postal code')) {
                allData.postalCode.push(value);
            }
        }
    }
    
    // Find most common value for each field
    for (const [field, values] of Object.entries(allData)) {
        if (values.length > 0) {
            // Filter out empty values and find most common
            const filteredValues = values.filter(v => v && v.trim() !== '');
            if (filteredValues.length > 0) {
                // Simple approach: take the first non-empty value, or most detailed one
                const bestValue = filteredValues.reduce((best, current) => {
                    return current.length > best.length ? current : best;
                });
                result[field] = bestValue;
            }
        }
    }
    
    console.log('Parsed IP info result:', result);
    return result;
}

async function handleDnsLookup(domain, recordType, sendResponse) {
    try {
        console.log('=== DNS Lookup Started ===');
        console.log('Domain:', domain);
        console.log('Record Type:', recordType);
        
        // Use Google DNS-over-HTTPS API
        const dnsApiUrl = `https://dns.google/resolve?name=${encodeURIComponent(domain)}&type=${recordType}`;
        console.log('DNS API URL:', dnsApiUrl);
        
        const response = await fetch(dnsApiUrl, {
            method: 'GET',
            headers: {
                'Accept': 'application/dns-json',
                'User-Agent': 'Tenten DNS Manager Extension'
            }
        });

        if (!response.ok) {
            throw new Error(`DNS API request failed: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log('DNS API Response:', data);

        // Parse DNS response
        const records = [];
        
        if (data.Answer && data.Answer.length > 0) {
            data.Answer.forEach(answer => {
                if (answer.type === getRecordTypeNumber(recordType)) {
                    const record = parseDnsRecord(answer, recordType);
                    if (record) {
                        records.push(record);
                    }
                }
            });
        }

        console.log('Parsed DNS records:', records);

        sendResponse({
            success: true,
            data: records,
            source: 'Google DNS-over-HTTPS',
            query: {
                domain: domain,
                type: recordType
            }
        });

    } catch (error) {
        console.error('DNS Lookup error:', error);
        sendResponse({
            success: false,
            error: error.message || 'Không thể tra cứu bản ghi DNS'
        });
    }
}

function getRecordTypeNumber(recordType) {
    const typeMap = {
        'A': 1,
        'NS': 2,
        'CNAME': 5,
        'SOA': 6,
        'PTR': 12,
        'MX': 15,
        'TXT': 16,
        'AAAA': 28,
        'SRV': 33,
        'DS': 43,
        'DNSKEY': 48,
        'CAA': 257
    };
    return typeMap[recordType] || 1;
}

function parseDnsRecord(answer, recordType) {
    const record = {
        type: recordType,
        ttl: answer.TTL
    };

    try {
        switch (recordType) {
            case 'A':
            case 'AAAA':
                record.address = answer.data;
                record.value = answer.data;
                break;
            
            case 'CNAME':
            case 'PTR':
            case 'NS':
                record.target = answer.data;
                record.value = answer.data;
                break;
            
            case 'MX':
                // MX format: "priority target"
                const mxParts = answer.data.split(' ');
                if (mxParts.length >= 2) {
                    record.priority = parseInt(mxParts[0]);
                    record.exchange = mxParts.slice(1).join(' ');
                    record.value = answer.data;
                } else {
                    record.value = answer.data;
                }
                break;
            
            case 'TXT':
                record.text = answer.data;
                record.value = answer.data;
                break;
            
            case 'SOA':
                // SOA format: "mname rname serial refresh retry expire minimum"
                record.value = answer.data;
                record.data = answer.data;
                break;
            
            case 'SRV':
                // SRV format: "priority weight port target"
                const srvParts = answer.data.split(' ');
                if (srvParts.length >= 4) {
                    record.priority = parseInt(srvParts[0]);
                    record.weight = parseInt(srvParts[1]);
                    record.port = parseInt(srvParts[2]);
                    record.target = srvParts[3];
                    record.value = answer.data;
                } else {
                    record.value = answer.data;
                }
                break;
            
            case 'CAA':
                // CAA format: "flags tag value"
                const caaParts = answer.data.split(' ');
                if (caaParts.length >= 3) {
                    record.flags = parseInt(caaParts[0]);
                    record.tag = caaParts[1];
                    record.value = caaParts.slice(2).join(' ');
                } else {
                    record.value = answer.data;
                }
                break;
            
            case 'DS':
            case 'DNSKEY':
                record.value = answer.data;
                record.data = answer.data;
                break;
            
            default:
                record.value = answer.data;
                record.data = answer.data;
        }
    } catch (error) {
        console.error('Error parsing DNS record:', error);
        record.value = answer.data;
    }

    return record;
}
