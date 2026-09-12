# 🛡️ RAKSHAK - National Disaster Rescue and Response System Backend

A comprehensive backend system for disaster management, survivor tracking, and emergency response coordination.

## Features

### 🚨 Emergency Management
- Report and track active disasters
- Real-time emergency alerts and notifications
- Damage assessment and casualty tracking
- Multi-disaster coordination

### 👥 Survivor Management
- Register survivors with location data
- Real-time location tracking via GPS
- Medical condition monitoring
- Battery level and connectivity status tracking
- Priority-based rescue queue algorithm

### 🚁 Rescue Team Coordination
- Register and manage rescue teams
- Real-time team location tracking
- Team capacity management
- Dispatch coordination
- Rescue completion tracking

### 📡 Real-Time Communication
- WebSocket support for live updates
- Instant alert notifications
- Status synchronization across dashboard
- Multi-client broadcasting

### 📊 Analytics & Reporting
- Survival statistics
- Response time analytics
- Critical area identification
- Recovery progress tracking

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Real-time**: Socket.IO
- **Data Models**: Custom JavaScript classes (easily adaptable to MongoDB)
- **Authentication**: JWT (ready to implement)

## Installation

```bash
# Clone the repository
git clone https://github.com/pritdjvuvw-tech/disaster-management.git
cd disaster-management

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your configuration

# Start the server
npm start

# Or for development with auto-reload
npm run dev
```

## API Endpoints

### Survivors
```
POST   /api/survivors/register           - Register new survivor
GET    /api/survivors                    - List active survivors
GET    /api/survivors/:id                - Get survivor details
POST   /api/survivors/:id/alive          - Confirm alive status
POST   /api/survivors/:id/location       - Update location
POST   /api/survivors/:id/medical-condition - Update medical status
POST   /api/survivors/:id/battery        - Update battery level
POST   /api/survivors/:id/rescue-team    - Assign rescue team
```

### Authorities
```
GET    /api/authorities/teams            - List all teams
GET    /api/authorities/teams/available  - List available teams
POST   /api/authorities/teams            - Register new team
GET    /api/authorities/teams/:id        - Get team details
POST   /api/authorities/teams/:id/location - Update team location
POST   /api/authorities/teams/:id/status - Update team status
POST   /api/authorities/dispatch         - Dispatch team to survivor
POST   /api/authorities/rescue-complete  - Mark rescue complete
```

### Emergency
```
POST   /api/emergency/report             - Report new emergency
GET    /api/emergency                    - List active emergencies
GET    /api/emergency/:id                - Get emergency details
POST   /api/emergency/:id/add-survivor   - Add survivor to emergency
POST   /api/emergency/:id/update-status  - Update emergency status
POST   /api/emergency/:id/update-casualties - Update casualty count
```

### Alerts
```
POST   /api/alerts/sos                   - Send SOS alert
GET    /api/alerts                       - Get active alerts
POST   /api/alerts/:id/acknowledge       - Acknowledge alert
POST   /api/alerts/:id/resolve           - Resolve alert
```

### Analytics
```
GET    /api/analytics/dashboard          - Dashboard statistics
GET    /api/analytics/survival-rate      - Survival statistics
GET    /api/analytics/response-time      - Response time analytics
GET    /api/analytics/critical-areas     - High-risk area data
```

## WebSocket Events

### Emit (Client to Server)
```javascript
socket.emit('survivor-status', data);
socket.emit('emergency-alert', data);
```

### Listen (Server to Client)
```javascript
socket.on('survivor-registered', data);
socket.on('survivor-update', data);
socket.on('survivor-location-update', data);
socket.on('emergency-reported', data);
socket.on('sos-alert', data);
socket.on('team-dispatched', data);
socket.on('rescue-completed', data);
```

## Priority Algorithm

Survivor rescue priority is calculated based on:
1. **Severity** (Medical condition) - 40%
2. **Battery Level** - 20%
3. **Time Trapped** - 20%
4. **Active Status** - 20%

Score Range: 0-100

## Example Usage

### Register a Survivor
```bash
curl -X POST http://localhost:5000/api/survivors/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "phone": "9876543210",
    "email": "john@example.com",
    "latitude": 22.5726,
    "longitude": 88.3639,
    "accuracy": 50,
    "medicalCondition": "SEVERE_INJURY"
  }'
```

### Get Active Survivors
```bash
curl http://localhost:5000/api/survivors
```

### Dispatch Rescue Team
```bash
curl -X POST http://localhost:5000/api/authorities/dispatch \
  -H "Content-Type: application/json" \
  -d '{
    "survivorId": "IND-XXXXX",
    "teamId": "RT-17"
  }'
```

## Future Enhancements

- [ ] MongoDB integration for persistent storage
- [ ] JWT authentication
- [ ] Role-based access control (RBAC)
- [ ] SMS/Email notifications
- [ ] Google Maps API integration
- [ ] Machine learning for priority prediction
- [ ] Multi-language support
- [ ] Mobile app integration
- [ ] Advanced geospatial queries
- [ ] Automated report generation

## Contributing

Contributions are welcome! Please follow these steps:
1. Create a new branch
2. Make your changes
3. Submit a pull request

## License

MIT License - See LICENSE file for details

## Support

For issues and support, please contact the RAKSHAK team.

---

**Made with ❤️ for disaster management and rescue operations**
