/* =========================================
   RAKSHAK FRONTEND - API INTEGRATION
   ========================================= */

// Backend API configuration
const API_BASE = 'http://localhost:5000/api';

// ============= UTILITY FUNCTIONS =============

async function apiCall(endpoint, method = 'GET', data = null) {
    try {
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json'
            }
        };

        if (data && (method === 'POST' || method === 'PUT')) {
            options.body = JSON.stringify(data);
        }

        const response = await fetch(`${API_BASE}${endpoint}`, options);
        const result = await response.json();

        if (!response.ok) {
            console.error('API Error:', result);
            return null;
        }

        return result;
    } catch (error) {
        console.error('Network Error:', error);
        showNotification('Connection error. Using demo mode.', 'warning');
        return null;
    }
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        font-weight: 600;
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;

    if (type === 'success') {
        notification.style.background = '#dcfce7';
        notification.style.color = '#166534';
    } else if (type === 'error') {
        notification.style.background = '#fee2e2';
        notification.style.color = '#991b1b';
    } else if (type === 'warning') {
        notification.style.background = '#fef3c7';
        notification.style.color = '#92400e';
    }

    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ============= NAVIGATION =============

function openCitizen() {
    document.getElementById("citizen").scrollIntoView({
        behavior: "smooth"
    });
}

function openGovernment() {
    document.getElementById("command").scrollIntoView({
        behavior: "smooth"
    });
}

// ============= I AM ALIVE - WITH API =============

function confirmAlive() {
    const message = document.getElementById("aliveMessage");
    const button = document.querySelector(".alive-button");

    getLocation().then(({ latitude, longitude }) => {
        const payload = {
            survivorId: generateSurvivorID(),
            latitude: latitude || 22.5726,
            longitude: longitude || 88.3639
        };

        apiCall('/survivors/alive', 'POST', payload).then(response => {
            if (response && response.success) {
                message.classList.remove("hidden");
                button.innerHTML = "✓ ALIVE STATUS CONFIRMED";
                button.style.background = "#15803d";
                button.disabled = true;

                showNotification('✓ Your alive status has been confirmed', 'success');
                console.log("SURVIVOR ALIVE REPORTED:", response.survivor);
            }
        });
    });
}

// ============= SOS - WITH API =============

function sendSOS() {
    const message = document.getElementById("sosMessage");
    const button = document.querySelector(".sos-button");

    getLocation().then(({ latitude, longitude }) => {
        const payload = {
            survivorId: generateSurvivorID(),
            latitude: latitude || 22.5726,
            longitude: longitude || 88.3639,
            condition: 'Emergency assistance needed'
        };

        apiCall('/survivors/sos', 'POST', payload).then(response => {
            if (response && response.success) {
                message.classList.remove("hidden");
                button.innerHTML = "✓ SOS SENT";
                button.style.background = "#991b1b";
                button.disabled = true;

                showNotification('🚨 Emergency signal received. Rescue teams dispatched!', 'success');
                console.log("EMERGENCY SOS SENT:", response.survivor);
            }
        });
    });
}

// ============= GET GPS LOCATION - ENHANCED =============

function getLocation() {
    return new Promise((resolve) => {
        const result = document.getElementById("locationResult");
        const coordinates = document.getElementById("coordinates");

        if (!navigator.geolocation) {
            coordinates.innerHTML = "Geolocation is not supported by this browser.";
            result.classList.remove("hidden");
            resolve({ latitude: null, longitude: null });
            return;
        }

        coordinates.innerHTML = "🛰️ Requesting GPS location...";
        result.classList.remove("hidden");

        navigator.geolocation.getCurrentPosition(
            function(position) {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;
                const accuracy = Math.round(position.coords.accuracy);

                coordinates.innerHTML = `
                    <strong>📍 Location Captured</strong>
                    <br>
                    Latitude: ${latitude.toFixed(6)}
                    <br>
                    Longitude: ${longitude.toFixed(6)}
                    <br>
                    Accuracy: ±${accuracy}m
                `;

                console.log("LOCATION CAPTURED:", { latitude, longitude, accuracy });
                resolve({ latitude, longitude });
            },
            function(error) {
                let errorMessage;

                switch(error.code) {
                    case error.PERMISSION_DENIED:
                        errorMessage = "❌ Location permission denied. Using default location.";
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMessage = "❌ Location information unavailable.";
                        break;
                    case error.TIMEOUT:
                        errorMessage = "❌ Location request timed out.";
                        break;
                    default:
                        errorMessage = "❌ Unable to retrieve location.";
                }

                coordinates.innerHTML = errorMessage;
                console.warn("LOCATION ERROR:", errorMessage);
                resolve({ latitude: null, longitude: null });
            }
        );
    });
}

