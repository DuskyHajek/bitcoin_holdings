// This is the main JavaScript file (script.js)

// Country codes mapping between ISO codes and SVG map IDs
const countryCodeMapping = {
    // Map the country codes from btc_holdings.json to the SVG IDs
    "US": ["United States", "US"], // United States
    "CN": ["China", "CN"], // China
    "GB": ["United Kingdom", "GB"], // United Kingdom
    "UA": ["UA", "Ukraine"], // Ukraine
    "BT": ["BT", "Bhutan"], // Bhutan
    "SV": ["SV", "El Salvador"], // El Salvador
    "FI": ["FI", "Finland"]  // Finland
};

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

// Updated Bitcoin color palette with more vibrant colors
const newColors = {
    noBtc: '#f8f9fa',
    lowBtc: '#f7931a33',
    mediumBtc: '#f7931a88',
    highBtc: '#f7931a',
    text: '#2d2d2d',
    background: '#ffffff',
    accent: '#f7931a',
    dark: '#2d2d2d',
    light: '#ffffff'
};

document.addEventListener('DOMContentLoaded', function() {
    // Load the world map SVG
    loadWorldMap();
    
    // Event listeners for country info and sharing
    setupEventListeners();
    
    // Apply the new Bitcoin-themed styling
    applyBitcoinStyling();
    
    // Set up share buttons
    setupShareButtons();
});

