// This is the main JavaScript file (script.js)

document.addEventListener('DOMContentLoaded', function() {
    // Bitcoin color palette
    const colors = {
        noBtc: '#f8f9fa',
        lowBtc: '#f7931a33',
        mediumBtc: '#f7931a88',
        highBtc: '#f7931a',
        text: '#4d4d4d',
        background: '#ffffff',
        accent: '#f7931a'
    };

    const btcHoldings = {
        "US": 207189,
        "CN": 194000,
        "GB": 61000,
        "UA": 46351,
        "BT": 13029,
        "SV": 6102,
        "FI": 90
    };

    // Fetch the current Bitcoin price
    fetchBtcPrice();
    
    // Initialize the map immediately
    setTimeout(() => {
        initializeMap();
    }, 100);
    
    // Close country info panel when close button clicked
    document.getElementById('close-info').addEventListener('click', function() {
        document.getElementById('country-info').classList.remove('active');
        document.getElementById('mobile-overlay').classList.add('hidden');
    });
    
    // Set up social media sharing buttons
    document.querySelector('.share-btn.twitter').addEventListener('click', function() {
        shareOnSocial('twitter');
    });
    
    document.querySelector('.share-btn.facebook').addEventListener('click', function() {
        shareOnSocial('facebook');
    });
    
    document.querySelector('.share-btn.linkedin').addEventListener('click', function() {
        shareOnSocial('linkedin');
    });

    const mobileOverlay = document.getElementById('mobile-overlay');
    const countryInfo = document.getElementById('country-info');
    const closeInfoBtn = document.getElementById('close-info');

    if (mobileOverlay && countryInfo && closeInfoBtn) {
        closeInfoBtn.addEventListener('click', function() {
            countryInfo.classList.remove('active');
            mobileOverlay.classList.add('hidden');
        });

        mobileOverlay.addEventListener('click', function() {
            countryInfo.classList.remove('active');
            this.classList.add('hidden');
        });
    }
});

function initializeMap() {
    // Try to find the SVG in the map container
    const mapContainer = document.getElementById('map-container');
    console.log('Map Container:', mapContainer);

    // First, try to find an existing SVG
    let svg = mapContainer ? mapContainer.querySelector('svg:not(#fallback-svg)') : null;
    
    // If no SVG found, try the fallback SVG
    if (!svg) {
        const fallbackSvg = document.getElementById('fallback-svg');
        if (fallbackSvg) {
            console.log('Using fallback SVG');
            // Clone the fallback SVG and make it visible
            svg = fallbackSvg.cloneNode(true);
            svg.style.display = 'block';
            mapContainer.appendChild(svg);
        }
    }

    // If still no SVG, log error and show error message
    if (!svg) {
        console.error('No SVG found in the map container. Possible reasons:');
        console.error('1. SVG not loaded correctly');
        console.error('2. Incorrect selector used');
        console.error('3. SVG content missing');
        
        // Show error message to the user
        const mapError = document.getElementById('map-error');
        const mapLoading = document.getElementById('map-loading');
        
        if (mapLoading) mapLoading.style.display = 'none';
        if (mapError) {
            mapError.style.display = 'block';
            mapError.innerHTML = `
                <p>Error: Map could not be loaded.</p>
                <p>Possible reasons:
                    <ul>
                        <li>SVG file is missing</li>
                        <li>Network issues</li>
                        <li>Incorrect file path</li>
                    </ul>
                </p>
                <button onclick="retryMapLoad()" class="retry-btn">Retry Loading</button>
            `;
        }
        return;
    }

    // Proceed with map initialization
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', 'auto');
    svg.setAttribute('viewBox', '0 0 2000 1000');
    svg.style.maxWidth = '100%';
    
    // Get all country paths
    const countryPaths = svg.querySelectorAll('path');
    console.log('Country Paths Found:', countryPaths.length);
    
    // Bitcoin color palette
    const colors = {
        noBtc: '#f8f9fa',
        lowBtc: '#f7931a33',
        mediumBtc: '#f7931a88',
        highBtc: '#f7931a',
        text: '#4d4d4d',
        background: '#ffffff',
        accent: '#f7931a'
    };

    const btcHoldings = {
        "US": 207189,
        "CN": 194000,
        "GB": 61000,
        "UA": 46351,
        "BT": 13029,
        "SV": 6102,
        "FI": 90
    };
    
    countryPaths.forEach(path => {
        // Get country code from the id of the path
        const countryCode = path.id.toUpperCase();
        
        // Set the fill color based on BTC holdings
        if (btcHoldings[countryCode]) {
            const btcAmount = btcHoldings[countryCode];
            
            if (btcAmount > 100000) {
                path.setAttribute('fill', colors.highBtc);
                path.setAttribute('data-category', 'high');
            } else if (btcAmount >= 10000) {
                path.setAttribute('fill', colors.mediumBtc);
                path.setAttribute('data-category', 'medium');
            } else {
                path.setAttribute('fill', colors.lowBtc);
                path.setAttribute('data-category', 'low');
            }
            
            // Store BTC holdings as a data attribute
            path.setAttribute('data-btc', btcAmount);
        } else {
            path.setAttribute('fill', colors.noBtc);
            path.setAttribute('data-category', 'none');
        }
        
        // Add hover effects
        path.addEventListener('mouseenter', showTooltip);
        path.addEventListener('mouseleave', hideTooltip);
        path.addEventListener('click', showCountryInfo);
        
        // For touch devices
        path.addEventListener('touchstart', function(e) {
            e.preventDefault();
            showTooltip.call(this, e);
        });
    });
    
    // Hide loading indicator
    const mapLoading = document.getElementById('map-loading');
    if (mapLoading) mapLoading.style.display = 'none';
    
    // For responsive behavior
    window.addEventListener('resize', adjustMapSize);
    
    adjustMapSize();
}

