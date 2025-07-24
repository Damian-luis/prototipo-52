"use client";
import React, { useState, useEffect } from 'react';
import { contractsService } from '@/services/contracts.service';
import { usersService } from '@/services/users.service';
import { useAuth } from '@/context/AuthContext';
import Card from '@/components/ui/card/Card';
import Button from '@/components/ui/button/Button';

export default function TestContractPage() {
  const [contracts, setContracts] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Cargar contratos y usuarios del backend
        const [contractsData, usersData] = await Promise.all([
          contractsService.getAllContracts(),
          usersService.getAllUsers(),
        ]);
        
        setContracts(contractsData);
        setUsers(usersData);
      } catch (error) {
        console.error('Error loading data:', error);
        setError('Error al cargar los datos');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const createTestContract = async () => {
    if (!user?.id) {
      setError('Usuario no autenticado');
      return;
    }

    try {
      setLoading(true);
      const testContract = {
        title: 'Proyecto de Prueba',
        projectId: 'test-project-id',
        companyId: user.id,
        professionalId: 'test-professional-id',
        type: 'fixed' as const,
        status: 'draft' as const,
        startDate: new Date().toISOString(),
        value: 1000,
        currency: 'USD',
        paymentTerms: 'Pago al completar el proyecto',
      };

      const newContract = await contractsService.createContract(testContract);
      setContracts(prev => [newContract, ...prev]);
      setError('');
    } catch (error) {
      console.error('Error creating test contract:', error);
      setError('Error al crear el contrato de prueba');
    } finally {
      setLoading(false);
    }
  };

  if (loading && contracts.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Página de Prueba de Contratos
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Esta página permite probar la funcionalidad de contratos con el backend
          </p>
        </div>

        {error && (
          <Card className="mb-6 p-4 border-red-200 bg-red-50 dark:bg-red-900/10">
            <p className="text-red-800 dark:text-red-200">{error}</p>
          </Card>
        )}

        <div className="grid gap-6 md:grid-cols-2">
          {/* Sección de Contratos */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Contratos ({contracts.length})
              </h2>
              <Button
                onClick={createTestContract}
                disabled={loading}
                loading={loading}
                variant="primary"
                size="sm"
              >
                Crear Contrato de Prueba
              </Button>
            </div>

            <div className="space-y-4">
              {contracts.map((contract) => (
                <div
                  key={contract.id}
                  className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                >
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {contract.project_title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Estado: {contract.status}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Valor: ${contract.value} {contract.currency}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Empresa: {contract.company_name}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Profesional: {contract.professional_name}
                  </p>
                </div>
              ))}

              {contracts.length === 0 && (
                <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                  No hay contratos disponibles
                </p>
              )}
            </div>
          </Card>

          {/* Sección de Usuarios */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Usuarios ({users.length})
            </h2>

            <div className="space-y-4">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                >
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {user.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Email: {user.email}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Rol: {user.role}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Activo: {user.is_active ? 'Sí' : 'No'}
                  </p>
                </div>
              ))}

              {users.length === 0 && (
                <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                  No hay usuarios disponibles
                </p>
              )}
            </div>
          </Card>
        </div>

        {/* Información del Usuario Actual */}
        {user && (
          <Card className="mt-6 p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Usuario Actual
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">ID:</p>
                <p className="font-medium text-gray-900 dark:text-white">{user.id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Nombre:</p>
                <p className="font-medium text-gray-900 dark:text-white">{user.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Email:</p>
                <p className="font-medium text-gray-900 dark:text-white">{user.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Rol:</p>
                <p className="font-medium text-gray-900 dark:text-white capitalize">{user.role}</p>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
} 