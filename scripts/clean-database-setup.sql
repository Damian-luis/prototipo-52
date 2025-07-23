-- =====================================================
-- SCRIPT LIMPIO DE BASE DE DATOS PARA FREELASAAS
-- =====================================================
-- Ejecutar en el SQL Editor de Supabase
-- Este script crea solo las tablas necesarias sin datos de prueba
-- Los usuarios se crearán desde la plataforma web

-- =====================================================
-- 1. ELIMINAR TABLAS EXISTENTES (SI EXISTEN)
-- =====================================================

DROP TABLE IF EXISTS evaluations CASCADE;
DROP TABLE IF EXISTS job_applications CASCADE;
DROP TABLE IF EXISTS job_vacancies CASCADE;
DROP TABLE IF EXISTS ai_recommendations CASCADE;
DROP TABLE IF EXISTS interests CASCADE;
DROP TABLE IF EXISTS consultations CASCADE;
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS contracts CASCADE;
DROP TABLE IF EXISTS tasks CASCADE;
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS support_notifications CASCADE;
DROP TABLE IF EXISTS support_messages CASCADE;
DROP TABLE IF EXISTS support_tickets CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS certifications CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- =====================================================
-- 2. CREAR TABLAS PRINCIPALES
-- =====================================================

-- Tabla de usuarios (se sincroniza con auth.users)
CREATE TABLE users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT CHECK (role IN ('admin', 'empresa', 'profesional', 'especialista')) NOT NULL,
  profile_picture TEXT,
  phone TEXT,
  address TEXT,
  city TEXT,
  country TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  last_login TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  
  -- Campos específicos para empresas
  company_name TEXT,
  industry TEXT,
  company_size TEXT CHECK (company_size IN ('small', 'medium', 'large')),
  website TEXT,
  description TEXT,
  
  -- Campos específicos para profesionales
  skills TEXT[],
  experience INTEGER,
  hourly_rate DECIMAL(10,2),
  availability TEXT CHECK (availability IN ('available', 'busy', 'unavailable')),
  bio TEXT,
  portfolio TEXT,
  rating DECIMAL(3,2) DEFAULT 0,
  completed_projects INTEGER DEFAULT 0,
  
  -- Campos específicos para especialistas
  specialization TEXT,
  expertise TEXT[]
);

-- Tabla de certificaciones
CREATE TABLE certifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  issuer TEXT NOT NULL,
  issue_date DATE NOT NULL,
  expiry_date DATE,
  credential_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabla de proyectos
