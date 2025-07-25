"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Plus,
  MessageSquare,
  User,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  Filter,
  Download,
  Loader2,
  AlertCircle,
  Eye,
  FileText,
  Tag,
  Users
} from "lucide-react";
import { useNotifications } from "@/hooks/useNotifications";
import { supportService, Ticket, CreateTicketData, UpdateTicketData } from "@/services/support.service";

const priorityColors = {
  HIGHEST: "bg-red-100 text-red-800 border-red-200",
  HIGH: "bg-orange-100 text-orange-800 border-orange-200",
  MEDIUM: "bg-yellow-100 text-yellow-800 border-yellow-200",
  LOW: "bg-blue-100 text-blue-800 border-blue-200",
  LOWEST: "bg-gray-100 text-gray-800 border-gray-200"
};

const priorityIcons = {
  HIGHEST: AlertTriangle,
  HIGH: AlertTriangle,
  MEDIUM: Clock,
  LOW: CheckCircle,
  LOWEST: CheckCircle
};

const statusColors = {
  OPEN: "bg-green-100 text-green-800 border-green-200",
  CLOSED: "bg-gray-100 text-gray-800 border-gray-200",
  PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
  IN_PROGRESS: "bg-blue-100 text-blue-800 border-blue-200"
};

export default function SupportPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [filteredTickets, setFilteredTickets] = useState<Ticket[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [assigneeFilter, setAssigneeFilter] = useState<string>("all");
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [ticketToDelete, setTicketToDelete] = useState<Ticket | null>(null);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    open: 0,
    closed: 0,
    assigned: 0,
    unassigned: 0
  });
  const [apiError, setApiError] = useState<string | null>(null);
  const { success, error } = useNotifications();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Formulario para crear/editar ticket
  const [formData, setFormData] = useState<CreateTicketData>({
    title: "",
    description: "",
    priority: "MEDIUM",
    projectName: ""
  });

  // Cargar tickets al montar el componente
  useEffect(() => {
    loadTickets();
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

  // Filtrar tickets
  useEffect(() => {
    let filtered = tickets;

    if (searchTerm) {
      filtered = filtered.filter(ticket =>
        ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.creator.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.creator.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (priorityFilter !== "all") {
      filtered = filtered.filter(ticket => ticket.priority === priorityFilter);
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(ticket => ticket.status === statusFilter);
    }

    if (assigneeFilter !== "all") {
      if (assigneeFilter === "assigned") {
        filtered = filtered.filter(ticket => ticket.assigneeId);
      } else if (assigneeFilter === "unassigned") {
        filtered = filtered.filter(ticket => !ticket.assigneeId);
      }
    }

    setFilteredTickets(filtered);
  }, [tickets, searchTerm, priorityFilter, statusFilter, assigneeFilter]);

  const loadTickets = async () => {
    try {
      setIsLoading(true);
      setApiError(null);
      
      const ticketsData = await supportService.getAllTickets();
      setTickets(ticketsData);
      
      // Calcular estadísticas
      const statsData = await supportService.getTicketStats();
      setStats(statsData);
    } catch (err: any) {
      console.error('Error loading tickets:', err);
      setApiError('Error al cargar los tickets de soporte');
      error('Error al cargar los tickets de soporte');
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewTicket = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setIsTicketModalOpen(true);
    setOpenDropdown(null);
  };

  const handleEditTicket = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setFormData({
      title: ticket.title,
      description: ticket.description || "",
      priority: ticket.priority,
      projectName: ticket.projectName || ""
    });
    setIsCreateModalOpen(true);
    setOpenDropdown(null);
  };

  const handleDeleteTicket = (ticket: Ticket) => {
    setTicketToDelete(ticket);
    setIsDeleteModalOpen(true);
    setOpenDropdown(null);
  };

  const handleCreateTicket = () => {
    setSelectedTicket(null);
    setFormData({
      title: "",
      description: "",
      priority: "MEDIUM",
      projectName: ""
    });
    setIsCreateModalOpen(true);
  };

  const handleSaveTicket = async () => {
    try {
      setIsSaving(true);
      
      if (selectedTicket) {
        // Actualizar ticket existente
        await supportService.updateTicket(selectedTicket.id, formData);
        success("Ticket actualizado correctamente");
      } else {
        // Crear nuevo ticket
        await supportService.createTicket(formData);
        success("Ticket creado correctamente");
      }
      
      setIsCreateModalOpen(false);
      setSelectedTicket(null);
      loadTickets(); // Recargar tickets
    } catch (err) {
      console.error('Error saving ticket:', err);
      error('Error al guardar el ticket');
    } finally {
      setIsSaving(false);
    }
  };

  const confirmDeleteTicket = async () => {
    if (!ticketToDelete) return;

    try {
      setIsDeleting(true);
      await supportService.deleteTicket(ticketToDelete.id);
      
      setIsDeleteModalOpen(false);
      setTicketToDelete(null);
      success("Ticket eliminado correctamente");
      loadTickets(); // Recargar tickets
    } catch (err) {
      console.error('Error deleting ticket:', err);
      error('Error al eliminar el ticket');
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const toggleDropdown = (ticketId: string) => {
    setOpenDropdown(openDropdown === ticketId ? null : ticketId);
  };

  const getPriorityDisplay = (priority: string) => {
    switch (priority) {
      case 'HIGHEST':
        return 'Máxima';
      case 'HIGH':
        return 'Alta';
      case 'MEDIUM':
        return 'Media';
      case 'LOW':
        return 'Baja';
      case 'LOWEST':
        return 'Mínima';
      default:
        return priority;
    }
  };

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'OPEN':
        return 'Abierto';
      case 'CLOSED':
        return 'Cerrado';
      case 'PENDING':
        return 'Pendiente';
      case 'IN_PROGRESS':
        return 'En Progreso';
      default:
        return status;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
          <span className="text-gray-600">Cargando tickets de soporte...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Soporte Técnico</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Gestiona todos los tickets de soporte de la plataforma
          </p>
          {apiError && (
            <div className="flex items-center space-x-2 mt-2 p-2 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <span className="text-sm text-red-800">{apiError}</span>
            </div>
          )}
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl shadow-md p-6 border-0">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Tickets</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText className="h-4 w-4 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6 border-0">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Abiertos</p>
              <p className="text-2xl font-bold text-green-600">{stats.open}</p>
            </div>
            <div className="h-8 w-8 bg-green-100 rounded-lg flex items-center justify-center">
              <AlertCircle className="h-4 w-4 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6 border-0">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Cerrados</p>
              <p className="text-2xl font-bold text-gray-600">{stats.closed}</p>
            </div>
            <div className="h-8 w-8 bg-gray-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="h-4 w-4 text-gray-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6 border-0">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Asignados</p>
              <p className="text-2xl font-bold text-blue-600">{stats.assigned}</p>
            </div>
            <div className="h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="h-4 w-4 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6 border-0">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Sin Asignar</p>
              <p className="text-2xl font-bold text-orange-600">{stats.unassigned}</p>
            </div>
            <div className="h-8 w-8 bg-orange-100 rounded-lg flex items-center justify-center">
              <Clock className="h-4 w-4 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-xl shadow-md border-0">
        <div className="p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Filter className="h-5 w-5 text-gray-500" />
            <h3 className="text-lg font-semibold text-gray-900">Filtros y Búsqueda</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar tickets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <select 
              value={priorityFilter} 
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            >
              <option value="all">Todas las prioridades</option>
              <option value="HIGHEST">Máxima</option>
              <option value="HIGH">Alta</option>
              <option value="MEDIUM">Media</option>
              <option value="LOW">Baja</option>
              <option value="LOWEST">Mínima</option>
            </select>
            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            >
              <option value="all">Todos los estados</option>
              <option value="OPEN">Abiertos</option>
              <option value="CLOSED">Cerrados</option>
              <option value="PENDING">Pendientes</option>
              <option value="IN_PROGRESS">En Progreso</option>
            </select>
            <select 
              value={assigneeFilter} 
              onChange={(e) => setAssigneeFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            >
              <option value="all">Todos los tickets</option>
              <option value="assigned">Asignados</option>
              <option value="unassigned">Sin asignar</option>
            </select>
            <div className="flex items-center justify-center px-4 py-2 bg-gray-50 rounded-lg border">
              <span className="text-sm font-medium text-gray-700">
                {filteredTickets.length} tickets encontrados
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabla de Tickets */}
      <div className="bg-white rounded-xl shadow-md border-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="font-semibold text-gray-900 py-4 px-6 text-left">Ticket</th>
                <th className="font-semibold text-gray-900 py-4 px-6 text-left">Creador</th>
                <th className="font-semibold text-gray-900 py-4 px-6 text-left">Asignado</th>
                <th className="font-semibold text-gray-900 py-4 px-6 text-left">Prioridad</th>
                <th className="font-semibold text-gray-900 py-4 px-6 text-left">Estado</th>
                <th className="font-semibold text-gray-900 py-4 px-6 text-left">Mensajes</th>
                <th className="font-semibold text-gray-900 py-4 px-6 text-left">Fecha</th>
                <th className="font-semibold text-gray-900 py-4 px-6 text-left w-[120px]">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredTickets.map((ticket) => {
                const PriorityIcon = priorityIcons[ticket.priority as keyof typeof priorityIcons];
                return (
                  <tr key={ticket.id} className="hover:bg-gray-50 border-b border-gray-100">
                    <td className="py-4 px-6">
                      <div>
                        <div className="font-semibold text-gray-900">{ticket.title}</div>
                        <div className="text-sm text-gray-500">{ticket.key}</div>
                        {ticket.projectName && (
                          <div className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full inline-block mt-1">
                            {ticket.projectName}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-sm">
                          <User className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{ticket.creator.fullName}</div>
                          <div className="text-sm text-gray-500">{ticket.creator.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      {ticket.assignee ? (
                        <div className="flex items-center space-x-3">
                          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-sm">
                            <User className="h-4 w-4 text-white" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{ticket.assignee.fullName}</div>
                            <div className="text-sm text-gray-500">{ticket.assignee.email}</div>
                          </div>
                        </div>
                      ) : (
                        <span className="text-gray-400 text-sm">Sin asignar</span>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`${priorityColors[ticket.priority as keyof typeof priorityColors]} border px-3 py-1 text-xs font-medium rounded-full flex items-center space-x-1 w-fit`}>
                        <PriorityIcon className="h-3 w-3" />
                        <span>{getPriorityDisplay(ticket.priority)}</span>
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`${statusColors[ticket.status as keyof typeof statusColors] || statusColors.OPEN} border px-3 py-1 text-xs font-medium rounded-full`}>
                        {getStatusDisplay(ticket.status)}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-1">
                        <MessageSquare className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{ticket.messages.length}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-gray-700 text-sm">{formatDate(ticket.createdAt)}</td>
                    <td className="py-4 px-6">
                      <div className="relative" ref={dropdownRef}>
                        <button
                          className="h-8 w-8 p-0 hover:bg-gray-100 rounded-lg flex items-center justify-center"
                          onClick={() => toggleDropdown(ticket.id)}
                        >
                          <MoreHorizontal className="h-4 w-4 text-gray-600" />
                        </button>
                        {openDropdown === ticket.id && (
                          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-50 border border-gray-200 py-1">
                            <button
                              onClick={() => handleViewTicket(ticket)}
                              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                              <Eye className="mr-3 h-4 w-4 text-blue-600" />
                              Ver Detalles
                            </button>
                            <button
                              onClick={() => handleEditTicket(ticket)}
                              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                              <Edit className="mr-3 h-4 w-4 text-blue-600" />
                              Editar Ticket
                            </button>
                            <button
                              onClick={() => handleDeleteTicket(ticket)}
                              className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                            >
                              <Trash2 className="mr-3 h-4 w-4 text-red-600" />
                              Eliminar Ticket
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

      {/* Modal de Detalles del Ticket */}
      {isTicketModalOpen && selectedTicket && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto transform transition-all">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{selectedTicket.title}</h2>
                  <p className="text-gray-600 mt-1">Ticket {selectedTicket.key}</p>
                </div>
                <button
                  onClick={() => setIsTicketModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="p-6 space-y-6">
              {/* Información del ticket */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Información del Ticket</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Estado:</span>
                      <span className={`${statusColors[selectedTicket.status as keyof typeof statusColors] || statusColors.OPEN} border px-2 py-1 text-xs font-medium rounded-full`}>
                        {getStatusDisplay(selectedTicket.status)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Prioridad:</span>
                      <span className={`${priorityColors[selectedTicket.priority as keyof typeof priorityColors]} border px-2 py-1 text-xs font-medium rounded-full`}>
                        {getPriorityDisplay(selectedTicket.priority)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Creado:</span>
                      <span className="text-gray-900">{formatDate(selectedTicket.createdAt)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Actualizado:</span>
                      <span className="text-gray-900">{formatDate(selectedTicket.updatedAt)}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Usuarios</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Creado por:</p>
                      <div className="flex items-center space-x-2">
                        <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center">
                          <User className="h-3 w-3 text-green-600" />
                        </div>
                        <span className="text-sm font-medium">{selectedTicket.creator.fullName}</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Asignado a:</p>
                      {selectedTicket.assignee ? (
                        <div className="flex items-center space-x-2">
                          <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center">
                            <User className="h-3 w-3 text-blue-600" />
                          </div>
                          <span className="text-sm font-medium">{selectedTicket.assignee.fullName}</span>
                        </div>
                      ) : (
                        <span className="text-gray-400 text-sm">Sin asignar</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Descripción */}
              {selectedTicket.description && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Descripción</h3>
                  <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{selectedTicket.description}</p>
                </div>
              )}

              {/* Mensajes */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Mensajes ({selectedTicket.messages.length})</h3>
                <div className="space-y-4 max-h-64 overflow-y-auto">
                  {selectedTicket.messages.length > 0 ? (
                    selectedTicket.messages.map((message) => (
                      <div key={message.id} className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center">
                              <User className="h-3 w-3 text-blue-600" />
                            </div>
                            <span className="text-sm font-medium">{message.user.fullName}</span>
                          </div>
                          <span className="text-xs text-gray-500">{formatDate(message.createdAt)}</span>
                        </div>
                        <p className="text-gray-700 text-sm">{message.content}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-4">No hay mensajes en este ticket</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Crear/Editar Ticket */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md transform transition-all">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">
                {selectedTicket ? 'Editar Ticket' : 'Nuevo Ticket'}
              </h2>
              <p className="text-gray-600 mt-1">
                {selectedTicket ? 'Modifica la información del ticket' : 'Crea un nuevo ticket de soporte'}
              </p>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Título
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ingresa el título del ticket"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Descripción
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                  placeholder="Describe el problema o solicitud"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Prioridad
                </label>
                <select 
                  value={formData.priority} 
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                >
                  <option value="LOWEST">Mínima</option>
                  <option value="LOW">Baja</option>
                  <option value="MEDIUM">Media</option>
                  <option value="HIGH">Alta</option>
                  <option value="HIGHEST">Máxima</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Proyecto (Opcional)
                </label>
                <input
                  type="text"
                  value={formData.projectName}
                  onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Nombre del proyecto relacionado"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b-xl">
              <button 
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                onClick={() => setIsCreateModalOpen(false)}
                disabled={isSaving}
              >
                Cancelar
              </button>
              <button 
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                onClick={handleSaveTicket}
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin inline" />
                    Guardando...
                  </>
                ) : (
                  selectedTicket ? 'Actualizar Ticket' : 'Crear Ticket'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Confirmación de Eliminación */}
      {isDeleteModalOpen && ticketToDelete && (
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
                ¿Estás seguro de que quieres eliminar el ticket{" "}
                <strong className="text-gray-900">{ticketToDelete.title}</strong>?
              </p>
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-700">
                  <strong>Advertencia:</strong> Esta acción eliminará permanentemente el ticket y todos sus mensajes asociados.
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
                onClick={confirmDeleteTicket}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin inline" />
                    Eliminando...
                  </>
                ) : (
                  'Eliminar Ticket'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 