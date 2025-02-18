import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Alert, AlertDescription } from "./ui/alert";
import MessageCard from './MessageCard';
import { AlertCircle } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const MessageList = ({ messages, onDelete, isLoading }) => {
  return (
    <Card className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-sm
                    border border-gray-200 dark:border-gray-700 rounded-xl">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-gray-800 dark:text-white">
          Mensajes Programados
        </CardTitle>
      </CardHeader>
      <CardContent>
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex justify-center py-8"
            >
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500" />
            </motion.div>
          ) : messages.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Alert className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-sm
                              border-gray-200 dark:border-gray-700 rounded-xl">
                <AlertCircle className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                <AlertDescription className="text-gray-600 dark:text-gray-300 ml-2">
                  No hay mensajes programados
                </AlertDescription>
              </Alert>
            </motion.div>
          ) : (
            <motion.div 
              key="list"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-4"
            >
              {messages.map(message => (
                <MessageCard
                  key={message.id}
                  message={message}
                  onDelete={onDelete}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
};

export default MessageList;