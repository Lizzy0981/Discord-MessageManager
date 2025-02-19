class ScheduleService {
  constructor() {
      // En producción, usa la URL completa
      this.API_URL = import.meta.env.NODE_ENV === 'production' 
          ? `${window.location.origin}/api`
          : import.meta.env.VITE_API_URL;
          
      this.CHANNEL_ID = import.meta.env.VITE_CHANNEL_ID;
      
      console.log('API_URL:', this.API_URL);
      console.log('Environment:', import.meta.env.NODE_ENV);
  }

  async getScheduledMessages() {
    try {
      const url = `${this.API_URL}/messages`;
      console.log('Fetching messages from:', url);

      const response = await fetch(url, {
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error response:', errorData);
        throw new Error(errorData.error || 'Error al obtener mensajes');
      }

      const data = await response.json();
      return Array.isArray(data) ? data : [];

    } catch (error) {
      console.error('Error in getScheduledMessages:', error);
      throw error;
    }
  }

  async scheduleMessage(messageData) {
    try {
      const url = `${this.API_URL}/message`;
      console.log('Scheduling message at:', url);

      if (!messageData.content?.trim()) {
        throw new Error('El contenido del mensaje es requerido');
      }

      const scheduledDate = new Date(messageData.scheduledFor);
      if (isNaN(scheduledDate.getTime())) {
        throw new Error('Fecha inválida');
      }

      if (scheduledDate < new Date()) {
        throw new Error('La fecha debe ser futura');
      }

      const formattedData = {
        content: messageData.content.trim(),
        scheduledFor: scheduledDate.toISOString(),
        channelId: this.CHANNEL_ID
      };

      console.log('Sending formatted data:', formattedData);

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formattedData),
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error response:', errorData);
        throw new Error(errorData.error || 'Error al programar mensaje');
      }

      const result = await response.json();
      console.log('Schedule response:', result);
      return result;

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

      const url = `${this.API_URL}/message/${messageId}`;
      console.log('Deleting message:', url);

      const response = await fetch(url, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json();
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
