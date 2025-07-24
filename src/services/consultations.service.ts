import api from '@/util/axios';

export interface Consultation {
  id: string;
  title: string;
  description: string;
  type: 'WELLNESS' | 'CAREER_DEVELOPMENT' | 'WORK_LIFE_BALANCE' | 'STRESS_MANAGEMENT' | 'SKILL_DEVELOPMENT' | 'OTHER';
  status: 'PENDING' | 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  scheduledAt?: string;
  completedAt?: string;
  notes?: string;
  rating?: number;
  feedback?: string;
  createdAt: string;
  updatedAt: string;
  professionalId: string;
  professionalName: string;
  specialistId: string;
  specialistName: string;
}

export interface CreateConsultationData {
  title: string;
  description: string;
  type: 'WELLNESS' | 'CAREER_DEVELOPMENT' | 'WORK_LIFE_BALANCE' | 'STRESS_MANAGEMENT' | 'SKILL_DEVELOPMENT' | 'OTHER';
  scheduledAt?: string;
}

export interface UpdateConsultationData {
  title?: string;
  description?: string;
  type?: 'WELLNESS' | 'CAREER_DEVELOPMENT' | 'WORK_LIFE_BALANCE' | 'STRESS_MANAGEMENT' | 'SKILL_DEVELOPMENT' | 'OTHER';
  status?: 'PENDING' | 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  scheduledAt?: string;
  completedAt?: string;
  notes?: string;
  rating?: number;
  feedback?: string;
}

export const consultationsService = {
  // Get all consultations
  async getAllConsultations(): Promise<Consultation[]> {
    const response = await api.get('/consultations');
    return response.data;
  },

  // Get consultation by ID
  async getConsultationById(id: string): Promise<Consultation> {
    const response = await api.get(`/consultations/${id}`);
    return response.data;
  },

  // Create consultation (professional only)
  async createConsultation(data: CreateConsultationData): Promise<Consultation> {
    const response = await api.post('/consultations', data);
    return response.data;
  },

  // Update consultation
  async updateConsultation(id: string, data: UpdateConsultationData): Promise<Consultation> {
    const response = await api.patch(`/consultations/${id}`, data);
    return response.data;
  },

  // Delete consultation
  async deleteConsultation(id: string): Promise<void> {
    await api.delete(`/consultations/${id}`);
  },

  // Get consultations by professional
  async getConsultationsByProfessional(): Promise<Consultation[]> {
    const response = await api.get('/consultations/professional');
    return response.data;
  },

  // Get consultations by specialist
  async getConsultationsBySpecialist(): Promise<Consultation[]> {
    const response = await api.get('/consultations/specialist');
    return response.data;
  },

  // Get consultation stats for professional
  async getConsultationStats(): Promise<any> {
    const response = await api.get('/consultations/professional/stats');
    return response.data;
  },

  // Get consultation stats for specialist
  async getSpecialistStats(): Promise<any> {
    const response = await api.get('/consultations/specialist/stats');
    return response.data;
  },

  // Get pending consultations
  async getPendingConsultations(): Promise<Consultation[]> {
    const response = await api.get('/consultations/pending');
    return response.data;
  },

  // Assign specialist to consultation
  async assignSpecialist(consultationId: string, specialistId: string): Promise<Consultation> {
    const response = await api.patch(`/consultations/${consultationId}/assign`, { specialistId });
    return response.data;
  },

  // Update consultation status
  async updateConsultationStatus(consultationId: string, status: string): Promise<Consultation> {
    const response = await api.patch(`/consultations/${consultationId}/status`, { status });
    return response.data;
  },

  // Add notes to consultation
  async addNotes(consultationId: string, notes: string): Promise<Consultation> {
    const response = await api.patch(`/consultations/${consultationId}/notes`, { notes });
    return response.data;
  },

  // Add rating to consultation
  async addRating(consultationId: string, rating: number, feedback: string): Promise<Consultation> {
    const response = await api.patch(`/consultations/${consultationId}/rating`, { rating, feedback });
    return response.data;
  },
}; 