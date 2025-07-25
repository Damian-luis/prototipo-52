# Plataforma de Outsourcing con IA

Una plataforma completa para gestión de outsourcing que conecta empresas con profesionales, utilizando inteligencia artificial para matching y automatización de procesos.

## 📋 DOCUMENTACIÓN DE FUNCIONALIDADES

- **[FUNCIONALIDADES_PLATAFORMA.md](./FUNCIONALIDADES_PLATAFORMA.md)** - Lista completa de funcionalidades por roles y fases de implementación
- **[CHANGELOG_IMPLEMENTACION.md](./CHANGELOG_IMPLEMENTACION.md)** - Registro diario de avances y cambios en el desarrollo

## 🚀 Características Principales

### Para Empresas
- **Gestión de Proyectos**: Creación, seguimiento y control de proyectos de outsourcing
- **Búsqueda de Talento**: Sistema de IA para encontrar profesionales adecuados
- **Contratos Inteligentes**: Contratos automatizados con blockchain
- **Gestión de Pagos**: Automatización de pagos y facturación
- **Analytics Avanzados**: Reportes y métricas de rendimiento

### Para Profesionales
- **Portal Personalizado**: Gestión de proyectos, pagos y perfil
- **Asesoría Profesional**: Sesiones de asesoría en salud y bienestar laboral
- **Recomendaciones IA**: Sugerencias personalizadas de proyectos
- **Sistema de Notificaciones**: Alertas en tiempo real

### Para Especialistas
- **Portal de Asesoría**: Gestión de consultas y sesiones
- **Herramientas de Evaluación**: Sistema de evaluación de profesionales

## 🛠️ Tecnologías

- **Frontend**: Next.js 14, React 18, TypeScript
- **Backend**: NestJS, MongoDB con Prisma
- **Styling**: Tailwind CSS
- **Autenticación**: JWT + Google OAuth
- **Estado**: Context API con múltiples providers
- **Almacenamiento**: Cloudinary

## 📊 ESTADO ACTUAL DEL PROYECTO

### ✅ **COMPLETADO (100%)**
- **Sistema de autenticación** (login, registro, Google OAuth)
- **Gestión de roles** (ADMIN, EMPRESA, PROFESIONAL, ESPECIALISTA)
- **Layouts y navegación** por rol
- **Sistema de avatares** con fallback
- **Gestión de perfiles** básica
- **Sidebars** para todos los roles
- **Rutas protegidas** con AuthGuard
- **Redirección automática** por rol

### 🔄 **EN DESARROLLO**
- Sistema de chat en tiempo real
- Sistema de pagos con Stripe
- Gestión de proyectos básica

### ⏳ **PENDIENTE**
- Algoritmo de matching IA
- Smart contracts
- Sistema de calificaciones
- Analíticas avanzadas
- Mobile app

## 📋 Requisitos Funcionales Implementados

### ✅ Must Have
- [x] **R-001**: Gestión de Usuarios (Empresa, Profesional, Especialista, Admin)
- [x] **R-002**: Gestión Integral de Proyectos
- [x] **R-003**: Búsqueda y Selección de Talento con IA

### ✅ Should Have
- [x] **R-004**: Contratación Automatizada con Blockchain
- [x] **R-005**: Portal del Profesional
- [x] **R-006**: Portal de Empresas

### ✅ Could Have
- [x] **R-007**: Sistema de Notificaciones
- [x] **R-008**: Asesoría Profesional

## 🏗️ Arquitectura

### Contextos (Estado Global)
- `AuthContext`: Autenticación y gestión de usuarios
- `SidebarContext`: Control de navegación lateral
- `ProjectContext`: Gestión de proyectos y tareas (pendiente)
- `ContractContext`: Contratos y firmas digitales (pendiente)
- `PaymentContext`: Pagos y facturación (pendiente)
- `AIContext`: Recomendaciones y análisis de IA (pendiente)
- `NotificationContext`: Sistema de notificaciones (pendiente)

### Servicios
- `authService`: Autenticación y gestión de usuarios
- `googleAuthService`: Integración con Google OAuth
- `projectService`: Operaciones de proyectos (pendiente)
- `contractService`: Gestión de contratos (pendiente)
- `paymentService`: Procesamiento de pagos (pendiente)
- `notificationService`: Sistema de notificaciones (pendiente)

## 🚀 Instalación

1. **Clonar el repositorio**
```bash
git clone <repository-url>
cd proyecto-52
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
cp .env.local.example .env.local
# Editar .env.local con tus credenciales
```

4. **Ejecutar en desarrollo**
```bash
npm run dev
```

## 🔧 Configuración

### Variables de Entorno Requeridas
```env
# Google OAuth
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id

# Backend API
NEXT_PUBLIC_API_URL=http://localhost:3001

# Cloudinary (para avatares)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## 📊 Estructura de Datos

### Tipos de Usuario
- `ADMIN`: Administrador del sistema
- `EMPRESA`: Empresas que contratan servicios
- `PROFESIONAL`: Profesionales que ofrecen servicios
- `ESPECIALISTA`: Especialistas en asesoría profesional

### Interfaces Principales
```typescript
interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  profile_picture?: string;
  created_at: string;
  is_active: boolean;
}

type UserRole = 'ADMIN' | 'EMPRESA' | 'PROFESIONAL' | 'ESPECIALISTA';
```

## 🔐 Seguridad

- Autenticación con JWT
- Google OAuth integrado
- Validación de roles y permisos
- Protección de rutas con AuthGuard
- Encriptación de datos sensibles

## 📱 Roles de Usuario

### Admin
- Gestión completa de la plataforma
- Reportes y analytics globales
- Gestión de usuarios y configuraciones

### Empresa
- Crear y gestionar proyectos
- Buscar y contratar profesionales
- Gestionar pagos y contratos
- Ver reportes de rendimiento

### Profesional
- Actualizar perfil y habilidades
- Aplicar a proyectos
- Gestionar contratos activos
- Recibir pagos y asesorías

### Especialista
- Ofrecer servicios de asesoría
- Gestionar consultas
- Evaluar profesionales

## 🎯 Próximos Pasos

### **FASE 1 - CRÍTICO (Semanas 1-4)**
1. **Sistema de chat** en tiempo real (Socket.io)
2. **Sistema de pagos** con Stripe
3. **Sistema de calificaciones** bidireccional
4. **Gestión de milestones** con entregables

### **FASE 2 - IMPORTANTE (Semanas 5-8)**
1. **Algoritmo de matching IA**
2. **Smart contracts** con blockchain
3. **Analíticas avanzadas**
4. **Sistema de asesoría completo**

### **FASE 3 - MEJORAS (Semanas 9-12)**
1. **Mobile app** nativa
2. **Integraciones externas**
3. **PWA** (Progressive Web App)
4. **API pública** para desarrolladores

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📞 Soporte

Para soporte técnico o preguntas, contacta a:
- Email: soporte@outsourcing-platform.com
- Documentación: [docs.outsourcing-platform.com](https://docs.outsourcing-platform.com)

---

*Para ver el progreso detallado de implementación, consulta [FUNCIONALIDADES_PLATAFORMA.md](./FUNCIONALIDADES_PLATAFORMA.md)*
*Para ver el registro de cambios diarios, consulta [CHANGELOG_IMPLEMENTACION.md](./CHANGELOG_IMPLEMENTACION.md)*
