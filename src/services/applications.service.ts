import api from '@/util/axios';
import { Job } from './jobs.service';

export interface Application {
  id: string;
  coverLetter?: string;
  proposedRate?: number;
  estimatedDuration?: string;
  status: 'PENDING' | 'REVIEWING' | 'INTERVIEWING' | 'ACCEPTED' | 'REJECTED' | 'WITHDRAWN';
  appliedAt: string;
  updatedAt: string;
  jobId: string;
  professionalId: string;
  job?: Job;
  professional?: any;
  isViewed?: boolean;
  viewedAt?: string;
}

export interface ApplicationView {
  id: string;
  viewedAt: string;
  companyId: string;
  company?: {
    id: string;
    fullName: string;
    avatar?: string;
  };
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
  status?: string;
}

export const applicationsService = {
  // Create application
  async createApplication(data: CreateApplicationData): Promise<Application> {
    const response = await api.post('/applications', data);
    return response.data;
  },

  // Get applications by professional
  async getMyApplications(): Promise<Application[]> {
    const response = await api.get('/applications/professional');
    return response.data;
  },

  // Get application by ID
  async getApplicationById(id: string): Promise<Application> {
    const response = await api.get(`/applications/${id}`);
    return response.data;
  },

  // Update application
  async updateApplication(id: string, data: UpdateApplicationData): Promise<Application> {
    const response = await api.patch(`/applications/${id}`, data);
    return response.data;
  },

  // Withdraw application
  async withdrawApplication(id: string): Promise<void> {
    await api.delete(`/applications/${id}`);
  },

  // Get application stats
  async getApplicationStats(): Promise<any> {
    const response = await api.get('/applications/professional/stats');
    return response.data;
  },

  // Company methods
  async getJobApplications(jobId: string): Promise<Application[]> {
    const response = await api.get(`/applications/job/${jobId}/applications`);
    return response.data;
  },

  async markApplicationAsViewed(applicationId: string): Promise<any> {
    const response = await api.patch(`/applications/${applicationId}/view`);
    return response.data;
  },

  async getApplicationViews(applicationId: string): Promise<ApplicationView[]> {
    const response = await api.get(`/applications/${applicationId}/views`);
    return response.data;
  },

  async updateApplicationStatus(applicationId: string, status: string): Promise<Application> {
    const response = await api.patch(`/applications/${applicationId}/status`, { status });
    return response.data;
  },
}; 