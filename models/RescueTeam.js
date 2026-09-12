class RescueTeam {
  constructor(data) {
    this.id = data.id || `RT-${Math.floor(Math.random() * 1000)}`;
    this.name = data.name || `Rescue Team ${this.id}`;
    this.location = {
      latitude: data.latitude || null,
      longitude: data.longitude || null,
      timestamp: new Date()
    };
    this.status = 'AVAILABLE'; // AVAILABLE, EN_ROUTE, AT_SCENE, RETURNING, UNAVAILABLE
    this.personnel = data.personnel || [];
    this.equipment = data.equipment || [];
    this.capacity = data.capacity || 5;
    this.currentAssignments = [];
    this.completedRescues = 0;
    this.lastUpdate = new Date();
    this.createdAt = new Date();
  }

  updateLocation(latitude, longitude) {
    this.location = {
      latitude,
      longitude,
      timestamp: new Date()
    };
    this.lastUpdate = new Date();
  }

  updateStatus(newStatus) {
    this.status = newStatus;
    this.lastUpdate = new Date();
  }

  assignSurvivor(survivorId) {
    if (this.currentAssignments.length < this.capacity) {
      this.currentAssignments.push({
        survivorId,
        assignedAt: new Date(),
        status: 'ASSIGNED'
      });
      this.status = 'EN_ROUTE';
      this.lastUpdate = new Date();
      return true;
    }
    return false;
  }

  completeSurvivorRescue(survivorId) {
    const index = this.currentAssignments.findIndex(a => a.survivorId === survivorId);
    if (index !== -1) {
      this.currentAssignments[index].status = 'COMPLETED';
      this.currentAssignments[index].completedAt = new Date();
      this.completedRescues++;
      
      if (this.currentAssignments.length === 0) {
        this.status = 'AVAILABLE';
      }
      this.lastUpdate = new Date();
      return true;
    }
    return false;
  }

  getAvailableCapacity() {
    return this.capacity - this.currentAssignments.length;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      location: this.location,
      status: this.status,
      personnel: this.personnel,
      equipment: this.equipment,
      capacity: this.capacity,
      availableCapacity: this.getAvailableCapacity(),
      currentAssignments: this.currentAssignments,
      completedRescues: this.completedRescues,
      lastUpdate: this.lastUpdate,
      createdAt: this.createdAt
    };
  }
}

module.exports = RescueTeam;