function applyBitcoinStyling() {
    // Update header styling
    const header = document.querySelector('header');
    if (header) {
        header.style.background = 'linear-gradient(135deg, #f7931a, #ff8f00)';
        header.style.color = '#ffffff';
        header.style.boxShadow = '0 4px 12px rgba(247, 147, 26, 0.2)';
        header.style.borderRadius = '0 0 15px 15px';
        header.style.padding = '2rem';
    }
    
    // Update footer styling
    const footer = document.querySelector('footer');
    if (footer) {
        footer.style.background = '#2d2d2d';
        footer.style.color = '#ffffff';
        footer.style.padding = '1.5rem';
        footer.style.borderRadius = '15px 15px 0 0';
    }
    
    // Update legend styling
    const legend = document.getElementById('legend');
    if (legend) {
        legend.style.background = '#ffffff';
        legend.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
        legend.style.borderRadius = '10px';
        legend.style.padding = '1.5rem';
        legend.style.margin = '2rem 0';
    }
    
    // Update country info panel
    const countryInfo = document.getElementById('country-info');
    if (countryInfo) {
        countryInfo.style.background = '#ffffff';
        countryInfo.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.15)';
        countryInfo.style.borderRadius = '10px';
        countryInfo.style.border = '2px solid #f7931a';
    }
    
    // Update buttons
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        button.style.background = '#f7931a';
        button.style.color = '#ffffff';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.padding = '0.5rem 1rem';
        button.style.cursor = 'pointer';
        button.style.transition = 'all 0.3s ease';
        
        // Add hover effect
        button.addEventListener('mouseenter', function() {
            this.style.background = '#ff8f00';
            this.style.transform = 'translateY(-2px)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.background = '#f7931a';
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Update tooltip styling
    const tooltip = document.getElementById('tooltip');
    if (tooltip) {
        tooltip.style.background = '#2d2d2d';
        tooltip.style.color = '#ffffff';
        tooltip.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.2)';
        tooltip.style.borderRadius = '5px';
        tooltip.style.padding = '0.75rem 1rem';
        tooltip.style.zIndex = '1000';
        tooltip.style.pointerEvents = 'none';
    }
    
    // Style the intro text
    const introText = document.querySelector('.intro-text');
    if (introText) {
        introText.style.background = '#ffffff';
        introText.style.padding = '1.5rem';
        introText.style.borderRadius = '10px';
        introText.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
        introText.style.marginBottom = '2rem';
        introText.style.textAlign = 'center';
        introText.style.fontSize = '1.1rem';
        introText.style.lineHeight = '1.6';
    }
    
    // Style the BTC price widget
    const btcPriceWidget = document.querySelector('.btc-price-widget');
    if (btcPriceWidget) {
        btcPriceWidget.style.marginTop = '1rem';
        btcPriceWidget.style.padding = '0.75rem';
        btcPriceWidget.style.background = '#f7931a';
        btcPriceWidget.style.color = '#ffffff';
        btcPriceWidget.style.borderRadius = '5px';
        btcPriceWidget.style.display = 'inline-block';
        btcPriceWidget.style.fontWeight = '500';
    }
    
    // Style the stats container
    const statsContainer = document.querySelector('.stats-container');
    if (statsContainer) {
        statsContainer.style.background = '#ffffff';
        statsContainer.style.padding = '1.5rem';
        statsContainer.style.borderRadius = '10px';
        statsContainer.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
        statsContainer.style.marginTop = '2rem';
        statsContainer.style.textAlign = 'center';
    }
    
    // Style the stats grid
    const statsGrid = document.querySelector('.stats-grid');
    if (statsGrid) {
        statsGrid.style.display = 'grid';
        statsGrid.style.gridTemplateColumns = 'repeat(auto-fit, minmax(200px, 1fr))';
        statsGrid.style.gap = '1.5rem';
        statsGrid.style.marginTop = '1.5rem';
    }
    
    // Style the stat cards
    const statCards = document.querySelectorAll('.stat-card');
    statCards.forEach(card => {
        card.style.background = '#f8f9fa';
        card.style.padding = '1.5rem';
        card.style.borderRadius = '10px';
        card.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.05)';
        card.style.transition = 'all 0.3s ease';
        
        // Add hover effect
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 8px 16px rgba(247, 147, 26, 0.15)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.05)';
        });
    });
    
    // Style the stat icons
    const statIcons = document.querySelectorAll('.stat-icon');
    statIcons.forEach(icon => {
        icon.style.fontSize = '2.5rem';
        icon.style.color = '#f7931a';
        icon.style.marginBottom = '1rem';
    });
    
    // Style the stat values
    const statValues = document.querySelectorAll('.stat-value');
    statValues.forEach(value => {
        value.style.fontSize = '2rem';
        value.style.fontWeight = '700';
        value.style.color = '#2d2d2d';
        value.style.marginBottom = '0.5rem';
    });
    
    // Style the stat labels
    const statLabels = document.querySelectorAll('.stat-label');
    statLabels.forEach(label => {
        label.style.fontSize = '1rem';
        label.style.color = '#666';
    });
    
    // Style footer links
    const footerLinks = document.querySelectorAll('.footer-link');
    footerLinks.forEach(link => {
        link.style.color = '#f7931a';
        link.style.textDecoration = 'none';
        link.style.transition = 'color 0.3s ease';
        
        link.addEventListener('mouseenter', function() {
            this.style.color = '#ff8f00';
            this.style.textDecoration = 'underline';
        });
        
        link.addEventListener('mouseleave', function() {
            this.style.color = '#f7931a';
            this.style.textDecoration = 'none';
        });
    });
    
    // Add Bitcoin logo to header
    const headerContent = document.querySelector('.header-content');
    if (headerContent) {
        headerContent.style.position = 'relative';
    }
    
    // Add subtle animation to the map container
    const mapContainer = document.getElementById('map-container');
    if (mapContainer) {
        mapContainer.style.transition = 'all 0.5s ease';
        mapContainer.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.1)';
        mapContainer.style.borderRadius = '15px';
        mapContainer.style.overflow = 'hidden';
        mapContainer.style.margin = '2rem 0';
    }
    
    // Make the body background a subtle gradient
    document.body.style.background = 'linear-gradient(135deg, #f8f9fa, #f0f0f0)';
    document.body.style.minHeight = '100vh';
    
    // Add animation keyframes for counting up
    const style = document.createElement('style');
    style.textContent = `
        @keyframes countUp {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
    `;
    document.head.appendChild(style);
}

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
    
    // Create a map of country codes to paths
    const countryPathsMap = {};
    
    // First, process paths with id attributes
    countryPaths.forEach(path => {
        if (path.id) {
            countryPathsMap[path.id.toUpperCase()] = path;
        }
    });
    
    // Then, process paths with class attributes for special cases like US, China, UK
    countryPaths.forEach(path => {
        if (path.getAttribute('class')) {
            const className = path.getAttribute('class');
            // Store only the first path for each country class (as a representative)
            if (!countryPathsMap[className]) {
                countryPathsMap[className] = path;
            }
        }
    });
    
    // Process each country in our BTC holdings data
    Object.keys(btcHoldings).forEach(countryCode => {
        // Get potential SVG IDs for this country
        const svgIds = countryCodeMapping[countryCode] || [countryCode];
        
        let foundPath = null;
        
        // Try each potential ID
        for (const svgId of svgIds) {
            // Try by ID
            let path = countryPathsMap[svgId.toUpperCase()];
            
            // If not found by ID, try by class
            if (!path) {
                const classPaths = svg.querySelectorAll(`path[class="${svgId}"]`);
                if (classPaths.length > 0) {
                    path = classPaths[0];
                }
            }
            
            if (path) {
                foundPath = path;
                break;
            }
        }
        
        if (foundPath) {
            console.log(`Found path for ${countryCode}`);
            const btcAmount = btcHoldings[countryCode];
            
            // For countries with multiple paths, color all of them
            const className = foundPath.getAttribute('class');
            const allCountryPaths = className 
                ? svg.querySelectorAll(`.${className}`) 
                : [foundPath];
            
            allCountryPaths.forEach(countryPath => {
                colorCountryPath(countryPath, btcAmount);
            });
        } else {
            console.warn(`No path found for country ${countryCode}`);
        }
    });
    
    // Populate the Bitcoin holdings table
    populateBitcoinHoldingsTable();
    
    // Add zoom and pan functionality to the map
    addMapInteractivity(svg);
    
    // Set default fill for countries without BTC data
    countryPaths.forEach(path => {
        if (!path.getAttribute('data-category')) {
            path.setAttribute('fill', newColors.noBtc);
            path.setAttribute('data-category', 'none');
        }
    });
    
    // Hide loading indicator
    const mapLoading = document.getElementById('map-loading');
    if (mapLoading) mapLoading.style.display = 'none';
    
    // For responsive behavior
    window.addEventListener('resize', adjustMapSize);
    
    adjustMapSize();
}

