import { Injectable, forwardRef, Inject } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsGateway } from './notifications.gateway';

@Injectable()
export class NotificationsService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(forwardRef(() => NotificationsGateway))
    private readonly notificationsGateway: NotificationsGateway,
  ) {}

  async createNotification(data: {
    userId: string;
    type: string;
    title: string;
    message: string;
    metadata?: any;
  }) {
    console.log(`📢 NotificationsService: Creating notification for user ${data.userId}`, data);
    
    const notification = await this.prisma.notification.create({
      data: {
        userId: data.userId,
        type: data.type,
        title: data.title,
        message: data.message,
        metadata: data.metadata || {},
      },
    });

    console.log(`✅ NotificationsService: Notification created with ID ${notification.id}`);

    // Emitir notificación en tiempo real
    console.log(`📡 NotificationsService: Emitting notification via websocket to user ${data.userId}`);
    this.notificationsGateway.sendNotificationToUser(data.userId, notification);

    return notification;
  }

  async getUserNotifications(userId: string) {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }

  async markAsRead(notificationId: string, userId: string) {
    return this.prisma.notification.update({
      where: {
        id: notificationId,
        userId,
      },
      data: { read: true },
    });
  }

  async markAllAsRead(userId: string) {
    return this.prisma.notification.updateMany({
      where: {
        userId,
        read: false,
      },
      data: { read: true },
    });
  }

  async getUnreadCount(userId: string) {
    return this.prisma.notification.count({
      where: {
        userId,
        read: false,
      },
    });
  }

  // ===== NOTIFICACIONES ESPECÍFICAS PARA LA PLATAFORMA =====

  // Notificación cuando un profesional aplica a una oferta
  async notifyJobApplication(empresaId: string, jobTitle: string, professionalName: string, applicationId: string) {
    await this.createNotification({
      userId: empresaId,
      type: 'job_application',
      title: 'Nueva aplicación recibida',
      message: `${professionalName} ha aplicado a tu oferta "${jobTitle}"`,
      metadata: { 
        jobTitle, 
        professionalName, 
        applicationId,
        action: 'view_application'
      },
    });
  }

  // Notificación cuando una empresa publica una nueva oferta (para profesionales)
  async notifyNewJobPosted(professionalIds: string[], jobTitle: string, companyName: string, jobId: string) {
    for (const professionalId of professionalIds) {
      await this.createNotification({
        userId: professionalId,
        type: 'new_job_posted',
        title: 'Nueva oferta de trabajo',
        message: `${companyName} ha publicado una nueva oferta: "${jobTitle}"`,
        metadata: { 
          jobTitle, 
          companyName, 
          jobId,
          action: 'view_job'
        },
      });
    }
  }

  // Notificación cuando cambia el estado de una aplicación
  async notifyApplicationStatusChanged(professionalId: string, jobTitle: string, newStatus: string, companyName: string, applicationId: string) {
    const statusMessages: Record<string, string> = {
      'pending': 'está siendo revisada',
      'accepted': 'ha sido aceptada',
      'rejected': 'ha sido rechazada',
      'interview': 'ha sido seleccionada para entrevista',
      'hired': 'ha sido contratada',
    };

    const message = statusMessages[newStatus] || `ha cambiado a ${newStatus}`;

    await this.createNotification({
      userId: professionalId,
      type: 'application_status_changed',
      title: 'Estado de aplicación actualizado',
      message: `Tu aplicación para "${jobTitle}" en ${companyName} ${message}`,
      metadata: { 
        jobTitle, 
        companyName, 
        newStatus, 
        applicationId,
        action: 'view_application'
      },
    });
  }

  // Notificación cuando se recibe un mensaje
  async notifyNewMessage(recipientId: string, senderName: string, messagePreview: string, chatRoomId: string) {
    await this.createNotification({
      userId: recipientId,
      type: 'new_message',
      title: 'Nuevo mensaje',
      message: `${senderName}: ${messagePreview}`,
      metadata: { 
        senderName, 
        messagePreview, 
        chatRoomId,
        action: 'open_chat'
      },
    });
  }

  // Notificación cuando una empresa envía mensaje a un profesional
  async notifyCompanyMessage(professionalId: string, companyName: string, messagePreview: string, chatRoomId: string) {
    await this.createNotification({
      userId: professionalId,
      type: 'company_message',
      title: 'Mensaje de empresa',
      message: `${companyName}: ${messagePreview}`,
      metadata: { 
        companyName, 
        messagePreview, 
        chatRoomId,
        action: 'open_chat'
      },
    });
  }

  // Notificación cuando un profesional envía mensaje a una empresa
  async notifyProfessionalMessage(empresaId: string, professionalName: string, messagePreview: string, chatRoomId: string) {
    await this.createNotification({
      userId: empresaId,
      type: 'professional_message',
      title: 'Mensaje de profesional',
      message: `${professionalName}: ${messagePreview}`,
      metadata: { 
        professionalName, 
        messagePreview, 
        chatRoomId,
        action: 'open_chat'
      },
    });
  }

  // Notificación de contrato firmado
  async notifyContractSigned(professionalId: string, empresaId: string, contractTitle: string, contractId: string) {
    // Notificar al profesional
    await this.createNotification({
      userId: professionalId,
      type: 'contract_signed',
      title: 'Contrato firmado',
      message: `El contrato "${contractTitle}" ha sido firmado exitosamente`,
      metadata: { 
        contractTitle, 
        contractId,
        action: 'view_contract'
      },
    });

    // Notificar a la empresa
    await this.createNotification({
      userId: empresaId,
      type: 'contract_signed',
      title: 'Contrato firmado',
      message: `El contrato "${contractTitle}" ha sido firmado exitosamente`,
      metadata: { 
        contractTitle, 
        contractId,
        action: 'view_contract'
      },
    });
  }

  // Notificación de pago realizado
  async notifyPaymentReceived(professionalId: string, amount: number, currency: string, contractTitle: string, paymentId: string) {
    await this.createNotification({
      userId: professionalId,
      type: 'payment_received',
      title: 'Pago recibido',
      message: `Has recibido un pago de ${amount} ${currency} por el contrato "${contractTitle}"`,
      metadata: { 
        amount, 
        currency, 
        contractTitle, 
        paymentId,
        action: 'view_payment'
      },
    });
  }

  // Notificación de pago enviado
  async notifyPaymentSent(empresaId: string, amount: number, currency: string, professionalName: string, contractTitle: string, paymentId: string) {
    await this.createNotification({
      userId: empresaId,
      type: 'payment_sent',
      title: 'Pago enviado',
      message: `Has enviado un pago de ${amount} ${currency} a ${professionalName} por el contrato "${contractTitle}"`,
      metadata: { 
        amount, 
        currency, 
        professionalName, 
        contractTitle, 
        paymentId,
        action: 'view_payment'
      },
    });
  }

  // Notificación de proyecto completado
  async notifyProjectCompleted(empresaId: string, professionalId: string, projectTitle: string, projectId: string) {
    // Notificar a la empresa
    await this.createNotification({
      userId: empresaId,
      type: 'project_completed',
      title: 'Proyecto completado',
      message: `El proyecto "${projectTitle}" ha sido marcado como completado`,
      metadata: { 
        projectTitle, 
        projectId,
        action: 'view_project'
      },
    });

    // Notificar al profesional
    await this.createNotification({
      userId: professionalId,
      type: 'project_completed',
      title: 'Proyecto completado',
      message: `Has completado el proyecto "${projectTitle}" exitosamente`,
      metadata: { 
        projectTitle, 
        projectId,
        action: 'view_project'
      },
    });
  }

  // Notificación de evaluación recibida
  async notifyEvaluationReceived(professionalId: string, rating: number, companyName: string, projectTitle: string, evaluationId: string) {
    await this.createNotification({
      userId: professionalId,
      type: 'evaluation_received',
      title: 'Evaluación recibida',
      message: `${companyName} te ha evaluado con ${rating}/5 estrellas por el proyecto "${projectTitle}"`,
      metadata: { 
        rating, 
        companyName, 
        projectTitle, 
        evaluationId,
        action: 'view_evaluation'
      },
    });
  }

  // ===== MÉTODOS EXISTENTES (MANTENER COMPATIBILIDAD) =====

  // Métodos para enviar notificaciones específicas
  async notifyUserAddedToProject(userId: string, projectName: string, addedByName: string) {
    await this.createNotification({
      userId,
      type: 'project_added',
      title: 'Agregado a proyecto',
      message: `${addedByName} te ha agregado al proyecto "${projectName}"`,
      metadata: { projectName, addedBy: addedByName },
    });
  }

  async notifyTaskAssigned(userId: string, taskTitle: string, taskKey: string, assignedByName: string) {
    await this.createNotification({
      userId,
      type: 'task_assigned',
      title: 'Tarea asignada',
      message: `${assignedByName} te ha asignado la tarea ${taskKey}: "${taskTitle}"`,
      metadata: { taskTitle, taskKey, assignedBy: assignedByName },
    });
  }

  async notifyUserMentioned(userId: string, taskKey: string, taskTitle: string, mentionedBy: string, commentContent: string) {
    await this.createNotification({
      userId,
      type: 'mention_comment',
      title: 'Mención en comentario',
      message: `${mentionedBy} te mencionó en ${taskKey}: "${taskTitle}"`,
      metadata: { taskKey, taskTitle, mentionedBy, commentContent },
    });
  }

  async notifyInvitationAccepted(scrumMasterId: string, userName: string, workspaceName: string) {
    await this.createNotification({
      userId: scrumMasterId,
      type: 'invitation_accepted',
      title: 'Invitación aceptada',
      message: `${userName} ha aceptado la invitación al workspace "${workspaceName}"`,
      metadata: { userName, workspaceName },
    });
  }

  async notifyTaskStatusChanged(scrumMasterId: string, taskKey: string, taskTitle: string, fromStatus: string, toStatus: string, changedBy: string) {
    await this.createNotification({
      userId: scrumMasterId,
      type: 'task_status_changed',
      title: 'Estado de tarea cambiado',
      message: `${changedBy} cambió ${taskKey} de "${fromStatus}" a "${toStatus}"`,
      metadata: { taskKey, taskTitle, fromStatus, toStatus, changedBy },
    });
  }
} 