import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import messageRoutes from './routes/messages.js';
import MessageScheduler from './services/scheduler.js';

const app = express();

// Configuración de CORS
const corsOptions = {
  origin: process.env.NODE_ENV === 'production'
    ? ['https://discord-message-manager.vercel.app', 'https://*.vercel.app']
    : ['http://localhost:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Middlewares
app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json());

// Headers de seguridad
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

// Rutas y servicios
app.use('/api', messageRoutes);
MessageScheduler.start();

// Manejo de errores
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Error interno del servidor'
  });
});

export default app;
