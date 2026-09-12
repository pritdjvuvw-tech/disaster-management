/* =========================================
   RAKSHAK BACKEND SERVER
   National Disaster Response System
   ========================================= */

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// ============= MIDDLEWARE =============

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// ============= IN-MEMORY DATABASE =============

let survivors = [];
let emergencyAlerts = [];
let rescueTeams = [];

// Initialize with demo data
function initializeDemoData() {
    survivors = [
        {
            id: 'IND-28491',
            location: { lat: 22.5726, lng: 88.3639 },
            status: 'ALIVE',
            condition: 'Severe injury',
            battery: 18,
            priority: 97,
            city: 'KOLKATA',
            timestamp: new Date(Date.now() - 12000)
        },
        {
            id: 'IND-19372',
            location: { lat: 22.5937, lng: 88.2763 },
            status: 'ALIVE',
            condition: 'Trapped',
            battery: 24,
            priority: 91,
            city: 'HOWRAH',
            timestamp: new Date(Date.now() - 38000)
        },
        {
            id: 'IND-82731',
            location: { lat: 23.5090, lng: 87.3156 },
            status: 'ALIVE',
            condition: 'Needs assistance',
            battery: 56,
            priority: 78,
            city: 'DURGAPUR',
            timestamp: new Date(Date.now() - 60000)
        },
        {
            id: 'IND-49102',
            location: { lat: 23.2383, lng: 87.7355 },
            status: 'ALIVE',
            condition: 'Stable',
            battery: 72,
            priority: 54,
            city: 'BARDHAMAN',
            timestamp: new Date(Date.now() - 120000)
        }
    ];

    emergencyAlerts = [
        {
            id: 1,
            type: 'CRITICAL',
            survivor: 'IND-28491',
            message: 'CRITICAL SURVIVOR - reports severe injury',
            timestamp: new Date(Date.now() - 12000)
        },
        {
            id: 2,
            type: 'SUCCESS',
            survivor: 'IND-19372',
            message: 'ALIVE CONFIRMATION - confirmed they are alive',
            timestamp: new Date(Date.now() - 38000)
        },
        {
            id: 3,
            type: 'CRITICAL',
            survivor: 'IND-82731',
            message: 'NEW SOS - Emergency signal received from Durgapur',
            timestamp: new Date(Date.now() - 60000)
        }
    ];

    rescueTeams = [
        { id: 'RT-17', status: 'AVAILABLE', location: 'Kolkata Base' },
        { id: 'RT-18', status: 'DEPLOYED', location: 'Howrah Sector' },
        { id: 'RT-19', status: 'AVAILABLE', location: 'Durgapur Base' }
    ];
}

initializeDemoData();

// ============= SURVIVOR ENDPOINTS =============

// Get all survivors
app.get('/api/survivors', (req, res) => {
    res.json({
        success: true,
        count: survivors.length,
        data: survivors
    });
});

// Report alive status
app.post('/api/survivors/alive', (req, res) => {
    const { survivorId, latitude, longitude } = req.body;

    if (!survivorId || latitude === undefined || longitude === undefined) {
        return res.status(400).json({
            success: false,
            message: 'Missing required fields: survivorId, latitude, longitude'
        });
    }

    let survivor = survivors.find(s => s.id === survivorId);

    if (!survivor) {
        survivor = {
            id: survivorId,
            status: 'ALIVE',
            location: { lat: latitude, lng: longitude },
            condition: 'Stable',
            battery: 50,
            priority: 50,
            timestamp: new Date()
        };
        survivors.push(survivor);
    } else {
        survivor.status = 'ALIVE';
        survivor.location = { lat: latitude, lng: longitude };
        survivor.timestamp = new Date();
    }

    emergencyAlerts.unshift({
        id: emergencyAlerts.length + 1,
        type: 'SUCCESS',
        survivor: survivorId,
        message: `ALIVE CONFIRMATION - ${survivorId} confirmed they are alive`,
        timestamp: new Date()
    });

    res.json({
        success: true,
        message: 'Alive status confirmed',
        survivor: survivor
    });
});

