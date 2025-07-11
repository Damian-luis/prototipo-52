"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type UserRole = 'admin' | 'freelancer';

export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: UserRole;
  profilePicture?: string;
  phone?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  taxId?: string;
  skills?: string[];
  hourlyRate?: number;
  availability?: 'available' | 'busy' | 'unavailable';
  bio?: string;
  portfolio?: string;
  bankAccounts?: BankAccount[];
  documents?: Document[];
  createdAt: string;
  lastLogin?: string;
}

export interface BankAccount {
  id: string;
  bankName: string;
  accountNumber: string;
  accountType: 'checking' | 'savings';
  currency: string;
  isDefault: boolean;
}

export interface Document {
  id: string;
  name: string;
  type: 'id' | 'tax' | 'certification' | 'other';
  url: string;
  uploadDate: string;
}

interface AuthContextType {
  user: User | null;
  users: User[];
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  register: (userData: Partial<User>) => Promise<{ success: boolean; message: string }>;
  updateProfile: (userData: Partial<User>) => Promise<{ success: boolean; message: string }>;
  resetPassword: (email: string) => Promise<{ success: boolean; message: string }>;
  addBankAccount: (bankAccount: Omit<BankAccount, 'id'>) => Promise<{ success: boolean; message: string }>;
  addDocument: (document: Omit<Document, 'id' | 'uploadDate'>) => Promise<{ success: boolean; message: string }>;
  getAllUsers: () => User[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Cargar usuarios del localStorage al iniciar
  useEffect(() => {
    const storedUsers = localStorage.getItem('users');
    const currentUser = localStorage.getItem('currentUser');
    let usersArr: User[] = [];
    if (storedUsers) {
      usersArr = JSON.parse(storedUsers);
      // Migrar usuarios con _id a id
      usersArr = usersArr.map(u => {
        const anyUser = u as any;
        if (!u.id && anyUser['_id']) {
          u.id = anyUser['_id'];
          delete anyUser['_id'];
        }
        return u;
      });
      // Verificar si existe el admin
      const adminExists = usersArr.some(u => u.role === 'admin' && u.email === 'admin@freelasaas.com');
      if (!adminExists) {
        usersArr.unshift({
          id: '1',
          email: 'admin@freelasaas.com',
          password: 'admin123',
          name: 'Administrador',
          role: 'admin',
          createdAt: new Date().toISOString(),
        } as User);
        localStorage.setItem('users', JSON.stringify(usersArr));
      }
      // Guardar migración si hubo cambios
      localStorage.setItem('users', JSON.stringify(usersArr));
      setUsers(usersArr);
    } else {
      // Crear usuarios por defecto
      const defaultUsers: User[] = [
        {
          id: '1',
          email: 'admin@freelasaas.com',
          password: 'admin123',
          name: 'Administrador',
          role: 'admin',
          createdAt: new Date().toISOString(),
        },
        {
          id: '2',
          email: 'freelancer@example.com',
          password: 'freelancer123',
          name: 'Juan Pérez',
          role: 'freelancer',
          skills: ['React', 'Node.js', 'TypeScript'],
          hourlyRate: 50,
          availability: 'available',
          bio: 'Desarrollador Full Stack con 5 años de experiencia',
          createdAt: new Date().toISOString(),
        }
      ];
      localStorage.setItem('users', JSON.stringify(defaultUsers));
      setUsers(defaultUsers);
    }

    if (currentUser) {
      try {
        let userData = JSON.parse(currentUser);
        // Migrar currentUser con _id a id
        const anyUserData = userData as any;
        if (!userData.id && anyUserData['_id']) {
          userData.id = anyUserData['_id'];
          delete anyUserData['_id'];
          localStorage.setItem('currentUser', JSON.stringify(userData));
        }
        // Validar que el usuario tiene los campos mínimos
        if (userData && userData.id && userData.email && userData.role) {
          setUser(userData);
          setIsAuthenticated(true);
        } else {
          // Si el objeto está malformado, limpiar y no setear usuario
          localStorage.removeItem('currentUser');
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (e) {
        // Si hay error de parseo, limpiar y no setear usuario
        localStorage.removeItem('currentUser');
        setUser(null);
        setIsAuthenticated(false);
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; message: string }> => {
    const foundUser = users.find(u => u.email === email && u.password === password);
    
    if (foundUser) {
      const updatedUser = { ...foundUser, lastLogin: new Date().toISOString() };
      setUser(updatedUser);
      setIsAuthenticated(true);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      
      // Actualizar último login en la lista de usuarios
      const updatedUsers = users.map(u => u.id === foundUser.id ? updatedUser : u);
      setUsers(updatedUsers);
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      
      return { success: true, message: 'Login exitoso' };
    }
    
    return { success: false, message: 'Credenciales inválidas' };
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('currentUser');
  };

  const register = async (userData: Partial<User>): Promise<{ success: boolean; message: string }> => {
    const existingUser = users.find(u => u.email === userData.email);
    
    if (existingUser) {
      return { success: false, message: 'El usuario ya existe' };
    }

    const newUser: User = {
      id: Date.now().toString(),
      email: userData.email!,
      password: userData.password!,
      name: userData.name!,
      role: userData.role || 'freelancer',
      createdAt: new Date().toISOString(),
      bankAccounts: [],
      documents: [],
      ...userData
    };

    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));

    return { success: true, message: 'Usuario registrado exitosamente' };
  };

  const updateProfile = async (userData: Partial<User>): Promise<{ success: boolean; message: string }> => {
    if (!user) {
      return { success: false, message: 'No hay usuario autenticado' };
    }

    const updatedUser = { ...user, ...userData };
    setUser(updatedUser);
    
    const updatedUsers = users.map(u => u.id === user.id ? updatedUser : u);
    setUsers(updatedUsers);
    
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    localStorage.setItem('users', JSON.stringify(updatedUsers));

    return { success: true, message: 'Perfil actualizado exitosamente' };
  };

  const resetPassword = async (email: string): Promise<{ success: boolean; message: string }> => {
    const foundUser = users.find(u => u.email === email);
    
    if (foundUser) {
      // En un sistema real, aquí se enviaría un email
      console.log(`Email de recuperación enviado a: ${email}`);
      return { success: true, message: 'Se ha enviado un email de recuperación' };
    }
    
    return { success: false, message: 'Email no encontrado' };
  };

  const addBankAccount = async (bankAccount: Omit<BankAccount, 'id'>): Promise<{ success: boolean; message: string }> => {
    if (!user) {
      return { success: false, message: 'No hay usuario autenticado' };
    }

    const newBankAccount: BankAccount = {
      ...bankAccount,
      id: Date.now().toString()
    };

    const updatedBankAccounts = [...(user.bankAccounts || []), newBankAccount];
    return updateProfile({ bankAccounts: updatedBankAccounts });
  };

  const addDocument = async (document: Omit<Document, 'id' | 'uploadDate'>): Promise<{ success: boolean; message: string }> => {
    if (!user) {
      return { success: false, message: 'No hay usuario autenticado' };
    }

    const newDocument: Document = {
      ...document,
      id: Date.now().toString(),
      uploadDate: new Date().toISOString()
    };

    const updatedDocuments = [...(user.documents || []), newDocument];
    return updateProfile({ documents: updatedDocuments });
  };

  const getAllUsers = () => users;

  return (
    <AuthContext.Provider value={{
      user,
      users,
      isAuthenticated,
      loading,
      login,
      logout,
      register,
      updateProfile,
      resetPassword,
      addBankAccount,
      addDocument,
      getAllUsers
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider');
  }
  return context;
}; 