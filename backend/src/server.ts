import express from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import { getRedisConnection } from './config/redis';
import { initSocketServer } from './sockets/socketServer';
import { initWorkers } from './workers/generationWorker';
import assignmentRoutes from './routes/assignmentRoutes';

// Load environment configurations
dotenv.config();

const app = express();
const server = http.createServer(app);

// App configuration
app.use(cors({
  origin: '*', // Allow all origins for dev simplicity
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check API
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || 'development',
  });
});

// Bind routers
app.use('/api/assignments', assignmentRoutes);

const PORT = process.env.PORT || 5000;

async function bootstrap() {
  console.log('🚀 Booting up Assessment Creator Backend...');
  
  // Connect database
  await connectDB();

  // Connect Redis
  getRedisConnection();

  // Initialize Socket.IO
  initSocketServer(server);

  // Initialize background queues
  initWorkers();

  // Start Server
  server.listen(PORT, () => {
    console.log(`📡 Server listening on port ${PORT}`);
  });
}

bootstrap().catch((err) => {
  console.error('❌ Server startup failed:', err);
  process.exit(1);
});
export default server;
