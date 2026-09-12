const express = require('express');
const router = express.Router();

// In-memory alert storage
const alerts = [];

/**
 * POST /api/alerts/sos
 * Send SOS emergency alert
 */
router.post('/sos', (req, res) => {
  try {
    const { survivorId, latitude, longitude, medicalCondition } = req.body;

    const sosAlert = {
      id: `SOS-${Date.now()}`,
      type: 'SOS',
      survivorId,
      location: { latitude, longitude },
      medicalCondition,
      status: 'ACTIVE',
      priority: 'CRITICAL',
      createdAt: new Date(),
      acknowledged: false
    };

    alerts.push(sosAlert);

    const io = req.app.get('io');
    io.emit('sos-alert', sosAlert);

    res.status(201).json({
      success: true,
      message: 'SOS alert sent',
      data: sosAlert
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/alerts
 * Get all active alerts
 */
router.get('/', (req, res) => {
  try {
    const activeAlerts = alerts.filter(a => a.status === 'ACTIVE');
    res.json({
      success: true,
      count: activeAlerts.length,
      data: activeAlerts
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/alerts/:id/acknowledge
 * Acknowledge an alert
 */
router.post('/:id/acknowledge', (req, res) => {
  try {
    const alert = alerts.find(a => a.id === req.params.id);
    if (!alert) {
      return res.status(404).json({
        success: false,
        error: 'Alert not found'
      });
    }

    alert.acknowledged = true;
    alert.acknowledgedAt = new Date();
    alert.acknowledgedBy = req.body.userId || 'System';

    const io = req.app.get('io');
    io.emit('alert-acknowledged', alert);

    res.json({
      success: true,
      message: 'Alert acknowledged',
      data: alert
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/alerts/:id/resolve
 * Resolve an alert
 */
router.post('/:id/resolve', (req, res) => {
  try {
    const alert = alerts.find(a => a.id === req.params.id);
    if (!alert) {
      return res.status(404).json({
        success: false,
        error: 'Alert not found'
      });
    }

    alert.status = 'RESOLVED';
    alert.resolvedAt = new Date();
    alert.resolution = req.body.resolution || 'No details provided';

    const io = req.app.get('io');
    io.emit('alert-resolved', alert);

    res.json({
      success: true,
      message: 'Alert resolved',
      data: alert
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
