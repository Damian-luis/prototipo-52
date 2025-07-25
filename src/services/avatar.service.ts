import api from '@/util/axios';

export interface AvatarUploadResponse {
  success: boolean;
  message: string;
  avatarUrl?: string;
  user?: any; // Usuario actualizado del backend
}

const avatarService = {
  // Subir avatar de perfil
  async uploadAvatar(file: File): Promise<AvatarUploadResponse> {
    try {
      const formData = new FormData();
      formData.append('file', file); // El backend espera 'file'
      
      const response = await api.patch('/users/me/profile-picture', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      // El backend devuelve el usuario completo actualizado
      const updatedUser = response.data;
      
      // Actualizar el localStorage con el usuario actualizado
      if (typeof window !== 'undefined') {
        const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
        const newUser = {
          ...currentUser,
          profile_picture: updatedUser.avatar, // Mapear avatar a profile_picture
        };
        localStorage.setItem('user', JSON.stringify(newUser));
      }
      
      return {
        success: true,
        message: 'Avatar subido exitosamente',
        avatarUrl: updatedUser.avatar,
        user: updatedUser,
      };
    } catch (error: any) {
      console.error('Error uploading avatar:', error);
      const message = error.response?.data?.message || 'Error al subir el avatar';
      return {
        success: false,
        message,
      };
    }
  },

  // Eliminar avatar de perfil
  async removeAvatar(): Promise<AvatarUploadResponse> {
    try {
      // Como no hay endpoint específico para eliminar, actualizamos con null
      const response = await api.patch('/users/me', {
        avatar: null
      });
      
      // Actualizar el localStorage
      if (typeof window !== 'undefined') {
        const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
        const newUser = {
          ...currentUser,
          profile_picture: null,
        };
        localStorage.setItem('user', JSON.stringify(newUser));
      }
      
      return {
        success: true,
        message: 'Avatar eliminado exitosamente',
      };
    } catch (error: any) {
      console.error('Error removing avatar:', error);
      const message = error.response?.data?.message || 'Error al eliminar el avatar';
      return {
        success: false,
        message,
      };
    }
  },

  // Obtener URL del avatar actual
  async getAvatarUrl(): Promise<string | null> {
    try {
      const response = await api.get('/users/me');
      return response.data.avatar || null;
    } catch (error) {
      console.error('Error getting avatar URL:', error);
      return null;
    }
  },
};

export default avatarService; 