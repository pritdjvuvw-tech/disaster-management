const express = require('express');
const router = express.Router();
const Emergency = require('../models/Emergency');

// In-memory storage
const emergencies = new Map();

/**
 * POST /api/emergency/report
 * Report a new emergency/disaster
 */
router.post('/report', (req, res) => {
  try {
    const { type, severity, latitude, longitude, radius, affectedArea, address, estimatedCasualties, damageAssessment } = req.body;

    const emergency = new Emergency({
      type,
      severity,
      latitude,
      longitude,
      radius,
      affectedArea,
      address,
      estimatedCasualties,
      damageAssessment
    });

    emergencies.set(emergency.id, emergency);

    const io = req.app.get('io');
    io.emit('emergency-reported', emergency.toJSON());

    res.status(201).json({
      success: true,
      message: 'Emergency reported successfully',
      data: emergency.toJSON()
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/emergency
 * Get all active emergencies
 */
router.get('/', (req, res) => {
  try {
    const activeEmergencies = Array.from(emergencies.values())
      .filter(e => e.status === 'ONGOING')
      .map(e => e.toJSON());

    res.json({
      success: true,
      count: activeEmergencies.length,
      data: activeEmergencies
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/emergency/:id
 * Get emergency details
 */
router.get('/:id', (req, res) => {
  try {
    const emergency = emergencies.get(req.params.id);
    if (!emergency) {
      return res.status(404).json({
        success: false,
        error: 'Emergency not found'
      });
    }
    res.json({
      success: true,
      data: emergency.toJSON()
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/emergency/:id/add-survivor
 * Add affected survivor to emergency
 */
router.post('/:id/add-survivor', (req, res) => {
  try {
    const { survivorId } = req.body;
    const emergency = emergencies.get(req.params.id);
    
    if (!emergency) {
      return res.status(404).json({
        success: false,
        error: 'Emergency not found'
      });
    }

    emergency.addAffectedSurvivor(survivorId);
    emergency.addNote(`Survivor ${survivorId} added to affected list`);

    const io = req.app.get('io');
    io.emit('emergency-survivor-added', emergency.toJSON());

    res.json({
      success: true,
      message: 'Survivor added to emergency',
      data: emergency.toJSON()
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/emergency/:id/update-status
 * Update emergency status
 */
router.post('/:id/update-status', (req, res) => {
  try {
    const { status, reason } = req.body;
    const emergency = emergencies.get(req.params.id);
    
    if (!emergency) {
      return res.status(404).json({
        success: false,
        error: 'Emergency not found'
      });
    }

    emergency.updateStatus(status, reason);

    const io = req.app.get('io');
    io.emit('emergency-status-updated', emergency.toJSON());

    res.json({
      success: true,
      message: 'Emergency status updated',
      data: emergency.toJSON()
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/emergency/:id/update-casualties
 * Update casualty numbers
 */
router.post('/:id/update-casualties', (req, res) => {
  try {
    const { confirmed, rescued } = req.body;
    const emergency = emergencies.get(req.params.id);
    
    if (!emergency) {
      return res.status(404).json({
        success: false,
        error: 'Emergency not found'
      });
    }

    emergency.updateCasualties(confirmed, rescued);

    const io = req.app.get('io');
    io.emit('emergency-casualties-updated', emergency.toJSON());

    res.json({
      success: true,
      message: 'Casualty numbers updated',
      data: emergency.toJSON()
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
