import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { fileURLToPath } from 'url';

// Configuración para ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function initializeDatabase() {
  const dbPath = process.env.DATABASE_PATH || path.join(__dirname, '../../database/database.sqlite');
  
  try {
    const db = await open({
      filename: dbPath,
      driver: sqlite3.Database
    });

    // Crear tabla de mensajes programados
    await db.exec(`
      CREATE TABLE IF NOT EXISTS scheduled_messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        content TEXT NOT NULL,
        scheduledFor DATETIME NOT NULL,
        channelId TEXT NOT NULL,
        status TEXT DEFAULT 'pending',
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        error TEXT
      );

      -- Índices para mejorar el rendimiento
      CREATE INDEX IF NOT EXISTS idx_scheduled_for ON scheduled_messages(scheduledFor);
      CREATE INDEX IF NOT EXISTS idx_status ON scheduled_messages(status);
    `);

    console.log('Base de datos inicializada correctamente en:', dbPath);
    return db;
  } catch (error) {
    console.error('Error inicializando la base de datos:', error);
    throw error;
  }
}