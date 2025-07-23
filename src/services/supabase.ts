import { supabase } from '@/lib/supabase';
import {
  User,
  Empresa,
  Profesional,
  Especialista,
  Project,
  Task,
  Contract,
  Payment,
  Notification,
  Consultation,
  Interest,
  AIRecommendation
} from '@/types';

// ===== SERVICIOS DE USUARIOS =====

export const userService = {
  // Obtener usuario por ID
  async getUserById(id: string): Promise<User | null> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        // Si el usuario no existe en la tabla users, intentar obtenerlo de Auth
        if (error.code === 'PGRST116') {
          console.log('User not found in users table, checking Auth...');
          return null;
        }
        throw error;
      }
      return data as User;
    } catch (error) {
      console.error('Error getting user:', error);
      throw error;
    }
  },

  // Obtener usuario por email
  async getUserByEmail(email: string): Promise<User | null> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') {
          return null;
        }
        throw error;
      }
      return data as User;
    } catch (error) {
      console.error('Error getting user by email:', error);
      throw error;
    }
  },

  // Crear usuario desde Auth
  async createUserFromAuth(authUser: any): Promise<User> {
    try {
      const userData = {
        id: authUser.id,
        email: authUser.email || '',
        name: authUser.user_metadata?.name || 'Usuario',
        role: authUser.user_metadata?.role || 'profesional',
        is_active: true,
        created_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('users')
        .insert([userData])
        .select()
        .single();
      
      if (error) throw error;
      return data as User;
    } catch (error) {
      console.error('Error creating user from auth:', error);
      throw error;
    }
  },

  // Obtener todos los usuarios
  async getAllUsers(): Promise<User[]> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as User[];
    } catch (error) {
      console.error('Error getting users:', error);
      throw error;
    }
  },

  // Crear usuario
  async createUser(userData: Omit<User, 'id' | 'created_at'>): Promise<string> {
    try {
      const { data, error } = await supabase
        .from('users')
        .insert([{
          ...userData,
          created_at: new Date().toISOString(),
          is_active: true
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data.id;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

  // Actualizar usuario
  async updateUser(id: string, userData: Partial<User>): Promise<void> {
    try {
      const { error } = await supabase
        .from('users')
        .update({
          ...userData,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);
      
      if (error) throw error;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },

  // Eliminar usuario
  async deleteUser(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }
};

// ===== SERVICIOS DE PROYECTOS =====

export const projectService = {
  // Obtener proyecto por ID
  async getProjectById(id: string): Promise<Project | null> {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data as Project;
    } catch (error) {
      console.error('Error getting project:', error);
      throw error;
    }
  },

  // Obtener todos los proyectos
  async getAllProjects(): Promise<Project[]> {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Project[];
    } catch (error) {
      console.error('Error getting projects:', error);
      throw error;
    }
  },

  // Obtener proyectos por empresa
  async getProjectsByCompany(companyId: string): Promise<Project[]> {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('company_id', companyId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Project[];
    } catch (error) {
      console.error('Error getting projects by company:', error);
      throw error;
    }
  },

  // Crear proyecto
  async createProject(projectData: Omit<Project, 'id' | 'created_at' | 'updated_at'>): Promise<string> {
    try {
      const { data, error } = await supabase
        .from('projects')
        .insert([{
          ...projectData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data.id;
    } catch (error) {
      console.error('Error creating project:', error);
      throw error;
    }
  },

  // Actualizar proyecto
  async updateProject(id: string, projectData: Partial<Project>): Promise<void> {
    try {
      const { error } = await supabase
        .from('projects')
        .update({
          ...projectData,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);
      
      if (error) throw error;
    } catch (error) {
      console.error('Error updating project:', error);
      throw error;
    }
  },

  // Eliminar proyecto
  async deleteProject(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    } catch (error) {
      console.error('Error deleting project:', error);
      throw error;
    }
  }
};

// ===== SERVICIOS DE CONTRATOS =====

export const contractService = {
  // Obtener contrato por ID
  async getContractById(id: string): Promise<Contract | null> {
    try {
      const { data, error } = await supabase
        .from('contracts')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data as Contract;
    } catch (error) {
      console.error('Error getting contract:', error);
      throw error;
    }
  },

  // Obtener contratos por profesional
  async getContractsByProfessional(professionalId: string): Promise<Contract[]> {
    try {
      const { data, error } = await supabase
        .from('contracts')
        .select('*')
        .eq('professional_id', professionalId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Contract[];
    } catch (error) {
      console.error('Error getting contracts by professional:', error);
      throw error;
    }
  },

  // Obtener contratos por empresa
  async getContractsByCompany(companyId: string): Promise<Contract[]> {
    try {
      const { data, error } = await supabase
        .from('contracts')
        .select('*')
        .eq('company_id', companyId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Contract[];
    } catch (error) {
      console.error('Error getting contracts by company:', error);
      throw error;
    }
  },

  // Crear contrato
  async createContract(contractData: Omit<Contract, 'id' | 'created_at' | 'updated_at'>): Promise<string> {
    try {
      const { data, error } = await supabase
        .from('contracts')
        .insert([{
          ...contractData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data.id;
    } catch (error) {
      console.error('Error creating contract:', error);
      throw error;
    }
  },

  // Actualizar contrato
  async updateContract(id: string, contractData: Partial<Contract>): Promise<void> {
    try {
      const { error } = await supabase
        .from('contracts')
        .update({
          ...contractData,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);
      
      if (error) throw error;
    } catch (error) {
      console.error('Error updating contract:', error);
      throw error;
    }
  },

  // Firmar contrato
  async signContract(contractId: string, signature: any): Promise<void> {
    try {
      const { data: contract, error: fetchError } = await supabase
        .from('contracts')
        .select('*')
        .eq('id', contractId)
        .single();
      
      if (fetchError) throw fetchError;
      
      const signatures = contract.signatures || [];
      signatures.push({
        ...signature,
        signed_at: new Date().toISOString()
      });
      
      const { error } = await supabase
        .from('contracts')
        .update({
          signatures,
          updated_at: new Date().toISOString()
        })
        .eq('id', contractId);
      
      if (error) throw error;
    } catch (error) {
      console.error('Error signing contract:', error);
      throw error;
    }
  }
};

// ===== SERVICIOS DE PAGOS =====

export const paymentService = {
  // Obtener pagos por profesional
  async getPaymentsByProfessional(professionalId: string): Promise<Payment[]> {
    try {
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .eq('professional_id', professionalId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Payment[];
    } catch (error) {
      console.error('Error getting payments by professional:', error);
      throw error;
    }
  },

  // Obtener pagos por contrato
  async getPaymentsByContract(contractId: string): Promise<Payment[]> {
    try {
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .eq('contract_id', contractId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Payment[];
    } catch (error) {
      console.error('Error getting payments by contract:', error);
      throw error;
    }
  },

  // Crear pago
  async createPayment(paymentData: Omit<Payment, 'id' | 'created_at'>): Promise<string> {
    try {
      const { data, error } = await supabase
        .from('payments')
        .insert([{
          ...paymentData,
          created_at: new Date().toISOString()
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data.id;
    } catch (error) {
      console.error('Error creating payment:', error);
      throw error;
    }
  },

  // Actualizar estado de pago
  async updatePaymentStatus(id: string, status: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('payments')
        .update({
          status,
          processed_date: status === 'completed' ? new Date().toISOString() : null
        })
        .eq('id', id);
      
      if (error) throw error;
    } catch (error) {
      console.error('Error updating payment status:', error);
      throw error;
    }
  }
};

// ===== SERVICIOS DE NOTIFICACIONES =====

export const notificationService = {
  // Obtener notificaciones por usuario
  async getNotificationsByUser(userId: string): Promise<Notification[]> {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(50);
      
      if (error) throw error;
      return data as Notification[];
    } catch (error) {
      console.error('Error getting notifications:', error);
      throw error;
    }
  },

  // Crear notificación
  async createNotification(notificationData: Omit<Notification, 'id' | 'created_at'>): Promise<string> {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .insert([{
          ...notificationData,
          is_read: false,
          created_at: new Date().toISOString()
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data.id;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  },

  // Marcar como leída
  async markAsRead(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({
          is_read: true
        })
        .eq('id', id);
      
      if (error) throw error;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  }
};

// ===== SERVICIOS DE ASESORÍAS =====

export const consultationService = {
  // Obtener asesorías por profesional
  async getConsultationsByProfessional(professionalId: string): Promise<Consultation[]> {
    try {
      const { data, error } = await supabase
        .from('consultations')
        .select('*')
        .eq('professional_id', professionalId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Consultation[];
    } catch (error) {
      console.error('Error getting consultations:', error);
      throw error;
    }
  },

  // Crear asesoría
  async createConsultation(consultationData: Omit<Consultation, 'id' | 'created_at'>): Promise<string> {
    try {
      const { data, error } = await supabase
        .from('consultations')
        .insert([{
          ...consultationData,
          created_at: new Date().toISOString()
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data.id;
    } catch (error) {
      console.error('Error creating consultation:', error);
      throw error;
    }
  },

  // Actualizar asesoría
  async updateConsultation(id: string, consultationData: Partial<Consultation>): Promise<void> {
    try {
      const { error } = await supabase
        .from('consultations')
        .update(consultationData)
        .eq('id', id);
      
      if (error) throw error;
    } catch (error) {
      console.error('Error updating consultation:', error);
      throw error;
    }
  }
};

// ===== SERVICIOS DE IA Y MATCHING =====

export const aiService = {
  // Obtener intereses por profesional
  async getInterestsByProfessional(professionalId: string): Promise<Interest[]> {
    try {
      const { data, error } = await supabase
        .from('interests')
        .select('*')
        .eq('professional_id', professionalId)
        .order('score', { ascending: false });
      
      if (error) throw error;
      return data as Interest[];
    } catch (error) {
      console.error('Error getting interests:', error);
      throw error;
    }
  },

  // Crear interés
  async createInterest(interestData: Omit<Interest, 'id' | 'created_at'>): Promise<string> {
    try {
      const { data, error } = await supabase
        .from('interests')
        .insert([{
          ...interestData,
          created_at: new Date().toISOString()
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data.id;
    } catch (error) {
      console.error('Error creating interest:', error);
      throw error;
    }
  },

  // Obtener recomendaciones de IA
  async getAIRecommendations(userId: string): Promise<AIRecommendation[]> {
    try {
      const { data, error } = await supabase
        .from('ai_recommendations')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as AIRecommendation[];
    } catch (error) {
      console.error('Error getting AI recommendations:', error);
      throw error;
    }
  },

  // Crear recomendación de IA
  async createAIRecommendation(recommendationData: Omit<AIRecommendation, 'id' | 'created_at'>): Promise<string> {
    try {
      const { data, error } = await supabase
        .from('ai_recommendations')
        .insert([{
          ...recommendationData,
          created_at: new Date().toISOString()
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data.id;
    } catch (error) {
      console.error('Error creating AI recommendation:', error);
      throw error;
    }
  }
};

// ===== SERVICIO DE WEBHOOKS =====

export const webhookService = {
  // Enviar datos a webhook de n8n
  async sendToWebhook(endpoint: string, data: any): Promise<void> {
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error(`Webhook failed: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error sending webhook:', error);
      throw error;
    }
  }
}; 

// Servicios de Soporte
export const supportService = {
  // Crear ticket de soporte
  async createTicket(ticketData: {
    user_id: string;
    user_name: string;
    user_email: string;
    subject: string;
    description: string;
    category: 'technical' | 'billing' | 'account' | 'contract' | 'other';
    priority: 'low' | 'medium' | 'high' | 'urgent';
  }) {
    try {
      const { data, error } = await supabase
        .from('support_tickets')
        .insert([ticketData])
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error creating support ticket:', error);
      return { success: false, error };
    }
  },

  // Obtener tickets por usuario
  async getTicketsByUser(userId: string) {
    try {
      const { data, error } = await supabase
        .from('support_tickets')
        .select(`
          *,
          ticket_messages(*)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error getting tickets by user:', error);
      return { success: false, error };
    }
  },

  // Obtener todos los tickets (para admins)
  async getAllTickets() {
    try {
      const { data, error } = await supabase
        .from('support_tickets')
        .select(`
          *,
          ticket_messages(*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error getting all tickets:', error);
      return { success: false, error };
    }
  },

  // Actualizar estado del ticket
  async updateTicketStatus(ticketId: string, status: string, assignedTo?: string, assignedToName?: string) {
    try {
      const updateData: any = { 
        status,
        updated_at: new Date().toISOString()
      };

      if (assignedTo) {
        updateData.assigned_to = assignedTo;
        updateData.assigned_to_name = assignedToName;
      }

      if (status === 'resolved') {
        updateData.resolved_at = new Date().toISOString();
      }

      const { data, error } = await supabase
        .from('support_tickets')
        .update(updateData)
        .eq('id', ticketId)
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error updating ticket status:', error);
      return { success: false, error };
    }
  },

  // Agregar mensaje al ticket
  async addMessage(messageData: {
    ticket_id: string;
    user_id: string;
    user_name: string;
    message: string;
    is_internal?: boolean;
  }) {
    try {
      const { data, error } = await supabase
        .from('ticket_messages')
        .insert([messageData])
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error adding message:', error);
      return { success: false, error };
    }
  },

  // Crear notificación
  async createNotification(notificationData: {
    type: 'ticket_created' | 'ticket_updated' | 'ticket_resolved' | 'new_message';
    ticket_id: string;
    user_id: string;
    message: string;
  }) {
    try {
      const { data, error } = await supabase
        .from('support_notifications')
        .insert([notificationData])
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error creating notification:', error);
      return { success: false, error };
    }
  },

  // Obtener notificaciones por usuario
  async getNotificationsByUser(userId: string) {
    try {
      const { data, error } = await supabase
        .from('support_notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error getting notifications:', error);
      return { success: false, error };
    }
  },

  // Marcar notificación como leída
  async markNotificationAsRead(notificationId: string) {
    try {
      const { data, error } = await supabase
        .from('support_notifications')
        .update({ is_read: true })
        .eq('id', notificationId)
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error marking notification as read:', error);
      return { success: false, error };
    }
  }
}; 

// Servicios de Talento
export const talentService = {
  // Crear vacante
  async createVacancy(vacancyData: {
    title: string;
    description: string;
    requirements: string[];
    skills: string[];
    experience_required: number;
    salary_range: { min: number; max: number; currency: string };
    location: string;
    type: 'full-time' | 'part-time' | 'contract' | 'freelance';
    status: 'open' | 'closed' | 'draft';
    created_by: string;
  }) {
    try {
      const { data, error } = await supabase
        .from('job_vacancies')
        .insert([vacancyData])
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error creating vacancy:', error);
      return { success: false, error };
    }
  },

  // Obtener todas las vacantes
  async getAllVacancies() {
    try {
      const { data, error } = await supabase
        .from('job_vacancies')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error getting vacancies:', error);
      return { success: false, error };
    }
  },

  // Obtener vacantes por empresa
  async getVacanciesByCompany(companyId: string) {
    try {
      const { data, error } = await supabase
        .from('job_vacancies')
        .select('*')
        .eq('created_by', companyId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error getting vacancies by company:', error);
      return { success: false, error };
    }
  },

  // Actualizar vacante
  async updateVacancy(vacancyId: string, updateData: any) {
    try {
      const { data, error } = await supabase
        .from('job_vacancies')
        .update(updateData)
        .eq('id', vacancyId)
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error updating vacancy:', error);
      return { success: false, error };
    }
  },

  // Eliminar vacante
  async deleteVacancy(vacancyId: string) {
    try {
      const { error } = await supabase
        .from('job_vacancies')
        .delete()
        .eq('id', vacancyId);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error deleting vacancy:', error);
      return { success: false, error };
    }
  },

  // Aplicar a trabajo
  async applyToJob(applicationData: {
    job_id: string;
    freelancer_id: string;
    freelancer_name: string;
    freelancer_email: string;
    cover_letter: string;
  }) {
    try {
      const { data, error } = await supabase
        .from('job_applications')
        .insert([applicationData])
        .select()
        .single();

      if (error) throw error;

      // Incrementar contador de aplicaciones
      await supabase
        .from('job_vacancies')
        .update({ applications_count: data.applications_count + 1 })
        .eq('id', applicationData.job_id);

      return { success: true, data };
    } catch (error) {
      console.error('Error applying to job:', error);
      return { success: false, error };
    }
  },

  // Obtener aplicaciones por trabajo
  async getApplicationsByJob(jobId: string) {
    try {
      const { data, error } = await supabase
        .from('job_applications')
        .select('*')
        .eq('job_id', jobId)
        .order('applied_at', { ascending: false });

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error getting applications by job:', error);
      return { success: false, error };
    }
  },

  // Obtener aplicaciones por freelancer
  async getApplicationsByFreelancer(freelancerId: string) {
    try {
      const { data, error } = await supabase
        .from('job_applications')
        .select('*')
        .eq('freelancer_id', freelancerId)
        .order('applied_at', { ascending: false });

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error getting applications by freelancer:', error);
      return { success: false, error };
    }
  },

  // Actualizar estado de aplicación
  async updateApplicationStatus(applicationId: string, status: string) {
    try {
      const { data, error } = await supabase
        .from('job_applications')
        .update({ status })
        .eq('id', applicationId)
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error updating application status:', error);
      return { success: false, error };
    }
  },

  // Crear evaluación
  async createEvaluation(evaluationData: {
    freelancer_id: string;
    evaluator_id: string;
    type: 'initial' | 'periodic' | 'project';
    scores: {
      technical: number;
      communication: number;
      punctuality: number;
      quality: number;
      teamwork: number;
    };
    overall_score: number;
    comments: string;
    recommendations?: string;
  }) {
    try {
      const { data, error } = await supabase
        .from('evaluations')
        .insert([evaluationData])
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error creating evaluation:', error);
      return { success: false, error };
    }
  },

  // Obtener evaluaciones por freelancer
  async getEvaluationsByFreelancer(freelancerId: string) {
    try {
      const { data, error } = await supabase
        .from('evaluations')
        .select('*')
        .eq('freelancer_id', freelancerId)
        .order('date', { ascending: false });

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error getting evaluations by freelancer:', error);
      return { success: false, error };
    }
  },

  // Obtener freelancers recomendados
  async getRecommendedFreelancers(jobId: string) {
    try {
      // Obtener la vacante para ver los skills requeridos
      const { data: vacancy, error: vacancyError } = await supabase
        .from('job_vacancies')
        .select('skills')
        .eq('id', jobId)
        .single();

      if (vacancyError) throw vacancyError;

      // Buscar usuarios con skills similares
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('role', 'profesional')
        .eq('is_active', true)
        .overlaps('skills', vacancy.skills);

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error getting recommended freelancers:', error);
      return { success: false, error };
    }
  }
}; 