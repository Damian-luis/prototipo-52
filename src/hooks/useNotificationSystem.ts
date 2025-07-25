import { useCallback } from 'react';
import { useNotifications } from '@/context/NotificationContext';
import { showSuccess, showError, showInfo } from '@/util/notifications';

export const useNotificationSystem = () => {
  const { markAsRead, markAllAsRead } = useNotifications();

  // Función para manejar notificaciones de aplicaciones
  const handleJobApplication = useCallback(async (
    jobTitle: string,
    professionalName: string,
    applicationId: string
  ) => {
    try {
      // Aquí podrías hacer una llamada a la API para crear la notificación
      showInfo(`${professionalName} ha aplicado a tu oferta "${jobTitle}"`);
    } catch (error) {
      console.error('Error handling job application notification:', error);
    }
  }, []);

  // Función para manejar notificaciones de cambio de estado
  const handleApplicationStatusChange = useCallback(async (
    jobTitle: string,
    newStatus: string,
    companyName: string,
    applicationId: string
  ) => {
    try {
      const statusMessages = {
        'pending': 'está siendo revisada',
        'accepted': 'ha sido aceptada',
        'rejected': 'ha sido rechazada',
        'interview': 'ha sido seleccionada para entrevista',
        'hired': 'ha sido contratada',
      };

      const message = statusMessages[newStatus as keyof typeof statusMessages] || `ha cambiado a ${newStatus}`;
      showInfo(`Tu aplicación para "${jobTitle}" en ${companyName} ${message}`);
    } catch (error) {
      console.error('Error handling application status change notification:', error);
    }
  }, []);

  // Función para manejar notificaciones de nuevos trabajos
  const handleNewJobPosted = useCallback(async (
    jobTitle: string,
    companyName: string,
    jobId: string
  ) => {
    try {
      showInfo(`${companyName} ha publicado una nueva oferta: "${jobTitle}"`);
    } catch (error) {
      console.error('Error handling new job posted notification:', error);
    }
  }, []);

  // Función para manejar notificaciones de mensajes
  const handleNewMessage = useCallback(async (
    senderName: string,
    messagePreview: string,
    chatRoomId: string
  ) => {
    try {
      showInfo(`Nuevo mensaje de ${senderName}: ${messagePreview}`);
    } catch (error) {
      console.error('Error handling new message notification:', error);
    }
  }, []);

  // Función para manejar notificaciones de contratos
  const handleContractSigned = useCallback(async (
    contractTitle: string,
    contractId: string
  ) => {
    try {
      showSuccess(`El contrato "${contractTitle}" ha sido firmado exitosamente`);
    } catch (error) {
      console.error('Error handling contract signed notification:', error);
    }
  }, []);

  // Función para manejar notificaciones de pagos
  const handlePaymentReceived = useCallback(async (
    amount: number,
    currency: string,
    contractTitle: string,
    paymentId: string
  ) => {
    try {
      showSuccess(`Has recibido un pago de ${amount} ${currency} por el contrato "${contractTitle}"`);
    } catch (error) {
      console.error('Error handling payment received notification:', error);
    }
  }, []);

  // Función para manejar notificaciones de proyectos completados
  const handleProjectCompleted = useCallback(async (
    projectTitle: string,
    projectId: string
  ) => {
    try {
      showSuccess(`El proyecto "${projectTitle}" ha sido completado exitosamente`);
    } catch (error) {
      console.error('Error handling project completed notification:', error);
    }
  }, []);

  // Función para manejar notificaciones de evaluaciones
  const handleEvaluationReceived = useCallback(async (
    rating: number,
    companyName: string,
    projectTitle: string,
    evaluationId: string
  ) => {
    try {
      showInfo(`${companyName} te ha evaluado con ${rating}/5 estrellas por el proyecto "${projectTitle}"`);
    } catch (error) {
      console.error('Error handling evaluation received notification:', error);
    }
  }, []);

  // Función para marcar notificación como leída
  const handleMarkAsRead = useCallback(async (notificationId: string) => {
    try {
      await markAsRead(notificationId);
    } catch (error) {
      console.error('Error marking notification as read:', error);
      showError('Error al marcar notificación como leída');
    }
  }, [markAsRead]);

  // Función para marcar todas las notificaciones como leídas
  const handleMarkAllAsRead = useCallback(async () => {
    try {
      await markAllAsRead();
      showSuccess('Todas las notificaciones han sido marcadas como leídas');
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      showError('Error al marcar todas las notificaciones como leídas');
    }
  }, [markAllAsRead]);

  return {
    // Funciones de manejo de notificaciones específicas
    handleJobApplication,
    handleApplicationStatusChange,
    handleNewJobPosted,
    handleNewMessage,
    handleContractSigned,
    handlePaymentReceived,
    handleProjectCompleted,
    handleEvaluationReceived,
    
    // Funciones de gestión de notificaciones
    handleMarkAsRead,
    handleMarkAllAsRead,
  };
}; 