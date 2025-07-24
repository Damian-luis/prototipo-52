"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService, AuthResponse, LoginData, RegisterData } from '@/services/auth.service';
import { googleAuthService, GoogleAuthResponse } from '@/services/google-auth.service';
import { usersService } from '@/services/users.service';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  loginWithGoogle: (googleUserData: any) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
  register: (userData: RegisterData) => Promise<{ success: boolean; message: string }>;
  updateProfile: (userData: Partial<User>) => Promise<{ success: boolean; message: string }>;
  resetPassword: (email: string) => Promise<{ success: boolean; message: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Verificar si hay un token al cargar la aplicación
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (token) {
          // Intentar obtener el perfil del usuario
          const userData = await usersService.getCurrentUser();
          setUser(userData);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Error checking auth:', error);
        // Si hay error, limpiar el token
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; message: string }> => {
    try {
      setLoading(true);
      const loginData: LoginData = { email, password };
      const response: AuthResponse = await authService.login(loginData);
      
      // Guardar token y datos del usuario
      localStorage.setItem('authToken', response.access_token);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      setUser(response.user);
      setIsAuthenticated(true);
      
      return { success: true, message: 'Inicio de sesión exitoso' };
    } catch (error: any) {
      console.error('Login error:', error);
      const message = error.response?.data?.message || 'Error al iniciar sesión';
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async (googleUserData: any): Promise<{ success: boolean; message: string }> => {
    try {
      setLoading(true);
      
      const response: GoogleAuthResponse = await googleAuthService.authenticateWithGoogle(googleUserData);
      
      // Guardar token y datos del usuario
      localStorage.setItem('authToken', response.access_token);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      setUser(response.user);
      setIsAuthenticated(true);
      
      return { success: true, message: 'Inicio de sesión con Google exitoso' };
    } catch (error: any) {
      console.error('Google login error:', error);
      const message = error.response?.data?.message || 'Error al iniciar sesión con Google';
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Limpiar datos locales
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const register = async (userData: RegisterData): Promise<{ success: boolean; message: string }> => {
    try {
      setLoading(true);
      const response: AuthResponse = await authService.register(userData);
      
      // Guardar token y datos del usuario
      localStorage.setItem('authToken', response.access_token);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      setUser(response.user);
      setIsAuthenticated(true);
      
      return { success: true, message: 'Registro exitoso' };
    } catch (error: any) {
      console.error('Register error:', error);
      const message = error.response?.data?.message || 'Error al registrar usuario';
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (userData: Partial<User>): Promise<{ success: boolean; message: string }> => {
    try {
      setLoading(true);
      const updatedUser = await usersService.updateCurrentUser(userData);
      
      // Actualizar datos locales
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      return { success: true, message: 'Perfil actualizado exitosamente' };
    } catch (error: any) {
      console.error('Update profile error:', error);
      const message = error.response?.data?.message || 'Error al actualizar perfil';
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string): Promise<{ success: boolean; message: string }> => {
    try {
      setLoading(true);
      // Implementar cuando el backend tenga esta funcionalidad
      // await authService.resetPassword(email);
      return { success: true, message: 'Instrucciones enviadas al correo electrónico' };
    } catch (error: any) {
      console.error('Reset password error:', error);
      const message = error.response?.data?.message || 'Error al restablecer contraseña';
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    loading,
    login,
    loginWithGoogle,
    logout,
    register,
    updateProfile,
    resetPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 