const express = require('express');
const router = express.Router();
const Survivor = require('../models/Survivor');

// In-memory storage (replace with database in production)
const survivors = new Map();

/**
 * POST /api/survivors/register
 * Register a new survivor
 */
router.post('/register', (req, res) => {
  try {
    const { name, phone, email, latitude, longitude, accuracy, medicalCondition } = req.body;

    const survivor = new Survivor({
      name,
      phone,
      email,
      latitude,
      longitude,
      accuracy,
      medicalCondition: medicalCondition || 'UNKNOWN'
    });

    survivors.set(survivor.id, survivor);

    // Emit real-time update
    const io = req.app.get('io');
    io.emit('survivor-registered', survivor.toJSON());

    res.status(201).json({
      success: true,
      message: 'Survivor registered successfully',
      data: survivor.toJSON()
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/survivors/:id
 * Get survivor details
 */
router.get('/:id', (req, res) => {
  try {
    const survivor = survivors.get(req.params.id);
    if (!survivor) {
      return res.status(404).json({
        success: false,
        error: 'Survivor not found'
      });
    }
    res.json({
      success: true,
      data: survivor.toJSON()
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/survivors
 * List all active survivors
 */
router.get('/', (req, res) => {
  try {
    const allSurvivors = Array.from(survivors.values())
      .filter(s => s.status === 'ACTIVE')
      .map(s => s.toJSON())
      .sort((a, b) => b.priority - a.priority);

    res.json({
      success: true,
      count: allSurvivors.length,
      data: allSurvivors
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/survivors/:id/alive
 * Confirm survivor is alive
 */
router.post('/:id/alive', (req, res) => {
  try {
    const survivor = survivors.get(req.params.id);
    if (!survivor) {
      return res.status(404).json({
        success: false,
        error: 'Survivor not found'
      });
    }

    survivor.updateStatus('ACTIVE', 'Alive confirmation received');
    survivor.addAlert('ALIVE_CONFIRMATION', 'Survivor confirmed to be alive');

    const io = req.app.get('io');
    io.emit('survivor-alive', survivor.toJSON());

    res.json({
      success: true,
      message: 'Alive status confirmed',
      data: survivor.toJSON()
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/survivors/:id/location
 * Update survivor location
 */
router.post('/:id/location', (req, res) => {
  try {
    const { latitude, longitude, accuracy, address } = req.body;
    const survivor = survivors.get(req.params.id);
    
    if (!survivor) {
      return res.status(404).json({
        success: false,
        error: 'Survivor not found'
      });
    }

    survivor.updateLocation(latitude, longitude, accuracy, address);

    const io = req.app.get('io');
    io.emit('survivor-location-update', survivor.toJSON());

    res.json({
      success: true,
      message: 'Location updated',
      data: survivor.toJSON()
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/survivors/:id/medical-condition
 * Update medical condition
 */
router.post('/:id/medical-condition', (req, res) => {
  try {
    const { condition } = req.body;
    const survivor = survivors.get(req.params.id);
    
    if (!survivor) {
      return res.status(404).json({
        success: false,
        error: 'Survivor not found'
      });
    }

    survivor.updateMedicalCondition(condition);

    const io = req.app.get('io');
    io.emit('survivor-condition-update', survivor.toJSON());

    res.json({
      success: true,
      message: 'Medical condition updated',
      data: survivor.toJSON()
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/survivors/:id/battery
 * Update battery level
 */
router.post('/:id/battery', (req, res) => {
  try {
    const { level } = req.body;
    const survivor = survivors.get(req.params.id);
    
    if (!survivor) {
      return res.status(404).json({
        success: false,
        error: 'Survivor not found'
      });
    }

    survivor.updateBatteryLevel(level);

    const io = req.app.get('io');
    io.emit('survivor-battery-update', survivor.toJSON());

    res.json({
      success: true,
      message: 'Battery level updated',
      data: survivor.toJSON()
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/survivors/:id/rescue-team
 * Assign rescue team
 */
router.post('/:id/rescue-team', (req, res) => {
  try {
    const { teamId } = req.body;
    const survivor = survivors.get(req.params.id);
    
    if (!survivor) {
      return res.status(404).json({
        success: false,
        error: 'Survivor not found'
      });
    }

    survivor.assignRescueTeam(teamId);

    const io = req.app.get('io');
    io.emit('survivor-team-assigned', survivor.toJSON());

    res.json({
      success: true,
      message: 'Rescue team assigned',
      data: survivor.toJSON()
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
