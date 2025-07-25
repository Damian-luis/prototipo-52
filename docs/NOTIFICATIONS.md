# Sistema de Notificaciones

Este documento describe el sistema de notificaciones implementado en la aplicación, que reemplaza los alerts nativos del navegador por notificaciones personalizadas y elegantes.

## Características

- ✅ **Notificaciones Toast**: Aparecen en la esquina superior derecha
- 🎨 **Diseño consistente**: Colores y estilos que coinciden con la aplicación
- 📱 **Responsive**: Se adaptan a diferentes tamaños de pantalla
- ⚡ **Rápidas**: Animaciones suaves y transiciones fluidas
- 🔧 **Configurables**: Opciones personalizables para cada notificación

## Tipos de Notificaciones

### 1. Notificaciones Básicas

```typescript
import { showSuccess, showError, showWarning, showInfo } from '@/util/notifications';

// Éxito (verde)
showSuccess('Operación completada exitosamente');

// Error (rojo)
showError('Ha ocurrido un error');

// Advertencia (amarillo)
showWarning('Ten cuidado con esta acción');

// Información (azul)
showInfo('Información importante');
```

### 2. Notificaciones con Opciones Personalizadas

```typescript
import { showNotification } from '@/util/notifications';

showNotification('Mensaje personalizado', 'success', {
  duration: 6000, // 6 segundos
  position: 'top-center',
});
```

### 3. Notificaciones de Carga

```typescript
import { showLoading, updateLoading } from '@/util/notifications';

// Mostrar carga
const loadingId = showLoading('Subiendo archivo...');

// Actualizar con resultado
updateLoading(loadingId, 'Archivo subido exitosamente', 'success');
```

### 4. Notificaciones con Promesas

```typescript
import { showPromise } from '@/util/notifications';

const uploadPromise = uploadFile(file);

showPromise(uploadPromise, {
  loading: 'Subiendo archivo...',
  success: 'Archivo subido exitosamente',
  error: 'Error al subir el archivo'
});
```

### 5. Notificaciones con Acciones

```typescript
import { showNotificationWithAction } from '@/util/notifications';

showNotificationWithAction(
  'Archivo eliminado',
  () => restoreFile(), // Función para deshacer
  'Deshacer',
  'success'
);
```

### 6. Confirmaciones

```typescript
import { showConfirm } from '@/util/notifications';

showConfirm(
  '¿Estás seguro de que quieres eliminar este archivo?',
  () => deleteFile(), // Función de confirmación
  () => console.log('Cancelado'), // Función de cancelación
  'Eliminar',
  'Cancelar'
);
```

## Hook Personalizado

Para facilitar el uso, se ha creado un hook personalizado:

```typescript
import { useNotifications } from '@/hooks/useNotifications';

function MyComponent() {
  const { success, error, warning, info, loading, promise } = useNotifications();

  const handleSubmit = async () => {
    try {
      const result = await submitForm();
      success('Formulario enviado exitosamente');
    } catch (err) {
      error('Error al enviar el formulario');
    }
  };

  const handleUpload = async (file: File) => {
    const uploadPromise = uploadFile(file);
    
    promise(uploadPromise, {
      loading: 'Subiendo archivo...',
      success: 'Archivo subido exitosamente',
      error: 'Error al subir el archivo'
    });
  };
}
```

## Configuración Global

El sistema de notificaciones se configura globalmente en el layout principal:

```typescript
// src/app/layout.tsx
import Toaster from '@/components/ui/Toaster';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Toaster /> {/* Componente que renderiza las notificaciones */}
      </body>
    </html>
  );
}
```

## Personalización

### Colores por Tipo

- **Success**: Verde (#10B981)
- **Error**: Rojo (#EF4444)
- **Warning**: Amarillo (#F59E0B)
- **Info**: Azul (#3B82F6)

### Posiciones Disponibles

- `top-right` (por defecto)
- `top-left`
- `top-center`
- `bottom-right`
- `bottom-left`
- `bottom-center`

### Opciones de Configuración

```typescript
interface ToastOptions {
  duration?: number; // Duración en milisegundos
  position?: string; // Posición de la notificación
  style?: object; // Estilos CSS personalizados
  icon?: string; // Icono personalizado
}
```

## Migración desde Alerts

### Antes (Alerts nativos)
```typescript
alert('Error al guardar los datos');
alert('Datos guardados exitosamente');
```

### Después (Notificaciones personalizadas)
```typescript
import { showError, showSuccess } from '@/util/notifications';

showError('Error al guardar los datos');
showSuccess('Datos guardados exitosamente');
```

## Mejores Prácticas

1. **Usar el tipo correcto**: 
   - `success` para operaciones exitosas
   - `error` para errores
   - `warning` para advertencias
   - `info` para información general

2. **Mensajes claros y concisos**:
   ```typescript
   // ✅ Bueno
   showSuccess('Perfil actualizado exitosamente');
   
   // ❌ Malo
   showSuccess('El perfil del usuario ha sido actualizado exitosamente en la base de datos');
   ```

3. **Usar notificaciones de carga para operaciones largas**:
   ```typescript
   const loadingId = showLoading('Procesando...');
   try {
     await longOperation();
     updateLoading(loadingId, 'Completado', 'success');
   } catch (error) {
     updateLoading(loadingId, 'Error', 'error');
   }
   ```

4. **Evitar notificaciones excesivas**:
   - No mostrar notificaciones para acciones menores
   - Usar notificaciones solo cuando sea necesario informar al usuario

## Ejemplos de Uso Comunes

### Formularios
```typescript
const handleSubmit = async (data: FormData) => {
  const loadingId = showLoading('Guardando...');
  
  try {
    await saveData(data);
    updateLoading(loadingId, 'Datos guardados exitosamente', 'success');
  } catch (error) {
    updateLoading(loadingId, 'Error al guardar los datos', 'error');
  }
};
```

### Subida de Archivos
```typescript
const handleFileUpload = async (file: File) => {
  const uploadPromise = uploadFile(file);
  
  showPromise(uploadPromise, {
    loading: 'Subiendo archivo...',
    success: 'Archivo subido exitosamente',
    error: 'Error al subir el archivo'
  });
};
```

### Confirmaciones
```typescript
const handleDelete = () => {
  showConfirm(
    '¿Estás seguro de que quieres eliminar este elemento?',
    () => deleteItem(),
    undefined,
    'Eliminar',
    'Cancelar'
  );
};
```

## Troubleshooting

### Problema: Las notificaciones no aparecen
**Solución**: Verificar que el componente `<Toaster />` esté incluido en el layout principal.

### Problema: Las notificaciones aparecen en la posición incorrecta
**Solución**: Verificar la configuración de posición en las opciones del toast.

### Problema: Los estilos no se aplican correctamente
**Solución**: Verificar que no haya conflictos con CSS personalizado que sobrescriba los estilos del toast. 