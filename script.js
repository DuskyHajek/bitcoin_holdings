// This is the main JavaScript file (script.js)

// Country names mapping
const countryNames = {
    "US": "United States",
    "CN": "China", 
    "GB": "United Kingdom",
    "UA": "Ukraine",
    "BT": "Bhutan",
    "SV": "El Salvador",
    "FI": "Finland"
};

// Bitcoin holdings data
const btcHoldings = {
    "US": 207189,
    "CN": 194000,
    "GB": 61000,
    "UA": 46351,
    "BT": 13029,
    "SV": 6102,
    "FI": 90
};

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

document.addEventListener('DOMContentLoaded', function() {
    // Load the world map SVG
    loadWorldMap();
    
    // Event listeners for country info and sharing
    setupEventListeners();
});

function loadWorldMap() {
    const mapContainer = document.getElementById('map-container');
    if (!mapContainer) {
        console.error('Map container not found');
        showMapError('Map container is missing');
        return;
    }

    // Create a new object to load the SVG
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'world.svg', true);
    xhr.onload = function() {
        if (xhr.status === 200) {
            // Remove loading indicator
            const mapLoading = document.getElementById('map-loading');
            if (mapLoading) mapLoading.style.display = 'none';
            
            // Insert the SVG content
            mapContainer.innerHTML = xhr.responseText;
            
            // Now initialize the map with the loaded SVG
            setTimeout(initializeMap, 100);
        } else {
            console.error('Failed to load world.svg:', xhr.status);
            showMapError('Failed to load world map');
        }
    };
    xhr.onerror = function() {
        console.error('Network error when loading world.svg');
        showMapError('Network error when loading world map');
    };
    xhr.send();
}

function initializeMap() {
    // Try to find the SVG in the map container
    const mapContainer = document.getElementById('map-container');
    if (!mapContainer) {
        console.error('Map container not found');
        showMapError('Map container is missing');
        return;
    }

    // Find the SVG element
    let svg = mapContainer.querySelector('svg');
    
    // If no SVG found, show error
    if (!svg) {
        showMapError('SVG map could not be loaded');
        return;
    }

    // Ensure valid SVG attributes
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '500');  // Use numeric value
    svg.setAttribute('viewBox', '0 0 2000 857');  // Match the original viewBox from world.svg
    svg.style.maxWidth = '100%';
    
    // Get all country paths
    const countryPaths = svg.querySelectorAll('path');
    console.log('Country Paths Found:', countryPaths.length);
    
    countryPaths.forEach(path => {
        // Get country code from the id of the path
        const countryCode = path.id ? path.id.toUpperCase() : '';
        
        // Skip paths without an id
        if (!countryCode) return;
        
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

function showMapError(message) {
    const mapLoading = document.getElementById('map-loading');
    const mapError = document.getElementById('map-error');
    
    if (mapLoading) mapLoading.style.display = 'none';
    if (mapError) {
        mapError.style.display = 'block';
        mapError.innerHTML = `
            <p>Error: ${message}</p>
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
}

function setupEventListeners() {
    // Close country info panel when close button clicked
    const closeInfoBtn = document.getElementById('close-info');
    const countryInfo = document.getElementById('country-info');
    const mobileOverlay = document.getElementById('mobile-overlay');

    if (closeInfoBtn) {
        closeInfoBtn.addEventListener('click', function() {
            if (countryInfo) countryInfo.classList.remove('active');
            if (mobileOverlay) mobileOverlay.classList.add('hidden');
        });
    }

    // Mobile overlay click
    if (mobileOverlay) {
        mobileOverlay.addEventListener('click', function() {
            if (countryInfo) countryInfo.classList.remove('active');
            this.classList.add('hidden');
        });
    }
}

function adjustMapSize() {
    const mapContainer = document.getElementById('map-container');
    if (!mapContainer) return;

    const containerWidth = mapContainer.clientWidth;
    const svg = mapContainer.querySelector('svg');
    
    if (!svg) return;
    
    // If width is less than 768px (mobile), adjust the viewBox to focus more on populated areas
    if (containerWidth < 768) {
        svg.setAttribute('viewBox', '300 0 1400 1000');
    } else {
        svg.setAttribute('viewBox', '0 0 2000 1000');
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
        btcValueElement.textContent = 'Value not available';
        
        // Show the panel
        countryInfoPanel.classList.add('active');
        
        // For mobile: show overlay
        if (window.innerWidth < 768) {
            document.getElementById('mobile-overlay').classList.remove('hidden');
        }
    }
}

function getCountryNameFromPath(pathElement) {
    if (!pathElement || !pathElement.id) return 'Unknown';
    const countryCode = pathElement.id.toUpperCase();
    return countryNames[countryCode] || countryCode;
}

function retryMapLoad() {
    const mapLoading = document.getElementById('map-loading');
    const mapError = document.getElementById('map-error');
    
    // Reset to loading state
    if (mapLoading) mapLoading.style.display = 'block';
    if (mapError) mapError.style.display = 'none';
    
    // Load the world map again
    loadWorldMap();
}
