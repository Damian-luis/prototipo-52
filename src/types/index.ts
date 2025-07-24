// Tipos de usuario
export type UserRole = 'PROFESIONAL' | 'EMPRESA' | 'ESPECIALISTA' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  profile_picture?: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  created_at: string;
  last_login?: string;
  is_active: boolean;
}

// Tipos específicos por rol
export interface Empresa extends User {
  role: 'EMPRESA';
  company_name: string;
  industry: string;
  company_size: 'small' | 'medium' | 'large';
  website?: string;
  description?: string;
  projects: string[]; // IDs de proyectos
  contracts: string[]; // IDs de contratos
}

export interface Profesional extends User {
  role: 'PROFESIONAL';
  skills: string[];
  experience: number; // años
  hourly_rate: number;
  availability: 'available' | 'busy' | 'unavailable';
  bio?: string;
  portfolio?: string;
  certifications: Certification[];
  projects: string[]; // IDs de proyectos
  contracts: string[]; // IDs de contratos
  rating: number;
  completed_projects: number;
}

export interface Especialista extends User {
  role: 'ESPECIALISTA';
  specialization: string;
  expertise: string[];
  hourly_rate: number;
  availability: 'available' | 'busy' | 'unavailable';
  bio?: string;
  consultations: string[]; // IDs de consultas
  rating: number;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  issue_date: string;
  expiry_date?: string;
  credential_id?: string;
}

// Proyectos
export interface Project {
  id: string;
  title: string;
  description: string;
  company_id: string;
  company_name: string;
  status: 'draft' | 'active' | 'paused' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  start_date: string;
  end_date?: string;
  budget: {
    min: number;
    max: number;
    currency: string;
  };
  skills: string[];
  requirements: string[];
  tasks: Task[];
  professionals: string[]; // IDs de profesionales asignados
  contracts: string[]; // IDs de contratos relacionados
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'review' | 'completed';
  priority: 'low' | 'medium' | 'high';
  assigned_to: string; // ID del profesional
  assigned_at: string;
  due_date: string;
  completed_at?: string;
  estimated_hours: number;
  actual_hours?: number;
  dependencies: string[]; // IDs de tareas dependientes
}

// Contratos
export interface Contract {
  id: string;
  project_id: string;
  project_title: string;
  company_id: string;
  company_name: string;
  professional_id: string;
  professional_name: string;
  type: 'hourly' | 'fixed' | 'milestone';
  status: 'draft' | 'pending' | 'active' | 'completed' | 'cancelled';
  start_date: string;
  end_date?: string;
  value: number;
  currency: string;
  payment_terms: string;
  milestones?: Milestone[];
  blockchain_hash?: string;
  signatures: Signature[];
  created_at: string;
  updated_at: string;
}

export interface Milestone {
  id: string;
  name: string;
  description: string;
  amount: number;
  due_date: string;
  status: 'pending' | 'in-progress' | 'completed' | 'approved';
  completed_date?: string;
  deliverables: string[];
}

export interface Signature {
  user_id: string;
  user_name: string;
  role: 'company' | 'professional';
  signed_at: string;
  ip_address: string;
  signature: string;
  wallet?: string;
}

// Pagos
export interface Payment {
  id: string;
  contract_id: string;
  professional_id: string;
  professional_name: string;
  amount: number;
  currency: string;
  type: 'milestone' | 'hourly' | 'bonus';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  payment_method: PaymentMethod;
  scheduled_date: string;
  processed_date?: string;
  description: string;
  invoice?: Invoice;
  blockchain_hash?: string;
  created_at: string;
}

export interface PaymentMethod {
  id: string;
  type: 'bank_transfer' | 'paypal' | 'crypto' | 'wire';
  details: {
    account_number?: string;
    bank_name?: string;
    email?: string;
    wallet_address?: string;
  };
  is_default: boolean;
}

export interface Invoice {
  id: string;
  number: string;
  date: string;
  due_date: string;
  items: InvoiceItem[];
  total: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
}

export interface InvoiceItem {
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

// Notificaciones
export interface Notification {
  id: string;
  user_id: string;
  type: 'project' | 'contract' | 'payment' | 'task' | 'consultation' | 'system';
  title: string;
  message: string;
  is_read: boolean;
  data?: any;
  created_at: string;
}

// Asesorías
export interface Consultation {
  id: string;
  professional_id: string;
  professional_name: string;
  specialist_id: string;
  specialist_name: string;
  category: 'health' | 'wellness' | 'career' | 'technical' | 'personal';
  status: 'pending' | 'scheduled' | 'completed' | 'cancelled';
  scheduled_date: string;
  duration: number; // minutos
  notes?: string;
  rating?: number;
  feedback?: string;
  created_at: string;
}

// IA y Matching
export interface Interest {
  id: string;
  professional_id: string;
  project_id: string;
  score: number; // 0-100
  matched_skills: string[];
  ai_recommendation: boolean;
  created_at: string;
}

export interface AIRecommendation {
  id: string;
  type: 'professional' | 'project' | 'skill';
  title: string;
  description: string;
  confidence: number; // 0-100
  data: any;
  created_at: string;
  user_id: string;
}

export interface AIWebhookPayload {
  type: 'professional_matching' | 'skill_analysis' | 'project_recommendation';
  data: any;
  timestamp: string;
}

// Estados de carga
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
} 