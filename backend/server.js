const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const { registerHandlers } = require('./socketHandlers');
const { startRoomCleaner, stopRoomCleaner } = require('./roomManager');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      const allowedOrigins = (process.env.CLIENT_URLS || '')
        .split(',')
        .map((value) => value.trim())
        .filter(Boolean);

      if (!origin || process.env.NODE_ENV !== 'production' || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error(`Origin not allowed: ${origin}`));
    },
    methods: ['GET', 'POST']
  }
});

// Optional single-service deployment: set CLIENT_BUILD_DIR to a React build folder.
const clientBuildDir = process.env.CLIENT_BUILD_DIR
  ? path.resolve(process.cwd(), process.env.CLIENT_BUILD_DIR)
  : null;

if (clientBuildDir) {
  app.use(express.static(clientBuildDir));
}

app.get('/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

if (clientBuildDir) {
  app.get('/{*splat}', (req, res) => {
    res.sendFile(path.join(clientBuildDir, 'index.html'));
  });
}

// Socket.IO connection handler
io.on('connection', (socket) => {
  console.log(`Connected: ${socket.id}`);
  registerHandlers(io, socket);
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  // Clean stale rooms every 60 seconds
  startRoomCleaner(60000);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received — shutting down');
  stopRoomCleaner();
  io.close();
  server.close(() => process.exit(0));
});
process.on('SIGINT', () => {
  console.log('SIGINT received — shutting down');
  stopRoomCleaner();
  io.close();
  server.close(() => process.exit(0));
});
