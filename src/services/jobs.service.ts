import api from '@/util/axios';

export interface Job {
  id: string;
  title: string;
  description: string;
  requirements: string[];
  skills: string[];
  budget: {
    min: number;
    max: number;
    currency: string;
  };
  duration?: string;
  location?: string;
  status: 'ACTIVE' | 'PAUSED' | 'CLOSED' | 'COMPLETED';
  isUrgent: boolean;
  createdAt: string;
  updatedAt: string;
  companyId: string;
  companyName: string;
}

export interface CreateJobData {
  title: string;
  description: string;
  requirements: string[];
  skills: string[];
  budget: {
    min: number;
    max: number;
    currency: string;
  };
  duration?: string;
  location?: string;
  isUrgent?: boolean;
}

export interface UpdateJobData {
  title?: string;
  description?: string;
  requirements?: string[];
  skills?: string[];
  budget?: {
    min: number;
    max: number;
    currency: string;
  };
  duration?: string;
  location?: string;
  status?: 'ACTIVE' | 'PAUSED' | 'CLOSED' | 'COMPLETED';
  isUrgent?: boolean;
}

export interface JobFilters {
  status?: string;
  skills?: string[];
  budgetMin?: number;
  budgetMax?: number;
  location?: string;
  isUrgent?: boolean;
}

export const jobsService = {
  // Get all jobs
  async getAllJobs(filters?: JobFilters): Promise<Job[]> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          if (Array.isArray(value)) {
            params.append(key, value.join(','));
          } else {
            params.append(key, value.toString());
          }
        }
      });
    }
    
    const response = await api.get(`/jobs?${params.toString()}`);
    return response.data;
  },

  // Get job by ID
  async getJobById(id: string): Promise<Job> {
    const response = await api.get(`/jobs/${id}`);
    return response.data;
  },

  // Create job (company only)
  async createJob(data: CreateJobData): Promise<Job> {
    const response = await api.post('/jobs', data);
    return response.data;
  },

  // Update job (company only)
  async updateJob(id: string, data: UpdateJobData): Promise<Job> {
    const response = await api.patch(`/jobs/${id}`, data);
    return response.data;
  },

  // Delete job (company only)
  async deleteJob(id: string): Promise<void> {
    await api.delete(`/jobs/${id}`);
  },

  // Search jobs
  async searchJobs(query: string, filters?: JobFilters): Promise<Job[]> {
    const params = new URLSearchParams({ q: query });
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          if (Array.isArray(value)) {
            params.append(key, value.join(','));
          } else {
            params.append(key, value.toString());
          }
        }
      });
    }
    
    const response = await api.get(`/jobs/search?${params.toString()}`);
    return response.data;
  },

  // Get jobs by company
  async getJobsByCompany(): Promise<Job[]> {
    const response = await api.get('/jobs/company');
    return response.data;
  },

  // Get job stats for company
  async getJobStats(): Promise<any> {
    const response = await api.get('/jobs/company/stats');
    return response.data;
  },
}; 