CREATE TABLE projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  company_id UUID REFERENCES users(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  status TEXT CHECK (status IN ('draft', 'active', 'paused', 'completed', 'cancelled')) DEFAULT 'draft',
  priority TEXT CHECK (priority IN ('low', 'medium', 'high', 'urgent')) DEFAULT 'medium',
  start_date DATE NOT NULL,
  end_date DATE,
  budget JSONB NOT NULL,
  skills TEXT[] NOT NULL,
  requirements TEXT[] NOT NULL,
  professionals TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabla de tareas
CREATE TABLE tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT CHECK (status IN ('pending', 'in-progress', 'review', 'completed')) DEFAULT 'pending',
  priority TEXT CHECK (priority IN ('low', 'medium', 'high')) DEFAULT 'medium',
  assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
  assigned_at TIMESTAMP WITH TIME ZONE,
  due_date DATE NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE,
  estimated_hours INTEGER NOT NULL,
  actual_hours INTEGER,
  dependencies TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabla de contratos
CREATE TABLE contracts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  project_title TEXT NOT NULL,
  company_id UUID REFERENCES users(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  professional_id UUID REFERENCES users(id) ON DELETE CASCADE,
  professional_name TEXT NOT NULL,
  type TEXT CHECK (type IN ('hourly', 'fixed', 'milestone')) NOT NULL,
  status TEXT CHECK (status IN ('draft', 'pending', 'active', 'completed', 'cancelled')) DEFAULT 'draft',
  start_date DATE NOT NULL,
  end_date DATE,
  value DECIMAL(12,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  payment_terms TEXT,
  milestones JSONB,
  blockchain_hash TEXT,
  signatures JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabla de pagos
CREATE TABLE payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  contract_id UUID REFERENCES contracts(id) ON DELETE CASCADE,
  professional_id UUID REFERENCES users(id) ON DELETE CASCADE,
  professional_name TEXT NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  type TEXT CHECK (type IN ('milestone', 'hourly', 'bonus')) NOT NULL,
  status TEXT CHECK (status IN ('pending', 'processing', 'completed', 'failed')) DEFAULT 'pending',
  payment_method JSONB NOT NULL,
  scheduled_date DATE NOT NULL,
  processed_date DATE,
  description TEXT NOT NULL,
  invoice JSONB,
  blockchain_hash TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabla de notificaciones
CREATE TABLE notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type TEXT CHECK (type IN ('project', 'contract', 'payment', 'task', 'consultation', 'system')) NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabla de consultas
CREATE TABLE consultations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  professional_id UUID REFERENCES users(id) ON DELETE CASCADE,
  professional_name TEXT NOT NULL,
  specialist_id UUID REFERENCES users(id) ON DELETE CASCADE,
  specialist_name TEXT NOT NULL,
  category TEXT CHECK (category IN ('health', 'wellness', 'career', 'technical', 'personal')) NOT NULL,
  status TEXT CHECK (status IN ('pending', 'scheduled', 'completed', 'cancelled')) DEFAULT 'pending',
  scheduled_date TIMESTAMP WITH TIME ZONE NOT NULL,
  duration INTEGER NOT NULL,
  notes TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  feedback TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabla de intereses
CREATE TABLE interests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  professional_id UUID REFERENCES users(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  score INTEGER CHECK (score >= 0 AND score <= 100) NOT NULL,
  matched_skills TEXT[] NOT NULL,
  ai_recommendation BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabla de recomendaciones de IA
CREATE TABLE ai_recommendations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT CHECK (type IN ('professional', 'project', 'skill')) NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  confidence INTEGER CHECK (confidence >= 0 AND confidence <= 100) NOT NULL,
  data JSONB NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabla de tickets de soporte
CREATE TABLE support_tickets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  user_email TEXT NOT NULL,
  subject TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT CHECK (category IN ('technical', 'billing', 'account', 'contract', 'other')) NOT NULL,
  priority TEXT CHECK (priority IN ('low', 'medium', 'high', 'urgent')) DEFAULT 'medium',
  status TEXT CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')) DEFAULT 'open',
  assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
  assigned_to_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabla de mensajes de soporte
CREATE TABLE support_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  ticket_id UUID REFERENCES support_tickets(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  message TEXT NOT NULL,
  is_internal BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabla de notificaciones de soporte
CREATE TABLE support_notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT CHECK (type IN ('ticket_created', 'ticket_updated', 'ticket_resolved', 'new_message')) NOT NULL,
  ticket_id UUID REFERENCES support_tickets(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabla de vacantes de trabajo
CREATE TABLE job_vacancies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  requirements TEXT[] NOT NULL,
  skills TEXT[] NOT NULL,
  experience_required INTEGER NOT NULL,
  salary_range JSONB NOT NULL,
  location TEXT NOT NULL,
  type TEXT CHECK (type IN ('full-time', 'part-time', 'contract', 'freelance')) NOT NULL,
  status TEXT CHECK (status IN ('open', 'closed', 'draft')) DEFAULT 'open',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by UUID REFERENCES users(id) ON DELETE CASCADE
);

-- Tabla de aplicaciones a trabajos
CREATE TABLE job_applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  job_id UUID REFERENCES job_vacancies(id) ON DELETE CASCADE,
  freelancer_id UUID REFERENCES users(id) ON DELETE CASCADE,
  freelancer_name TEXT NOT NULL,
  freelancer_email TEXT NOT NULL,
  cover_letter TEXT NOT NULL,
  status TEXT CHECK (status IN ('pending', 'reviewing', 'interview', 'accepted', 'rejected')) DEFAULT 'pending',
  applied_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  evaluation_score DECIMAL(3,2),
  notes TEXT
);

-- Tabla de evaluaciones
CREATE TABLE evaluations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  freelancer_id UUID REFERENCES users(id) ON DELETE CASCADE,
  evaluator_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type TEXT CHECK (type IN ('initial', 'periodic', 'project')) NOT NULL,
  date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  scores JSONB NOT NULL,
  overall_score DECIMAL(3,2) NOT NULL,
  comments TEXT NOT NULL,
  recommendations TEXT
);

-- =====================================================
-- 3. HABILITAR ROW LEVEL SECURITY (RLS)
-- =====================================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultations ENABLE ROW LEVEL SECURITY;
ALTER TABLE interests ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_vacancies ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE evaluations ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 4. CREAR POLÍTICAS RLS
-- =====================================================

-- Políticas para users
CREATE POLICY "Users can view their own profile" ON users
  FOR SELECT USING (id = auth.uid());

CREATE POLICY "Users can update their own profile" ON users
  FOR UPDATE USING (id = auth.uid());

CREATE POLICY "Users can insert their own profile" ON users
  FOR INSERT WITH CHECK (id = auth.uid());

CREATE POLICY "Admins can view all users" ON users
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

-- Políticas para certifications
CREATE POLICY "Users can view their own certifications" ON certifications
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can manage their own certifications" ON certifications
  FOR ALL USING (user_id = auth.uid());

-- Políticas para projects
CREATE POLICY "Companies can view their own projects" ON projects
  FOR SELECT USING (company_id = auth.uid());

CREATE POLICY "Companies can manage their own projects" ON projects
  FOR ALL USING (company_id = auth.uid());

-- Políticas para tasks
CREATE POLICY "Users can view tasks from their projects" ON tasks
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.id = tasks.project_id 
      AND projects.company_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage tasks from their projects" ON tasks
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.id = tasks.project_id 
      AND projects.company_id = auth.uid()
    )
  );

-- Políticas para contracts
CREATE POLICY "Users can view their contracts" ON contracts
  FOR SELECT USING (company_id = auth.uid() OR professional_id = auth.uid());

CREATE POLICY "Users can manage their contracts" ON contracts
  FOR ALL USING (company_id = auth.uid() OR professional_id = auth.uid());

-- Políticas para payments
CREATE POLICY "Users can view their payments" ON payments
  FOR SELECT USING (professional_id = auth.uid());

CREATE POLICY "Companies can view payments for their contracts" ON payments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM contracts 
      WHERE contracts.id = payments.contract_id 
      AND contracts.company_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage their payments" ON payments
  FOR ALL USING (professional_id = auth.uid());

-- Políticas para notifications
CREATE POLICY "Users can view their notifications" ON notifications
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update their notifications" ON notifications
  FOR UPDATE USING (user_id = auth.uid());

-- Políticas para consultations
CREATE POLICY "Users can view their consultations" ON consultations
  FOR SELECT USING (professional_id = auth.uid() OR specialist_id = auth.uid());

CREATE POLICY "Users can manage their consultations" ON consultations
  FOR ALL USING (professional_id = auth.uid() OR specialist_id = auth.uid());

-- Políticas para interests
CREATE POLICY "Users can view their interests" ON interests
  FOR SELECT USING (professional_id = auth.uid());

CREATE POLICY "Users can manage their interests" ON interests
  FOR ALL USING (professional_id = auth.uid());

-- Políticas para ai_recommendations
CREATE POLICY "Users can view their recommendations" ON ai_recommendations
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can manage their recommendations" ON ai_recommendations
  FOR ALL USING (user_id = auth.uid());

-- Políticas para support_tickets
CREATE POLICY "Users can view their tickets" ON support_tickets
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create tickets" ON support_tickets
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their tickets" ON support_tickets
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Admins can view all tickets" ON support_tickets
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

-- Políticas para support_messages
CREATE POLICY "Users can view messages from their tickets" ON support_messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM support_tickets 
      WHERE support_tickets.id = support_messages.ticket_id 
      AND support_tickets.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create messages for their tickets" ON support_messages
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM support_tickets 
      WHERE support_tickets.id = support_messages.ticket_id 
      AND support_tickets.user_id = auth.uid()
    )
  );

