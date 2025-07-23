'use client'
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { contractService, userService } from '@/services/supabase';

export default function TestContractPage() {
  const { user } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true);
        const allUsers = await userService.getAllUsers();
        setUsers(allUsers);
      } catch (error) {
        console.error('Error loading users:', error);
        setMessage('Error al cargar usuarios');
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  const createTestContract = async () => {
    if (!user?.id) {
      setMessage('Usuario no autenticado');
      return;
    }

    try {
      // Buscar un profesional para crear el contrato
      const professional = users.find(u => u.role === 'profesional');
      if (!professional) {
        setMessage('No hay profesionales disponibles');
        return;
      }

      const contractData = {
        project_id: 'test-project-id',
        project_title: 'Proyecto de Prueba',
        company_id: user.id,
        company_name: user.name || 'Empresa Test',
        professional_id: professional.id,
        professional_name: professional.name,
        type: 'fixed' as const,
        status: 'draft' as const,
        start_date: new Date().toISOString(),
        end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 días
        value: 5000,
        currency: 'USD',
        payment_terms: 'Mensual',
        signatures: []
      };

      const contractId = await contractService.createContract(contractData);
      setMessage(`Contrato de prueba creado exitosamente con ID: ${contractId}`);
    } catch (error) {
      console.error('Error creating test contract:', error);
      setMessage('Error al crear el contrato de prueba');
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-6"></div>
          <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
        Página de Prueba de Contratos
      </h1>

      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm mb-6">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
          Crear Contrato de Prueba
        </h2>
        
        <button
          onClick={createTestContract}
          className="px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600"
        >
          Crear Contrato de Prueba
        </button>

        {message && (
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg">
            {message}
          </div>
        )}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
          Usuarios Disponibles ({users.length})
        </h2>
        
        <div className="grid gap-4">
          {users.map((user) => (
            <div key={user.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium text-gray-800 dark:text-white">
                    {user.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {user.email}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-500">
                    Rol: {user.role}
                  </p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  user.is_active 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                    : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                }`}>
                  {user.is_active ? 'Activo' : 'Inactivo'}
                </span>
              </div>
            </div>
          ))}
        </div>

        {users.length === 0 && (
          <p className="text-gray-500 dark:text-gray-400 text-center py-8">
            No hay usuarios disponibles
          </p>
        )}
      </div>
    </div>
  );
} 