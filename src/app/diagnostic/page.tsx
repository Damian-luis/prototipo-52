'use client'
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { databaseUtils } from '@/lib/database';
import { userService } from '@/services/supabase';
import { supabase } from '@/lib/supabase';
import Card from '@/components/ui/card/Card';
import Button from '@/components/ui/button/Button';

export default function DiagnosticPage() {
  const { user, supabaseUser, isAuthenticated } = useAuth();
  const [diagnostics, setDiagnostics] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const runDiagnostics = async () => {
    setLoading(true);
    setMessage('');
    
    try {
      const results: any = {};

      // Verificar estado de autenticación
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      results.sessionExists = !!session;
      results.userExists = !!user;
      results.sessionError = sessionError;
      results.userError = userError;

      // Verificar tabla users
      results.usersTableExists = await databaseUtils.checkUsersTable();
      
      // Verificar si hay usuarios
      if (results.usersTableExists) {
        results.usersExist = await databaseUtils.checkUsersExist();
      }

      // Verificar usuario actual
      if (user) {
        try {
          const currentUser = await userService.getUserById(user.id);
          results.currentUserInTable = !!currentUser;
          results.currentUserData = currentUser;
        } catch (error) {
          results.currentUserInTable = false;
          results.currentUserError = error;
        }
      }

      // Verificar conexión a Supabase
      try {
        const users = await userService.getAllUsers();
        results.connectionWorking = true;
        results.totalUsers = users?.length || 0;
      } catch (error) {
        results.connectionWorking = false;
        results.connectionError = error;
      }

      setDiagnostics(results);
      setMessage('Diagnóstico completado');
    } catch (error) {
      console.error('Error running diagnostics:', error);
      setMessage('Error al ejecutar diagnóstico');
    } finally {
      setLoading(false);
    }
  };

  const createTestUser = async () => {
    setLoading(true);
    try {
      const success = await databaseUtils.createTestUser();
      if (success) {
        setMessage('Usuario de prueba creado exitosamente');
        runDiagnostics(); // Re-ejecutar diagnóstico
      } else {
        setMessage('Error al crear usuario de prueba');
      }
    } catch (error) {
      console.error('Error creating test user:', error);
      setMessage('Error al crear usuario de prueba');
    } finally {
      setLoading(false);
    }
  };

  const createCurrentUser = async () => {
    setLoading(true);
    try {
      const success = await databaseUtils.createCurrentUser();
      if (success) {
        setMessage('Usuario actual creado exitosamente en la tabla users');
        runDiagnostics(); // Re-ejecutar diagnóstico
      } else {
        setMessage('Error al crear usuario actual');
      }
    } catch (error) {
      console.error('Error creating current user:', error);
      setMessage('Error al crear usuario actual');
    } finally {
      setLoading(false);
    }
  };

  const syncUsers = async () => {
    setLoading(true);
    try {
      const success = await databaseUtils.syncAuthUsers();
      if (success) {
        setMessage('Usuarios sincronizados exitosamente');
        runDiagnostics(); // Re-ejecutar diagnóstico
      } else {
        setMessage('Error al sincronizar usuarios');
      }
    } catch (error) {
      console.error('Error syncing users:', error);
      setMessage('Error al sincronizar usuarios');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runDiagnostics();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Diagnóstico de Base de Datos
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Verifica el estado de la base de datos y soluciona problemas de conexión
          </p>
        </div>

        <div className="grid gap-6">
          {/* Estado de autenticación */}
          <Card>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Estado de Autenticación
            </h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Autenticado:</span>
                <span className={`font-medium ${isAuthenticated ? 'text-success-600' : 'text-error-600'}`}>
                  {isAuthenticated ? 'Sí' : 'No'}
                </span>
              </div>
              {supabaseUser && (
                <>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">ID de Auth:</span>
                    <span className="font-mono text-sm text-gray-800 dark:text-gray-200">
                      {supabaseUser.id}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Email:</span>
                    <span className="text-gray-800 dark:text-gray-200">
                      {supabaseUser.email}
                    </span>
                  </div>
                </>
              )}
              {user && (
                <>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Nombre:</span>
                    <span className="text-gray-800 dark:text-gray-200">
                      {user.name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Rol:</span>
                    <span className="text-gray-800 dark:text-gray-200">
                      {user.role}
                    </span>
                  </div>
                </>
              )}
            </div>
          </Card>

          {/* Diagnóstico de base de datos */}
          <Card>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Diagnóstico de Base de Datos
              </h2>
              <Button
                onClick={runDiagnostics}
                disabled={loading}
                loading={loading}
                size="sm"
              >
                Re-ejecutar
              </Button>
            </div>
            
            {Object.keys(diagnostics).length > 0 && (
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Sesión existe:</span>
                  <span className={`font-medium ${diagnostics.sessionExists ? 'text-success-600' : 'text-error-600'}`}>
                    {diagnostics.sessionExists ? 'Sí' : 'No'}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Usuario Auth existe:</span>
                  <span className={`font-medium ${diagnostics.userExists ? 'text-success-600' : 'text-error-600'}`}>
                    {diagnostics.userExists ? 'Sí' : 'No'}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Tabla users existe:</span>
                  <span className={`font-medium ${diagnostics.usersTableExists ? 'text-success-600' : 'text-error-600'}`}>
                    {diagnostics.usersTableExists ? 'Sí' : 'No'}
                  </span>
                </div>
                
                {diagnostics.usersTableExists && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Hay usuarios en la tabla:</span>
                      <span className={`font-medium ${diagnostics.usersExist ? 'text-success-600' : 'text-error-600'}`}>
                        {diagnostics.usersExist ? 'Sí' : 'No'}
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Conexión funcionando:</span>
                      <span className={`font-medium ${diagnostics.connectionWorking ? 'text-success-600' : 'text-error-600'}`}>
                        {diagnostics.connectionWorking ? 'Sí' : 'No'}
                      </span>
                    </div>
                    
                    {diagnostics.connectionWorking && (
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Total de usuarios:</span>
                        <span className="font-medium text-gray-800 dark:text-gray-200">
                          {diagnostics.totalUsers}
                        </span>
                      </div>
                    )}
                    
                    {diagnostics.userExists && (
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Usuario actual en tabla:</span>
                        <span className={`font-medium ${diagnostics.currentUserInTable ? 'text-success-600' : 'text-error-600'}`}>
                          {diagnostics.currentUserInTable ? 'Sí' : 'No'}
                        </span>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </Card>

          {/* Acciones */}
          <Card>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Acciones
            </h2>
            <div className="flex gap-4">
              <Button
                onClick={createTestUser}
                disabled={loading}
                loading={loading}
                variant="secondary"
              >
                Crear Usuario de Prueba
              </Button>
              <Button
                onClick={createCurrentUser}
                disabled={loading}
                loading={loading}
                variant="primary"
              >
                Crear Usuario Actual
              </Button>
              <Button
                onClick={syncUsers}
                disabled={loading}
                loading={loading}
                variant="secondary"
              >
                Sincronizar Usuarios
              </Button>
            </div>
          </Card>

          {/* Mensajes */}
          {message && (
            <Card>
              <div className={`p-4 rounded-lg ${
                message.includes('Error') 
                  ? 'bg-error-50 text-error-800 dark:bg-error-500/15 dark:text-error-400'
                  : 'bg-success-50 text-success-800 dark:bg-success-500/15 dark:text-success-400'
              }`}>
                {message}
              </div>
            </Card>
          )}

          {/* Errores detallados */}
          {diagnostics.connectionError && (
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Error de Conexión
              </h3>
              <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg text-sm overflow-x-auto">
                {JSON.stringify(diagnostics.connectionError, null, 2)}
              </pre>
            </Card>
          )}

          {diagnostics.currentUserError && (
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Error de Usuario Actual
              </h3>
              <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg text-sm overflow-x-auto">
                {JSON.stringify(diagnostics.currentUserError, null, 2)}
              </pre>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
} 