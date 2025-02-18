import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Moon, Sun, RefreshCw, Send, Users, Github, Linkedin, Twitter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Alert, AlertDescription } from "./ui/alert";
import { Input } from "./ui/input";
import DiscordService from '../services/discordApi';

if (typeof window !== 'undefined') {
  window.addEventListener('error', (e) => {
    if (e.target && (e.target.src || e.target.href)) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
  }, true);
}

const discordService = new DiscordService(import.meta.env.VITE_DISCORD_TOKEN);
const GUILD_ID = import.meta.env.VITE_GUILD_ID;
const CHANNEL_ID = import.meta.env.VITE_CHANNEL_ID;
const UPDATE_INTERVAL = 60000;

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

const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

const DiscordDashboard = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [error, setError] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [adminStatuses] = useState({
    "Carlos_Admin": "offline",
    "Ana_Moderator": "online",
    "Juan_Support": "offline",
    "Maria_Manager": "online",
    "Pedro_Admin": "offline"
  });
  const [serverData, setServerData] = useState({
    totalMembers: 0,
    lastMessages: [],
    admins: [
      { id: 1, name: "Carlos_Admin" },
      { id: 2, name: "Ana_Moderator" },
      { id: 3, name: "Juan_Support" },
      { id: 4, name: "Maria_Manager" },
      { id: 5, name: "Pedro_Admin" }
    ],
    activityData: []
  });

  // Manejo correcto del modo oscuro
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const fetchDiscordData = useCallback(async () => {
    if (loading) return;
    
    try {
      setLoading(true);
      const [guildInfo, messages, activityStats] = await Promise.all([
        discordService.getGuildInfo(GUILD_ID),
        discordService.getChannelMessages(CHANNEL_ID),
        discordService.getChannelStats(CHANNEL_ID)
      ]);

      setServerData(prev => ({
        ...prev,
        totalMembers: guildInfo.approximate_member_count || 0,
        lastMessages: messages.map(msg => ({
          id: msg.id,
          user: msg.author.username,
          content: msg.content,
          timestamp: new Date(msg.timestamp).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          })
        })),
        activityData: activityStats
      }));
      setError(null);
    } catch (err) {
      console.error('Error fetching Discord data:', err);
      setError('Error al cargar los datos de Discord. Por favor, intenta de nuevo.');
    } finally {
      setTimeout(() => setLoading(false), 500);
    }
  }, [loading]);

  useEffect(() => {
    const debouncedFetch = debounce(fetchDiscordData, 1000);
    debouncedFetch();

    const interval = setInterval(debouncedFetch, UPDATE_INTERVAL);
    return () => {
      clearInterval(interval);
    };
  }, [fetchDiscordData]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || sendingMessage) return;

    try {
      setSendingMessage(true);
      const sentMessage = await discordService.sendMessage(CHANNEL_ID, newMessage);
      
      const formattedMessage = {
        id: sentMessage.id,
        user: sentMessage.author.username,
        content: sentMessage.content,
        timestamp: new Date(sentMessage.timestamp).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit'
        })
      };

      setServerData(prev => ({
        ...prev,
        lastMessages: [formattedMessage, ...prev.lastMessages.slice(0, 4)]
      }));

      setNewMessage('');
      setError(null);
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Error al enviar el mensaje. Por favor, intenta de nuevo.');
    } finally {
      setSendingMessage(false);
    }
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
            Discord Server Dashboard
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
                onClick={() => !loading && fetchDiscordData()}
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
                </AlertDescription>
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stats Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6"
          variants={containerVariants}
        >
          <motion.div variants={itemVariants} whileHover={{ scale: 1.02 }}>
            <Card className={cardStyle}>
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 dark:from-indigo-500/5 dark:to-purple-500/5" />
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-800 dark:text-white">
                  Miembros Totales
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <motion.p 
                    className="text-4xl font-bold text-indigo-600 dark:text-indigo-400"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    {serverData.totalMembers}
                  </motion.p>
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.8 }}
                  >
                    <Users className="h-8 w-8 text-purple-500 dark:text-purple-400" />
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Messages Section */}
          <motion.div variants={itemVariants}>
            <Card className={cardStyle}>
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-800 dark:text-white">
                  Últimos Mensajes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <motion.form 
                  onSubmit={handleSendMessage}
                  className="flex gap-3 mb-6"
                >
                  <Input
                    placeholder="Escribe un mensaje..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700
                             focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400
                             rounded-xl"
                  />
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      type="submit"
                      className="rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500
                                hover:from-indigo-600 hover:to-purple-600 text-white"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </motion.div>
                </motion.form>

                <AnimatePresence>
                  {serverData.lastMessages.map((message, index) => (
                    <motion.div
                      key={message.id}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: -20, opacity: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Alert className="mb-3 bg-white/40 dark:bg-gray-800/40 backdrop-blur-sm
                                      border border-gray-200 dark:border-gray-700 rounded-xl">
                        <AlertDescription>
                          <div className="flex justify-between items-start">
                            <div>
                              <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                                {message.user}
                              </span>
                              <p className="mt-1 text-gray-600 dark:text-gray-300">
                                {message.content}
                              </p>
                            </div>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {message.timestamp}
                            </span>
                          </div>
                        </AlertDescription>
                      </Alert>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>

          {/* Admin Status */}
          <motion.div variants={itemVariants}>
            <Card className={cardStyle}>
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-800 dark:text-white">
                  Estado de Administradores
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {serverData.admins.map((admin, index) => (
                    <motion.div
                      key={admin.id}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4 rounded-xl bg-white/40 dark:bg-gray-800/40 backdrop-blur-sm
                               border border-gray-200 dark:border-gray-700
                               flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <motion.div
                          animate={{
                            scale: adminStatuses[admin.name] === 'online' ? [1, 1.2, 1] : 1
                          }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className={`w-3 h-3 rounded-full ${
                            adminStatuses[admin.name] === 'online'
                              ? 'bg-green-500'
                              : 'bg-gray-400'
                          }`}
                        />
                        <span className="font-medium text-gray-700 dark:text-gray-200">
                          {admin.name}
                        </span>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        adminStatuses[admin.name] === 'online'
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                      }`}>
                        {adminStatuses[admin.name]}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Activity Chart */}
        <motion.div variants={itemVariants}>
          <Card className={cardStyle}>
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-800 dark:text-white">
                Actividad del Servidor
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={serverData.activityData}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis 
                      dataKey="day" 
                      stroke={darkMode ? '#94a3b8' : '#475569'}
                    />
                    <YAxis
                      stroke={darkMode ? '#94a3b8' : '#475569'}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: darkMode ? 'rgba(17, 24, 39, 0.8)' : 'rgba(255, 255, 255, 0.8)',
                        borderRadius: '12px',
                        border: 'none',
                        backdropFilter: 'blur(12px)'
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="messages"
                      stroke={darkMode ? '#818cf8' : '#4f46e5'}
                      strokeWidth={2}
                      dot={{ fill: darkMode ? '#818cf8' : '#4f46e5', r: 4 }}
                      activeDot={{ r: 8, fill: darkMode ? '#818cf8' : '#4f46e5' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

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
                  className="text-indigo-600 dark:text-indigo-400 hover:text-purple-600 
                             dark:hover:text-purple-400 transition-colors duration-300"
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

export default DiscordDashboard;