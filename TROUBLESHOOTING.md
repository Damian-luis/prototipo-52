# Guía de Solución de Problemas - Backend NestJS

## Error: Conexión al Backend

### Descripción del Problema
```
GET http://localhost:3000/api/users 500 (Internal Server Error)
Error connecting to backend: Network Error
```

### Causas Posibles
1. **Backend NestJS no está ejecutándose**
2. **Puerto incorrecto** en la configuración
3. **Variables de entorno** mal configuradas
4. **Problemas de CORS**
5. **Token de autenticación inválido**

### Solución Paso a Paso

#### 1. Verificar que el Backend esté Ejecutándose

1. Navega al directorio del backend: `cd proyecto-52-back`
2. Ejecuta: `npm run start:dev`
3. Verifica que el servidor esté corriendo en `http://localhost:3000`

#### 2. Verificar Variables de Entorno

Asegúrate de que las variables de entorno estén configuradas correctamente:

```env
# Frontend (.env.local)
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_GOOGLE_CLIENT_ID=tu-google-client-id

# Backend (.env)
DATABASE_URL=mongodb://localhost:27017/proyecto52
JWT_SECRET=tu-jwt-secret
GOOGLE_CLIENT_ID=tu-google-client-id
GOOGLE_CLIENT_SECRET=tu-google-client-secret
```

#### 3. Usar la Página de Diagnóstico

1. Ve a `http://localhost:4000/diagnostic`
2. Ejecuta el diagnóstico
3. Revisa los resultados
4. Usa los botones de acción para:
   - Probar conexión al backend
   - Verificar autenticación
   - Probar endpoints de la API

#### 4. Verificar Configuración de CORS

En el backend NestJS, asegúrate de que CORS esté configurado correctamente:

```typescript
// main.ts
app.enableCors({
  origin: ['http://localhost:4000'],
  credentials: true,
});
```

#### 5. Verificar Autenticación

1. Limpia el localStorage del navegador
2. Intenta autenticarte nuevamente
3. Verifica que el token se guarde correctamente
4. Revisa los headers de autorización en las peticiones

#### 6. Reiniciar la Aplicación

1. Detén el servidor de desarrollo del frontend (`Ctrl+C`)
2. Detén el servidor del backend (`Ctrl+C`)
3. Ejecuta `npm run dev` en el frontend
4. Ejecuta `npm run start:dev` en el backend
5. Limpia el caché del navegador
6. Intenta autenticarte nuevamente

### Prevención

Para evitar este problema en el futuro:

1. **Siempre verifica que ambos servidores estén corriendo**
2. **Usa la página de diagnóstico** regularmente
3. **Implementa manejo de errores robusto** en los servicios
4. **Configura correctamente las variables de entorno**

### Códigos de Error Comunes

| Código | Descripción | Solución |
|--------|-------------|----------|
| 401 | Unauthorized | Token inválido o expirado |
| 403 | Forbidden | Permisos insuficientes |
| 404 | Not Found | Endpoint no existe |
| 500 | Internal Server Error | Error del servidor |
| Network Error | Sin conexión | Backend no está corriendo |

### Recursos Adicionales

- [Documentación de NestJS](https://docs.nestjs.com/)
- [Guía de Autenticación JWT](https://docs.nestjs.com/security/authentication)
- [Configuración de CORS](https://docs.nestjs.com/security/cors) 