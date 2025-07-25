# Sistema de Notificaciones en Tiempo Real

Este documento describe el sistema completo de notificaciones en tiempo real implementado en la plataforma.

## Arquitectura del Sistema

### Backend (NestJS)
- **WebSocket Gateway**: `NotificationsGateway` - Maneja conexiones WebSocket
- **Servicio**: `NotificationsService` - Lógica de negocio para notificaciones
- **Controlador**: `NotificationsController` - Endpoints REST para notificaciones
- **Base de Datos**: Tabla `notifications` en Prisma

### Frontend (Next.js)
- **Context**: `NotificationContext` - Estado global de notificaciones
- **Componente**: `NotificationBell` - UI para mostrar notificaciones
- **Hook**: `useNotificationSystem` - Funciones de utilidad
- **Servicio**: `notificationsService` - Llamadas a la API

## Tipos de Notificaciones

### 1. Aplicaciones de Trabajo
- **Tipo**: `job_application`
- **Descripción**: Cuando un profesional aplica a una oferta
- **Destinatario**: Empresa
- **Mensaje**: `"{professionalName} ha aplicado a tu oferta "{jobTitle}"`

### 2. Nuevas Ofertas de Trabajo
- **Tipo**: `new_job_posted`
- **Descripción**: Cuando una empresa publica una nueva oferta
- **Destinatario**: Profesionales
- **Mensaje**: `"{companyName} ha publicado una nueva oferta: "{jobTitle}"`

### 3. Cambio de Estado de Aplicación
- **Tipo**: `application_status_changed`
- **Descripción**: Cuando cambia el estado de una aplicación
- **Destinatario**: Profesional
- **Mensaje**: `"Tu aplicación para "{jobTitle}" en {companyName} {status}"`

### 4. Mensajes
- **Tipos**: `new_message`, `company_message`, `professional_message`
- **Descripción**: Cuando se recibe un nuevo mensaje
- **Destinatario**: Usuario correspondiente
- **Mensaje**: `"{senderName}: {messagePreview}"`

### 5. Contratos
- **Tipo**: `contract_signed`
- **Descripción**: Cuando se firma un contrato
- **Destinatario**: Ambos (profesional y empresa)
- **Mensaje**: `"El contrato "{contractTitle}" ha sido firmado exitosamente"`

### 6. Pagos
- **Tipos**: `payment_received`, `payment_sent`
- **Descripción**: Cuando se realiza un pago
- **Destinatario**: Usuario correspondiente
- **Mensaje**: `"Has recibido/enviado un pago de {amount} {currency}"`

### 7. Proyectos
- **Tipo**: `project_completed`
- **Descripción**: Cuando se completa un proyecto
- **Destinatario**: Ambos (profesional y empresa)
- **Mensaje**: `"El proyecto "{projectTitle}" ha sido completado"`

### 8. Evaluaciones
- **Tipo**: `evaluation_received`
- **Descripción**: Cuando se recibe una evaluación
- **Destinatario**: Profesional
- **Mensaje**: `"{companyName} te ha evaluado con {rating}/5 estrellas"`

## Configuración del Backend

### 1. Instalación de Dependencias
```bash
npm install @nestjs/websockets @nestjs/platform-socket.io socket.io
```

### 2. Configuración del Gateway
El `NotificationsGateway` está configurado con:
- **Namespace**: `/notifications`
- **CORS**: Habilitado para el frontend
- **Autenticación**: JWT token requerido
- **Rooms**: Cada usuario tiene su propio room (`user-{userId}`)

### 3. Métodos del Servicio
```typescript
// Crear notificación básica
createNotification(data: {
  userId: string;
  type: string;
  title: string;
  message: string;
  metadata?: any;
})

// Métodos específicos
notifyJobApplication(empresaId, jobTitle, professionalName, applicationId)
notifyNewJobPosted(professionalIds, jobTitle, companyName, jobId)
notifyApplicationStatusChanged(professionalId, jobTitle, newStatus, companyName, applicationId)
notifyNewMessage(recipientId, senderName, messagePreview, chatRoomId)
notifyContractSigned(professionalId, empresaId, contractTitle, contractId)
notifyPaymentReceived(professionalId, amount, currency, contractTitle, paymentId)
notifyProjectCompleted(empresaId, professionalId, projectTitle, projectId)
notifyEvaluationReceived(professionalId, rating, companyName, projectTitle, evaluationId)
```

## Configuración del Frontend

### 1. Context Provider
El `NotificationProvider` debe estar incluido en el layout principal:

```typescript
// src/app/layout.tsx
import { NotificationProvider } from '@/context/NotificationContext';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <NotificationProvider>
          {children}
        </NotificationProvider>
      </body>
    </html>
  );
}
```

