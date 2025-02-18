import express from 'express';
import { messageController } from '../controllers/messageController.js';

const router = express.Router();

router.post('/message', messageController.createMessage);
router.get('/messages', messageController.getMessages);
router.delete('/message/:id', messageController.deleteMessage);

export default router;