// Add zoom and pan functionality to the map
function addMapInteractivity(svg) {
    let isDragging = false;
    let startX, startY;
    let viewBox = { x: 0, y: 0, width: 2000, height: 857 };
    
    // Set initial viewBox
    updateViewBox();
    
    // Mouse wheel zoom
    svg.addEventListener('wheel', function(e) {
        e.preventDefault();
        
        const mouseX = e.clientX;
        const mouseY = e.clientY;
        const rect = svg.getBoundingClientRect();
        const svgX = mouseX - rect.left;
        const svgY = mouseY - rect.top;
        
        // Convert mouse position to SVG coordinates
        const svgPoint = svgX / rect.width * viewBox.width + viewBox.x;
        const svgPointY = svgY / rect.height * viewBox.height + viewBox.y;
        
        // Zoom factor
        const zoomFactor = e.deltaY > 0 ? 1.1 : 0.9;
        
        // Calculate new viewBox dimensions
        const newWidth = viewBox.width * zoomFactor;
        const newHeight = viewBox.height * zoomFactor;
        
        // Calculate new viewBox position to zoom toward mouse position
        viewBox.x = svgPoint - (svgPoint - viewBox.x) * zoomFactor;
        viewBox.y = svgPointY - (svgPointY - viewBox.y) * zoomFactor;
        viewBox.width = newWidth;
        viewBox.height = newHeight;
        
        // Update viewBox
        updateViewBox();
    });
    
    // Mouse drag pan
    svg.addEventListener('mousedown', function(e) {
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
        svg.style.cursor = 'grabbing';
    });
    
    window.addEventListener('mousemove', function(e) {
        if (!isDragging) return;
        
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        
        const rect = svg.getBoundingClientRect();
        const scaleX = viewBox.width / rect.width;
        const scaleY = viewBox.height / rect.height;
        
        viewBox.x -= dx * scaleX;
        viewBox.y -= dy * scaleY;
        
        updateViewBox();
        
        startX = e.clientX;
        startY = e.clientY;
    });
    
    window.addEventListener('mouseup', function() {
        isDragging = false;
        svg.style.cursor = 'grab';
    });
    
    // Double click to reset view
    svg.addEventListener('dblclick', function() {
        viewBox = { x: 0, y: 0, width: 2000, height: 857 };
        updateViewBox();
    });
    
    // Set cursor style
    svg.style.cursor = 'grab';
    
    // Add zoom controls
    addZoomControls(svg);
    
    function updateViewBox() {
        svg.setAttribute('viewBox', `${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`);
    }
}

