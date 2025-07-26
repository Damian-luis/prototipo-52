"use client";

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import ChatInterface from '@/components/chat/ChatInterface';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import ComponentCard from '@/components/common/ComponentCard';

const EmpresaChatPage = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="mx-auto max-w-7xl">
        <PageBreadcrumb pageTitle="Chat" />
        <ComponentCard title="Acceso Denegado">
          <div className="text-center py-8">
            <p className="text-gray-500">Debes iniciar sesión para acceder al chat.</p>
          </div>
        </ComponentCard>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-3 sm:px-6">
      <PageBreadcrumb pageTitle="Chat" />
      
      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Chat
        </h1>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
          Comunícate con profesionales y gestiona tus proyectos
        </p>
      </div>

      <div className="h-[calc(100vh-200px)] sm:h-[700px]">
        <ChatInterface />
      </div>
    </div>
  );
};

export default EmpresaChatPage; 