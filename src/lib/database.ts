import { supabase } from './supabase';

export const databaseUtils = {
  // Verificar si la tabla users existe
  async checkUsersTable(): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('count')
        .limit(1);
      
      return !error;
    } catch (error) {
      console.error('Error checking users table:', error);
      return false;
    }
  },

  // Crear tabla users si no existe
  async createUsersTable(): Promise<boolean> {
    try {
      const { error } = await supabase.rpc('create_users_table_if_not_exists');
      return !error;
    } catch (error) {
      console.error('Error creating users table:', error);
      return false;
    }
  },

  // Verificar si hay usuarios en la tabla
  async checkUsersExist(): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id')
        .limit(1);
      
      if (error) return false;
      return data && data.length > 0;
    } catch (error) {
      console.error('Error checking users exist:', error);
      return false;
    }
  },

  // Crear usuario de prueba
  async createTestUser(): Promise<boolean> {
    try {
      const testUser = {
        id: 'test-user-id',
        email: 'test@example.com',
        name: 'Usuario de Prueba',
        role: 'profesional',
        is_active: true,
        created_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('users')
        .insert([testUser]);
      
      return !error;
    } catch (error) {
      console.error('Error creating test user:', error);
      return false;
    }
  },

  // Crear usuario actual en la tabla users
  async createCurrentUser(): Promise<boolean> {
    try {
      // Obtener el usuario actual de Auth
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        console.error('Error getting current user:', authError);
        return false;
      }

      // Crear usuario en la tabla users
      const userData = {
        id: user.id,
        email: user.email || '',
        name: user.user_metadata?.name || 'Usuario',
        role: user.user_metadata?.role || 'profesional',
        is_active: true,
        created_at: user.created_at,
      };

      const { error: insertError } = await supabase
        .from('users')
        .insert([userData]);

      if (insertError) {
        console.error('Error creating current user in table:', insertError);
        return false;
      }

      console.log('Current user created successfully in users table');
      return true;
    } catch (error) {
      console.error('Error creating current user:', error);
      return false;
    }
  },

  // Sincronizar usuarios de Auth con la tabla users
  async syncAuthUsers(): Promise<boolean> {
    try {
      // Obtener el usuario actual de Auth (sin permisos de admin)
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        console.error('Error getting current user:', authError);
        return false;
      }

      // Verificar si el usuario ya existe en la tabla users
      const existingUser = await supabase
        .from('users')
        .select('id')
        .eq('id', user.id)
        .single();

      if (!existingUser.data) {
        // Crear usuario en la tabla users
        const userData = {
          id: user.id,
          email: user.email || '',
          name: user.user_metadata?.name || 'Usuario',
          role: user.user_metadata?.role || 'profesional',
          is_active: true,
          created_at: user.created_at,
        };

        const { error: insertError } = await supabase
          .from('users')
          .insert([userData]);

        if (insertError) {
          console.error('Error creating user in table:', insertError);
          return false;
        }

        console.log('User created successfully in users table');
      } else {
        console.log('User already exists in users table');
      }

      return true;
    } catch (error) {
      console.error('Error syncing Auth users:', error);
      return false;
    }
  }
}; 