class DiscordService {
    constructor(token) {
      this.token = token;
      this.baseUrl = 'https://discord.com/api/v10';
    }
  
    async getGuildInfo(guildId) {
      try {
        const response = await fetch(`${this.baseUrl}/guilds/${guildId}`, {
          headers: {
            'Authorization': `Bot ${this.token}`
          }
        });
        return await response.json();
      } catch (error) {
        console.error('Error getting guild info:', error);
        return { approximate_member_count: 0 };
      }
    }
  
    async getChannelMessages(channelId) {
      try {
        const response = await fetch(`${this.baseUrl}/channels/${channelId}/messages`, {
          headers: {
            'Authorization': `Bot ${this.token}`
          }
        });
        return await response.json();
      } catch (error) {
        console.error('Error getting channel messages:', error);
        return [];
      }
    }
  
    async sendMessage(channelId, content) {
      try {
        const response = await fetch(`${this.baseUrl}/channels/${channelId}/messages`, {
          method: 'POST',
          headers: {
            'Authorization': `Bot ${this.token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ content })
        });
        return await response.json();
      } catch (error) {
        console.error('Error sending message:', error);
        throw error;
      }
    }
  
    async getChannelStats(channelId) {
      try {
        // Simulación de estadísticas del canal
        return [
          { day: 'Lun', messages: 150 },
          { day: 'Mar', messages: 165 },
          { day: 'Mie', messages: 170 },
          { day: 'Jue', messages: 168 },
          { day: 'Vie', messages: 172 },
          { day: 'Sab', messages: 169 },
          { day: 'Dom', messages: 155 }
        ];
      } catch (error) {
        console.error('Error getting channel stats:', error);
        return [];
      }
    }
  }
  
  export default DiscordService;