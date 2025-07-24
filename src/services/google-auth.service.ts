import api from '@/util/axios';
import { User } from '@/types';

export interface GoogleAuthResponse {
  user: User;
  access_token: string;
  refresh_token: string;
}

export interface GoogleUserData {
  email: string;
  fullName: string;
  avatar?: string;
}

export const googleAuthService = {
  // Autenticación con Google
  async authenticateWithGoogle(googleUserData: GoogleUserData): Promise<GoogleAuthResponse> {
    const response = await api.post('/auth/google', googleUserData);
    return response.data;
  },

  // Verificar si el usuario existe antes de autenticar
  async checkUserExists(email: string): Promise<{ exists: boolean; user?: any }> {
    try {
      const response = await api.get(`/auth/check-user-exists/${email}`);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return { exists: false };
      }
      throw error;
    }
  },
}; 