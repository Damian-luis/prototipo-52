# Sistema de Recuperación de Contraseña

## Descripción General

El sistema de recuperación de contraseña permite a los usuarios restablecer su contraseña de forma segura cuando la han olvidado. El flujo incluye solicitud de recuperación, validación de token y restablecimiento de contraseña.

## Arquitectura

### Backend (NestJS)

#### Endpoints Disponibles

1. **POST /api/auth/forgot-password**
   - **Propósito**: Solicitar enlace de recuperación
   - **Payload**: `{ email: string }`
   - **Respuesta**: `{ message: string }`
   - **Funcionalidad**: 
     - Busca el usuario por email
     - Genera token seguro de 32 bytes
     - Envía email con enlace de recuperación
     - Token expira en 1 hora

2. **POST /api/auth/validate-reset-token**
   - **Propósito**: Validar token de recuperación
   - **Payload**: `{ token: string }`
   - **Respuesta**: `{ valid: boolean, user: { email: string, fullName: string } }`
   - **Funcionalidad**: Verifica que el token sea válido y no haya expirado

3. **POST /api/auth/reset-password**
   - **Propósito**: Restablecer contraseña
   - **Payload**: `{ token: string, password: string }`
   - **Respuesta**: `{ message: string }`
   - **Funcionalidad**: 
     - Valida token
     - Hashea nueva contraseña
     - Actualiza contraseña del usuario
     - Elimina token usado

#### Seguridad

- **Tokens seguros**: Generados con `crypto.randomBytes(32)`
- **Hashing**: Tokens hasheados con SHA-256 antes de almacenar
- **Expiración**: Tokens expiran en 1 hora
- **Un solo uso**: Tokens se eliminan después de usar
- **Mensajes genéricos**: No revela si el email existe o no

### Frontend (Next.js)

#### Páginas Implementadas

1. **`/forgot-password`** - Solicitud de recuperación
   - Formulario para ingresar email
   - Validación de email
   - Mensaje de confirmación
   - Enlaces de navegación

2. **`/reset-password/[token]`** - Restablecimiento de contraseña
   - Validación automática del token
   - Formulario para nueva contraseña
   - Confirmación de contraseña
   - Validaciones de seguridad

#### Componentes

- **Formularios responsivos** con validación
- **Estados de carga** y manejo de errores
- **Iconos y feedback visual** para mejor UX
- **Navegación intuitiva** entre páginas

## Flujo de Usuario

### 1. Solicitud de Recuperación
```
Usuario → /forgot-password → Ingresa email → Backend valida → Email enviado
```

### 2. Validación de Token
```
Usuario → Click en email → /reset-password/[token] → Backend valida token → Formulario mostrado
```

### 3. Restablecimiento
```
Usuario → Ingresa nueva contraseña → Backend actualiza → Confirmación → Redirección a login
```

## Características de Seguridad

### Backend
- ✅ Tokens criptográficamente seguros
- ✅ Hashing de tokens antes de almacenar
- ✅ Expiración automática (1 hora)
- ✅ Eliminación después de uso
- ✅ Mensajes genéricos por seguridad
- ✅ Validación de email existente

### Frontend
- ✅ Validación de contraseñas
- ✅ Confirmación de contraseña
- ✅ Estados de carga y error
- ✅ Navegación segura
- ✅ UX intuitiva

## Configuración de Email

El sistema utiliza el servicio de email configurado en el backend para enviar los enlaces de recuperación. El email incluye:

- **Asunto**: Recuperación de contraseña
- **Contenido**: Enlace con token de recuperación
- **URL**: `{frontendUrl}/reset-password/{token}`
- **Expiración**: 1 hora

## Archivos del Sistema

### Backend
```
proyecto-52-back/apps/main-service/src/auth/
├── auth.controller.ts          # Endpoints de recuperación
├── auth.service.ts             # Lógica de negocio
├── dto/
│   ├── forgot-password.dto.ts  # Validación de solicitud
│   └── reset-password.dto.ts   # Validación de restablecimiento
└── mail/
    └── mail.service.ts         # Envío de emails
```

### Frontend
```
src/
├── app/
│   ├── forgot-password/
│   │   └── page.tsx            # Página de solicitud
│   └── reset-password/
│       └── [token]/
│           └── page.tsx        # Página de restablecimiento
├── services/
│   └── auth.service.ts         # Servicio de autenticación
└── components/
    └── auth/
        └── SignInForm.tsx      # Enlace de recuperación
```

## Uso

### Para Usuarios
1. Ir a `/signin`
2. Hacer clic en "¿Olvidaste tu contraseña?"
3. Ingresar email en `/forgot-password`
4. Revisar email y hacer clic en el enlace
5. Ingresar nueva contraseña en `/reset-password/[token]`
6. Confirmar cambio y volver a login

### Para Desarrolladores
1. **Agregar enlace**: El enlace ya está en SignInForm
2. **Personalizar emails**: Modificar `mail.service.ts`
3. **Cambiar expiración**: Modificar tiempo en `auth.service.ts`
4. **Estilos**: Personalizar componentes de React

## Pruebas

### Casos de Prueba
- ✅ Email válido → Email enviado
- ✅ Email inválido → Mensaje genérico
- ✅ Token válido → Formulario mostrado
- ✅ Token inválido → Error mostrado
- ✅ Token expirado → Error mostrado
- ✅ Contraseñas diferentes → Error de validación
- ✅ Contraseña corta → Error de validación
- ✅ Restablecimiento exitoso → Confirmación

### Testing Manual
1. Ir a `/forgot-password`
2. Ingresar email válido
3. Verificar email recibido
4. Hacer clic en enlace
5. Probar validaciones de contraseña
6. Confirmar restablecimiento exitoso

## Consideraciones Futuras

- [ ] Integración con reCAPTCHA
- [ ] Límite de intentos por IP
- [ ] Notificaciones push
- [ ] Logs de auditoría
- [ ] Integración con SMS
- [ ] Preguntas de seguridad 