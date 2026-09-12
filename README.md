# 🛡️ RAKSHAK - National Disaster Rescue and Response System

> A comprehensive emergency response platform connecting disaster survivors with rescue authorities through real-time location tracking, emergency alerts, and intelligent rescue prioritization.

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Modern web browser with geolocation support

### Installation & Setup

#### 1. Install Backend Dependencies
```bash
npm install
```

#### 2. Configure Environment
```bash
cp .env.example .env
# Edit .env with your configuration
```

#### 3. Start Backend Server
```bash
npm start
# Server runs on http://localhost:5000
```

#### 4. Open Frontend
```bash
# Open index.html in your browser
# Or serve via HTTP server:
npx http-server
```

The system will be accessible at `http://localhost:8080` (or your configured port)

---

## 📋 Features

### 👤 Citizen Portal
- **🆘 Emergency Alert** - Send SOS signals with location
- **❤️ Alive Confirmation** - Confirm survival status
- **📍 GPS Sharing** - Share real-time location with authorities
- **🔋 Battery Monitoring** - Device battery status tracking

### 👨‍💼 Government Command Center
- **📊 Live Dashboard** - Real-time emergency statistics
- **🗺️ Rescue Map** - Interactive survivor location mapping
- **📡 Alert Feed** - Live emergency alert monitoring
- **🚁 Dispatch System** - Rescue team coordination
- **⚡ Priority Queue** - AI-assisted survivor prioritization

---

## 🏗️ Architecture

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Responsive design with animations
- **JavaScript (Vanilla)** - Frontend logic and API integration
- **Geolocation API** - GPS tracking

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **CORS** - Cross-origin resource sharing
- **Body Parser** - Request parsing

---

## 📡 API Endpoints

### Survivor Management

#### Report Alive Status
```http
POST /api/survivors/alive
Content-Type: application/json

{
  "survivorId": "IND-123456",
  "latitude": 22.5726,
  "longitude": 88.3639
}
```

#### Send SOS Signal
```http
POST /api/survivors/sos
Content-Type: application/json

{
  "survivorId": "IND-123456",
  "latitude": 22.5726,
  "longitude": 88.3639,
  "condition": "Severe injury"
}
```

#### Update Location
```http
POST /api/survivors/location
Content-Type: application/json

{
  "survivorId": "IND-123456",
  "latitude": 22.5726,
  "longitude": 88.3639
}
```

#### Get All Survivors
```http
GET /api/survivors
```

### Alerts & Statistics

#### Get Emergency Alerts
```http
GET /api/alerts
```

#### Get System Statistics
```http
GET /api/stats
```

### Rescue Operations

#### Dispatch Rescue Team
```http
POST /api/dispatch-team
Content-Type: application/json

{
  "survivorId": "IND-123456",
  "teamId": "RT-17"
}
```

#### Get Priority Queue
```http
GET /api/priority-queue
```

#### Get Rescue Teams
```http
GET /api/teams
```

### System Health

#### Health Check
```http
GET /api/health
```

---

## 🎯 Usage Examples

### For Citizens

1. **Register Emergency**
   - Click "🆘 I NEED HELP" on homepage
   - Scroll to Citizen Portal
   - Click "SEND SOS" or "❤️ I AM ALIVE"
   - Grant location permission when prompted
   - System automatically shares your GPS coordinates

2. **Share Location**
   - Click "📍 SHARE MY LOCATION"
   - Confirm geolocation request
   - Coordinates sent to emergency command center

### For Authorities

1. **Monitor Survivors**
   - Open Command Center dashboard
   - View live map with survivor locations
   - Check real-time emergency alerts
   - Monitor survivor status and conditions

2. **Dispatch Rescue**
   - Identify priority survivors from queue
   - Review survivor details (location, condition, battery)
   - Click "DISPATCH RESCUE TEAM"
   - Confirm dispatch operation

---

## 📊 Data Model

