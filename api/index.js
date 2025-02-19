import express from 'express';
import cors from 'cors';
import { messageController } from '../backend/src/controllers/messageController.js';

// Configuramos una mini app express para las funciones serverless
const app = express();

// Configurar CORS
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'DELETE'],
  credentials: true
}));

app.use(express.json());

// Rutas simplificadas
app.get('/api/messages', messageController.getMessages);
app.post('/api/message', messageController.createMessage);
app.delete('/api/message/:id', messageController.deleteMessage);


export default app;