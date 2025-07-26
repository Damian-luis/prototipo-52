import api from '@/util/axios';

export interface CVData {
  cvUrl: string;
  cvFileName: string;
  experience: number;
  education: Education[];
  certifications: Certification[];
  portfolio?: string;
  availability: 'available' | 'busy' | 'unavailable';
  bio?: string;
  skills: string[];
  languages: Language[];
}

export interface Education {
  degree: string;
  institution: string;
  year: number;
  description?: string;
}

export interface Certification {
  name: string;
  issuer: string;
  year: number;
  credentialId?: string;
  verificationUrl?: string;
}

export interface Language {
  name: string;
  level: 'basic' | 'intermediate' | 'advanced' | 'native';
}

export interface ProfessionalProfile {
  id: string;
  fullName: string;
  email: string;
  avatar?: string;
  role: string;
  cvUrl?: string;
  cvFileName?: string;
  experience: number;
  education: Education[];
  certifications: Certification[];
  portfolio?: string;
  availability: string;
  rating: number;
  completedProjects: number;
  totalEarnings: number;
  bio?: string;
  skills: string[];
  languages: Language[];
  country?: string;
  city?: string;
  hourlyRate?: number;
  createdAt: string;
}

const cvService = {
  // Subir CV
  async uploadCV(file: File): Promise<{ url: string; fileName: string }> {
    const formData = new FormData();
    formData.append('cv', file);
    
    const response = await api.post('/users/cv/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  },

  // Actualizar perfil profesional
  async updateProfessionalProfile(data: Partial<CVData>): Promise<ProfessionalProfile> {
    const response = await api.put('/users/profile/professional', data);
    return response.data;
  },

  // Obtener perfil profesional
  async getProfessionalProfile(userId: string): Promise<ProfessionalProfile> {
    const response = await api.get(`/users/${userId}/profile`);
    return response.data;
  },

  // Obtener todos los profesionales (para empresas)
  async getAllProfessionals(filters?: {
    skills?: string[];
    experience?: number;
    availability?: string;
    rating?: number;
    country?: string;
    search?: string;
  }): Promise<ProfessionalProfile[]> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          if (Array.isArray(value)) {
            params.append(key, value.join(','));
          } else {
            params.append(key, value.toString());
          }
        }
      });
    }
    
    const response = await api.get(`/users/professionals?${params.toString()}`);
    return response.data;
  },

  // Buscar profesionales
  async searchProfessionals(query: string, filters?: any): Promise<ProfessionalProfile[]> {
    const response = await api.post('/users/professionals/search', {
      query,
      filters,
    });
    return response.data;
  },

  // Descargar CV
  async downloadCV(userId: string): Promise<Blob> {
    const response = await api.get(`/users/${userId}/cv/download`, {
      responseType: 'blob',
    });
    return response.data;
  },

  // Marcar profesional como favorito
  async addToFavorites(userId: string): Promise<void> {
    await api.post(`/users/professionals/${userId}/favorite`);
  },

  // Remover de favoritos
  async removeFromFavorites(userId: string): Promise<void> {
    await api.delete(`/users/professionals/${userId}/favorite`);
  },

  // Obtener favoritos
  async getFavorites(): Promise<ProfessionalProfile[]> {
    const response = await api.get('/users/professionals/favorites');
    return response.data;
  },
};

export default cvService; 