function adjustMapSize() {
    const mapContainer = document.getElementById('map-container');
    const containerWidth = mapContainer.clientWidth;
    
    // If width is less than 768px (mobile), adjust the viewBox to focus more on populated areas
    if (containerWidth < 768) {
        const svg = mapContainer.querySelector('svg');
        if (svg) {
            svg.setAttribute('viewBox', '300 0 1400 1000');
        }
    } else {
        const svg = mapContainer.querySelector('svg');
        if (svg) {
            svg.setAttribute('viewBox', '0 0 2000 1000');
        }
    }
}

function showTooltip(event) {
    const countryCode = this.id.toUpperCase();
    const tooltip = document.getElementById('tooltip');
    
    // Get country name from the map
    let countryName = getCountryNameFromPath(this);
    
    if (btcHoldings[countryCode]) {
        const btcAmount = btcHoldings[countryCode].toLocaleString();
        tooltip.innerHTML = `<strong>${countryName}</strong><br>${btcAmount} BTC`;
        tooltip.classList.remove('hidden');
        
        // Position the tooltip near the mouse or touch point
        positionTooltip(event);
    } else {
        tooltip.innerHTML = `<strong>${countryName}</strong><br>No reported BTC`;
        tooltip.classList.remove('hidden');
        
        // Position the tooltip near the mouse or touch point
        positionTooltip(event);
    }
    
    // Highlight the country
    this.setAttribute('stroke', colors.accent);
    this.setAttribute('stroke-width', '1.5');
}

function hideTooltip() {
    const tooltip = document.getElementById('tooltip');
    tooltip.classList.add('hidden');
    
    // Remove highlight
    this.setAttribute('stroke', '#ffffff');
    this.setAttribute('stroke-width', '0.5');
}

function positionTooltip(event) {
    const tooltip = document.getElementById('tooltip');
    const mapContainer = document.getElementById('map-container');
    const containerRect = mapContainer.getBoundingClientRect();
    
    // Check if it's a touch event
    let clientX, clientY;
    if (event.type === 'touchstart') {
        clientX = event.touches[0].clientX;
        clientY = event.touches[0].clientY;
    } else {
        clientX = event.clientX;
        clientY = event.clientY;
    }
    
    // Calculate position relative to the container
    const x = clientX - containerRect.left + 10;
    const y = clientY - containerRect.top + 10;
    
    // Make sure the tooltip stays within the viewport
    const tooltipWidth = tooltip.offsetWidth;
    const tooltipHeight = tooltip.offsetHeight;
    
    if (x + tooltipWidth > containerRect.width) {
        tooltip.style.left = (x - tooltipWidth - 20) + 'px';
    } else {
        tooltip.style.left = x + 'px';
    }
    
    if (y + tooltipHeight > containerRect.height) {
        tooltip.style.top = (y - tooltipHeight - 20) + 'px';
    } else {
        tooltip.style.top = y + 'px';
    }
}