function addZoomControls(svg) {
    const mapContainer = document.getElementById('map-container');
    
    // Create zoom controls container
    const zoomControls = document.createElement('div');
    zoomControls.className = 'zoom-controls';
    zoomControls.style.position = 'absolute';
    zoomControls.style.bottom = '20px';
    zoomControls.style.right = '20px';
    zoomControls.style.display = 'flex';
    zoomControls.style.flexDirection = 'column';
    zoomControls.style.gap = '10px';
    zoomControls.style.zIndex = '100';
    
    // Zoom in button
    const zoomInBtn = document.createElement('button');
    zoomInBtn.innerHTML = '+';
    zoomInBtn.style.width = '40px';
    zoomInBtn.style.height = '40px';
    zoomInBtn.style.fontSize = '20px';
    zoomInBtn.style.borderRadius = '50%';
    zoomInBtn.style.display = 'flex';
    zoomInBtn.style.alignItems = 'center';
    zoomInBtn.style.justifyContent = 'center';
    
    // Zoom out button
    const zoomOutBtn = document.createElement('button');
    zoomOutBtn.innerHTML = '−';
    zoomOutBtn.style.width = '40px';
    zoomOutBtn.style.height = '40px';
    zoomOutBtn.style.fontSize = '20px';
    zoomOutBtn.style.borderRadius = '50%';
    zoomOutBtn.style.display = 'flex';
    zoomOutBtn.style.alignItems = 'center';
    zoomOutBtn.style.justifyContent = 'center';
    
    // Reset button
    const resetBtn = document.createElement('button');
    resetBtn.innerHTML = '↺';
    resetBtn.style.width = '40px';
    resetBtn.style.height = '40px';
    resetBtn.style.fontSize = '20px';
    resetBtn.style.borderRadius = '50%';
    resetBtn.style.display = 'flex';
    resetBtn.style.alignItems = 'center';
    resetBtn.style.justifyContent = 'center';
    
    // Add event listeners
    zoomInBtn.addEventListener('click', function() {
        const viewBox = svg.viewBox.baseVal;
        const newWidth = viewBox.width * 0.8;
        const newHeight = viewBox.height * 0.8;
        const newX = viewBox.x + (viewBox.width - newWidth) / 2;
        const newY = viewBox.y + (viewBox.height - newHeight) / 2;
        svg.setAttribute('viewBox', `${newX} ${newY} ${newWidth} ${newHeight}`);
    });
    
    zoomOutBtn.addEventListener('click', function() {
        const viewBox = svg.viewBox.baseVal;
        const newWidth = viewBox.width * 1.2;
        const newHeight = viewBox.height * 1.2;
        const newX = viewBox.x - (newWidth - viewBox.width) / 2;
        const newY = viewBox.y - (newHeight - viewBox.height) / 2;
        svg.setAttribute('viewBox', `${newX} ${newY} ${newWidth} ${newHeight}`);
    });
    
    resetBtn.addEventListener('click', function() {
        svg.setAttribute('viewBox', '0 0 2000 857');
    });
    
    // Add buttons to controls
    zoomControls.appendChild(zoomInBtn);
    zoomControls.appendChild(zoomOutBtn);
    zoomControls.appendChild(resetBtn);
    
    // Add controls to map container
    mapContainer.style.position = 'relative';
    mapContainer.appendChild(zoomControls);
}

