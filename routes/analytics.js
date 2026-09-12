const express = require('express');
const router = express.Router();

// Mock analytics data
const getAnalyticsData = () => {
  return {
    activeDisasters: 4,
    totalSurvivors: 1284,
    survivorsAlive: 913,
    criticalCondition: 127,
    rescuedCount: 456,
    deceasedCount: 12,
    missingCount: 25
  };
};

/**
 * GET /api/analytics/dashboard
 * Get dashboard statistics
 */
router.get('/dashboard', (req, res) => {
  try {
    const stats = getAnalyticsData();
    res.json({
      success: true,
      timestamp: new Date(),
      data: stats
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/analytics/survival-rate
 * Get survival statistics
 */
router.get('/survival-rate', (req, res) => {
  try {
    const stats = getAnalyticsData();
    const survivalRate = (stats.survivorsAlive / stats.totalSurvivors * 100).toFixed(2);
    
    res.json({
      success: true,
      data: {
        totalReported: stats.totalSurvivors,
        alive: stats.survivorsAlive,
        rescued: stats.rescuedCount,
        deceased: stats.deceasedCount,
        missing: stats.missingCount,
        survivalRatePercent: survivalRate
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/analytics/response-time
 * Get average response times
 */
router.get('/response-time', (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        averageResponseTime: '12 minutes',
        fastestResponse: '2 minutes',
        slowestResponse: '45 minutes',
        mediaResponse: '11 minutes',
        improvementPercent: 23
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/analytics/critical-areas
 * Get high-risk areas
 */
router.get('/critical-areas', (req, res) => {
  try {
    res.json({
      success: true,
      data: [
        {
          area: 'Sector 14, Kolkata',
          survivors: 127,
          critical: 34,
          responseTeams: 5
        },
        {
          area: 'Howrah Riverside',
          survivors: 89,
          critical: 12,
          responseTeams: 3
        },
        {
          area: 'Durgapur',
          survivors: 156,
          critical: 48,
          responseTeams: 4
        },
        {
          area: 'Bardhaman',
          survivors: 73,
          critical: 5,
          responseTeams: 2
        }
      ]
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
