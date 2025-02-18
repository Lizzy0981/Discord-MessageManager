# 🎮 Discord Message Manager

Un dashboard web para programar y gestionar mensajes en tu servidor de Discord.

## 📸 Imagen del Proyecto

![screencapture-localhost-5173-2025-02-17-23_09_37](https://github.com/user-attachments/assets/0d836f12-bd83-45b0-9fa3-3612c3db1094)




## ✨ Características

- 📝 Programación de mensajes
- 📊 Dashboard de mensajes programados
- 🌓 Modo oscuro/claro
- 📱 Diseño responsivo
- 🔄 Actualización en tiempo real

## 🛠️ Tecnologías utilizadas

### Frontend
- ⚛️ React
- ⚡ Vite
- 🎨 TailwindCSS
- 🎯 shadcn/ui
- 📈 Recharts
- 🎭 Framer Motion

### Backend
- 📦 Node.js
- 🚂 Express
- 🗄️ SQLite
- 🔄 Cron Jobs

## 🚀 Instalación

1. Clona el repositorio:
```bash
git clone https://github.com/Lizzy0981/Discord-MessageManager.git
cd Discord-MessageManager
```

2. Instala pnpm si no lo tienes:
```bash
npm install -g pnpm
```

3. Instala las dependencias:
```bash
pnpm install
```

4. Configura las variables de entorno:

Frontend (.env):
```env
VITE_API_URL=http://localhost:3000/api
VITE_DISCORD_TOKEN=tu_token
VITE_CHANNEL_ID=tu_channel_id
```

Backend (.env):
```env
PORT=3000
DATABASE_PATH=./database/database.sqlite
BOT_TOKEN=tu_token
CHANNEL_ID=tu_channel_id
```

5. Inicia el proyecto:
```bash
pnpm run dev
```

## 🌐 Despliegue

El proyecto está desplegado en Vercel. Visita: [Discord Message Manager](https://discord-message-manager.vercel.app)

## 📄 Licencia

Este proyecto está licenciado bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## 👩‍💻 Créditos

Desarrollado con 💜 por Elizabeth Diaz Familia
- 🐱 [GitHub](https://github.com/Lizzy0981)
- 💼 [LinkedIn](https://linkedin.com/in/eli-familia/)
- 🐦 [Twitter](https://twitter.com/Lizzyfamilia)
  
## 🙏 Agradecimientos

- 🎓 Oracle Next Education
- 🚀 Alura Latam
