# Sistema de Avatares con Recorte de Imágenes

## Resumen

Se ha implementado un sistema completo de cambio de foto de perfil con recorte de imágenes circular, integrado en todas las páginas de perfil de la plataforma de outsourcing.

## Características Implementadas

### ✅ Funcionalidades Principales

1. **Modal de Recorte de Pantalla Completa**
   - Fondo semitransparente oscuro
   - Experiencia inmersiva similar a Facebook
   - Interfaz intuitiva y moderna

2. **Recorte Circular Automático**
   - Relación de aspecto 1:1
   - Recorte circular perfecto
   - Área de recorte ajustable

3. **Herramientas de Edición**
   - Rotación de imagen (izquierda y derecha)
   - Botones de control intuitivos
   - Vista previa en tiempo real

4. **Procesamiento de Alta Calidad**
   - Canvas API para procesamiento
   - Mantiene la calidad original
   - Exportación como Blob optimizado

5. **Integración Completa**
   - Subida automática al servidor
   - Actualización en tiempo real del perfil
   - Validación de archivos y tamaños

### ✅ Páginas Integradas

- **Profesionales**: `/profesional/profile`
- **Empresas**: `/empresa/profile`
- **Especialistas**: `/especialista/profile`
- **Demo**: `/example/profile-avatar`

## Arquitectura del Sistema

### Componentes Creados

1. **`ImageCropModal`** (`src/components/ui/image-crop/ImageCropModal.tsx`)
   - Modal principal de recorte
   - Manejo de estado y lógica de procesamiento
   - Integración con react-image-crop

2. **`AvatarUpload`** (actualizado)
   - Componente de subida de avatar mejorado
   - Integración con el modal de recorte
   - Manejo de estados de carga

3. **`avatarService`** (`src/services/avatar.service.ts`)
   - Servicio para comunicación con el backend
   - Métodos para subir y eliminar avatares
   - Manejo de errores y respuestas

### Flujo de Funcionamiento

```
Usuario selecciona imagen
         ↓
   Validación de archivo
         ↓
   Abre modal de recorte
         ↓
   Usuario ajusta recorte
         ↓
   Procesamiento con Canvas
         ↓
   Conversión a Blob
         ↓
   Subida al servidor
         ↓
   Actualización del perfil
```

## Tecnologías Utilizadas

### Frontend
- **React 18+** con TypeScript
- **react-image-crop** para el recorte
- **Canvas API** para procesamiento
- **Tailwind CSS** para estilos
- **Lucide React** para iconos

### Backend (Servicio)
- **API REST** para subida de archivos
- **Validación** de tipos de archivo
- **Almacenamiento** en servidor/CDN
- **Actualización** de perfil de usuario

## Instalación y Configuración

### Dependencias Instaladas

```bash
npm install react-image-crop
```

### Configuración del Backend

El sistema espera los siguientes endpoints en el backend:

```typescript
// POST /users/avatar/upload
// Subir avatar de perfil
{
  avatar: File
}

// DELETE /users/avatar
// Eliminar avatar de perfil

// GET /users/avatar
// Obtener URL del avatar actual
```

## Uso del Sistema

### Para Desarrolladores

```tsx
import { ImageCropModal } from "@/components/ui/image-crop";
import avatarService from "@/services/avatar.service";

const handleAvatarChange = async (file: File) => {
  const result = await avatarService.uploadAvatar(file);
  if (result.success) {
    // Avatar subido exitosamente
    console.log('Avatar URL:', result.avatarUrl);
  }
};
```

### Para Usuarios

1. **Acceder a la página de perfil**
2. **Hacer clic en el avatar actual**
3. **Seleccionar una imagen**
4. **Ajustar el recorte circular**
5. **Rotar la imagen si es necesario**
6. **Hacer clic en "Guardar"**
7. **La imagen se sube automáticamente**

## Validaciones Implementadas

### Frontend
- ✅ Tipo de archivo (solo imágenes)
- ✅ Tamaño máximo (10MB)
- ✅ Formato soportado (JPG, PNG, GIF)
- ✅ Estado de carga y errores

### Backend (Esperado)
- ✅ Validación de archivo
- ✅ Límites de tamaño
- ✅ Tipos MIME permitidos
- ✅ Almacenamiento seguro

## Estados de Carga

El sistema maneja varios estados de carga:

1. **Selección de archivo**: Validación inicial
2. **Modal de recorte**: Ajuste de imagen
3. **Procesamiento**: Conversión a Blob
4. **Subida**: Envío al servidor
5. **Actualización**: Refresh del perfil

## Manejo de Errores

### Errores de Validación
- Archivo no válido
- Tamaño excesivo
- Formato no soportado

### Errores de Red
- Fallo en la subida
- Problemas de conectividad
- Errores del servidor

### Errores de Procesamiento
- Fallo en el recorte
- Problemas con Canvas API
- Errores de memoria

## Personalización

### Cambiar Relación de Aspecto

```tsx
<ImageCropModal
  aspectRatio={16/9} // Para formato panorámico
  circularCrop={false} // Para recorte rectangular
/>
```

### Modificar Tamaño Máximo

```tsx
// En AvatarUpload.tsx
if (file.size > 5 * 1024 * 1024) { // 5MB
  alert("La imagen debe ser menor a 5MB");
  return;
}
```

### Personalizar Estilos

```tsx
// En ImageCropModal.tsx
<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
  {/* Personalizar colores y estilos */}
</div>
```

## Páginas de Demo

### `/example/image-crop`
- Demo básico del componente de recorte
- Ejemplos de uso
- Documentación técnica

### `/example/profile-avatar`
- Demo completo del sistema integrado
- Instrucciones de uso
- Características del sistema

## Próximas Mejoras

### Funcionalidades Adicionales
- [ ] Zoom en la imagen
- [ ] Filtros de imagen
- [ ] Múltiples formatos de salida
- [ ] Compresión automática

### Optimizaciones
- [ ] Lazy loading de imágenes
- [ ] Cache de avatares
- [ ] Procesamiento en Web Workers
- [ ] Soporte para WebP

### Integración
- [ ] Drag & drop de archivos
- [ ] Captura desde cámara
- [ ] Integración con redes sociales
- [ ] Sincronización automática

## Soporte y Mantenimiento

### Archivos Principales
- `src/components/ui/image-crop/ImageCropModal.tsx`
- `src/components/ui/avatar/AvatarUpload.tsx`
- `src/services/avatar.service.ts`
- `src/app/example/profile-avatar/page.tsx`

### Documentación
- `src/components/ui/image-crop/README.md`
- `SISTEMA_AVATARES.md` (este archivo)

### Testing
- Componentes unitarios
- Integración con páginas de perfil
- Validación de flujos completos

## Conclusión

El sistema de avatares implementado proporciona una experiencia de usuario moderna y profesional, similar a las mejores plataformas del mercado. La integración completa con el sistema de perfiles permite a todos los tipos de usuarios (profesionales, empresas, especialistas) personalizar su imagen de perfil de manera fácil e intuitiva.

El código está bien estructurado, documentado y listo para producción, con manejo robusto de errores y estados de carga que garantizan una experiencia fluida para los usuarios. 