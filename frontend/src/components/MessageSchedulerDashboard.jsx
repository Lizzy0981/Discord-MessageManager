import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Moon, Sun, RefreshCw, Clock, Trash2, Github, Linkedin, Twitter } from 'lucide-react';
import { Button } from "./ui/button";
import { Alert, AlertDescription } from "./ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import scheduleApi from '../services/scheduleApi';

// Variantes de animación
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 24
    }
  }
};

// Estilos base para cards
const cardStyle = `
  relative overflow-hidden rounded-xl
  border border-gray-200 dark:border-gray-800
  bg-gradient-to-br from-white/40 to-white/10 dark:from-gray-900/40 dark:to-gray-900/10
  backdrop-blur-md
  transition-all duration-300
  hover:translate-y-[-5px] hover:shadow-2xl
  dark:shadow-none
  dark:hover:shadow-lg dark:hover:shadow-indigo-500/20
`;

const MessageSchedulerDashboard = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [scheduleDate, setScheduleDate] = useState('');

  // Manejo del modo oscuro
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const fetchMessages = useCallback(async () => {
    try {
      console.log('Fetching messages...');
      setLoading(true);
      const data = await scheduleApi.getScheduledMessages();
      console.log('Messages fetched:', data);
      setMessages(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching messages:', err);
      setError('Error al cargar los mensajes programados');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 30000);
    return () => clearInterval(interval);
  }, [fetchMessages]);

  const handleScheduleMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !scheduleDate || loading) return;

    try {
      setLoading(true);
      console.log('Scheduling message:', { content: newMessage, scheduledFor: scheduleDate });
      
      await scheduleApi.scheduleMessage({
        content: newMessage,
        scheduledFor: scheduleDate
      });
      
      console.log('Message scheduled successfully');
      await fetchMessages();
      setNewMessage('');
      setScheduleDate('');
      setError(null);
    } catch (err) {
      console.error('Error scheduling message:', err);
      setError('Error al programar el mensaje');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMessage = async (messageId) => {
    try {
      setLoading(true);
      console.log('Deleting message:', messageId);
      
      await scheduleApi.deleteMessage(messageId);
      
      console.log('Message deleted successfully');
      await fetchMessages();
      setError(null);
    } catch (err) {
      console.error('Error deleting message:', err);
      setError('Error al eliminar el mensaje');
    } finally {
      setLoading(false);
    }
  };

  // Obtener fecha mínima (ahora)
  const getMinDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className={`min-h-screen transition-colors duration-500
        bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50
        dark:from-gray-900 dark:via-indigo-950 dark:to-purple-950
      `}
    >
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <motion.div 
          className="flex justify-between items-center mb-8"
          variants={itemVariants}
        >
          <motion.h1 
            className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 
                       dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent"
            whileHover={{ scale: 1.05 }}
          >
            Discord Message Scheduler
          </motion.h1>
          <div className="flex gap-3">
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setDarkMode(!darkMode)}
                className="rounded-xl bg-white/20 dark:bg-gray-800/40 backdrop-blur-sm
                          border border-gray-200 dark:border-gray-700"
              >
                {darkMode ? 
                  <Sun className="h-5 w-5 text-yellow-500" /> : 
                  <Moon className="h-5 w-5 text-indigo-600" />
                }
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={fetchMessages}
                disabled={loading}
                className="rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500
                          hover:from-indigo-600 hover:to-purple-600 text-white
                          border-none shadow-lg shadow-indigo-500/30"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                {loading ? 'Actualizando...' : 'Actualizar'}
              </Button>
            </motion.div>
          </div>
        </motion.div>

        {/* Error Alert */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6"
            >
              <Alert className={`${cardStyle} border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-900/20`}>
                <AlertDescription className="text-red-600 dark:text-red-400">
                  {error}
                  <Button
                    variant="link"
                    className="ml-2 text-sm"
                    onClick={() => setError(null)}
                  >
                    Cerrar
                  </Button>
                </AlertDescription>
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Schedule Form */}
          <motion.div variants={itemVariants}>
            <Card className={cardStyle}>
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-800 dark:text-white">
                  Programar Mensaje
                </CardTitle>
              </CardHeader>
              <CardContent>
                <motion.form 
                  onSubmit={handleScheduleMessage}
                  className="space-y-4"
                >
                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    className="space-y-4"
                  >
                    <Input
                      placeholder="Escribe tu mensaje..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className="bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700
                               focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400
                               rounded-xl"
                    />
                    
                    <Input
                      type="datetime-local"
                      value={scheduleDate}
                      onChange={(e) => setScheduleDate(e.target.value)}
                      min={getMinDateTime()}
                      className="bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700
                               focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400
                               rounded-xl"
                    />
                  </motion.div>

                  <motion.div 
                    whileHover={{ scale: 1.02 }} 
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button 
                      type="submit"
                      className="w-full rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500
                               hover:from-indigo-600 hover:to-purple-600 text-white
                               shadow-lg shadow-indigo-500/30"
                      disabled={loading}
                    >
                      <Clock className="mr-2 h-4 w-4" />
                      {loading ? 'Programando...' : 'Programar Mensaje'}
                    </Button>
                  </motion.div>
                </motion.form>
              </CardContent>
            </Card>
          </motion.div>

          {/* Messages List */}
          <motion.div variants={itemVariants}>
            <Card className={cardStyle}>
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-800 dark:text-white">
                  Mensajes Programados
                </CardTitle>
              </CardHeader>
              <CardContent>
                <AnimatePresence>
                  {messages.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <Alert className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-sm
                                      border-gray-200 dark:border-gray-700 rounded-xl">
                        <AlertDescription className="text-gray-600 dark:text-gray-300">
                          No hay mensajes programados
                        </AlertDescription>
                      </Alert>
                    </motion.div>
                  ) : (
                    <motion.div 
                      className="space-y-3"
                      variants={containerVariants}
                    >
                      {messages.map((message, index) => (
                        <motion.div
                          key={message.id}
                          variants={itemVariants}
                          initial="hidden"
                          animate="visible"
                          exit={{ opacity: 0, x: -100 }}
                          custom={index}
                          className="group"
                        >
                          <Alert className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-sm
                                          border-gray-200 dark:border-gray-700 rounded-xl
                                          transition-all duration-300 group-hover:translate-x-2">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <p className="font-medium text-gray-800 dark:text-white">
                                  {message.content}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                  Programado para: {new Date(message.scheduledFor).toLocaleString()}
                                </p>
                              </div>
                              <motion.button
                                whileHover={{ scale: 1.2, rotate: 180 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleDeleteMessage(message.id)}
                                className="text-gray-400 hover:text-red-500 dark:text-gray-500 
                                          dark:hover:text-red-400 transition-colors duration-300"
                              >
                                <Trash2 className="h-4 w-4" />
                              </motion.button>
                            </div>
                          </Alert>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Footer */}
        <motion.footer 
          className="mt-8 text-center"
          variants={itemVariants}
        >
          <motion.div 
            className={`${cardStyle} p-8`}
            whileHover={{ scale: 1.02 }}
          >
            <motion.h2 
              className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600
                         dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent mb-4"
              animate={{
                scale: [1, 1.02, 1],
                transition: { duration: 2, repeat: Infinity }
              }}
            >
              Elizabeth Diaz Familia
            </motion.h2>
            <div className="flex justify-center gap-6">
            {[
  { icon: Github, href: "https://github.com/Lizzy0981" },
  { icon: Linkedin, href: "https://linkedin.com/in/eli-familia" },
  { icon: Twitter, href: "https://twitter.com/Lizzyfamilia" }
].map((social, index) => (
  <motion.a
    key={social.href}
    href={social.href}
    target="_blank"
    rel="noopener noreferrer"
    whileHover={{ scale: 1.2, rotate: 15 }}
    whileTap={{ scale: 0.9 }}
    initial={{ opacity: 0, y: 20 }}
    animate={{ 
      opacity: 1,
      y: 0,
      transition: { delay: index * 0.2 }
    }}
    className="text-indigo-600 dark:text-indigo-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-300"
  >
    <social.icon className="h-6 w-6" />
  </motion.a>
))}
</div>
<motion.p 
  className="mt-4 text-sm text-gray-600 dark:text-gray-400"
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ delay: 0.8 }}
>
  © {new Date().getFullYear()} | Made with 💜
</motion.p>
</motion.div>
</motion.footer>
</div>
</motion.div>
);
};

export default MessageSchedulerDashboard;