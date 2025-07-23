"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { userService } from '@/services/supabase';
import { User, UserRole } from '@/types';
import { User as SupabaseUser } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  supabaseUser: SupabaseUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
  register: (userData: Partial<User> & { password: string }) => Promise<{ success: boolean; message: string }>;
  updateProfile: (userData: Partial<User>) => Promise<{ success: boolean; message: string }>;
  resetPassword: (email: string) => Promise<{ success: boolean; message: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Escuchar cambios en el estado de autenticación de Supabase
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSupabaseUser(session?.user ?? null);
      
      if (session?.user) {
        try {
          // Obtener datos del usuario desde Supabase
          const userData = await userService.getUserById(session.user.id);
          
          if (userData) {
            setUser(userData);
            setIsAuthenticated(true);
          } else {
            // Si no existe en la base de datos, crear usuario desde Auth
            try {
              const newUser = await userService.createUserFromAuth(session.user);
              setUser(newUser);
              setIsAuthenticated(true);
            } catch (createError) {
              console.error('Error creating user from Auth:', createError);
              // Si falla la creación, crear un usuario temporal
              const tempUser: User = {
                id: session.user.id,
                email: session.user.email || '',
                name: session.user.user_metadata?.name || 'Usuario',
                role: session.user.user_metadata?.role || 'profesional',
                is_active: true,
                created_at: new Date().toISOString(),
              };
              setUser(tempUser);
              setIsAuthenticated(true);
            }
          }
        } catch (error) {
          console.error('Error getting user data:', error);
          // Crear usuario temporal en caso de error
          const tempUser: User = {
            id: session.user.id,
            email: session.user.email || '',
            name: session.user.user_metadata?.name || 'Usuario',
            role: session.user.user_metadata?.role || 'profesional',
            is_active: true,
            created_at: new Date().toISOString(),
          };
          setUser(tempUser);
          setIsAuthenticated(true);
        }
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; message: string }> => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
      // Los datos del usuario se cargarán automáticamente en el useEffect
      return { success: true, message: 'Inicio de sesión exitoso' };
    } catch (error: any) {
      console.error('Login error:', error);
      let message = 'Error al iniciar sesión';
      
      if (error.message?.includes('Invalid login credentials')) {
        message = 'Credenciales inválidas';
      } else if (error.message?.includes('Email not confirmed')) {
        message = 'Email no confirmado';
      } else if (error.message?.includes('Too many requests')) {
        message = 'Demasiados intentos, inténtalo más tarde';
      }
      
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  const register = async (userData: Partial<User> & { password: string }): Promise<{ success: boolean; message: string }> => {
    try {
      setLoading(true);
      const { password, ...userInfo } = userData;
      
      // Crear usuario en Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email: userInfo.email!,
        password: password,
        options: {
          data: {
            name: userInfo.name,
            role: userInfo.role || 'profesional'
          }
        }
      });
      
      if (error) throw error;
      
      if (data.user) {
        // Crear documento en la base de datos
        const newUser: Omit<User, 'id'> = {
          email: userInfo.email!,
          name: userInfo.name!,
          role: userInfo.role || 'profesional',
          is_active: true,
          created_at: new Date().toISOString(),
          ...userInfo
        };
        
        await userService.createUser(newUser);
      }
      
      return { success: true, message: 'Usuario registrado exitosamente' };
    } catch (error: any) {
      console.error('Register error:', error);
      let message = 'Error al registrar usuario';
      
      if (error.message?.includes('User already registered')) {
        message = 'El usuario ya está registrado';
      } else if (error.message?.includes('Password should be at least')) {
        message = 'La contraseña debe tener al menos 6 caracteres';
      } else if (error.message?.includes('Invalid email')) {
        message = 'Email inválido';
      }
      
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (userData: Partial<User>): Promise<{ success: boolean; message: string }> => {
    try {
      if (!user?.id) {
        return { success: false, message: 'Usuario no autenticado' };
      }
      
      await userService.updateUser(user.id, userData);
      
      // Actualizar estado local
      setUser(prev => prev ? { ...prev, ...userData } : null);
      
      return { success: true, message: 'Perfil actualizado exitosamente' };
    } catch (error) {
      console.error('Update profile error:', error);
      return { success: false, message: 'Error al actualizar perfil' };
    }
  };

  const resetPassword = async (email: string): Promise<{ success: boolean; message: string }> => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });
      
      if (error) throw error;
      
      return { success: true, message: 'Se ha enviado un email para restablecer la contraseña' };
    } catch (error) {
      console.error('Reset password error:', error);
      return { success: false, message: 'Error al restablecer contraseña' };
    }
  };

  const value: AuthContextType = {
    user,
    supabaseUser,
    isAuthenticated,
    loading,
    login,
    logout,
    register,
    updateProfile,
    resetPassword
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