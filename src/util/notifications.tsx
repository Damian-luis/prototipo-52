import React from 'react';
import toast, { ToastOptions } from 'react-hot-toast';

// Tipos de notificación
export type NotificationType = 'success' | 'error' | 'warning' | 'info';

// Configuración por defecto para toast
const defaultToastOptions: ToastOptions = {
  duration: 4000,
  position: 'top-right',
  style: {
    background: '#363636',
    color: '#fff',
    borderRadius: '8px',
    padding: '12px 16px',
    fontSize: '14px',
    fontWeight: '500',
  },
};

// Configuraciones específicas por tipo
const toastConfigs = {
  success: {
    ...defaultToastOptions,
    icon: '✅',
    style: {
      ...defaultToastOptions.style,
      background: '#10B981',
      border: '1px solid #059669',
    },
  },
  error: {
    ...defaultToastOptions,
    icon: '❌',
    style: {
      ...defaultToastOptions.style,
      background: '#EF4444',
      border: '1px solid #DC2626',
    },
  },
  warning: {
    ...defaultToastOptions,
    icon: '⚠️',
    style: {
      ...defaultToastOptions.style,
      background: '#F59E0B',
      border: '1px solid #D97706',
    },
  },
  info: {
    ...defaultToastOptions,
    icon: 'ℹ️',
    style: {
      ...defaultToastOptions.style,
      background: '#3B82F6',
      border: '1px solid #2563EB',
    },
  },
};

// Función principal para mostrar notificaciones toast
export const showNotification = (
  message: string,
  type: NotificationType = 'info',
  options?: ToastOptions
) => {
  const config = { ...toastConfigs[type], ...options };
  
  switch (type) {
    case 'success':
      return toast.success(message, config);
    case 'error':
      return toast.error(message, config);
    case 'warning':
      return toast(message, { ...config, icon: '⚠️' });
    case 'info':
      return toast(message, { ...config, icon: 'ℹ️' });
    default:
      return toast(message, config);
  }
};

// Funciones específicas para cada tipo
export const showSuccess = (message: string, options?: ToastOptions) => {
  return showNotification(message, 'success', options);
};

export const showError = (message: string, options?: ToastOptions) => {
  return showNotification(message, 'error', options);
};

export const showWarning = (message: string, options?: ToastOptions) => {
  return showNotification(message, 'warning', options);
};

export const showInfo = (message: string, options?: ToastOptions) => {
  return showNotification(message, 'info', options);
};

// Función para mostrar notificaciones de carga
export const showLoading = (message: string = 'Cargando...') => {
  return toast.loading(message, {
    ...defaultToastOptions,
    style: {
      ...defaultToastOptions.style,
      background: '#6B7280',
    },
  });
};

// Función para actualizar una notificación de carga
export const updateLoading = (toastId: string, message: string, type: NotificationType = 'success') => {
  toast.dismiss(toastId);
  return showNotification(message, type);
};

// Función para mostrar notificaciones promesas
export const showPromise = (
  promise: Promise<any>,
  {
    loading = 'Cargando...',
    success = 'Operación completada',
    error = 'Error en la operación',
  }: {
    loading?: string;
    success?: string;
    error?: string;
  } = {}
) => {
  return toast.promise(
    promise,
    {
      loading,
      success,
      error,
    },
    defaultToastOptions
  );
};

// Función para limpiar todas las notificaciones
export const clearNotifications = () => {
  toast.dismiss();
};

// Función para mostrar notificaciones con acciones
export const showNotificationWithAction = (
  message: string,
  action: () => void,
  actionText: string = 'Deshacer',
  type: NotificationType = 'info'
) => {
  const toastId = showNotification(message, type, {
    ...defaultToastOptions,
    duration: 6000,
  });

  // Agregar botón de acción usando toast con JSX simple
  toast(
    (t) => (
      <div className="flex items-center gap-2">
        <span>{message}</span>
        <button
          onClick={() => {
            action();
            toast.dismiss(t.id);
          }}
          className="ml-2 px-2 py-1 text-xs bg-white/20 rounded hover:bg-white/30 transition-colors"
        >
          {actionText}
        </button>
      </div>
    ),
    {
      ...toastConfigs[type],
      duration: 6000,
    }
  );

  return toastId;
};

// Función para mostrar confirmaciones
export const showConfirm = (
  message: string,
  onConfirm: () => void,
  onCancel?: () => void,
  confirmText: string = 'Confirmar',
  cancelText: string = 'Cancelar'
) => {
  toast(
    (t) => (
      <div className="flex flex-col gap-3">
        <span>{message}</span>
        <div className="flex gap-2">
          <button
            onClick={() => {
              onConfirm();
              toast.dismiss(t.id);
            }}
            className="px-3 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          >
            {confirmText}
          </button>
          <button
            onClick={() => {
              onCancel?.();
              toast.dismiss(t.id);
            }}
            className="px-3 py-1 text-xs bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
          >
            {cancelText}
          </button>
        </div>
      </div>
    ),
    {
      ...defaultToastOptions,
      duration: 0, // No se cierra automáticamente
      style: {
        ...defaultToastOptions.style,
        background: '#1F2937',
        minWidth: '300px',
      },
    }
  );
};

// Exportar toast para uso directo si es necesario
export { toast }; 