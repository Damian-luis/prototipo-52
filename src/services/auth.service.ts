import api from '@/util/axios';
import { User } from '@/types';

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  fullName: string;
  role: 'PROFESIONAL' | 'EMPRESA' | 'ESPECIALISTA' | 'ADMIN';
  phone?: string;
  country?: string;
  city?: string;
}

export interface LoginResponse {
  id: string;
  email: string;
  fullName: string;
  accountStatus: string;
  createdAt: string;
  avatar?: string;
  isGoogleUser: boolean;
  role: 'PROFESIONAL' | 'EMPRESA' | 'ESPECIALISTA' | 'ADMIN';
  token: string;
  refresh_token?: string;
}

export interface RegisterResponse {
  access_token: string;
  user: {
    id: string;
    email: string;
    fullName: string;
    accountStatus: string;
    createdAt?: string;
    avatar?: string;
    isGoogleUser?: boolean;
    role: 'PROFESIONAL' | 'EMPRESA' | 'ESPECIALISTA' | 'ADMIN';
  };
  refresh_token?: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
}

export interface ValidateTokenRequest {
  token: string;
}

export interface AuthResponse {
  message: string;
  success?: boolean;
}

export interface ValidateTokenResponse {
  valid: boolean;
  user: {
    email: string;
    fullName: string;
  };
}

class AuthService {
  // Login
  async login(data: LoginData): Promise<LoginResponse> {
    const response = await api.post('/auth/login', data);
    return response.data;
  }

  // Register
  async register(data: RegisterData): Promise<RegisterResponse> {
    const response = await api.post('/auth/register', data);
    return response.data;
  }

  // Logout
  async logout(): Promise<void> {
    await api.post('/auth/logout');
  }

  // Refresh token
  async refreshToken(refreshToken: string): Promise<LoginResponse> {
    const response = await api.post('/auth/refresh', { refresh_token: refreshToken });
    return response.data;
  }

  // Get profile
  async getProfile(): Promise<User> {
    const response = await api.get('/auth/profile');
    return response.data;
  }

  // Update profile
  async updateProfile(data: Partial<User>): Promise<User> {
    const response = await api.patch('/auth/profile', data);
    return response.data;
  }

  // Solicitar recuperación de contraseña
  async forgotPassword(data: ForgotPasswordRequest): Promise<AuthResponse> {
    try {
      const response = await api.post('/auth/forgot-password', data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al solicitar recuperación de contraseña');
    }
  }

  // Validar token de recuperación
  async validateResetToken(data: ValidateTokenRequest): Promise<ValidateTokenResponse> {
    try {
      const response = await api.post('/auth/validate-reset-token', data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Token inválido o expirado');
    }
  }

  // Restablecer contraseña
  async resetPassword(data: ResetPasswordRequest): Promise<AuthResponse> {
    try {
      const response = await api.post('/auth/reset-password', data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al restablecer la contraseña');
    }
  }
}

export default new AuthService(); 