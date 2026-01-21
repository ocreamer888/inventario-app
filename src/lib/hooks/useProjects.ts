import { useState, useCallback, useEffect } from 'react';
import { Project } from '@/types/material';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/app/contexts/AuthContext';

// Transform database project (snake_case) to app project (camelCase)
function transformProjectFromDB(dbProject: any): Project {
  return {
    id: dbProject.id,
    user_id: dbProject.user_id,
    name: dbProject.name,
    fileName: dbProject.file_name,
    createdAt: dbProject.created_at,
    updatedAt: dbProject.updated_at
  };
}

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [optimisticIds, setOptimisticIds] = useState<Set<string>>(new Set());
  const { user } = useAuth();
  const supabase = createClient();

  // Fetch projects from Supabase
  const fetchProjects = useCallback(async () => {
    if (!user) {
      setProjects([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      // Transform snake_case from DB to camelCase for app
      const transformedData = (data || []).map(transformProjectFromDB);
      setProjects(transformedData);
      
      // Set initial current project if none selected
      if (transformedData && transformedData.length > 0 && !currentProject) {
        setCurrentProject(transformedData[0]);
      }
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError(err instanceof Error ? err.message : 'Error al cargar proyectos');
    } finally {
      setLoading(false);
    }
  }, [user, supabase, currentProject]);

  // Initial fetch
  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // Real-time subscription
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('projects-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'projects',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('Project change received:', payload);
          
          if (payload.eventType === 'INSERT') {
            const transformedProject = transformProjectFromDB(payload.new);
            setProjects(prev => {
              // Check if we already have this project optimistically added
              const exists = prev.some(p => p.id === transformedProject.id);
              if (exists) {
                // Replace optimistic version with real data
                return prev.map(p => p.id === transformedProject.id ? transformedProject : p);
              }
              // Add new project from another device
              return [transformedProject, ...prev];
            });
            // Remove from optimistic tracking
            setOptimisticIds(prev => {
              const next = new Set(prev);
              next.delete(transformedProject.id);
              return next;
            });
          } else if (payload.eventType === 'UPDATE') {
            const transformedProject = transformProjectFromDB(payload.new);
            setProjects(prev =>
              prev.map(p => p.id === payload.new.id ? transformedProject : p)
            );
            if (currentProject?.id === payload.new.id) {
              setCurrentProject(transformedProject);
            }
          } else if (payload.eventType === 'DELETE') {
            setProjects(prev => prev.filter(p => p.id !== payload.old.id));
            if (currentProject?.id === payload.old.id) {
              setCurrentProject(null);
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, supabase, currentProject]);

  const createProject = useCallback(async (projectData: { name: string; fileName?: string }) => {
    if (!user) {
      throw new Error('Debes iniciar sesión para crear un proyecto');
    }

    // Generate temporary ID for optimistic update
    const tempId = `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date().toISOString();

    // Create optimistic project
    const optimisticProject: Project = {
      id: tempId,
      user_id: user.id,
      name: projectData.name,
      fileName: projectData.fileName,
      createdAt: now,
      updatedAt: now
    };

    // Add optimistically to UI immediately
    setProjects(prev => [optimisticProject, ...prev]);
    setCurrentProject(optimisticProject);
    setOptimisticIds(prev => new Set(prev).add(tempId));

    try {
      const newProject = {
        user_id: user.id,
        name: projectData.name,
        file_name: projectData.fileName || null,
        created_at: now,
        updated_at: now
      };

      const { data, error: insertError } = await supabase
        .from('projects')
        .insert([newProject])
        .select()
        .single();

      if (insertError) throw insertError;

      const transformedProject = transformProjectFromDB(data);

      // Replace temp project with real one
      setProjects(prev =>
        prev.map(p => p.id === tempId ? transformedProject : p)
      );
      setCurrentProject(transformedProject);
      
      // Track the real ID to handle real-time subscription
      setOptimisticIds(prev => {
        const next = new Set(prev);
        next.delete(tempId);
        next.add(transformedProject.id);
        return next;
      });

      return transformedProject;
    } catch (err) {
      console.error('Error creating project:', err);
      
      // Rollback: Remove optimistic project
      setProjects(prev => prev.filter(p => p.id !== tempId));
      setCurrentProject(null);
      setOptimisticIds(prev => {
        const next = new Set(prev);
        next.delete(tempId);
        return next;
      });
      
      throw err;
    }
  }, [user, supabase]);

  const updateProject = useCallback(async (id: string, updates: Partial<Project>): Promise<Project | void> => {
    if (!user) {
      throw new Error('Debes iniciar sesión para actualizar un proyecto');
    }

    // Save current state for rollback
    const previousProject = projects.find(p => p.id === id);
    if (!previousProject) return;

    // Update UI optimistically
    const optimisticUpdates = {
      ...updates,
      updatedAt: new Date().toISOString()
    };

    setProjects(prev =>
      prev.map(p => p.id === id ? { ...p, ...optimisticUpdates } : p)
    );

    if (currentProject?.id === id) {
      setCurrentProject(prev => prev ? { ...prev, ...optimisticUpdates } : prev);
    }

    try {
      const updateData: any = {
        updated_at: new Date().toISOString()
      };
      
      if (updates.name !== undefined) updateData.name = updates.name;
      if (updates.fileName !== undefined) updateData.file_name = updates.fileName;
      if (updates.updatedAt !== undefined) updateData.updated_at = updates.updatedAt;

      const { data, error: updateError } = await supabase
        .from('projects')
        .update(updateData)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (updateError) throw updateError;

      return data ? transformProjectFromDB(data) : data;
    } catch (err) {
      console.error('Error updating project:', err);
      
      // Rollback to previous state
      setProjects(prev =>
        prev.map(p => p.id === id ? previousProject : p)
      );
      
      if (currentProject?.id === id) {
        setCurrentProject(previousProject);
      }
      
      throw err;
    }
  }, [user, projects, currentProject, supabase]);

  const deleteProject = useCallback(async (id: string) => {
    if (!user) {
      throw new Error('Debes iniciar sesión para eliminar un proyecto');
    }

    // Save for rollback
    const deletedProject = projects.find(p => p.id === id);
    if (!deletedProject) return;

    const wasCurrentProject = currentProject?.id === id;
    const remainingProjects = projects.filter(project => project.id !== id);

    // Remove from UI optimistically
    setProjects(remainingProjects);
    if (wasCurrentProject) {
      setCurrentProject(remainingProjects.length > 0 ? remainingProjects[0] : null);
    }

    try {
      const { error: deleteError } = await supabase
        .from('projects')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (deleteError) throw deleteError;
    } catch (err) {
      console.error('Error deleting project:', err);
      
      // Rollback: Re-add the project
      setProjects(prev => {
        // Find the correct position to insert it back
        const index = prev.findIndex(p => 
          new Date(p.createdAt) < new Date(deletedProject.createdAt)
        );
        if (index === -1) {
          return [...prev, deletedProject];
        }
        return [...prev.slice(0, index), deletedProject, ...prev.slice(index)];
      });
      
      if (wasCurrentProject) {
        setCurrentProject(deletedProject);
      }
      
      throw err;
    }
  }, [user, supabase, currentProject, projects]);

  const switchProject = useCallback((project: Project) => {
    setCurrentProject(project);
  }, []);

  return {
    projects,
    currentProject,
    setCurrentProject,
    createProject,
    updateProject,
    deleteProject,
    switchProject,
    loading,
    error,
    refetch: fetchProjects
  };
}
