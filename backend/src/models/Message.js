import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class Message {
  static async initDB() {
    try {
      // Construir la ruta a la base de datos
      const dbPath = path.resolve(__dirname, '../../database/database.sqlite');
      console.log('Inicializando base de datos en:', dbPath);

      const db = await open({
        filename: dbPath,
        driver: sqlite3.Database
      });

      // Crear tabla si no existe
      await db.exec(`
        CREATE TABLE IF NOT EXISTS scheduled_messages (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          content TEXT NOT NULL,
          scheduledFor DATETIME NOT NULL,
          channelId TEXT NOT NULL,
          status TEXT DEFAULT 'pending',
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Verificar que la tabla se creó
      const tables = await db.all("SELECT name FROM sqlite_master WHERE type='table'");
      console.log('Tablas en la base de datos:', tables);

      return db;
    } catch (error) {
      console.error('Error inicializando la base de datos:', error);
      throw error;
    }
  }
}

export default Message;