-- Políticas para support_notifications
CREATE POLICY "Users can view their support notifications" ON support_notifications
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update their support notifications" ON support_notifications
  FOR UPDATE USING (user_id = auth.uid());

-- Políticas para job_vacancies
CREATE POLICY "Anyone can view open vacancies" ON job_vacancies
  FOR SELECT USING (status = 'open');

CREATE POLICY "Companies can view their own vacancies" ON job_vacancies
  FOR SELECT USING (created_by = auth.uid());

CREATE POLICY "Companies can create vacancies" ON job_vacancies
  FOR INSERT WITH CHECK (created_by = auth.uid());

CREATE POLICY "Companies can update their own vacancies" ON job_vacancies
  FOR UPDATE USING (created_by = auth.uid());

CREATE POLICY "Companies can delete their own vacancies" ON job_vacancies
  FOR DELETE USING (created_by = auth.uid());

-- Políticas para job_applications
CREATE POLICY "Users can view their own applications" ON job_applications
  FOR SELECT USING (freelancer_id = auth.uid());

CREATE POLICY "Companies can view applications for their jobs" ON job_applications
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM job_vacancies
      WHERE job_vacancies.id = job_applications.job_id
      AND job_vacancies.created_by = auth.uid()
    )
  );

CREATE POLICY "Users can create applications" ON job_applications
  FOR INSERT WITH CHECK (freelancer_id = auth.uid());

