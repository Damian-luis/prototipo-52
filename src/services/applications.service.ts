import api from '@/util/axios';

export interface Application {
  id: string;
  coverLetter?: string;
  proposedRate?: number;
  estimatedDuration?: string;
  status: 'PENDING' | 'REVIEWING' | 'INTERVIEWING' | 'ACCEPTED' | 'REJECTED' | 'WITHDRAWN';
  appliedAt: string;
  updatedAt: string;
  jobId: string;
  jobTitle: string;
  professionalId: string;
  professionalName: string;
  professionalEmail: string;
}

export interface CreateApplicationData {
  jobId: string;
  coverLetter?: string;
  proposedRate?: number;
  estimatedDuration?: string;
}

export interface UpdateApplicationData {
  coverLetter?: string;
  proposedRate?: number;
  estimatedDuration?: string;
  status?: 'PENDING' | 'REVIEWING' | 'INTERVIEWING' | 'ACCEPTED' | 'REJECTED' | 'WITHDRAWN';
}

export const applicationsService = {
  // Get all applications
  async getAllApplications(): Promise<Application[]> {
    const response = await api.get('/applications');
    return response.data;
  },

  // Get application by ID
  async getApplicationById(id: string): Promise<Application> {
    const response = await api.get(`/applications/${id}`);
    return response.data;
  },

  // Create application (professional only)
  async createApplication(data: CreateApplicationData): Promise<Application> {
    const response = await api.post('/applications', data);
    return response.data;
  },

  // Update application
  async updateApplication(id: string, data: UpdateApplicationData): Promise<Application> {
    const response = await api.patch(`/applications/${id}`, data);
    return response.data;
  },

  // Get applications by job
  async getApplicationsByJob(jobId: string): Promise<Application[]> {
    const response = await api.get(`/applications/job/${jobId}`);
    return response.data;
  },

  // Get applications by professional
  async getApplicationsByProfessional(): Promise<Application[]> {
    const response = await api.get('/applications/professional');
    return response.data;
  },

  // Get application stats for professional
  async getApplicationStats(): Promise<any> {
    const response = await api.get('/applications/professional/stats');
    return response.data;
  },
}; 