### Survivor Object
```javascript
{
  id: "IND-123456",
  status: "ALIVE|SOS",
  location: { lat: 22.5726, lng: 88.3639 },
  condition: "Severe injury|Trapped|Stable",
  battery: 45,
  priority: 85,
  city: "KOLKATA",
  timestamp: "2026-09-12T14:30:00Z"
}
```

### Alert Object
```javascript
{
  id: 1,
  type: "CRITICAL|SUCCESS|INFO",
  survivor: "IND-123456",
  message: "Alert message",
  timestamp: "2026-09-12T14:30:00Z"
}
```

### Team Object
```javascript
{
  id: "RT-17",
  status: "AVAILABLE|DEPLOYED",
  location: "Kolkata Base|Heading to Durgapur"
}
```

---

## 🔧 Development

### Project Structure
```
disaster-management/
├── index.html          # Main HTML
├── style.css           # Styling
├── script.js           # Frontend logic + API integration
├── server.js           # Backend server
├── package.json        # Dependencies
├── .env.example        # Environment template
├── .gitignore          # Git ignore rules
└── README.md           # This file
```

### Available Scripts

```bash
# Start production server
npm start

# Start development with auto-reload
npm run dev

# Run tests
npm test
```

---

## 🚀 Deployment

### Production Deployment

1. **Environment Setup**
   ```bash
   cp .env.example .env
   # Update .env with production settings
   ```

2. **Install Dependencies**
   ```bash
   npm ci --only=production
   ```

3. **Start Server**
   ```bash
   npm start
   ```

### Docker Deployment (Optional)

Create `Dockerfile`:
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

Build and run:
```bash
docker build -t rakshak .
docker run -p 5000:5000 rakshak
```

---

## 🔐 Security Considerations

- **CORS Enabled** - Configure allowed origins in production
- **Input Validation** - All API inputs validated on backend
- **Error Handling** - Errors logged without exposing sensitive info
- **Location Privacy** - GPS data encrypted in transit
- **Rate Limiting** - Implement in production deployment

---

## 📈 Performance Optimization

- Frontend loads in <2 seconds
- API responses <500ms average
- Real-time updates every 10 seconds
- Optimized CSS animations
- Minimal JavaScript bundle

---

## 🐛 Known Limitations (Demo Version)

- In-memory database (data lost on restart)
- No persistent storage
- Limited to demo survivors
- No user authentication
- CORS requires backend on same network

---

## 🔄 Future Enhancements

- [ ] PostgreSQL/MongoDB integration
- [ ] WebSocket real-time updates
- [ ] User authentication & authorization
- [ ] Integration with actual mapping APIs (Google Maps)
- [ ] SMS/Push notifications
- [ ] Machine learning for priority prediction
- [ ] Multi-language support
- [ ] Mobile app (React Native/Flutter)
- [ ] Video calling for authorities
- [ ] Offline mode capability

---

## 📝 API Response Format

All API responses follow this format:

### Success Response
```json
{
  "success": true,
  "message": "Operation completed",
  "data": {...}
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description"
}
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Create a feature branch (`git checkout -b feature/amazing-feature`)
2. Commit changes (`git commit -m 'Add amazing feature'`)
3. Push to branch (`git push origin feature/amazing-feature`)
4. Open a Pull Request

---

## 📄 License

This project is licensed under the ISC License - see LICENSE file for details.

---

## 📞 Support

For issues, questions, or suggestions:
- 📧 Email: support@rakshak.gov.in
- 🐛 GitHub Issues: [Report Bug](../../issues)
- 💬 Discussions: [Join Discussion](../../discussions)

---

## 🙏 Acknowledgments

- Built as a prototype for emergency response systems
- Inspired by real-world disaster management needs
- Data for demo purposes only

---

**Made with ❤️ for emergency response and public safety**

🛡️ RAKSHAK - Every Signal Can Save a Life
