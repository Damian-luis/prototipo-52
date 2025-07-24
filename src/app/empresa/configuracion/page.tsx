"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import Button from "@/components/ui/button/Button";
import { Empresa } from "@/types";

const EmpresaConfiguracionPage = () => {
  const { user, updateProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [companyData, setCompanyData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    company_name: (user as Empresa)?.company_name || "",
    industry: (user as Empresa)?.industry || "",
    company_size: (user as Empresa)?.company_size || "small",
    website: (user as Empresa)?.website || "",
    description: (user as Empresa)?.description || "",
    address: user?.address || "",
    city: user?.city || "",
    country: user?.country || "",
  });

  const [notifications, setNotifications] = useState({
    email_notifications: true,
    push_notifications: true,
    project_updates: true,
    payment_notifications: true,
    contract_notifications: true,
    marketing_emails: false,
  });

  const [security, setSecurity] = useState({
    two_factor_auth: false,
    session_timeout: "24",
    password_change_required: false,
  });

  const handleSaveProfile = async () => {
    setLoading(true);
    setMessage("");
    
    try {
      await updateProfile(companyData);
      setMessage("Perfil actualizado exitosamente");
    } catch (error) {
      setMessage("Error al actualizar el perfil");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveNotifications = () => {
    // Implementar guardado de configuraciones de notificaciones
    setMessage("Configuraciones de notificaciones guardadas");
  };

  const handleSaveSecurity = () => {
    // Implementar guardado de configuraciones de seguridad
    setMessage("Configuraciones de seguridad guardadas");
  };

  const handleChangePassword = () => {
    // Implementar cambio de contraseña
    console.log('Cambiar contraseña');
  };

  const handleDeleteAccount = () => {
    // Implementar eliminación de cuenta
    if (confirm('¿Estás seguro de que quieres eliminar tu cuenta? Esta acción no se puede deshacer.')) {
      console.log('Eliminar cuenta');
    }
  };

  return (
    <div className="mx-auto max-w-7xl">
      <PageBreadcrumb pageTitle="Configuración" />
      
      <div className="grid grid-cols-1 gap-6">
        {/* Mensaje de estado */}
        {message && (
          <ComponentCard title="Estado">
            <div className={`p-4 rounded-lg ${
              message.includes('Error') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'
            }`}>
              {message}
            </div>
          </ComponentCard>
        )}

        {/* Información de la empresa */}
        <ComponentCard title="Información de la Empresa">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nombre de la Empresa *
              </label>
              <input
                type="text"
                value={companyData.company_name}
                onChange={(e) => setCompanyData({...companyData, company_name: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                placeholder="Nombre de tu empresa"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Industria
              </label>
              <select
                value={companyData.industry}
                onChange={(e) => setCompanyData({...companyData, industry: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              >
                <option value="">Seleccionar industria</option>
                <option value="technology">Tecnología</option>
                <option value="healthcare">Salud</option>
                <option value="finance">Finanzas</option>
                <option value="education">Educación</option>
                <option value="retail">Comercio</option>
                <option value="manufacturing">Manufactura</option>
                <option value="consulting">Consultoría</option>
                <option value="other">Otro</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tamaño de la Empresa
              </label>
              <select
                value={companyData.company_size}
                onChange={(e) => setCompanyData({...companyData, company_size: e.target.value as any})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              >
                <option value="small">Pequeña (1-50 empleados)</option>
                <option value="medium">Mediana (51-200 empleados)</option>
                <option value="large">Grande (200+ empleados)</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Sitio Web
              </label>
              <input
                type="url"
                value={companyData.website}
                onChange={(e) => setCompanyData({...companyData, website: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                placeholder="https://www.tuempresa.com"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Descripción de la Empresa
              </label>
              <textarea
                value={companyData.description}
                onChange={(e) => setCompanyData({...companyData, description: e.target.value})}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                placeholder="Describe tu empresa y sus servicios..."
              />
            </div>
          </div>
          
          <div className="mt-6">
            <Button
              onClick={handleSaveProfile}
              variant="primary"
              loading={loading}
            >
              Guardar Cambios
            </Button>
          </div>
        </ComponentCard>

        {/* Información de contacto */}
        <ComponentCard title="Información de Contacto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nombre del Contacto
              </label>
              <input
                type="text"
                value={companyData.name}
                onChange={(e) => setCompanyData({...companyData, name: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                placeholder="Tu nombre completo"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                value={companyData.email}
                onChange={(e) => setCompanyData({...companyData, email: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                placeholder="tu@email.com"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Teléfono
              </label>
              <input
                type="tel"
                value={companyData.phone}
                onChange={(e) => setCompanyData({...companyData, phone: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                placeholder="+1 (555) 123-4567"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                País
              </label>
              <input
                type="text"
                value={companyData.country}
                onChange={(e) => setCompanyData({...companyData, country: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                placeholder="País"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Ciudad
              </label>
              <input
                type="text"
                value={companyData.city}
                onChange={(e) => setCompanyData({...companyData, city: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                placeholder="Ciudad"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Dirección
              </label>
              <input
                type="text"
                value={companyData.address}
                onChange={(e) => setCompanyData({...companyData, address: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                placeholder="Dirección completa"
              />
            </div>
          </div>
        </ComponentCard>

        {/* Configuraciones de notificaciones */}
        <ComponentCard title="Configuraciones de Notificaciones">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Notificaciones por Email</h4>
                <p className="text-sm text-gray-500">Recibe notificaciones importantes por email</p>
              </div>
              <input
                type="checkbox"
                checked={notifications.email_notifications}
                onChange={(e) => setNotifications({...notifications, email_notifications: e.target.checked})}
                className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Notificaciones Push</h4>
                <p className="text-sm text-gray-500">Recibe notificaciones en tiempo real</p>
              </div>
              <input
                type="checkbox"
                checked={notifications.push_notifications}
                onChange={(e) => setNotifications({...notifications, push_notifications: e.target.checked})}
                className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Actualizaciones de Proyectos</h4>
                <p className="text-sm text-gray-500">Notificaciones sobre cambios en proyectos</p>
              </div>
              <input
                type="checkbox"
                checked={notifications.project_updates}
                onChange={(e) => setNotifications({...notifications, project_updates: e.target.checked})}
                className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Notificaciones de Pagos</h4>
                <p className="text-sm text-gray-500">Alertas sobre pagos y transacciones</p>
              </div>
              <input
                type="checkbox"
                checked={notifications.payment_notifications}
                onChange={(e) => setNotifications({...notifications, payment_notifications: e.target.checked})}
                className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Notificaciones de Contratos</h4>
                <p className="text-sm text-gray-500">Actualizaciones sobre contratos</p>
              </div>
              <input
                type="checkbox"
                checked={notifications.contract_notifications}
                onChange={(e) => setNotifications({...notifications, contract_notifications: e.target.checked})}
                className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Emails de Marketing</h4>
                <p className="text-sm text-gray-500">Recibe ofertas y novedades</p>
              </div>
              <input
                type="checkbox"
                checked={notifications.marketing_emails}
                onChange={(e) => setNotifications({...notifications, marketing_emails: e.target.checked})}
                className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
            </div>
          </div>
          
          <div className="mt-6">
            <Button
              onClick={handleSaveNotifications}
              variant="primary"
            >
              Guardar Configuraciones
            </Button>
          </div>
        </ComponentCard>

        {/* Configuraciones de seguridad */}
        <ComponentCard title="Configuraciones de Seguridad">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Autenticación de Dos Factores</h4>
                <p className="text-sm text-gray-500">Añade una capa extra de seguridad</p>
              </div>
              <input
                type="checkbox"
                checked={security.two_factor_auth}
                onChange={(e) => setSecurity({...security, two_factor_auth: e.target.checked})}
                className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tiempo de Sesión (horas)
              </label>
              <select
                value={security.session_timeout}
                onChange={(e) => setSecurity({...security, session_timeout: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              >
                <option value="1">1 hora</option>
                <option value="8">8 horas</option>
                <option value="24">24 horas</option>
                <option value="168">1 semana</option>
              </select>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Cambio de Contraseña Requerido</h4>
                <p className="text-sm text-gray-500">Forzar cambio de contraseña en el próximo login</p>
              </div>
              <input
                type="checkbox"
                checked={security.password_change_required}
                onChange={(e) => setSecurity({...security, password_change_required: e.target.checked})}
                className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
            </div>
          </div>
          
          <div className="mt-6 space-y-3">
            <Button
              onClick={handleSaveSecurity}
              variant="primary"
            >
              Guardar Configuraciones
            </Button>
            
            <Button
              onClick={handleChangePassword}
              variant="outline"
            >
              Cambiar Contraseña
            </Button>
          </div>
        </ComponentCard>

        {/* Zona de peligro */}
        <ComponentCard title="Zona de Peligro">
          <div className="space-y-4">
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <h4 className="font-medium text-red-800 dark:text-red-200 mb-2">Eliminar Cuenta</h4>
              <p className="text-sm text-red-700 dark:text-red-300 mb-4">
                Esta acción eliminará permanentemente tu cuenta y todos los datos asociados. Esta acción no se puede deshacer.
              </p>
              <Button
                onClick={handleDeleteAccount}
                variant="danger"
              >
                Eliminar Cuenta
              </Button>
            </div>
          </div>
        </ComponentCard>
      </div>
    </div>
  );
};

export default EmpresaConfiguracionPage; 