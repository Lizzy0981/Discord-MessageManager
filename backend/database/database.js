import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function initializeDatabase() {
  const dbPath = path.join(__dirname, 'database.sqlite');
  console.log('Intentando crear base de datos en:', dbPath);

  try {
    // Forzar la creación del archivo de base de datos
    const db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error('Error al crear el archivo de base de datos:', err);
        throw err;
      }
      console.log('Archivo de base de datos creado en:', dbPath);
    });

    // Abrir con el driver que soporta promesas
    const dbConnection = await open({
      filename: dbPath,
      driver: sqlite3.Database
    });

    // Crear tabla e índices
    await dbConnection.exec(`
      CREATE TABLE IF NOT EXISTS scheduled_messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        content TEXT NOT NULL,
        scheduledFor DATETIME NOT NULL,
        channelId TEXT NOT NULL,
        status TEXT DEFAULT 'pending',
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE INDEX IF NOT EXISTS idx_scheduled_for ON scheduled_messages(scheduledFor);
      CREATE INDEX IF NOT EXISTS idx_status ON scheduled_messages(status);
    `);

    // Verificar que la tabla existe
    const tables = await dbConnection.all("SELECT name FROM sqlite_master WHERE type='table'");
    console.log('Tablas creadas:', tables);

    return dbConnection;
  } catch (error) {
    console.error('Error al inicializar la base de datos:', error);
    throw error;
  }
}

export async function getDatabase() {
  const dbPath = path.join(__dirname, 'database.sqlite');
  return open({
    filename: dbPath,
    driver: sqlite3.Database
  });
}

export async function closeDatabase(db) {
  if (db) {
    await db.close();
  }
}