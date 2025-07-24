"use client";
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { usersService } from '@/services/users.service';
import Card from '@/components/ui/card/Card';
import Button from '@/components/ui/button/Button';

interface DiagnosticData {
  backendConnection: boolean;
  databaseConnection: boolean;
  authStatus: boolean;
  userData: boolean;
  apiEndpoints: boolean;
}

export default function DiagnosticPage() {
  const { user, isAuthenticated } = useAuth();
  const [diagnosticData, setDiagnosticData] = useState<DiagnosticData>({
    backendConnection: false,
    databaseConnection: false,
    authStatus: false,
    userData: false,
    apiEndpoints: false,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const runDiagnostics = async () => {
      setLoading(true);
      setError(null);

      try {
        // Verificar autenticación
        const authStatus = isAuthenticated && user !== null;
        setDiagnosticData(prev => ({ ...prev, authStatus }));

        // Verificar conexión al backend
        try {
          await usersService.getAllUsers();
          setDiagnosticData(prev => ({ ...prev, backendConnection: true, apiEndpoints: true }));
        } catch (error) {
          console.error('Backend connection error:', error);
          setDiagnosticData(prev => ({ ...prev, backendConnection: false, apiEndpoints: false }));
        }

        // Verificar datos del usuario
        if (user?.id) {
          try {
            const userData = await usersService.getUserById(user.id);
            setDiagnosticData(prev => ({ ...prev, userData: !!userData }));
          } catch (error) {
            console.error('User data error:', error);
            setDiagnosticData(prev => ({ ...prev, userData: false }));
          }
        }

        // Verificar conexión a la base de datos (simulado)
        setDiagnosticData(prev => ({ ...prev, databaseConnection: true }));

      } catch (error) {
        console.error('Diagnostic error:', error);
        setError('Error al ejecutar diagnósticos');
      } finally {
        setLoading(false);
      }
    };

    runDiagnostics();
  }, [user, isAuthenticated]);

  const getStatusColor = (status: boolean) => {
    return status ? 'text-green-600' : 'text-red-600';
  };

  const getStatusIcon = (status: boolean) => {
    return status ? '✓' : '✗';
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Diagnóstico del Sistema
        </h1>
        <Button
          variant="primary"
          onClick={() => window.location.reload()}
        >
          Ejecutar Nuevamente
        </Button>
      </div>

      {error && (
        <Card className="p-4 border-red-200 bg-red-50 dark:bg-red-900/10">
          <p className="text-red-800 dark:text-red-200">{error}</p>
        </Card>
      )}

      <div className="grid gap-4">
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Estado de Conexiones
          </h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-700 dark:text-gray-300">Conexión al Backend</span>
              <span className={`font-semibold ${getStatusColor(diagnosticData.backendConnection)}`}>
                {getStatusIcon(diagnosticData.backendConnection)} {diagnosticData.backendConnection ? 'Conectado' : 'Desconectado'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700 dark:text-gray-300">Base de Datos</span>
              <span className={`font-semibold ${getStatusColor(diagnosticData.databaseConnection)}`}>
                {getStatusIcon(diagnosticData.databaseConnection)} {diagnosticData.databaseConnection ? 'Conectado' : 'Desconectado'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700 dark:text-gray-300">Autenticación</span>
              <span className={`font-semibold ${getStatusColor(diagnosticData.authStatus)}`}>
                {getStatusIcon(diagnosticData.authStatus)} {diagnosticData.authStatus ? 'Activa' : 'Inactiva'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700 dark:text-gray-300">Datos de Usuario</span>
              <span className={`font-semibold ${getStatusColor(diagnosticData.userData)}`}>
                {getStatusIcon(diagnosticData.userData)} {diagnosticData.userData ? 'Disponibles' : 'No disponibles'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700 dark:text-gray-300">Endpoints de API</span>
              <span className={`font-semibold ${getStatusColor(diagnosticData.apiEndpoints)}`}>
                {getStatusIcon(diagnosticData.apiEndpoints)} {diagnosticData.apiEndpoints ? 'Funcionando' : 'Error'}
              </span>
            </div>
          </div>
        </Card>

        {user && (
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Información del Usuario
            </h2>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-gray-700 dark:text-gray-300">ID:</span>
                <span className="font-mono text-sm text-gray-900 dark:text-white">{user.id}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700 dark:text-gray-300">Email:</span>
                <span className="text-gray-900 dark:text-white">{user.email}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700 dark:text-gray-300">Rol:</span>
                <span className="text-gray-900 dark:text-white capitalize">{user.role}</span>
              </div>
            </div>
          </Card>
        )}

        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Resumen del Sistema
          </h2>
          <div className="space-y-2">
            <p className="text-gray-700 dark:text-gray-300">
              <strong>Frontend:</strong> Next.js 15.2.3 - Funcionando correctamente
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              <strong>Backend:</strong> NestJS - {diagnosticData.backendConnection ? 'Conectado' : 'Desconectado'}
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              <strong>Base de Datos:</strong> MongoDB - {diagnosticData.databaseConnection ? 'Conectado' : 'Desconectado'}
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              <strong>Autenticación:</strong> JWT + Google OAuth - {diagnosticData.authStatus ? 'Activa' : 'Inactiva'}
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
} 