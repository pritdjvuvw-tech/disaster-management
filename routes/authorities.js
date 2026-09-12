const express = require('express');
const router = express.Router();
const RescueTeam = require('../models/RescueTeam');
const Survivor = require('../models/Survivor');

// In-memory storage
const rescueTeams = new Map();

// Initialize some demo teams
const initializeDemoTeams = () => {
  const demoTeams = [
    { id: 'RT-17', name: 'Alpha Rescue Unit', latitude: 22.5726, longitude: 88.3639, personnel: 5, equipment: ['Stretcher', 'Medical Kit', 'Rope'], capacity: 8 },
    { id: 'RT-18', name: 'Bravo Response Team', latitude: 22.5859, longitude: 88.3850, personnel: 6, equipment: ['Ladder', 'Saw', 'First Aid'], capacity: 10 },
    { id: 'RT-19', name: 'Charlie Emergency Unit', latitude: 22.4698, longitude: 88.4676, personnel: 4, equipment: ['Generator', 'Water Pump', 'Light'], capacity: 6 }
  ];

  demoTeams.forEach(team => {
    const rescueTeam = new RescueTeam(team);
    rescueTeams.set(team.id, rescueTeam);
  });
};

initializeDemoTeams();

/**
 * GET /api/authorities/teams
 * Get all rescue teams
 */
router.get('/teams', (req, res) => {
  try {
    const allTeams = Array.from(rescueTeams.values())
      .map(t => t.toJSON());

    res.json({
      success: true,
      count: allTeams.length,
      data: allTeams
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/authorities/teams/available
 * Get available rescue teams
 */
router.get('/teams/available', (req, res) => {
  try {
    const availableTeams = Array.from(rescueTeams.values())
      .filter(t => t.status === 'AVAILABLE' && t.getAvailableCapacity() > 0)
      .map(t => t.toJSON());

    res.json({
      success: true,
      count: availableTeams.length,
      data: availableTeams
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/authorities/teams
 * Register a new rescue team
 */
router.post('/teams', (req, res) => {
  try {
    const { name, latitude, longitude, personnel, equipment, capacity } = req.body;
    
    const team = new RescueTeam({
      name,
      latitude,
      longitude,
      personnel,
      equipment,
      capacity
    });

    rescueTeams.set(team.id, team);

    const io = req.app.get('io');
    io.emit('team-registered', team.toJSON());

    res.status(201).json({
      success: true,
      message: 'Rescue team registered',
      data: team.toJSON()
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/authorities/teams/:id
 * Get team details
 */
router.get('/teams/:id', (req, res) => {
  try {
    const team = rescueTeams.get(req.params.id);
    if (!team) {
      return res.status(404).json({
        success: false,
        error: 'Team not found'
      });
    }
    res.json({
      success: true,
      data: team.toJSON()
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/authorities/teams/:id/location
 * Update team location
 */
router.post('/teams/:id/location', (req, res) => {
  try {
    const { latitude, longitude } = req.body;
    const team = rescueTeams.get(req.params.id);
    
    if (!team) {
      return res.status(404).json({
        success: false,
        error: 'Team not found'
      });
    }

    team.updateLocation(latitude, longitude);

    const io = req.app.get('io');
    io.emit('team-location-updated', team.toJSON());

    res.json({
      success: true,
      message: 'Team location updated',
      data: team.toJSON()
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/authorities/teams/:id/status
 * Update team status
 */
router.post('/teams/:id/status', (req, res) => {
  try {
    const { status } = req.body;
    const team = rescueTeams.get(req.params.id);
    
    if (!team) {
      return res.status(404).json({
        success: false,
        error: 'Team not found'
      });
    }

    team.updateStatus(status);

    const io = req.app.get('io');
    io.emit('team-status-updated', team.toJSON());

    res.json({
      success: true,
      message: 'Team status updated',
      data: team.toJSON()
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/authorities/dispatch
 * Dispatch rescue team to survivor
 */
router.post('/dispatch', (req, res) => {
  try {
    const { survivorId, teamId } = req.body;
    
    const team = rescueTeams.get(teamId);
    if (!team) {
      return res.status(404).json({
        success: false,
        error: 'Team not found'
      });
    }

    const assigned = team.assignSurvivor(survivorId);
    if (!assigned) {
      return res.status(400).json({
        success: false,
        error: 'Team is at full capacity'
      });
    }

    const io = req.app.get('io');
    io.emit('team-dispatched', {
      teamId,
      survivorId,
      team: team.toJSON(),
      timestamp: new Date()
    });

    res.json({
      success: true,
      message: 'Rescue team dispatched',
      data: team.toJSON()
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/authorities/rescue-complete
 * Mark rescue as complete
 */
router.post('/rescue-complete', (req, res) => {
  try {
    const { survivorId, teamId } = req.body;
    
    const team = rescueTeams.get(teamId);
    if (!team) {
      return res.status(404).json({
        success: false,
        error: 'Team not found'
      });
    }

    team.completeSurvivorRescue(survivorId);

    const io = req.app.get('io');
    io.emit('rescue-completed', {
      teamId,
      survivorId,
      team: team.toJSON(),
      timestamp: new Date()
    });

    res.json({
      success: true,
      message: 'Rescue marked as complete',
      data: team.toJSON()
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
