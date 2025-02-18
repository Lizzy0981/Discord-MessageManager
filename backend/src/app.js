import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { corsOptions } from './config/cors.js';
import messageRoutes from './routes/messages.js';
import MessageScheduler from './services/scheduler.js';

const app = express();

app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json());

// Configurar rutas y servicios
app.use('/api', messageRoutes);
MessageScheduler.start();

export default app;