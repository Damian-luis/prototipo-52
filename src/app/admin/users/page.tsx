"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { 
  Search, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Plus,
  User,
  Building,
  Briefcase,
  UserCheck,
  Filter,
  Download,
  Loader2,
  AlertCircle
} from "lucide-react";
import { useNotifications } from "@/hooks/useNotifications";
import { usersService } from "@/services/users.service";

// Interfaz que coincide con la respuesta de la API
interface ApiUser {
  id: string;
  email: string;
  fullName: string;
  role: string; // Cambiado a string para ser más flexible
  accountStatus: string;
  createdAt: string;
  updatedAt: string;
  isGoogleUser: boolean;
  avatar?: string;
}

const roleIcons = {
  ADMIN: UserCheck,
  EMPRESA: Building,
  PROFESIONAL: Briefcase,
  ESPECIALISTA: User
};

const roleColors = {
  ADMIN: "bg-purple-100 text-purple-800 border-purple-200",
  EMPRESA: "bg-blue-100 text-blue-800 border-blue-200",
  PROFESIONAL: "bg-green-100 text-green-800 border-green-200",
  ESPECIALISTA: "bg-orange-100 text-orange-800 border-orange-200"
};

const statusColors: Record<string, string> = {
  ACTIVE: "bg-green-100 text-green-800 border-green-200",
  INACTIVE: "bg-red-100 text-red-800 border-red-200",
  PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200"
};

