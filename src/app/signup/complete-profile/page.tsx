"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { usersService } from '@/services/users.service';
import Card from '@/components/ui/card/Card';
import Button from '@/components/ui/button/Button';
import Input from '@/components/ui/input/Input';

export default function CompleteProfilePage() {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    country: '',
    role: 'profesional' as 'profesional' | 'empresa' | 'especialista' | 'admin',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      router.push('/signin');
      return;
    }

    // Cargar datos del usuario desde el backend
    const loadUserData = async () => {
      try {
        if (user.id) {
          const userData = await usersService.getUserById(user.id);
          if (userData) {
            setForm(prev => ({
              ...prev,
              name: userData.name || '',
              phone: userData.phone || '',
              address: userData.address || '',
              city: userData.city || '',
              country: userData.country || '',
              role: userData.role || 'profesional',
            }));
          }
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    };

    loadUserData();
  }, [user, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!user?.id) {
        throw new Error('Usuario no autenticado');
      }

      // Actualizar perfil del usuario en el backend
      const updateData = {
        name: form.name,
        phone: form.phone,
        address: form.address,
        city: form.city,
        country: form.country,
        role: form.role,
      };

      await usersService.updateUser(user.id, updateData);

      // Redirigir según el rol
      switch (form.role) {
        case 'empresa':
          router.push('/empresa');
          break;
        case 'profesional':
          router.push('/profesional');
          break;
        case 'especialista':
          router.push('/especialista');
          break;
        default:
          router.push('/');
      }
    } catch (error: any) {
      console.error('Error updating profile:', error);
      setError(error.response?.data?.message || 'Error al actualizar el perfil');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Completar Perfil
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Completa tu información para continuar
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 px-4 py-3 rounded-md">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <Input
              label="Nombre completo"
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              required
            />

            <Input
              label="Teléfono"
              name="phone"
              type="tel"
              value={form.phone}
              onChange={handleChange}
            />

            <Input
              label="Dirección"
              name="address"
              type="text"
              value={form.address}
              onChange={handleChange}
            />

            <Input
              label="Ciudad"
              name="city"
              type="text"
              value={form.city}
              onChange={handleChange}
            />

            <Input
              label="País"
              name="country"
              type="text"
              value={form.country}
              onChange={handleChange}
            />

            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Rol
              </label>
              <select
                id="role"
                name="role"
                value={form.role}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                required
              >
                <option value="profesional">Profesional</option>
                <option value="empresa">Empresa</option>
                <option value="especialista">Especialista</option>
              </select>
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            className="w-full"
            loading={loading}
            disabled={loading}
          >
            {loading ? 'Actualizando...' : 'Completar Perfil'}
          </Button>
        </form>
      </Card>
    </div>
  );
} 