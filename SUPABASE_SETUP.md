# Configuración de Supabase

## Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto con las siguientes variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Webhook URLs
N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/ai-analysis

# Optional: Supabase Service Role Key (for server-side operations)
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

## Configuración de Supabase

### 1. Crear Proyecto en Supabase

1. Ve a [supabase.com](https://supabase.com)
2. Crea una nueva cuenta o inicia sesión
3. Crea un nuevo proyecto
4. Anota la URL del proyecto y la clave anónima

### 2. Configurar Autenticación

En el dashboard de Supabase:

1. Ve a **Authentication > Settings**
2. Configura los proveedores de autenticación que necesites (Email, Google, etc.)
3. Configura las URLs de redirección para tu aplicación

### 3. Crear Tablas en la Base de Datos

Ejecuta los siguientes comandos SQL en el SQL Editor de Supabase:

```sql
-- Tabla de usuarios
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'profesional',
  profile_picture TEXT,
  phone TEXT,
  address TEXT,
  city TEXT,
  country TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true
);

-- Tabla de proyectos
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  company_id UUID REFERENCES users(id),
  company_name TEXT NOT NULL,
  status TEXT DEFAULT 'draft',
  priority TEXT DEFAULT 'medium',
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  budget JSONB,
  skills TEXT[],
  requirements TEXT[],
  tasks JSONB DEFAULT '[]',
  professionals UUID[] DEFAULT '{}',
  contracts UUID[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de contratos
CREATE TABLE contracts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id),
  project_title TEXT NOT NULL,
  company_id UUID REFERENCES users(id),
  company_name TEXT NOT NULL,
  professional_id UUID REFERENCES users(id),
  professional_name TEXT NOT NULL,
  type TEXT DEFAULT 'hourly',
  status TEXT DEFAULT 'draft',
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  value DECIMAL(10,2),
  currency TEXT DEFAULT 'USD',
  payment_terms TEXT,
  milestones JSONB DEFAULT '[]',
  blockchain_hash TEXT,
  signatures JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de pagos
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_id UUID REFERENCES contracts(id),
  professional_id UUID REFERENCES users(id),
  professional_name TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  type TEXT DEFAULT 'milestone',
  status TEXT DEFAULT 'pending',
  payment_method JSONB,
  scheduled_date TIMESTAMP WITH TIME ZONE,
  processed_date TIMESTAMP WITH TIME ZONE,
  description TEXT,
  invoice JSONB,
  blockchain_hash TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de notificaciones
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de asesorías
CREATE TABLE consultations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  professional_id UUID REFERENCES users(id),
  professional_name TEXT NOT NULL,
  specialist_id UUID REFERENCES users(id),
  specialist_name TEXT NOT NULL,
  category TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  scheduled_date TIMESTAMP WITH TIME ZONE,
  duration INTEGER,
  notes TEXT,
  rating INTEGER,
  feedback TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de intereses
CREATE TABLE interests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  professional_id UUID REFERENCES users(id),
  project_id UUID REFERENCES projects(id),
  score INTEGER DEFAULT 0,
  matched_skills TEXT[],
  ai_recommendation BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de recomendaciones de IA
CREATE TABLE ai_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  confidence INTEGER DEFAULT 0,
  data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES users(id)
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
  priority TEXT CHECK (priority IN ('low', 'medium', 'high', 'urgent')) NOT NULL,
  status TEXT CHECK (status IN ('open', 'in-progress', 'waiting-response', 'resolved', 'closed')) DEFAULT 'open',
  assigned_to UUID REFERENCES users(id),
  assigned_to_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  resolved_at TIMESTAMP WITH TIME ZONE
);

-- Tabla de mensajes de tickets
CREATE TABLE ticket_messages (
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
  requirements TEXT[] DEFAULT '{}',
  skills TEXT[] DEFAULT '{}',
  experience_required INTEGER DEFAULT 0,
  salary_range JSONB DEFAULT '{"min": 0, "max": 0, "currency": "USD"}',
  location TEXT,
  type TEXT CHECK (type IN ('full-time', 'part-time', 'contract', 'freelance')) DEFAULT 'full-time',
  status TEXT CHECK (status IN ('open', 'closed', 'draft')) DEFAULT 'draft',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by UUID REFERENCES users(id) ON DELETE CASCADE,
  applications_count INTEGER DEFAULT 0
);

-- Tabla de aplicaciones a trabajos
CREATE TABLE job_applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  job_id UUID REFERENCES job_vacancies(id) ON DELETE CASCADE,
  freelancer_id UUID REFERENCES users(id) ON DELETE CASCADE,
  freelancer_name TEXT NOT NULL,
  freelancer_email TEXT NOT NULL,
  cover_letter TEXT,
  status TEXT CHECK (status IN ('pending', 'reviewing', 'interview', 'accepted', 'rejected')) DEFAULT 'pending',
  applied_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  evaluation_score INTEGER,
  notes TEXT
);

-- Tabla de evaluaciones
CREATE TABLE evaluations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  freelancer_id UUID REFERENCES users(id) ON DELETE CASCADE,
  evaluator_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type TEXT CHECK (type IN ('initial', 'periodic', 'project')) DEFAULT 'initial',
  date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  scores JSONB DEFAULT '{"technical": 0, "communication": 0, "punctuality": 0, "quality": 0, "teamwork": 0}',
  overall_score INTEGER DEFAULT 0,
  comments TEXT,
  recommendations TEXT
);

-- Políticas de seguridad RLS (Row Level Security)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultations ENABLE ROW LEVEL SECURITY;
ALTER TABLE interests ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_recommendations ENABLE ROW LEVEL SECURITY;

-- Políticas básicas (ajustar según necesidades)
CREATE POLICY "Users can view own data" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own data" ON users FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Projects are viewable by company and professionals" ON projects FOR SELECT USING (
  company_id = auth.uid() OR 
  auth.uid() = ANY(professionals)
);

CREATE POLICY "Companies can manage their projects" ON projects FOR ALL USING (company_id = auth.uid());

-- Más políticas según sea necesario...

-- Políticas RLS para support_tickets
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own tickets" ON support_tickets
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own tickets" ON support_tickets
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tickets" ON support_tickets
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all tickets" ON support_tickets
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

-- Políticas RLS para ticket_messages
ALTER TABLE ticket_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view messages of their tickets" ON ticket_messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM support_tickets 
      WHERE support_tickets.id = ticket_messages.ticket_id 
      AND support_tickets.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can add messages to their tickets" ON ticket_messages
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM support_tickets 
      WHERE support_tickets.id = ticket_messages.ticket_id 
      AND support_tickets.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all messages" ON ticket_messages
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

-- Políticas RLS para support_notifications
ALTER TABLE support_notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own notifications" ON support_notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" ON support_notifications
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all notifications" ON support_notifications
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

-- Políticas RLS para job_vacancies
ALTER TABLE job_vacancies ENABLE ROW LEVEL SECURITY;

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

-- Políticas RLS para job_applications
ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Freelancers can view their own applications" ON job_applications
  FOR SELECT USING (freelancer_id = auth.uid());

CREATE POLICY "Companies can view applications to their jobs" ON job_applications
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM job_vacancies 
      WHERE job_vacancies.id = job_applications.job_id 
      AND job_vacancies.created_by = auth.uid()
    )
  );

CREATE POLICY "Freelancers can create applications" ON job_applications
  FOR INSERT WITH CHECK (freelancer_id = auth.uid());

CREATE POLICY "Companies can update application status" ON job_applications
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM job_vacancies 
      WHERE job_vacancies.id = job_applications.job_id 
      AND job_vacancies.created_by = auth.uid()
    )
  );

-- Políticas RLS para evaluations
ALTER TABLE evaluations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Freelancers can view their own evaluations" ON evaluations
  FOR SELECT USING (freelancer_id = auth.uid());

CREATE POLICY "Evaluators can view evaluations they created" ON evaluations
  FOR SELECT USING (evaluator_id = auth.uid());

CREATE POLICY "Evaluators can create evaluations" ON evaluations
  FOR INSERT WITH CHECK (evaluator_id = auth.uid());

CREATE POLICY "Evaluators can update their evaluations" ON evaluations
  FOR UPDATE USING (evaluator_id = auth.uid());
```

### 4. Configurar Storage (opcional)

Si necesitas almacenar archivos:

1. Ve a **Storage** en el dashboard
2. Crea buckets para diferentes tipos de archivos
3. Configura las políticas de acceso

### 5. Configurar Webhooks (opcional)

Para integración con n8n u otros servicios:

1. Ve a **Database > Webhooks**
2. Crea webhooks para eventos específicos
3. Configura las URLs de destino

## Migración desde Firebase

### 1. Exportar datos de Firebase

```bash
# Instalar Firebase CLI si no lo tienes
npm install -g firebase-tools

# Exportar datos de Firestore
firebase firestore:export ./firebase-export

# Exportar datos de Auth
firebase auth:export ./firebase-export/users.json
```

### 2. Migrar datos a Supabase

Crea un script de migración para convertir los datos de Firebase a Supabase:

```typescript
// scripts/migrate-to-supabase.ts
import { createClient } from '@supabase/supabase-js'
import firebaseData from '../firebase-export'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function migrateData() {
  // Migrar usuarios
  for (const user of firebaseData.users) {
    await supabase.from('users').insert({
      id: user.uid,
      email: user.email,
      name: user.displayName || 'Usuario',
      role: 'profesional',
      created_at: user.metadata.creationTime,
      is_active: !user.disabled
    })
  }

  // Migrar otros datos...
  console.log('Migración completada')
}

migrateData()
```

## Verificación

1. Ejecuta `npm run dev`
2. Verifica que la autenticación funcione
3. Prueba crear/leer/actualizar datos
4. Verifica que los contextos funcionen correctamente

## Troubleshooting

### Error de conexión a Supabase
- Verifica las variables de entorno
- Asegúrate de que la URL y clave sean correctas
- Verifica que el proyecto esté activo

### Errores de RLS (Row Level Security)
- Revisa las políticas de seguridad
- Asegúrate de que el usuario esté autenticado
- Verifica los permisos en las tablas

### Errores de tipos TypeScript
- Verifica que los tipos coincidan con la estructura de la base de datos
- Asegúrate de que los campos usen snake_case
- Revisa las importaciones de tipos 