// Helper function to color a country path based on BTC amount
function colorCountryPath(path, btcAmount) {
    if (btcAmount > 100000) {
        path.setAttribute('fill', newColors.highBtc);
        path.setAttribute('data-category', 'high');
    } else if (btcAmount >= 10000) {
        path.setAttribute('fill', newColors.mediumBtc);
        path.setAttribute('data-category', 'medium');
    } else {
        path.setAttribute('fill', newColors.lowBtc);
        path.setAttribute('data-category', 'low');
    }
    
    // Store BTC holdings as a data attribute
    path.setAttribute('data-btc', btcAmount);
    
    // Add hover effects
    path.addEventListener('mouseenter', showTooltip);
    path.addEventListener('mouseleave', hideTooltip);
    path.addEventListener('click', showCountryInfo);
    
    // For touch devices
    path.addEventListener('touchstart', function(e) {
        e.preventDefault();
        showTooltip.call(this, e);
    });
    
    // Add hover animation
    path.style.transition = 'fill 0.3s ease, transform 0.3s ease';
    path.addEventListener('mouseenter', function() {
        const currentFill = this.getAttribute('fill');
        const category = this.getAttribute('data-category');
        
        if (category === 'high') {
            this.setAttribute('fill', '#ff8f00');
        } else if (category === 'medium') {
            this.setAttribute('fill', '#f7931aaa');
        } else if (category === 'low') {
            this.setAttribute('fill', '#f7931a66');
        }
    });
    
    path.addEventListener('mouseleave', function() {
        const category = this.getAttribute('data-category');
        
        if (category === 'high') {
            this.setAttribute('fill', newColors.highBtc);
        } else if (category === 'medium') {
            this.setAttribute('fill', newColors.mediumBtc);
        } else if (category === 'low') {
            this.setAttribute('fill', newColors.lowBtc);
        }
    });
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
    // Get country code from either id or class
    let countryCode = this.id ? this.id.toUpperCase() : '';
    if (!countryCode && this.getAttribute('class')) {
        countryCode = this.getAttribute('class');
    }
    
    const tooltip = document.getElementById('tooltip');
    
    // Get country name from the map
    let countryName = getCountryNameFromPath(this);
    
    // Find BTC holdings for this country
    let btcAmount = null;
    
    // Check if we have direct match in btcHoldings
    if (btcHoldings[countryCode]) {
        btcAmount = btcHoldings[countryCode];
    } else {
        // Try to find by reverse mapping
        for (const [code, mappedCode] of Object.entries(countryCodeMapping)) {
            if (mappedCode === countryCode && btcHoldings[code]) {
                btcAmount = btcHoldings[code];
                break;
            }
        }
    }
    
    if (btcAmount !== null) {
        tooltip.innerHTML = `<strong>${countryName}</strong><br>${btcAmount.toLocaleString()} BTC`;
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
    // Get country code from either id or class
    let countryCode = this.id ? this.id.toUpperCase() : '';
    if (!countryCode && this.getAttribute('class')) {
        countryCode = this.getAttribute('class');
    }
    
    const countryInfoPanel = document.getElementById('country-info');
    const countryNameElement = document.getElementById('country-name');
    const btcAmountElement = document.getElementById('btc-amount');
    const btcValueElement = document.getElementById('btc-value');
    const countryRankElement = document.getElementById('country-rank');
    
    // Get country name
    let countryName = getCountryNameFromPath(this);
    
    // Find BTC holdings for this country
    let btcAmount = null;
    
    // Check if we have direct match in btcHoldings
    if (btcHoldings[countryCode]) {
        btcAmount = btcHoldings[countryCode];
    } else {
        // Try to find by reverse mapping
        for (const [code, mappedCode] of Object.entries(countryCodeMapping)) {
            if (mappedCode === countryCode && btcHoldings[code]) {
                btcAmount = btcHoldings[code];
                countryCode = code; // Set the correct country code for ranking
                break;
            }
        }
    }
    
    if (btcAmount !== null) {
        countryNameElement.textContent = countryName;
        btcAmountElement.textContent = `${btcAmount.toLocaleString()} BTC`;
        
        // Calculate BTC value if price is available
        if (window.currentBtcPrice) {
            const value = btcAmount * window.currentBtcPrice;
            btcValueElement.textContent = `≈ $${value.toLocaleString()} USD`;
        } else {
        btcValueElement.textContent = 'Value not available';
        }
        
        // Calculate country rank
        if (countryRankElement) {
            const rank = getCountryRank(countryCode);
            countryRankElement.textContent = `Rank: #${rank} globally`;
        }
        
        // Show the panel
        countryInfoPanel.classList.add('active');
        
        // For mobile: show overlay
        if (window.innerWidth < 768) {
            document.getElementById('mobile-overlay').classList.remove('hidden');
        }
    }
}

function getCountryNameFromPath(pathElement) {
    if (!pathElement) return 'Unknown';
    
    // First try to get name from the name attribute
    if (pathElement.getAttribute('name')) {
        return pathElement.getAttribute('name');
    }
    
    // Then try to get from id
    if (pathElement.id) {
    const countryCode = pathElement.id.toUpperCase();
    return countryNames[countryCode] || countryCode;
    }
    
    // Then try to get from class
    if (pathElement.getAttribute('class')) {
        const className = pathElement.getAttribute('class');
        
        // Try to find in countryNames by reverse mapping
        for (const [code, mappedCode] of Object.entries(countryCodeMapping)) {
            if (mappedCode === className && countryNames[code]) {
                return countryNames[code];
            }
        }
        
        // If not found, return the class name
        return className;
    }
    
    return 'Unknown';
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

// Get country rank based on BTC holdings
function getCountryRank(countryCode) {
    // Create array of countries sorted by BTC holdings
    const sortedCountries = Object.entries(btcHoldings)
        .sort((a, b) => b[1] - a[1]);
    
    // Find the index of the country
    const index = sortedCountries.findIndex(([code]) => code === countryCode);
    
    // Return rank (1-based)
    return index !== -1 ? index + 1 : 'N/A';
}

// Function to populate the Bitcoin holdings table
function populateBitcoinHoldingsTable() {
    const tableBody = document.getElementById('bitcoin-holdings-body');
    
    // Sort countries by BTC holdings in descending order
    const sortedCountries = Object.entries(btcHoldings)
        .sort((a, b) => b[1] - a[1]);
    
    // Clear existing rows
    tableBody.innerHTML = '';
    
    // Create rows for each country
    sortedCountries.forEach(([countryCode, btcAmount]) => {
        const row = document.createElement('tr');
        
        // Determine category
        let category = 'No Holdings';
        if (btcAmount > 100000) {
            category = 'High Holdings';
        } else if (btcAmount >= 10000) {
            category = 'Medium Holdings';
        } else if (btcAmount > 0) {
            category = 'Low Holdings';
        }
        
        // Determine country name
        const countryName = countryNames[countryCode] || countryCode;
        
        row.innerHTML = `
            <td>${countryName}</td>
            <td>${btcAmount.toLocaleString()} BTC</td>
            <td>${category}</td>
        `;
        
        // Add color coding to the row based on category
        switch(category) {
            case 'High Holdings':
                row.style.backgroundColor = 'rgba(247, 147, 26, 0.1)';
                break;
            case 'Medium Holdings':
                row.style.backgroundColor = 'rgba(247, 147, 26, 0.05)';
                break;
            case 'Low Holdings':
                row.style.backgroundColor = 'rgba(247, 147, 26, 0.02)';
                break;
        }
        
        tableBody.appendChild(row);
    });
}