function showCountryInfo(event) {
    const countryCode = this.id.toUpperCase();
    const countryInfoPanel = document.getElementById('country-info');
    const countryNameElement = document.getElementById('country-name');
    const btcAmountElement = document.getElementById('btc-amount');
    const btcValueElement = document.getElementById('btc-value');
    
    // Get country name
    let countryName = getCountryNameFromPath(this);
    
    if (btcHoldings[countryCode]) {
        const btcAmount = btcHoldings[countryCode];
        
        countryNameElement.textContent = countryName;
        btcAmountElement.textContent = `${btcAmount.toLocaleString()} BTC`;
        
        // Calculate value in USD if BTC price is available
        const btcPriceElement = document.getElementById('btc-price-value');
        const btcPrice = parseFloat(btcPriceElement.getAttribute('data-price'));
        
        if (!isNaN(btcPrice)) {
            const valueUsd = btcAmount * btcPrice;
            btcValueElement.textContent = `≈ $${valueUsd.toLocaleString()} USD`;
        } else {
            btcValueElement.textContent = 'Value: Price data unavailable';
        }
        
        // Show the panel
        countryInfoPanel.classList.add('active');
        
        // For mobile: show overlay
        if (window.innerWidth < 768) {
            document.getElementById('mobile-overlay').classList.remove('hidden');
        }
    }
}

// Add comprehensive country name mapping
const countryNames = {
    "US": "United States",
    "CN": "China", 
    "GB": "United Kingdom",
    "UA": "Ukraine",
    "BT": "Bhutan",
    "SV": "El Salvador",
    "FI": "Finland"
};

// Improved error handling for Bitcoin price fetching
async function fetchBtcPrice() {
    try {
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd');
        const data = await response.json();
        const btcPrice = data.bitcoin.usd;
        
        const btcPriceElement = document.getElementById('btc-price-value');
        btcPriceElement.textContent = `$${btcPrice.toLocaleString()}`;
        btcPriceElement.setAttribute('data-price', btcPrice);
    } catch (error) {
        console.error('Error fetching Bitcoin price:', error);
        const btcPriceElement = document.getElementById('btc-price-value');
        btcPriceElement.textContent = 'Price Unavailable';
    }
}

// Improved country name retrieval
function getCountryNameFromPath(pathElement) {
    const countryCode = pathElement.id.toUpperCase();
    return countryNames[countryCode] || countryCode;
}

// Social sharing functions with error handling
function shareOnSocial(platform) {
    const shareText = 'Check out this interactive map of Bitcoin holdings by country!';
    const shareUrl = window.location.href;
    
    switch(platform) {
        case 'twitter':
            window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, '_blank');
            break;
        case 'facebook':
            window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
            break;
        case 'linkedin':
            window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(shareText)}`, '_blank');
            break;
        default:
            console.error('Unsupported sharing platform');
    }
}

// Modify retryMapLoad to add more logging
function retryMapLoad() {
    console.log('Retrying map load...');
    
    const mapContainer = document.getElementById('map-container');
    const mapLoading = document.getElementById('map-loading');
    const mapError = document.getElementById('map-error');
    
    // Reset to loading state
    if (mapLoading) mapLoading.style.display = 'block';
    if (mapError) mapError.style.display = 'none';
    
    // Reinitialize the map
    setTimeout(() => {
        initializeMap();
    }, 100);
}

// Add a global error handler
window.addEventListener('error', function(event) {
    console.error('Unhandled error:', event.error);
    const mapError = document.getElementById('map-error');
    if (mapError) {
        mapError.style.display = 'block';
        mapError.innerHTML = `
            <p>An unexpected error occurred:</p>
            <p>${event.error ? event.error.message : 'Unknown error'}</p>
            <button onclick="retryMapLoad()" class="retry-btn">Retry Loading</button>
        `;
    }
});
