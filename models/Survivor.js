class Survivor {
  constructor(data) {
    this.id = this.generateId();
    this.name = data.name || 'Anonymous';
    this.phone = data.phone || null;
    this.email = data.email || null;
    this.location = {
      latitude: data.latitude || null,
      longitude: data.longitude || null,
      accuracy: data.accuracy || null,
      address: data.address || null,
      timestamp: new Date()
    };
    this.status = 'ACTIVE'; // ACTIVE, RESCUED, DECEASED, UNKNOWN
    this.medicalCondition = data.medicalCondition || 'UNKNOWN';
    this.severity = this.calculateSeverity(data.medicalCondition);
    this.batteryLevel = data.batteryLevel || 100;
    this.lastUpdate = new Date();
    this.createdAt = new Date();
    this.alerts = [];
    this.rescueTeamAssigned = null;
    this.notes = [];
  }

  generateId() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = 'IND-';
    for (let i = 0; i < 5; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  calculateSeverity(condition) {
    const severityMap = {
      'CRITICAL': 4,
      'SEVERE_INJURY': 4,
      'TRAPPED': 3,
      'INJURED': 2,
      'NEEDS_ASSISTANCE': 2,
      'STABLE': 1,
      'UNKNOWN': 2
    };
    return severityMap[condition] || 2;
  }

  calculatePriority() {
    let priority = 0;
    
    // Severity score (0-40)
    priority += this.severity * 10;
    
    // Battery level (0-20)
    priority += Math.max(0, 20 - (this.batteryLevel / 5));
    
    // Time trapped (0-20)
    const timeTrapped = Math.floor((Date.now() - this.createdAt) / 60000);
    priority += Math.min(20, timeTrapped / 3);
    
    // Status (0-20)
    if (this.status === 'ACTIVE') priority += 20;
    
    return Math.round(priority);
  }

  updateLocation(latitude, longitude, accuracy, address) {
    this.location = {
      latitude,
      longitude,
      accuracy,
      address,
      timestamp: new Date()
    };
    this.lastUpdate = new Date();
  }

  updateStatus(newStatus, reason = '') {
    this.status = newStatus;
    this.notes.push({
      timestamp: new Date(),
      message: `Status changed to ${newStatus}. Reason: ${reason}`
    });
    this.lastUpdate = new Date();
  }

  updateBatteryLevel(level) {
    this.batteryLevel = level;
    if (level < 20) {
      this.addAlert('LOW_BATTERY', `Battery level critically low: ${level}%`);
    }
    this.lastUpdate = new Date();
  }

  updateMedicalCondition(condition) {
    this.medicalCondition = condition;
    this.severity = this.calculateSeverity(condition);
    this.lastUpdate = new Date();
  }

  addAlert(type, message) {
    this.alerts.push({
      id: this.alerts.length + 1,
      type,
      message,
      timestamp: new Date(),
      acknowledged: false
    });
  }

  assignRescueTeam(teamId) {
    this.rescueTeamAssigned = teamId;
    this.addAlert('TEAM_ASSIGNED', `Rescue team ${teamId} has been assigned`);
    this.lastUpdate = new Date();
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      phone: this.phone,
      email: this.email,
      location: this.location,
      status: this.status,
      medicalCondition: this.medicalCondition,
      severity: this.severity,
      priority: this.calculatePriority(),
      batteryLevel: this.batteryLevel,
      lastUpdate: this.lastUpdate,
      createdAt: this.createdAt,
      alerts: this.alerts,
      rescueTeamAssigned: this.rescueTeamAssigned,
      notes: this.notes
    };
  }
}

module.exports = Survivor;
