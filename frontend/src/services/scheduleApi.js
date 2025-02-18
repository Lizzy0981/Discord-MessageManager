const API_URL = import.meta.env.VITE_API_URL;
const CHANNEL_ID = import.meta.env.VITE_CHANNEL_ID;

class ScheduleService {
  constructor() {
    // Verificar que las variables de entorno están cargadas
    console.log('API_URL:', API_URL);
    console.log('CHANNEL_ID:', CHANNEL_ID);
    
    if (!API_URL) {
      console.error('VITE_API_URL no está definida en el archivo .env');
    }
    if (!CHANNEL_ID) {
      console.error('VITE_CHANNEL_ID no está definida en el archivo .env');
    }
  }

  async getScheduledMessages() {
    try {
      const url = `${API_URL}/messages`;
      console.log('Fetching messages from:', url);

      const response = await fetch(url);
      console.log('Response:', response.status, response.statusText);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error response:', errorData);
        throw new Error(errorData.error || 'Error al obtener mensajes');
      }

      const data = await response.json();
      console.log('Messages received:', data);
      return Array.isArray(data) ? data : [];

    } catch (error) {
      console.error('Error in getScheduledMessages:', error);
      throw error;
    }
  }

  async scheduleMessage(messageData) {
    try {
      const url = `${API_URL}/message`;
      console.log('Scheduling message at:', url);
      console.log('Message data:', messageData);

      if (!messageData.content) {
        throw new Error('El contenido del mensaje es requerido');
      }

      const scheduledDate = new Date(messageData.scheduledFor);
      if (isNaN(scheduledDate.getTime())) {
        throw new Error('Fecha inválida');
      }

      const formattedData = {
        content: messageData.content.trim(),
        scheduledFor: scheduledDate.toISOString(),
        channelId: CHANNEL_ID
      };

      console.log('Formatted data:', formattedData);

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formattedData),
      });

      console.log('Schedule response:', response.status, response.statusText);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Schedule error:', errorData);
        throw new Error(errorData.error || 'Error al programar mensaje');
      }

      const data = await response.json();
      console.log('Scheduled message response:', data);
      return data;

    } catch (error) {
      console.error('Error in scheduleMessage:', error);
      throw error;
    }
  }

  async deleteMessage(messageId) {
    try {
      if (!messageId) {
        throw new Error('ID del mensaje es requerido');
      }

      const url = `${API_URL}/message/${messageId}`;
      console.log('Deleting message:', url);

      const response = await fetch(url, {
        method: 'DELETE',
      });

      console.log('Delete response:', response.status, response.statusText);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Delete error:', errorData);
        throw new Error(errorData.error || 'Error al eliminar mensaje');
      }

      return true;
    } catch (error) {
      console.error('Error in deleteMessage:', error);
      throw error;
    }
  }
}

export default new ScheduleService();