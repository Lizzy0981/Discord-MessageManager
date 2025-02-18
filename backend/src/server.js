import app from './app.js';
import { initializeDatabase } from '../database/database.js';

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    // Inicializar la base de datos
    await initializeDatabase();
    
    // Iniciar el servidor
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
      console.log(`📚 Documentación API en http://localhost:${PORT}/api-docs`);
    });
  } catch (error) {
    console.error('Error al iniciar el servidor:', error);
    process.exit(1);
  }
}

startServer();

// Manejar el cierre gracioso del servidor
process.on('SIGTERM', () => {
  console.log('👋 Cerrando servidor...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('👋 Cerrando servidor...');
  process.exit(0);
});