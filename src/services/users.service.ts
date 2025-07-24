import api from '@/util/axios';
import { User } from '@/types';

export interface CreateUserData {
  email: string;
  password: string;
  fullName: string;
  role: 'PROFESIONAL' | 'EMPRESA' | 'ESPECIALISTA' | 'ADMIN';
  phone?: string;
  country?: string;
  city?: string;
  bio?: string;
  hourlyRate?: number;
  skills?: string[];
  languages?: any[];
  paypalEmail?: string;
  cryptoWallets?: any[];
}

export interface UpdateUserData {
  fullName?: string;
  phone?: string;
  country?: string;
  city?: string;
  bio?: string;
  hourlyRate?: number;
  skills?: string[];
  languages?: any[];
  paypalEmail?: string;
  cryptoWallets?: any[];
  profileCompleted?: boolean;
}

export const usersService = {
  // Get all users (admin only)
  async getAllUsers(): Promise<User[]> {
    const response = await api.get('/admin/users');
    return response.data;
  },

  // Get user by ID
  async getUserById(id: string): Promise<User> {
    const response = await api.get(`/admin/users/${id}`);
    return response.data;
  },

  // Create user (admin only)
  async createUser(data: CreateUserData): Promise<User> {
    const response = await api.post('/admin/users', data);
    return response.data;
  },

  // Update user (admin only)
  async updateUser(id: string, data: UpdateUserData): Promise<User> {
    const response = await api.patch(`/admin/users/${id}`, data);
    return response.data;
  },

  // Delete user (admin only)
  async deleteUser(id: string): Promise<void> {
    await api.delete(`/admin/users/${id}`);
  },

  // Get current user profile
  async getCurrentUser(): Promise<User> {
    const response = await api.get('/users/profile');
    return response.data;
  },

  // Update current user profile
  async updateCurrentUser(data: UpdateUserData): Promise<User> {
    const response = await api.patch('/users/profile', data);
    return response.data;
  },
}; 