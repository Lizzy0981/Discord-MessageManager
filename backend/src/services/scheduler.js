import { CronJob } from 'cron';
import Message from '../models/Message.js';
import DiscordService from './discordService.js';

class MessageScheduler {
  constructor() {
    this.job = new CronJob('* * * * *', this.checkMessages.bind(this));
  }

  async checkMessages() {
    try {
      const db = await Message.initDB();
      const pendingMessages = await db.all(`
        SELECT * FROM scheduled_messages 
        WHERE status = 'pending' 
        AND scheduledFor <= datetime('now')
      `);

      for (const message of pendingMessages) {
        await this.sendMessage(message);
        await db.run(
          'UPDATE scheduled_messages SET status = ? WHERE id = ?',
          ['sent', message.id]
        );
      }
    } catch (error) {
      console.error('Error checking messages:', error);
    }
  }

  async sendMessage(message) {
    try {
      await DiscordService.sendMessage(message.channelId, message.content);
    } catch (error) {
      console.error(`Error sending message ${message.id}:`, error);
    }
  }

  start() {
    this.job.start();
  }

  stop() {
    this.job.stop();
  }
}

export default new MessageScheduler();