// Send SOS signal
app.post('/api/survivors/sos', (req, res) => {
    const { survivorId, latitude, longitude, condition } = req.body;

    if (!survivorId || latitude === undefined || longitude === undefined) {
        return res.status(400).json({
            success: false,
            message: 'Missing required fields: survivorId, latitude, longitude'
        });
    }

    let survivor = survivors.find(s => s.id === survivorId);

    if (!survivor) {
        survivor = {
            id: survivorId,
            status: 'SOS',
            location: { lat: latitude, lng: longitude },
            condition: condition || 'Emergency',
            battery: 50,
            priority: 95,
            timestamp: new Date()
        };
        survivors.push(survivor);
    } else {
        survivor.status = 'SOS';
        survivor.priority = 95;
        survivor.location = { lat: latitude, lng: longitude };
        survivor.condition = condition || 'Emergency';
        survivor.timestamp = new Date();
    }

    emergencyAlerts.unshift({
        id: emergencyAlerts.length + 1,
        type: 'CRITICAL',
        survivor: survivorId,
        message: `EMERGENCY SOS - Critical signal received from ${survivorId}`,
        timestamp: new Date()
    });

    res.json({
        success: true,
        message: 'SOS signal received and dispatching rescue teams',
        survivor: survivor
    });
});

// Update survivor location
app.post('/api/survivors/location', (req, res) => {
    const { survivorId, latitude, longitude } = req.body;

    if (!survivorId || latitude === undefined || longitude === undefined) {
        return res.status(400).json({
            success: false,
            message: 'Missing required fields: survivorId, latitude, longitude'
        });
    }

    const survivor = survivors.find(s => s.id === survivorId);

    if (!survivor) {
        return res.status(404).json({
            success: false,
            message: 'Survivor not found'
        });
    }

    survivor.location = { lat: latitude, lng: longitude };
    survivor.timestamp = new Date();

    res.json({
        success: true,
        message: 'Location updated',
        survivor: survivor
    });
});

// ============= ALERTS ENDPOINTS =============

// Get all alerts
app.get('/api/alerts', (req, res) => {
    res.json({
        success: true,
        count: emergencyAlerts.length,
        data: emergencyAlerts.slice(0, 10) // Return latest 10
    });
});

// Get statistics
app.get('/api/stats', (req, res) => {
    const aliveCount = survivors.filter(s => s.status === 'ALIVE').length;
    const criticalCount = survivors.filter(s => s.priority >= 90).length;

    res.json({
        success: true,
        stats: {
            totalSurvivors: survivors.length,
            aliveConfirmed: aliveCount,
            criticalCases: criticalCount,
            activeMissions: rescueTeams.filter(t => t.status === 'DEPLOYED').length
        }
    });
});

// ============= RESCUE TEAM ENDPOINTS =============

// Dispatch rescue team
app.post('/api/dispatch-team', (req, res) => {
    const { survivorId, teamId } = req.body;

    if (!survivorId || !teamId) {
        return res.status(400).json({
            success: false,
            message: 'Missing required fields: survivorId, teamId'
        });
    }

    const survivor = survivors.find(s => s.id === survivorId);
    const team = rescueTeams.find(t => t.id === teamId);

    if (!survivor) {
        return res.status(404).json({
            success: false,
            message: 'Survivor not found'
        });
    }

    if (!team) {
        return res.status(404).json({
            success: false,
            message: 'Team not found'
        });
    }

    team.status = 'DEPLOYED';
    team.location = `Heading to ${survivor.city}`;

    res.json({
        success: true,
        message: 'Rescue team dispatched',
        dispatch: {
            survivor: survivorId,
            team: teamId,
            status: 'EN ROUTE',
            timestamp: new Date()
        }
    });
});

// Get rescue teams
app.get('/api/teams', (req, res) => {
    res.json({
        success: true,
        count: rescueTeams.length,
        data: rescueTeams
    });
});

// ============= PRIORITY CALCULATION =============

app.get('/api/priority-queue', (req, res) => {
    const sorted = [...survivors].sort((a, b) => b.priority - a.priority);

    res.json({
        success: true,
        queue: sorted
    });
});

// ============= HEALTH CHECK =============

app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        status: 'SYSTEM OPERATIONAL',
        timestamp: new Date(),
        uptime: process.uptime()
    });
});

// ============= ERROR HANDLING =============

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: err.message
    });
});

// ============= START SERVER =============

app.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════╗
║  RAKSHAK BACKEND SERVER                ║
║  National Disaster Response System     ║
║                                        ║
║  Server running on port ${PORT}           ║
║  🛡️  SYSTEM ONLINE                      ║
╚════════════════════════════════════════╝
    `);
});

module.exports = app;
