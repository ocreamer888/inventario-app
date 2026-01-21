import { useState, useEffect, useCallback } from 'react';
import { Material, Project } from '@/types/material';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/app/contexts/AuthContext';

interface UseMaterialsProps {
  currentProject: Project | null;
  onProjectUpdate: (id: string, updates: Partial<Project>) => void;
}

// Transform database material (snake_case) to app material (camelCase)
function transformMaterialFromDB(dbMaterial: any): Material {
  return {
    id: dbMaterial.id,
    project_id: dbMaterial.project_id,
    user_id: dbMaterial.user_id,
    name: dbMaterial.name,
    description: dbMaterial.description,
    category: dbMaterial.category,
    brand: dbMaterial.brand,
    color: dbMaterial.color,
    size: dbMaterial.size,
    dimensions: dbMaterial.dimensions,
    unit: dbMaterial.unit,
    quantity: dbMaterial.quantity,
    minQuantity: dbMaterial.min_quantity,
    price: dbMaterial.price,
    location: dbMaterial.location,
    supplier: dbMaterial.supplier,
    notes: dbMaterial.notes,
    createdAt: dbMaterial.created_at,
    updatedAt: dbMaterial.updated_at
  };
}

export function useMaterials({ currentProject, onProjectUpdate }: UseMaterialsProps) {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [filteredMaterials, setFilteredMaterials] = useState<Material[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [optimisticIds, setOptimisticIds] = useState<Set<string>>(new Set());
  const { user } = useAuth();
  const supabase = createClient();

  // Fetch materials from Supabase when project changes
  const fetchMaterials = useCallback(async () => {
    if (!currentProject || !user) {
      setMaterials([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('materials')
        .select('*')
        .eq('project_id', currentProject.id)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      // Transform snake_case from DB to camelCase for app
      const transformedData = (data || []).map(transformMaterialFromDB);
      setMaterials(transformedData);
    } catch (err) {
      console.error('Error fetching materials:', err);
      setError(err instanceof Error ? err.message : 'Error al cargar materiales');
    } finally {
      setLoading(false);
    }
  }, [currentProject, user, supabase]);

  // Fetch materials when project changes
  useEffect(() => {
    fetchMaterials();
    setSearchTerm('');
    setSelectedCategory('all');
    setEditingMaterial(null);
  }, [fetchMaterials]);

  // Real-time subscription
  useEffect(() => {
    if (!currentProject || !user) return;

    const channel = supabase
      .channel(`materials-${currentProject.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'materials',
          filter: `project_id=eq.${currentProject.id}`
        },
        (payload) => {
          console.log('Material change received:', payload);
          
          if (payload.eventType === 'INSERT') {
            const transformedMaterial = transformMaterialFromDB(payload.new);
            setMaterials(prev => {
              // Check if we already have this material optimistically added
              const exists = prev.some(m => m.id === transformedMaterial.id);
              if (exists) {
                // Replace optimistic version with real data
                return prev.map(m => m.id === transformedMaterial.id ? transformedMaterial : m);
              }
              // Add new material from another user/device
              return [transformedMaterial, ...prev];
            });
            // Remove from optimistic tracking
            setOptimisticIds(prev => {
              const next = new Set(prev);
              next.delete(transformedMaterial.id);
              return next;
            });
          } else if (payload.eventType === 'UPDATE') {
            const transformedMaterial = transformMaterialFromDB(payload.new);
            setMaterials(prev =>
              prev.map(m => m.id === payload.new.id ? transformedMaterial : m)
            );
          } else if (payload.eventType === 'DELETE') {
            setMaterials(prev => prev.filter(m => m.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentProject, user, supabase]);

  // Filter materials
  useEffect(() => {
    let filtered = materials;

    if (searchTerm) {
      filtered = filtered.filter(material =>
        material.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        material.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        material.brand.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(material => material.category === selectedCategory);
    }

    setFilteredMaterials(filtered);
  }, [materials, searchTerm, selectedCategory]);

  const addMaterial = useCallback(async (material: Omit<Material, 'id' | 'createdAt' | 'updatedAt' | 'project_id' | 'user_id'>) => {
    if (!currentProject) {
      throw new Error('Debes crear o seleccionar un proyecto primero');
    }
    if (!user) {
      throw new Error('Debes iniciar sesión para agregar materiales');
    }

    // Generate temporary ID for optimistic update
    const tempId = `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date().toISOString();

    // Create optimistic material
    const optimisticMaterial: Material = {
      id: tempId,
      project_id: currentProject.id,
      user_id: user.id,
      name: material.name,
      description: material.description,
      category: material.category,
      brand: material.brand,
      color: material.color,
      size: material.size,
      dimensions: material.dimensions,
      unit: material.unit,
      quantity: material.quantity,
      minQuantity: material.minQuantity,
      price: material.price,
      location: material.location,
      supplier: material.supplier,
      notes: material.notes,
      createdAt: now,
      updatedAt: now
    };

    // Add optimistically to UI immediately
    setMaterials(prev => [optimisticMaterial, ...prev]);
    setOptimisticIds(prev => new Set(prev).add(tempId));

    try {
      const newMaterial = {
        project_id: currentProject.id,
        user_id: user.id,
        name: material.name,
        description: material.description,
        category: material.category,
        brand: material.brand,
        color: material.color || null,
        size: material.size || null,
        dimensions: material.dimensions || null,
        unit: material.unit,
        quantity: material.quantity,
        min_quantity: material.minQuantity,
        price: material.price,
        location: material.location,
        supplier: material.supplier || null,
        notes: material.notes || null,
        created_at: now,
        updated_at: now
      };

      const { data, error: insertError } = await supabase
        .from('materials')
        .insert([newMaterial])
        .select()
        .single();

      if (insertError) throw insertError;

      const transformedData = transformMaterialFromDB(data);

      // Replace temp material with real one
      setMaterials(prev =>
        prev.map(m => m.id === tempId ? transformedData : m)
      );
      
      // Track the real ID to handle real-time subscription
      setOptimisticIds(prev => {
        const next = new Set(prev);
        next.delete(tempId);
        next.add(transformedData.id);
        return next;
      });

      // Update project's updated_at timestamp (in background, non-blocking)
      onProjectUpdate(currentProject.id, {
        updatedAt: new Date().toISOString()
      }).catch(err => console.error('Error updating project timestamp:', err));

      return transformedData;
    } catch (err) {
      console.error('Error adding material:', err);
      
      // Rollback: Remove optimistic material
      setMaterials(prev => prev.filter(m => m.id !== tempId));
      setOptimisticIds(prev => {
        const next = new Set(prev);
        next.delete(tempId);
        return next;
      });
      
      throw err;
    }
  }, [currentProject, user, supabase, onProjectUpdate]);

  const updateMaterial = useCallback(async (id: string, updates: Partial<Material>) => {
    if (!currentProject || !user) return;

    // Save current state for rollback
    const previousMaterial = materials.find(m => m.id === id);
    if (!previousMaterial) return;

    // Update UI optimistically
    setMaterials(prev =>
      prev.map(m =>
        m.id === id
          ? { ...m, ...updates, updatedAt: new Date().toISOString() }
          : m
      )
    );

    try {
      const updateData: any = {
        updated_at: new Date().toISOString()
      };

      // Map camelCase to snake_case for database
      if (updates.name !== undefined) updateData.name = updates.name;
      if (updates.description !== undefined) updateData.description = updates.description;
      if (updates.category !== undefined) updateData.category = updates.category;
      if (updates.brand !== undefined) updateData.brand = updates.brand;
      if (updates.color !== undefined) updateData.color = updates.color;
      if (updates.size !== undefined) updateData.size = updates.size;
      if (updates.dimensions !== undefined) updateData.dimensions = updates.dimensions;
      if (updates.unit !== undefined) updateData.unit = updates.unit;
      if (updates.quantity !== undefined) updateData.quantity = updates.quantity;
      if (updates.minQuantity !== undefined) updateData.min_quantity = updates.minQuantity;
      if (updates.price !== undefined) updateData.price = updates.price;
      if (updates.location !== undefined) updateData.location = updates.location;
      if (updates.supplier !== undefined) updateData.supplier = updates.supplier;
      if (updates.notes !== undefined) updateData.notes = updates.notes;

      const { error: updateError } = await supabase
        .from('materials')
        .update(updateData)
        .eq('id', id)
        .eq('user_id', user.id);

      if (updateError) throw updateError;

      // Update project's updated_at timestamp (in background)
      onProjectUpdate(currentProject.id, {
        updatedAt: new Date().toISOString()
      }).catch(err => console.error('Error updating project timestamp:', err));

      setEditingMaterial(null);
    } catch (err) {
      console.error('Error updating material:', err);
      
      // Rollback to previous state
      setMaterials(prev =>
        prev.map(m => m.id === id ? previousMaterial : m)
      );
      
      throw err;
    }
  }, [currentProject, user, materials, supabase, onProjectUpdate]);

  const deleteMaterial = useCallback(async (id: string) => {
    if (!currentProject || !user) return;

    // Save for rollback
    const deletedMaterial = materials.find(m => m.id === id);
    if (!deletedMaterial) return;

    // Remove from UI optimistically
    setMaterials(prev => prev.filter(m => m.id !== id));

    try {
      const { error: deleteError } = await supabase
        .from('materials')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (deleteError) throw deleteError;

      // Update project's updated_at timestamp (in background)
      onProjectUpdate(currentProject.id, {
        updatedAt: new Date().toISOString()
      }).catch(err => console.error('Error updating project timestamp:', err));
    } catch (err) {
      console.error('Error deleting material:', err);
      
      // Rollback: Re-add the material
      setMaterials(prev => {
        // Find the correct position to insert it back
        const index = prev.findIndex(m => 
          new Date(m.createdAt) < new Date(deletedMaterial.createdAt)
        );
        if (index === -1) {
          return [...prev, deletedMaterial];
        }
        return [...prev.slice(0, index), deletedMaterial, ...prev.slice(index)];
      });
      
      throw err;
    }
  }, [currentProject, user, materials, supabase, onProjectUpdate]);

  const updateQuantity = useCallback(async (id: string, newQuantity: number, operation: 'add' | 'subtract') => {
    if (!currentProject || !user) return;

    // Get current material
    const material = materials.find(m => m.id === id);
    if (!material) return;

    const currentQuantity = material.quantity;
    let newQuantityValue = currentQuantity;
    
    if (operation === 'add') {
      newQuantityValue = currentQuantity + newQuantity;
    } else if (operation === 'subtract') {
      newQuantityValue = Math.max(0, currentQuantity - newQuantity);
    }

    // Update UI optimistically
    setMaterials(prev =>
      prev.map(m =>
        m.id === id
          ? { ...m, quantity: newQuantityValue, updatedAt: new Date().toISOString() }
          : m
      )
    );

    try {
      const { error: updateError } = await supabase
        .from('materials')
        .update({
          quantity: newQuantityValue,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .eq('user_id', user.id);

      if (updateError) throw updateError;

      // Update project's updated_at timestamp (in background)
      onProjectUpdate(currentProject.id, {
        updatedAt: new Date().toISOString()
      }).catch(err => console.error('Error updating project timestamp:', err));
    } catch (err) {
      console.error('Error updating quantity:', err);
      
      // Rollback to original quantity
      setMaterials(prev =>
        prev.map(m =>
          m.id === id
            ? { ...m, quantity: currentQuantity }
            : m
        )
      );
      
      throw err;
    }
  }, [currentProject, user, materials, supabase, onProjectUpdate]);

  const setMaterialsDirectly = useCallback(async (newMaterials: Material[]) => {
    // This is used for import functionality
    // We'll handle this in the ImportExportPanel component
    console.warn('setMaterialsDirectly called - use import functionality instead');
  }, []);

  return {
    materials,
    filteredMaterials,
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    editingMaterial,
    setEditingMaterial,
    addMaterial,
    updateMaterial,
    deleteMaterial,
    updateQuantity,
    setMaterials: setMaterialsDirectly,
    loading,
    error,
    refetch: fetchMaterials
  };
}
