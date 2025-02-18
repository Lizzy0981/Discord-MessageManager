export const corsOptions = {
  origin: process.env.NODE_ENV === 'production'
    ? ['https://discord-message-manager.vercel.app', 'https://*.vercel.app']
    : ['http://localhost:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 600
};