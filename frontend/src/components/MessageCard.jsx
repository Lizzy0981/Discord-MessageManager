import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Clock, Trash2, MessageSquare } from 'lucide-react';

const MessageCard = ({ message, onDelete }) => {
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        throw new Error('Fecha inválida');
      }
      return date.toLocaleString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error('Error formateando fecha:', error);
      return 'Fecha no disponible';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ scale: 1.02 }}
      className="w-full"
    >
      <Card className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-sm
                      border border-gray-200 dark:border-gray-700 rounded-xl
                      transition-all duration-300 hover:shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-800 dark:text-white">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-indigo-500" />
              Mensaje Programado
            </div>
          </CardTitle>
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(message.id)}
              className="text-gray-400 hover:text-red-500 dark:text-gray-500 
                        dark:hover:text-red-400 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </motion.div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="text-gray-800 dark:text-white">{message.content}</p>
            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <Clock className="h-3 w-3" />
              <span>{formatDate(message.scheduledFor)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default MessageCard;