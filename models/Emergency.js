class Emergency {
  constructor(data) {
    this.id = `DSTR-${Date.now()}`;
    this.type = data.type || 'UNKNOWN'; // EARTHQUAKE, FLOOD, FIRE, CYCLONE, LANDSLIDE, etc.
    this.severity = data.severity || 'MODERATE'; // LOW, MODERATE, HIGH, CRITICAL
    this.location = {
      latitude: data.latitude,
      longitude: data.longitude,
      radius: data.radius || 5, // km
      affectedArea: data.affectedArea || '',
      address: data.address || ''
    };
    this.status = 'ONGOING'; // ONGOING, CONTROLLED, RESOLVED
    this.startTime = new Date();
    this.estimatedEndTime = data.estimatedEndTime || null;
    this.affectedSurvivors = [];
    this.assignedTeams = [];
    this.alerts = [];
    this.casualties = {
      confirmed: 0,
      estimated: data.estimatedCasualties || 0,
      rescued: 0
    };
    this.damageAssessment = data.damageAssessment || '';
    this.notes = [];
  }

  addAffectedSurvivor(survivorId) {
    if (!this.affectedSurvivors.includes(survivorId)) {
      this.affectedSurvivors.push(survivorId);
    }
  }

  removeAffectedSurvivor(survivorId) {
    this.affectedSurvivors = this.affectedSurvivors.filter(id => id !== survivorId);
  }

  assignTeam(teamId) {
    if (!this.assignedTeams.includes(teamId)) {
      this.assignedTeams.push(teamId);
    }
  }

  updateCasualties(confirmed, rescued) {
    this.casualties.confirmed = confirmed;
    this.casualties.rescued = rescued;
  }

  updateStatus(newStatus, reason = '') {
    this.status = newStatus;
    this.addNote(`Status updated to ${newStatus}. Reason: ${reason}`);
  }

  addNote(note) {
    this.notes.push({
      timestamp: new Date(),
      message: note
    });
  }

  addAlert(type, message) {
    this.alerts.push({
      id: this.alerts.length + 1,
      type,
      message,
      timestamp: new Date()
    });
  }

  getStats() {
    return {
      emergencyId: this.id,
      type: this.type,
      severity: this.severity,
      status: this.status,
      duration: this.getDurationMinutes(),
      affectedSurvivorCount: this.affectedSurvivors.length,
      assignedTeamsCount: this.assignedTeams.length,
      casualties: this.casualties
    };
  }

  getDurationMinutes() {
    return Math.floor((Date.now() - this.startTime) / 60000);
  }

  toJSON() {
    return {
      id: this.id,
      type: this.type,
      severity: this.severity,
      location: this.location,
      status: this.status,
      startTime: this.startTime,
      estimatedEndTime: this.estimatedEndTime,
      durationMinutes: this.getDurationMinutes(),
      affectedSurvivors: this.affectedSurvivors,
      assignedTeams: this.assignedTeams,
      alerts: this.alerts,
      casualties: this.casualties,
      damageAssessment: this.damageAssessment,
      notes: this.notes
    };
  }
}

module.exports = Emergency;