CREATE POLICY "Companies can update applications for their jobs" ON job_applications
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM job_vacancies
      WHERE job_vacancies.id = job_applications.job_id
      AND job_vacancies.created_by = auth.uid()
    )
  );

-- Políticas para evaluations
CREATE POLICY "Users can view their own evaluations" ON evaluations
  FOR SELECT USING (freelancer_id = auth.uid());

CREATE POLICY "Evaluators can view their evaluations" ON evaluations
  FOR SELECT USING (evaluator_id = auth.uid());

CREATE POLICY "Evaluators can create evaluations" ON evaluations
  FOR INSERT WITH CHECK (evaluator_id = auth.uid());

-- =====================================================
-- 5. CREAR ÍNDICES PARA OPTIMIZACIÓN
-- =====================================================

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_projects_company_id ON projects(company_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_contracts_company_id ON contracts(company_id);
CREATE INDEX idx_contracts_professional_id ON contracts(professional_id);
CREATE INDEX idx_payments_professional_id ON payments(professional_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_job_vacancies_status ON job_vacancies(status);
CREATE INDEX idx_job_vacancies_created_by ON job_vacancies(created_by);
CREATE INDEX idx_job_applications_freelancer_id ON job_applications(freelancer_id);
CREATE INDEX idx_job_applications_job_id ON job_applications(job_id);
CREATE INDEX idx_support_tickets_user_id ON support_tickets(user_id);
CREATE INDEX idx_support_tickets_status ON support_tickets(status);

-- =====================================================
-- 6. FUNCIONES DE TRIGGER PARA UPDATED_AT
-- =====================================================

-- Función para actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para updated_at
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contracts_updated_at BEFORE UPDATE ON contracts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_support_tickets_updated_at BEFORE UPDATE ON support_tickets
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 7. FUNCIÓN PARA SINCRONIZAR USUARIOS
-- =====================================================

-- Función para sincronizar usuarios cuando se registran
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', 'Usuario'),
    COALESCE(NEW.raw_user_meta_data->>'role', 'profesional')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para sincronizar usuarios
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- SCRIPT COMPLETADO
-- =====================================================
-- Este script ha creado todas las tablas, políticas RLS, 
-- índices y triggers necesarios para la aplicación FreelaSaaS.
-- 
-- Ahora puedes:
-- 1. Crear usuarios desde la plataforma web
-- 2. Los usuarios se sincronizarán automáticamente con la tabla users
-- 3. Todas las políticas RLS están configuradas para seguridad
-- 
-- Para verificar que todo funciona correctamente:
-- SELECT COUNT(*) FROM users;
-- SELECT COUNT(*) FROM projects;
-- SELECT COUNT(*) FROM contracts; 