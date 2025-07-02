// Domain Utilities
// Common utilities for domain handling, storage, and validation

class DomainUtils {
    static cleanDomainName(domain) {
        if (!domain) return '';
        
        // Remove protocol
        domain = domain.replace(/^https?:\/\//, '');
        
        // Remove www
        domain = domain.replace(/^www\./, '');
        
        // Remove path
        domain = domain.split('/')[0];
        
        // Remove port
        domain = domain.split(':')[0];
        
        return domain.toLowerCase().trim();
    }

    static isValidDomain(domain) {
        const cleanDomain = this.cleanDomainName(domain);
        const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9](?:\.[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9])*$/;
        return domainRegex.test(cleanDomain);
    }

    static isValidIP(ip) {
        // IPv4 validation
        const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
        
        // IPv6 validation (basic)
        const ipv6Regex = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
        
        return ipv4Regex.test(ip) || ipv6Regex.test(ip);
    }

    static saveDomain(domain) {
        if (domain && domain.trim()) {
            chrome.storage.local.set({ 'lastDomain': domain.trim() });
        }
    }

    static async loadSavedDomain() {
        return new Promise((resolve) => {
            chrome.storage.local.get(['lastDomain'], (result) => {
                resolve(result.lastDomain || '');
            });
        });
    }

    static formatDate(dateString) {
        if (!dateString) return 'N/A';
        
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) {
                return dateString; // Return original if can't parse
            }
            
            return date.toLocaleDateString('vi-VN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
            });
        } catch (error) {
            console.error('Date formatting error:', error);
            return dateString;
        }
    }

    static extractTLD(domain) {
        const cleanDomain = this.cleanDomainName(domain);
        const parts = cleanDomain.split('.');
        return parts.length > 1 ? parts[parts.length - 1] : '';
    }

    static extractSubdomain(domain) {
        const cleanDomain = this.cleanDomainName(domain);
        const parts = cleanDomain.split('.');
        
        if (parts.length > 2) {
            return parts.slice(0, -2).join('.');
        }
        return '';
    }

    static getDomainInfo(domain) {
        const cleanDomain = this.cleanDomainName(domain);
        const parts = cleanDomain.split('.');
        
        return {
            full: cleanDomain,
            subdomain: this.extractSubdomain(domain),
            domain: parts.length > 1 ? parts.slice(-2, -1)[0] : cleanDomain,
            tld: this.extractTLD(domain),
            isValid: this.isValidDomain(domain),
            isIP: this.isValidIP(cleanDomain)
        };
    }

    static async checkDomainReachability(domain) {
        const cleanDomain = this.cleanDomainName(domain);
        
        try {
            const response = await fetch(`https://${cleanDomain}`, {
                method: 'HEAD',
                mode: 'no-cors',
                timeout: 5000
            });
            return true;
        } catch (error) {
            console.log(`Domain ${cleanDomain} not reachable:`, error);
            return false;
        }
    }

    static generateDomainVariations(domain) {
        const cleanDomain = this.cleanDomainName(domain);
        const variations = [
            cleanDomain,
            `www.${cleanDomain}`
        ];

        // Add common subdomain variations
        const commonSubdomains = ['mail', 'ftp', 'blog', 'shop', 'api', 'cdn'];
        commonSubdomains.forEach(sub => {
            variations.push(`${sub}.${cleanDomain}`);
        });

        return [...new Set(variations)]; // Remove duplicates
    }

    static async batchProcess(domains, processor, concurrency = 3) {
        const results = [];
        const cleanDomains = domains.map(d => this.cleanDomainName(d));
        
        for (let i = 0; i < cleanDomains.length; i += concurrency) {
            const batch = cleanDomains.slice(i, i + concurrency);
            const batchPromises = batch.map(domain => processor(domain));
            
            try {
                const batchResults = await Promise.allSettled(batchPromises);
                results.push(...batchResults);
            } catch (error) {
                console.error('Batch processing error:', error);
                // Add failed results
                batch.forEach(() => {
                    results.push({ status: 'rejected', reason: error });
                });
            }
        }
        
        return results;
    }

    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    static throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
}

// Export for use in other modules
window.DomainUtils = DomainUtils;
