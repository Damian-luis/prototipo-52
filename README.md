# Plataforma de Outsourcing con IA

Una plataforma completa para gestión de outsourcing que conecta empresas con profesionales, utilizando inteligencia artificial para matching y automatización de procesos.

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

- **Frontend**: Next.js 15, React 19, TypeScript
- **Backend**: Firebase (Firestore, Auth, Storage)
- **Styling**: Tailwind CSS 4.0
- **IA**: Webhooks con n8n para análisis y recomendaciones
- **Blockchain**: Integración con contratos inteligentes
- **Estado**: Context API con múltiples providers

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
- `ProjectContext`: Gestión de proyectos y tareas
- `ContractContext`: Contratos y firmas digitales
- `PaymentContext`: Pagos y facturación
- `AIContext`: Recomendaciones y análisis de IA
- `NotificationContext`: Sistema de notificaciones
- `Web3Context`: Integración blockchain

### Servicios Firebase
- `userService`: Gestión de usuarios
- `projectService`: Operaciones de proyectos
- `contractService`: Gestión de contratos
- `paymentService`: Procesamiento de pagos
- `notificationService`: Sistema de notificaciones
- `aiService`: Servicios de IA
- `webhookService`: Integración con n8n

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

3. **Configurar Firebase**
   - Crear proyecto en Firebase Console
   - Habilitar Authentication, Firestore y Storage
   - Copiar configuración a `.env.local`

4. **Configurar variables de entorno**
```bash
cp .env.local.example .env.local
# Editar .env.local con tus credenciales de Firebase
```

5. **Ejecutar en desarrollo**
```bash
npm run dev
```

## 🔧 Configuración de Firebase

### 1. Crear Proyecto
- Ve a [Firebase Console](https://console.firebase.google.com/)
- Crea un nuevo proyecto
- Habilita Authentication, Firestore Database y Storage

### 2. Configurar Authentication
- Habilita Email/Password authentication
- Configura las reglas de seguridad

### 3. Configurar Firestore
- Crea la base de datos en modo de prueba
- Configura las reglas de seguridad

### 4. Configurar Storage
- Habilita Cloud Storage
- Configura las reglas de seguridad

## 📊 Estructura de Datos

### Colecciones Firestore
- `users`: Usuarios del sistema
- `projects`: Proyectos de outsourcing
- `contracts`: Contratos entre empresas y profesionales
- `payments`: Transacciones de pago
- `notifications`: Notificaciones del sistema
- `consultations`: Asesorías profesionales
- `interests`: Intereses de profesionales en proyectos
- `aiRecommendations`: Recomendaciones de IA

## 🤖 Integración con IA

La plataforma utiliza webhooks con n8n para:
- **Análisis de perfiles**: Evaluación automática de habilidades
- **Matching de profesionales**: Recomendaciones inteligentes
- **Análisis de proyectos**: Optimización de requerimientos

### Configuración de n8n
1. Instalar n8n
2. Crear workflows para análisis de IA
3. Configurar webhooks para recibir datos
4. Configurar la URL del webhook en `.env.local`

## 🔐 Seguridad

- Autenticación con Firebase Auth
- Reglas de seguridad en Firestore
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

- [ ] Implementar tests unitarios y de integración
- [ ] Optimizar rendimiento y SEO
- [ ] Implementar PWA
- [ ] Añadir más integraciones (Stripe, PayPal)
- [ ] Implementar sistema de gamificación
- [ ] Añadir funcionalidades de chat en tiempo real

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