### 2. Componente de Notificaciones
El `NotificationBell` se incluye en el header:

```typescript
// src/layout/AppHeader.tsx
import NotificationBell from '@/components/ui/notifications/NotificationBell';

// En el JSX
<NotificationBell />
```

### 3. Hook de Utilidad
```typescript
import { useNotificationSystem } from '@/hooks/useNotificationSystem';

const MyComponent = () => {
  const {
    handleJobApplication,
    handleApplicationStatusChange,
    handleNewMessage,
    // ... otros métodos
  } = useNotificationSystem();

  // Usar los métodos según sea necesario
};
```

## Uso en Componentes

### 1. Aplicación de Trabajo
```typescript
// En el componente de aplicación
const handleSubmitApplication = async () => {
  try {
    const application = await applicationsService.createApplication(data);
    
    // Notificar a la empresa
    handleJobApplication(job.title, user.fullName, application.id);
    
    showSuccess('Aplicación enviada exitosamente');
  } catch (error) {
    showError('Error al enviar la aplicación');
  }
};
```

### 2. Cambio de Estado de Aplicación
```typescript
// En el panel de empresa
const handleStatusChange = async (applicationId: string, newStatus: string) => {
  try {
    await applicationsService.updateApplicationStatus(applicationId, newStatus);
    
    // Notificar al profesional
    handleApplicationStatusChange(
      application.job.title,
      newStatus,
      company.name,
      applicationId
    );
    
    showSuccess('Estado actualizado');
  } catch (error) {
    showError('Error al actualizar estado');
  }
};
```

### 3. Nuevo Mensaje
```typescript
// En el componente de chat
const handleSendMessage = async () => {
  try {
    const message = await chatService.sendMessage(messageData);
    
    // Notificar al destinatario
    handleNewMessage(
      user.fullName,
      message.content.substring(0, 50) + '...',
      chatRoomId
    );
  } catch (error) {
    showError('Error al enviar mensaje');
  }
};
```

## Integración con WebSockets

### 1. Conexión Automática
El contexto se conecta automáticamente cuando el usuario está autenticado:

```typescript
useEffect(() => {
  if (user) {
    connectToNotifications();
    loadNotifications();
    loadUnreadCount();
  } else {
    disconnectFromNotifications();
  }
}, [user]);
```

### 2. Eventos Escuchados
- `newNotification`: Nueva notificación recibida
- `unreadCount`: Actualización del contador de no leídas

### 3. Eventos Emitidos
- `markAsRead`: Marcar notificación como leída
- `markAllAsRead`: Marcar todas como leídas

## Personalización

### 1. Iconos por Tipo
```typescript
const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'job_application': return '📝';
    case 'new_job_posted': return '💼';
    case 'new_message': return '💬';
    case 'contract_signed': return '📋';
    case 'payment_received': return '💰';
    case 'project_completed': return '✅';
    case 'evaluation_received': return '⭐';
    default: return '🔔';
  }
};
```

### 2. Colores por Tipo
```typescript
const getNotificationType = (type: string) => {
  const typeMap = {
    'job_application': 'info',
    'new_job_posted': 'info',
    'application_status_changed': 'info',
    'new_message': 'info',
    'contract_signed': 'success',
    'payment_received': 'success',
    'project_completed': 'success',
    'evaluation_received': 'info',
  };
  return typeMap[type] || 'info';
};
```

## Troubleshooting

### 1. WebSocket no se conecta
- Verificar que el backend esté corriendo en el puerto correcto
- Verificar que el token JWT sea válido
- Revisar la configuración de CORS

### 2. Notificaciones no aparecen
- Verificar que el `NotificationProvider` esté incluido en el layout
- Verificar que el usuario esté autenticado
- Revisar la consola del navegador para errores

### 3. Notificaciones duplicadas
- Verificar que no haya múltiples conexiones WebSocket
- Revisar la lógica de deduplicación en el contexto

### 4. Performance
- Las notificaciones se limitan a 50 por usuario
- El contador de no leídas se actualiza automáticamente
- Las notificaciones antiguas se pueden paginar

## Próximas Mejoras

1. **Notificaciones Push**: Integración con Service Workers
2. **Filtros**: Filtrar notificaciones por tipo
3. **Configuración**: Permitir al usuario configurar qué notificaciones recibir
4. **Sonidos**: Sonidos personalizados por tipo de notificación
5. **Badges**: Badges en el navegador para notificaciones no leídas
6. **Email**: Notificaciones por email para eventos importantes
7. **SMS**: Notificaciones por SMS para eventos críticos 