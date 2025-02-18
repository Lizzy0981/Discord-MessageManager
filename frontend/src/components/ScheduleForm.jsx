import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Alert, AlertDescription } from "./ui/alert";
import { Send, Calendar } from 'lucide-react';

const ScheduleForm = ({ onSchedule }) => {
  const [message, setMessage] = useState('');
  const [scheduledFor, setScheduledFor] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      // Validaciones
      if (!message.trim()) {
        throw new Error('Por favor escribe un mensaje');
      }

      if (!scheduledFor) {
        throw new Error('Por favor selecciona una fecha y hora');
      }

      const scheduledDate = new Date(scheduledFor);
      const now = new Date();

      if (isNaN(scheduledDate.getTime())) {
        throw new Error('Fecha inválida');
      }

      if (scheduledDate < now) {
        throw new Error('La fecha debe ser futura');
      }

      // Intentar programar el mensaje
      await onSchedule({
        content: message,
        scheduledFor: scheduledDate.toISOString()
      });

      // Limpiar formulario solo si fue exitoso
      setMessage('');
      setScheduledFor('');
      
    } catch (err) {
      setError(err.message || 'Error al programar el mensaje');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Obtener fecha mínima (ahora)
  const getMinDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-bold">Programar Mensaje</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-2">
            <Input
              type="text"
              placeholder="Escribe tu mensaje..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full"
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <Input
                type="datetime-local"
                value={scheduledFor}
                onChange={(e) => setScheduledFor(e.target.value)}
                min={getMinDateTime()}
                className="w-full"
                disabled={isSubmitting}
              />
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full"
            disabled={isSubmitting}
          >
            <Send className={`h-4 w-4 mr-2 ${isSubmitting ? 'animate-spin' : ''}`} />
            {isSubmitting ? 'Programando...' : 'Programar Mensaje'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ScheduleForm;