// ============= GENERATE SURVIVOR ID =============

function generateSurvivorID() {
    const timestamp = Date.now().toString().slice(-6);
    return `IND-${timestamp}`;
}

// ============= RESCUE TEAM DISPATCH - WITH API =============

async function dispatchTeam(survivorID) {
    const confirmed = confirm(`Dispatch rescue team to ${survivorID}?`);

    if (confirmed) {
        const payload = {
            survivorId: survivorID,
            teamId: 'RT-17'
        };

        const response = await apiCall('/dispatch-team', 'POST', payload);

        if (response && response.success) {
            alert(
                `🚁 RESCUE TEAM DISPATCHED\n\n` +
                `Survivor: ${survivorID}\n` +
                `Team: ${response.dispatch.team}\n` +
                `Status: ${response.dispatch.status}`
            );

            showNotification('🚁 Rescue team dispatched successfully', 'success');
            console.log("RESCUE TEAM DISPATCHED:", response.dispatch);
        } else {
            alert('Failed to dispatch rescue team');
        }
    }
}

// ============= LOAD LIVE DATA - COMMAND CENTER =============

async function loadDashboardData() {
    const statsResponse = await apiCall('/stats', 'GET');
    const survivorsResponse = await apiCall('/survivors', 'GET');
    const alertsResponse = await apiCall('/alerts', 'GET');

    if (statsResponse && statsResponse.success) {
        updateStats(statsResponse.stats);
    }

    if (survivorsResponse && survivorsResponse.success) {
        updateMap(survivorsResponse.data);
        updatePriorityQueue(survivorsResponse.data);
    }

    if (alertsResponse && alertsResponse.success) {
        updateAlerts(alertsResponse.data);
    }
}

function updateStats(stats) {
    const statCards = document.querySelectorAll('.stat-number');

    if (statCards.length >= 4) {
        statCards[0].textContent = stats.activeMissions || '04';
        statCards[1].textContent = stats.totalSurvivors || '1,284';
        statCards[2].textContent = stats.aliveConfirmed || '913';
        statCards[3].textContent = stats.criticalCases || '127';
    }
}

function updateMap(survivors) {
    const map = document.querySelector('.map');
    if (!map) return;

    console.log('Map data updated with', survivors.length, 'survivors');
}

function updatePriorityQueue(survivors) {
    const survivorGrid = document.querySelector('.survivor-grid');
    if (!survivorGrid || survivors.length === 0) return;

    const cards = survivorGrid.querySelectorAll('.survivor-card');

    survivors.slice(0, 4).forEach((survivor, index) => {
        if (cards[index]) {
            const card = cards[index];
            card.querySelector('h3').textContent = survivor.id;
            card.querySelector('.priority-score strong').textContent = survivor.priority;
            
            const details = card.querySelectorAll('.survivor-details p');
            if (details.length >= 4) {
                details[0].innerHTML = `📍 ${survivor.city}`;
                details[1].innerHTML = `❤️ ${survivor.condition}`;
                details[2].innerHTML = `🔋 Battery ${survivor.battery}%`;
            }
        }
    });
}

function updateAlerts(alerts) {
    const alertsContainer = document.querySelector('.alerts-card');
    if (!alertsContainer) return;

    console.log('Alerts updated:', alerts.length, 'new alerts');
}

// ============= SYSTEM HEALTH CHECK =============

async function checkSystemHealth() {
    const response = await apiCall('/health', 'GET');

    if (response && response.success) {
        console.log('✓ System Status:', response.status);
        console.log('✓ Server Uptime:', Math.floor(response.uptime), 'seconds');
        return true;
    } else {
        console.warn('⚠ Backend unavailable - using demo mode');
        return false;
    }
}

// ============= INITIALIZATION =============

document.addEventListener('DOMContentLoaded', function() {
    console.log('🛡️ RAKSHAK Frontend Loaded');
    console.log('📡 Backend API: ' + API_BASE);

    checkSystemHealth().then(isHealthy => {
        if (isHealthy) {
            console.log('✓ Backend connected successfully');
        } else {
            console.log('⚠ Backend offline - Demo mode active');
        }
    });

    loadDashboardData();
    setInterval(loadDashboardData, 10000);
    updateClock();
    setInterval(updateClock, 1000);
});

// ============= DEMO LIVE CLOCK =============

function updateClock() {
    const now = new Date();
    console.log("System time:", now.toLocaleTimeString());
}
