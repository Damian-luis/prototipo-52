"use client";
import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { projectService } from '@/services/supabase';
import { Project, Task } from '@/types';

interface ProjectContextType {
  projects: Project[];
  currentProject: Project | null;
  loading: boolean;
  error: string | null;
  createProject: (projectData: Omit<Project, 'id' | 'created_at' | 'updated_at'>) => Promise<{ success: boolean; message: string; projectId?: string }>;
  updateProject: (id: string, projectData: Partial<Project>) => Promise<{ success: boolean; message: string }>;
  deleteProject: (id: string) => Promise<{ success: boolean; message: string }>;
  getProjectById: (id: string) => Promise<Project | null>;
  getProjectsByCompany: (companyId: string) => Promise<Project[]>;
  getActiveProjects: () => Promise<Project[]>;
  addTaskToProject: (projectId: string, task: Omit<Task, 'id'>) => Promise<{ success: boolean; message: string }>;
  updateTask: (projectId: string, taskId: string, taskData: Partial<Task>) => Promise<{ success: boolean; message: string }>;
  assignProfessionalToProject: (projectId: string, professionalId: string) => Promise<{ success: boolean; message: string }>;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createProject = useCallback(async (projectData: Omit<Project, 'id' | 'created_at' | 'updated_at'>): Promise<{ success: boolean; message: string; projectId?: string }> => {
    try {
      setLoading(true);
      setError(null);
      
      const projectId = await projectService.createProject(projectData);
      
      // Crear el objeto del proyecto para el estado local
      const newProject: Project = {
        id: projectId,
        ...projectData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      setProjects(prev => [newProject, ...prev]);
      
      return { success: true, message: 'Proyecto creado exitosamente', projectId };
    } catch (error) {
      const message = 'Error al crear proyecto';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProject = useCallback(async (id: string, projectData: Partial<Project>): Promise<{ success: boolean; message: string }> => {
    try {
      setLoading(true);
      setError(null);
      
      await projectService.updateProject(id, projectData);
      
      // Actualizar estado local
      setProjects(prev => prev.map(project => 
        project.id === id 
          ? { ...project, ...projectData, updated_at: new Date().toISOString() }
          : project
      ));
      
      if (currentProject?.id === id) {
        setCurrentProject(prev => prev ? { ...prev, ...projectData, updated_at: new Date().toISOString() } : null);
      }
      
      return { success: true, message: 'Proyecto actualizado exitosamente' };
    } catch (error) {
      const message = 'Error al actualizar proyecto';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  }, [currentProject?.id]);

  const deleteProject = useCallback(async (id: string): Promise<{ success: boolean; message: string }> => {
    try {
      setLoading(true);
      setError(null);
      
      await projectService.deleteProject(id);
      
      setProjects(prev => prev.filter(project => project.id !== id));
      
      if (currentProject?.id === id) {
        setCurrentProject(null);
      }
      
      return { success: true, message: 'Proyecto eliminado exitosamente' };
    } catch (error) {
      const message = 'Error al eliminar proyecto';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  }, [currentProject?.id]);

  const getProjectById = useCallback(async (id: string): Promise<Project | null> => {
    try {
      setLoading(true);
      setError(null);
      
      const project = await projectService.getProjectById(id);
      setCurrentProject(project);
      
      return project;
    } catch (error) {
      const message = 'Error al obtener proyecto';
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getProjectsByCompany = useCallback(async (companyId: string): Promise<Project[]> => {
    try {
      setLoading(true);
      setError(null);
      
      const companyProjects = await projectService.getProjectsByCompany(companyId);
      setProjects(companyProjects);
      
      return companyProjects;
    } catch (error) {
      const message = 'Error al obtener proyectos de la empresa';
      setError(message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const getActiveProjects = useCallback(async (): Promise<Project[]> => {
    try {
      setLoading(true);
      setError(null);
      
      // Filtrar proyectos activos desde el estado local
      const activeProjects = projects.filter(project => project.status === 'active');
      setProjects(activeProjects);
      
      return activeProjects;
    } catch (error) {
      const message = 'Error al obtener proyectos activos';
      setError(message);
      return [];
    } finally {
      setLoading(false);
    }
  }, [projects]);

  const addTaskToProject = useCallback(async (projectId: string, taskData: Omit<Task, 'id'>): Promise<{ success: boolean; message: string }> => {
    try {
      setLoading(true);
      setError(null);
      
      const newTask: Task = {
        id: Date.now().toString(),
        ...taskData
      };
      
      const project = projects.find(p => p.id === projectId);
      if (!project) {
        return { success: false, message: 'Proyecto no encontrado' };
      }
      
      const updatedTasks = [...project.tasks, newTask];
      await projectService.updateProject(projectId, { tasks: updatedTasks });
      
      // Actualizar estado local
      setProjects(prev => prev.map(project => 
        project.id === projectId 
          ? { ...project, tasks: updatedTasks, updatedAt: new Date().toISOString() }
          : project
      ));
      
      if (currentProject?.id === projectId) {
        setCurrentProject(prev => prev ? { ...prev, tasks: updatedTasks, updatedAt: new Date().toISOString() } : null);
      }
      
      return { success: true, message: 'Tarea agregada exitosamente' };
    } catch (error) {
      const message = 'Error al agregar tarea';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  }, [projects, currentProject?.id]);

  const updateTask = useCallback(async (projectId: string, taskId: string, taskData: Partial<Task>): Promise<{ success: boolean; message: string }> => {
    try {
      setLoading(true);
      setError(null);
      
      const project = projects.find(p => p.id === projectId);
      if (!project) {
        return { success: false, message: 'Proyecto no encontrado' };
      }
      
      const updatedTasks = project.tasks.map(task => 
        task.id === taskId 
          ? { ...task, ...taskData }
          : task
      );
      
      await projectService.updateProject(projectId, { tasks: updatedTasks });
      
      // Actualizar estado local
      setProjects(prev => prev.map(project => 
        project.id === projectId 
          ? { ...project, tasks: updatedTasks, updatedAt: new Date().toISOString() }
          : project
      ));
      
      if (currentProject?.id === projectId) {
        setCurrentProject(prev => prev ? { ...prev, tasks: updatedTasks, updatedAt: new Date().toISOString() } : null);
      }
      
      return { success: true, message: 'Tarea actualizada exitosamente' };
    } catch (error) {
      const message = 'Error al actualizar tarea';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  }, [projects, currentProject?.id]);

  const assignProfessionalToProject = useCallback(async (projectId: string, professionalId: string): Promise<{ success: boolean; message: string }> => {
    try {
      setLoading(true);
      setError(null);
      
      const project = projects.find(p => p.id === projectId);
      if (!project) {
        return { success: false, message: 'Proyecto no encontrado' };
      }
      
      const updatedProfessionals = [...project.professionals, professionalId];
      await projectService.updateProject(projectId, { professionals: updatedProfessionals });
      
      // Actualizar estado local
      setProjects(prev => prev.map(project => 
        project.id === projectId 
          ? { ...project, professionals: updatedProfessionals, updatedAt: new Date().toISOString() }
          : project
      ));
      
      if (currentProject?.id === projectId) {
        setCurrentProject(prev => prev ? { ...prev, professionals: updatedProfessionals, updatedAt: new Date().toISOString() } : null);
      }
      
      return { success: true, message: 'Profesional asignado exitosamente' };
    } catch (error) {
      const message = 'Error al asignar profesional';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  }, [projects, currentProject?.id]);

  const value: ProjectContextType = {
    projects,
    currentProject,
    loading,
    error,
    createProject,
    updateProject,
    deleteProject,
    getProjectById,
    getProjectsByCompany,
    getActiveProjects,
    addTaskToProject,
    updateTask,
    assignProfessionalToProject
  };

  return (
    <ProjectContext.Provider value={value}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
}; 