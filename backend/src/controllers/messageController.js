import Message from '../models/Message.js';

export const messageController = {
  async createMessage(req, res) {
    try {
      const { content, scheduledFor, channelId } = req.body;
      
      console.log('Received message data:', { content, scheduledFor, channelId });

      // Validaciones
      if (!content?.trim()) {
        return res.status(400).json({ error: 'El contenido del mensaje es requerido' });
      }
      if (!scheduledFor) {
        return res.status(400).json({ error: 'La fecha de programación es requerida' });
      }
      if (!channelId) {
        return res.status(400).json({ error: 'El ID del canal es requerido' });
      }

      const db = await Message.initDB();
      
      const result = await db.run(
        `INSERT INTO scheduled_messages (content, scheduledFor, channelId, status) 
         VALUES (?, ?, ?, 'pending')`,
        [content, scheduledFor, channelId]
      );

      console.log('Message inserted with ID:', result.lastID);

      // Obtener el mensaje recién creado
      const message = await db.get(
        'SELECT * FROM scheduled_messages WHERE id = ?',
        [result.lastID]
      );

      console.log('Created message:', message);
      res.status(201).json(message);
    } catch (error) {
      console.error('Error in createMessage:', error);
      res.status(500).json({ error: 'Error al programar el mensaje' });
    }
  },

  async getMessages(req, res) {
    try {
      console.log('Getting scheduled messages');
      const db = await Message.initDB();
      
      const messages = await db.all(
        `SELECT * FROM scheduled_messages 
         WHERE status = 'pending' 
         ORDER BY scheduledFor ASC`
      );

      console.log('Found messages:', messages);
      res.json(messages);
    } catch (error) {
      console.error('Error in getMessages:', error);
      res.status(500).json({ error: 'Error al obtener los mensajes' });
    }
  },

  async deleteMessage(req, res) {
    try {
      const { id } = req.params;
      console.log('Deleting message:', id);
      
      const db = await Message.initDB();
      
      // Verificar que el mensaje existe
      const message = await db.get(
        'SELECT id FROM scheduled_messages WHERE id = ?', 
        [id]
      );
      
      if (!message) {
        return res.status(404).json({ error: 'Mensaje no encontrado' });
      }

      await db.run('DELETE FROM scheduled_messages WHERE id = ?', [id]);
      console.log('Message deleted successfully');
      
      res.status(204).send();
    } catch (error) {
      console.error('Error in deleteMessage:', error);
      res.status(500).json({ error: 'Error al eliminar el mensaje' });
    }
  }
};