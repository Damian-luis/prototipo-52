# Guía de Solución de Problemas - Supabase

## Error: PGRST116 - The result contains 0 rows

### Descripción del Problema
```
GET https://hbcbmepbslllfvmrbcsw.supabase.co/rest/v1/users?select=*&id=eq.23e36611-597c-4f15-ba2d-bd095566151d 406 (Not Acceptable)
Error getting user: {code: 'PGRST116', details: 'The result contains 0 rows', hint: null, message: 'JSON object requested, multiple (or no) rows returned'}
```

### Causas Posibles
1. **Tabla `users` no existe** en la base de datos
2. **Usuario no existe** en la tabla `users` pero sí en Auth
3. **Políticas RLS** bloqueando el acceso
4. **Estructura de tabla incorrecta**

### Solución Paso a Paso

#### 1. Verificar y Crear la Tabla Users

Ejecuta el siguiente script SQL en el **SQL Editor** de Supabase:

```sql
-- Crear tabla users si no existe
CREATE TABLE IF NOT EXISTS users (
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

-- Habilitar RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Crear políticas RLS
CREATE POLICY IF NOT EXISTS "Users can view own data" ON users 
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY IF NOT EXISTS "Users can update own data" ON users 
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY IF NOT EXISTS "Users can insert own data" ON users 
  FOR INSERT WITH CHECK (auth.uid() = id);
```

#### 2. Usar la Página de Diagnóstico

1. Ve a `http://localhost:3000/diagnostic`
2. Ejecuta el diagnóstico
3. Revisa los resultados
4. Usa los botones de acción para:
   - Crear usuario de prueba
   - Sincronizar usuarios

#### 3. Verificar Manualmente

En el **SQL Editor** de Supabase, ejecuta:

```sql
-- Verificar si la tabla existe
SELECT table_name FROM information_schema.tables WHERE table_name = 'users';

-- Verificar si hay usuarios
SELECT COUNT(*) FROM users;

-- Verificar usuario específico
SELECT * FROM users WHERE id = '23e36611-597c-4f15-ba2d-bd095566151d';

-- Verificar políticas RLS
SELECT * FROM pg_policies WHERE tablename = 'users';
```

#### 4. Crear Usuario Manualmente

Si el usuario existe en Auth pero no en la tabla `users`:

```sql
-- Obtener información del usuario de Auth
-- (Esto requiere permisos de administrador)
SELECT * FROM auth.users WHERE id = '23e36611-597c-4f15-ba2d-bd095566151d';

-- Crear usuario en la tabla users
INSERT INTO users (id, email, name, role, is_active, created_at)
VALUES (
  '23e36611-597c-4f15-ba2d-bd095566151d',
  'email@example.com',
  'Nombre del Usuario',
  'profesional',
  true,
  NOW()
);
```

#### 5. Verificar Variables de Entorno

Asegúrate de que las variables de entorno estén configuradas correctamente:

```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-clave-anonima
```

#### 6. Reiniciar la Aplicación

1. Detén el servidor de desarrollo (`Ctrl+C`)
2. Ejecuta `npm run dev` nuevamente
3. Limpia el caché del navegador
4. Intenta autenticarte nuevamente

### Prevención

Para evitar este problema en el futuro:

1. **Siempre ejecuta el script de configuración** al crear un nuevo proyecto
2. **Usa la página de diagnóstico** regularmente
3. **Implementa manejo de errores robusto** en el AuthContext
4. **Sincroniza usuarios de Auth** con la tabla `users` automáticamente

### Códigos de Error Comunes

| Código | Descripción | Solución |
|--------|-------------|----------|
| PGRST116 | No rows returned | Usuario no existe en la tabla |
| PGRST301 | Missing required claim | Problema con RLS |
| PGRST302 | JWT expired | Token expirado |
| PGRST303 | JWT invalid | Token inválido |

### Recursos Adicionales

- [Documentación de Supabase](https://supabase.com/docs)
- [Guía de RLS](https://supabase.com/docs/guides/auth/row-level-security)
- [Troubleshooting de Auth](https://supabase.com/docs/guides/auth/troubleshooting) 