"use client";
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

interface SearchItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  route: string;
  category: string;
}

const SearchCommand: React.FC = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Definir las rutas y funcionalidades disponibles según el rol del usuario
  const getSearchItems = (): SearchItem[] => {
    const baseItems: SearchItem[] = [
      {
        id: 'dashboard',
        title: 'Dashboard',
        description: 'Panel principal de la aplicación',
        icon: '📊',
        route: '/dashboard',
        category: 'Navegación'
      },
      {
        id: 'profile',
        title: 'Mi Perfil',
        description: 'Ver y editar mi perfil de usuario',
        icon: '👤',
        route: '/profile',
        category: 'Perfil'
      },
      {
        id: 'notifications',
        title: 'Notificaciones',
        description: 'Ver todas las notificaciones',
        icon: '🔔',
        route: '/notifications',
        category: 'Comunicación'
      },
      {
        id: 'settings',
        title: 'Configuración',
        description: 'Configurar preferencias de la cuenta',
        icon: '⚙️',
        route: '/configuracion',
        category: 'Configuración'
      }
    ];

    if (user?.role === 'EMPRESA') {
      return [
        ...baseItems,
        {
          id: 'professionals',
          title: 'Buscar Profesionales',
          description: 'Encontrar talento para tus proyectos',
          icon: '👥',
          route: '/empresa/profesionales',
          category: 'Talento'
        },
        {
          id: 'projects',
          title: 'Mis Proyectos',
          description: 'Gestionar proyectos activos',
          icon: '📁',
          route: '/empresa/proyectos',
          category: 'Proyectos'
        },
        {
          id: 'new-project',
          title: 'Crear Proyecto',
          description: 'Crear un nuevo proyecto',
          icon: '➕',
          route: '/empresa/proyectos/nuevo',
          category: 'Proyectos'
        },
        {
          id: 'contracts',
          title: 'Contratos',
          description: 'Gestionar contratos activos',
          icon: '📄',
          route: '/empresa/contratos',
          category: 'Contratos'
        },
        {
          id: 'payments',
          title: 'Pagos',
          description: 'Gestionar pagos y facturación',
          icon: '💳',
          route: '/empresa/pagos',
          category: 'Finanzas'
        },
        {
          id: 'reports',
          title: 'Reportes',
          description: 'Ver reportes y estadísticas',
          icon: '📈',
          route: '/empresa/reportes',
          category: 'Análisis'
        },
        {
          id: 'teams',
          title: 'Mis Equipos',
          description: 'Gestionar equipos de trabajo',
          icon: '👨‍👩‍👧‍👦',
          route: '/empresa/profesionales/equipos',
          category: 'Talento'
        }
      ];
    } else if (user?.role === 'PROFESIONAL') {
      return [
        ...baseItems,
        {
          id: 'jobs',
          title: 'Buscar Trabajos',
          description: 'Encontrar proyectos disponibles',
          icon: '🔍',
          route: '/profesional/jobs/search',
          category: 'Trabajo'
        },
        {
          id: 'applications',
          title: 'Mis Aplicaciones',
          description: 'Ver estado de mis aplicaciones',
          icon: '📝',
          route: '/profesional/applications',
          category: 'Trabajo'
        },
        {
          id: 'active-jobs',
          title: 'Trabajos Activos',
          description: 'Proyectos en los que estoy trabajando',
          icon: '⚡',
          route: '/profesional/jobs/active',
          category: 'Trabajo'
        },
        {
          id: 'contracts',
          title: 'Mis Contratos',
          description: 'Gestionar contratos activos',
          icon: '📄',
          route: '/profesional/contracts/active',
          category: 'Contratos'
        },
        {
          id: 'payments',
          title: 'Mis Pagos',
          description: 'Ver historial de pagos',
          icon: '💰',
          route: '/profesional/payments/history',
          category: 'Finanzas'
        },
        {
          id: 'performance',
          title: 'Mi Rendimiento',
          description: 'Ver estadísticas y evaluaciones',
          icon: '📊',
          route: '/profesional/performance/stats',
          category: 'Análisis'
        },
        {
          id: 'ai-assistant',
          title: 'Asistente IA',
          description: 'Obtener ayuda con IA',
          icon: '🤖',
          route: '/profesional/ai-assistant',
          category: 'Herramientas'
        }
      ];
    } else if (user?.role === 'ESPECIALISTA') {
      return [
        ...baseItems,
        {
          id: 'consultations',
          title: 'Mis Consultas',
          description: 'Gestionar consultas especializadas',
          icon: '💬',
          route: '/especialista/consultas',
          category: 'Consultas'
        },
        {
          id: 'sessions',
          title: 'Sesiones',
          description: 'Gestionar sesiones de consultoría',
          icon: '🎯',
          route: '/especialista/sesiones',
          category: 'Consultas'
        },
        {
          id: 'evaluations',
          title: 'Evaluaciones',
          description: 'Realizar evaluaciones técnicas',
          icon: '📋',
          route: '/especialista/evaluaciones',
          category: 'Evaluación'
        },
        {
          id: 'reports',
          title: 'Reportes',
          description: 'Generar reportes especializados',
          icon: '📊',
          route: '/especialista/reportes',
          category: 'Análisis'
        }
      ];
    } else if (user?.role === 'ADMIN') {
      return [
        ...baseItems,
        {
          id: 'admin-dashboard',
          title: 'Dashboard Admin',
          description: 'Panel de administración',
          icon: '🛡️',
          route: '/admin',
          category: 'Administración'
        },
        {
          id: 'users',
          title: 'Gestionar Usuarios',
          description: 'Administrar usuarios del sistema',
          icon: '👥',
          route: '/admin/users',
          category: 'Administración'
        },
        {
          id: 'projects-admin',
          title: 'Gestionar Proyectos',
          description: 'Administrar todos los proyectos',
          icon: '📁',
          route: '/admin/projects',
          category: 'Administración'
        },
        {
          id: 'reports-admin',
          title: 'Reportes del Sistema',
          description: 'Ver reportes globales',
          icon: '📈',
          route: '/admin/reports',
          category: 'Administración'
        },
        {
          id: 'support',
          title: 'Soporte',
          description: 'Gestionar tickets de soporte',
          icon: '🆘',
          route: '/admin/support',
          category: 'Administración'
        }
      ];
    }

    return baseItems;
  };

  const searchItems = getSearchItems();

  const filteredItems = searchItems.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        setIsOpen(true);
        setTimeout(() => inputRef.current?.focus(), 100);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setSelectedIndex(0);
    }
  }, [searchTerm, isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setSelectedIndex(prev => 
        prev < filteredItems.length - 1 ? prev + 1 : 0
      );
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setSelectedIndex(prev => 
        prev > 0 ? prev - 1 : filteredItems.length - 1
      );
    } else if (event.key === 'Enter') {
      event.preventDefault();
      if (filteredItems[selectedIndex]) {
        handleSelect(filteredItems[selectedIndex]);
      }
    } else if (event.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const handleSelect = (item: SearchItem) => {
    router.push(item.route);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleInputChange = (value: string) => {
    setSearchTerm(value);
    if (!isOpen) {
      setIsOpen(true);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="relative">
        <span className="absolute -translate-y-1/2 left-4 top-1/2 pointer-events-none">
          <svg
            className="fill-gray-500 dark:fill-gray-400"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M3.04175 9.37363C3.04175 5.87693 5.87711 3.04199 9.37508 3.04199C12.8731 3.04199 15.7084 5.87693 15.7084 9.37363C15.7084 12.8703 12.8731 15.7053 9.37508 15.7053C5.87711 15.7053 3.04175 12.8703 3.04175 9.37363ZM9.37508 1.54199C5.04902 1.54199 1.54175 5.04817 1.54175 9.37363C1.54175 13.6991 5.04902 17.2053 9.37508 17.2053C11.2674 17.2053 13.003 16.5344 14.357 15.4176L17.177 18.238C17.4699 18.5309 17.9448 18.5309 18.2377 18.238C18.5306 17.9451 18.5306 17.4703 18.2377 17.1774L15.418 14.3573C16.5365 13.0033 17.2084 11.2669 17.2084 9.37363C17.2084 5.04817 13.7011 1.54199 9.37508 1.54199Z"
              fill=""
            />
          </svg>
        </span>
        <input
          ref={inputRef}
          type="text"
          placeholder="Buscar o escribir comando..."
          value={searchTerm}
          onChange={(e) => handleInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsOpen(true)}
          className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-200 bg-transparent py-2.5 pl-12 pr-14 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-gray-900 dark:bg-white/[0.03] dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 xl:w-[430px]"
        />
        <button className="absolute right-2.5 top-1/2 inline-flex -translate-y-1/2 items-center gap-0.5 rounded-lg border border-gray-200 bg-gray-50 px-[7px] py-[4.5px] text-xs -tracking-[0.2px] text-gray-500 dark:border-gray-800 dark:bg-white/[0.03] dark:text-gray-400">
          <span> ⌘ </span>
          <span> K </span>
        </button>
      </div>

      {/* Dropdown de sugerencias */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          {filteredItems.length > 0 ? (
            <div className="py-2">
              {filteredItems.map((item, index) => (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  className={`w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                    index === selectedIndex ? 'bg-gray-50 dark:bg-gray-700' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{item.icon}</span>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 dark:text-white">
                        {item.title}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {item.description}
                      </div>
                    </div>
                    <div className="text-xs text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-600 px-2 py-1 rounded">
                      {item.category}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
              <div className="text-lg mb-2">🔍</div>
              <div>No se encontraron resultados</div>
              <div className="text-sm mt-1">Intenta con otros términos</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchCommand; 