export default function UsersManagementPage() {
  const [users, setUsers] = useState<ApiUser[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<ApiUser[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [editingUser, setEditingUser] = useState<ApiUser | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<ApiUser | null>(null);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());
  const { success, error } = useNotifications();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Cargar usuarios al montar el componente
  useEffect(() => {
    loadUsers();
  }, []);

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Filtrar usuarios
  useEffect(() => {
    let filtered = users;

    // Excluir usuarios con rol ADMIN
    filtered = filtered.filter(user => user.role !== 'ADMIN');

    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (roleFilter !== "all") {
      filtered = filtered.filter(user => user.role === roleFilter);
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(user => user.accountStatus === statusFilter);
    }

    setFilteredUsers(filtered);
  }, [users, searchTerm, roleFilter, statusFilter]);

  const loadUsers = async () => {
    try {
      setIsLoading(true);
      setApiError(null);
      
      const usersData = await usersService.getAllUsers();
      
      // Log para debuggear los roles
      console.log('Roles de usuarios recibidos:', usersData.map((user: any) => user.role));
      
      // Transformar los datos para que coincidan con nuestra interfaz
      const transformedUsers: ApiUser[] = usersData.map((user: any) => ({
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        accountStatus: user.accountStatus,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        isGoogleUser: user.isGoogleUser || false,
        avatar: user.avatar
      }));
      
      setUsers(transformedUsers);
    } catch (err: any) {
      console.error('Error loading users:', err);
      setApiError('Error al cargar los usuarios');
      error('Error al cargar los usuarios');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditUser = (user: ApiUser) => {
    setEditingUser({ ...user });
    setIsEditModalOpen(true);
    setOpenDropdown(null);
  };

  const handleSaveUser = async () => {
    if (!editingUser) return;

    try {
      setIsSaving(true);
      await usersService.updateUser(editingUser.id, {
        fullName: editingUser.fullName,
      });

      // Actualizar la lista local
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user.id === editingUser.id ? editingUser : user
        )
      );

      setIsEditModalOpen(false);
      setEditingUser(null);
      success("Usuario actualizado correctamente");
    } catch (err) {
      console.error('Error updating user:', err);
      error('Error al actualizar el usuario');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteUser = (user: ApiUser) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
    setOpenDropdown(null);
  };

  const confirmDeleteUser = async () => {
    if (!userToDelete) return;

    try {
      setIsDeleting(true);
      await usersService.deleteUser(userToDelete.id);

      // Actualizar la lista local
      setUsers(prevUsers =>
        prevUsers.filter(user => user.id !== userToDelete.id)
      );

      setIsDeleteModalOpen(false);
      setUserToDelete(null);
      success("Usuario eliminado correctamente");
    } catch (err) {
      console.error('Error deleting user:', err);
      error('Error al eliminar el usuario');
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES');
  };

  const toggleDropdown = (userId: string) => {
    setOpenDropdown(openDropdown === userId ? null : userId);
  };

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'Activo';
      case 'INACTIVE':
        return 'Inactivo';
      case 'pending':
        return 'Pendiente';
      default:
        return status;
    }
  };

  const handleImageError = (userId: string) => {
    setImageErrors(prev => new Set(prev).add(userId));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
          <span className="text-gray-600">Cargando usuarios...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Gestión de Usuarios</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Administra todos los usuarios de la plataforma
          </p>
          {apiError && (
            <div className="flex items-center space-x-2 mt-2 p-2 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <span className="text-sm text-red-800">{apiError}</span>
            </div>
          )}
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-xl shadow-md border-0">
        <div className="p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Filter className="h-5 w-5 text-gray-500" />
            <h3 className="text-lg font-semibold text-gray-900">Filtros y Búsqueda</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar usuarios..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <select 
              value={roleFilter} 
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            >
              <option value="all">Todos los roles</option>
              <option value="EMPRESA">Empresas</option>
              <option value="PROFESIONAL">Profesionales</option>
              <option value="ESPECIALISTA">Especialistas</option>
            </select>
            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            >
              <option value="all">Todos los estados</option>
              <option value="ACTIVE">Activos</option>
              <option value="INACTIVE">Inactivos</option>
              <option value="pending">Pendientes</option>
            </select>
            <div className="flex items-center justify-center px-4 py-2 bg-gray-50 rounded-lg border">
              <span className="text-sm font-medium text-gray-700">
                {filteredUsers.length} usuarios encontrados
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-xl shadow-md border-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="font-semibold text-gray-900 py-4 px-6 text-left">Usuario</th>
                <th className="font-semibold text-gray-900 py-4 px-6 text-left">Rol</th>
                <th className="font-semibold text-gray-900 py-4 px-6 text-left">Estado</th>
                <th className="font-semibold text-gray-900 py-4 px-6 text-left">Fecha de Registro</th>
                <th className="font-semibold text-gray-900 py-4 px-6 text-left">Última Actualización</th>
                <th className="font-semibold text-gray-900 py-4 px-6 text-left w-[120px]">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => {
                const RoleIcon = roleIcons[user.role as keyof typeof roleIcons] || User; // Usar User como icono por defecto
                return (
                  <tr key={user.id} className="hover:bg-gray-50 border-b border-gray-100">
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        {user.avatar && !imageErrors.has(user.id) ? (
                          <Image 
                            src={user.avatar} 
                            alt={`Avatar de ${user.fullName}`}
                            width={40}
                            height={40}
                            className="h-10 w-10 rounded-full object-cover shadow-sm"
                            onError={() => handleImageError(user.id)}
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-sm">
                            <RoleIcon className="h-5 w-5 text-white" />
                          </div>
                        )}
                        <div>
                          <div className="font-semibold text-gray-900">{user.fullName}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                          {user.isGoogleUser && (
                            <div className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full inline-block mt-1">
                              Google
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`${roleColors[user.role as keyof typeof roleColors] || roleColors.PROFESIONAL} border px-3 py-1 text-xs font-medium rounded-full`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`${statusColors[user.accountStatus] || statusColors.PENDING} border px-3 py-1 text-xs font-medium rounded-full`}>
                        {getStatusDisplay(user.accountStatus)}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-gray-700">{formatDate(user.createdAt)}</td>
                    <td className="py-4 px-6 text-gray-700">{formatDate(user.updatedAt)}</td>
                    <td className="py-4 px-6">
                      <div className="relative" ref={dropdownRef}>
                        <button
                          className="h-8 w-8 p-0 hover:bg-gray-100 rounded-lg flex items-center justify-center"
                          onClick={() => toggleDropdown(user.id)}
                        >
                          <MoreHorizontal className="h-4 w-4 text-gray-600" />
                        </button>
                        {openDropdown === user.id && (
                          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-50 border border-gray-200 py-1">
                            <button
                              onClick={() => handleEditUser(user)}
                              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                              <Edit className="mr-3 h-4 w-4 text-blue-600" />
                              Editar Usuario
                            </button>
                            <button
                              onClick={() => handleDeleteUser(user)}
                              className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                            >
                              <Trash2 className="mr-3 h-4 w-4 text-red-600" />
                              Eliminar Usuario
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Edición */}
      {isEditModalOpen && editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md transform transition-all">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Editar Usuario</h2>
              <p className="text-gray-600 mt-1">Modifica la información del usuario</p>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nombre Completo
                </label>
                <input
                  type="text"
                  value={editingUser.fullName}
                  onChange={(e) => setEditingUser({ ...editingUser, fullName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ingresa el nombre completo"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  value={editingUser.email}
                  onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                  placeholder="usuario@ejemplo.com"
                  disabled
                />
                <p className="text-xs text-gray-500 mt-1">El email no se puede modificar</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Rol de Usuario
                </label>
                <select 
                  value={editingUser.role} 
                  onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                >
                  <option value="EMPRESA">Empresa</option>
                  <option value="PROFESIONAL">Profesional</option>
                  <option value="ESPECIALISTA">Especialista</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Estado de la Cuenta
                </label>
                <select 
                  value={editingUser.accountStatus} 
                  onChange={(e) => setEditingUser({ ...editingUser, accountStatus: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                >
                  <option value="ACTIVE">Activo</option>
                  <option value="INACTIVE">Inactivo</option>
                  <option value="pending">Pendiente</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b-xl">
              <button 
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                onClick={() => setIsEditModalOpen(false)}
                disabled={isSaving}
              >
                Cancelar
              </button>
              <button 
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                onClick={handleSaveUser}
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin inline" />
                    Guardando...
                  </>
                ) : (
                  'Guardar Cambios'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Confirmación de Eliminación */}
      {isDeleteModalOpen && userToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md transform transition-all">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                  <Trash2 className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Confirmar Eliminación</h2>
                  <p className="text-gray-600 text-sm">Esta acción no se puede deshacer</p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <p className="text-gray-700 mb-4">
                ¿Estás seguro de que quieres eliminar al usuario{" "}
                <strong className="text-gray-900">{userToDelete.fullName}</strong>?
              </p>
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-700">
                  <strong>Advertencia:</strong> Esta acción eliminará permanentemente la cuenta del usuario y todos sus datos asociados.
                </p>
              </div>
            </div>
            <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b-xl">
              <button 
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                onClick={() => setIsDeleteModalOpen(false)}
                disabled={isDeleting}
              >
                Cancelar
              </button>
              <button 
                className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                onClick={confirmDeleteUser}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin inline" />
                    Eliminando...
                  </>
                ) : (
                  'Eliminar Usuario'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 