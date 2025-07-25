import { useCallback } from 'react';
import { ToastOptions } from 'react-hot-toast';
import {
  showNotification,
  showSuccess,
  showError,
  showWarning,
  showInfo,
  showLoading,
  updateLoading,
  showPromise,
  clearNotifications,
  showNotificationWithAction,
  showConfirm,
  NotificationType,
} from '@/util/notifications';

export const useNotifications = () => {
  const notify = useCallback((
    message: string,
    type: NotificationType = 'info',
    options?: ToastOptions
  ) => {
    return showNotification(message, type, options);
  }, []);

  const success = useCallback((message: string, options?: ToastOptions) => {
    return showSuccess(message, options);
  }, []);

  const error = useCallback((message: string, options?: ToastOptions) => {
    return showError(message, options);
  }, []);

  const warning = useCallback((message: string, options?: ToastOptions) => {
    return showWarning(message, options);
  }, []);

  const info = useCallback((message: string, options?: ToastOptions) => {
    return showInfo(message, options);
  }, []);

  const loading = useCallback((message: string = 'Cargando...') => {
    return showLoading(message);
  }, []);

  const update = useCallback((
    toastId: string,
    message: string,
    type: NotificationType = 'success'
  ) => {
    return updateLoading(toastId, message, type);
  }, []);

  const promise = useCallback(<T>(
    promise: Promise<T>,
    messages: {
      loading?: string;
      success?: string;
      error?: string;
    } = {}
  ) => {
    return showPromise(promise, messages);
  }, []);

  const clear = useCallback(() => {
    clearNotifications();
  }, []);

  const withAction = useCallback((
    message: string,
    action: () => void,
    actionText: string = 'Deshacer',
    type: NotificationType = 'info'
  ) => {
    return showNotificationWithAction(message, action, actionText, type);
  }, []);

  const confirm = useCallback((
    message: string,
    onConfirm: () => void,
    onCancel?: () => void,
    confirmText: string = 'Confirmar',
    cancelText: string = 'Cancelar'
  ) => {
    return showConfirm(message, onConfirm, onCancel, confirmText, cancelText);
  }, []);

  return {
    notify,
    success,
    error,
    warning,
    info,
    loading,
    update,
    promise,
    clear,
    withAction,
    confirm,
  };
}; 