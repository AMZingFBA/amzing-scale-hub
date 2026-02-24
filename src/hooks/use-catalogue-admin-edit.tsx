import { useState, useEffect, useCallback } from 'react';
import { useAdmin } from './use-admin';

export function useCatalogueAdminEdit<T extends Record<string, any>>(
  storageKey: string,
  initialProducts: T[],
  idField: string = 'ean'
) {
  const { isAdmin } = useAdmin();

  const [products, setProducts] = useState<T[]>(() => {
    if (typeof window === 'undefined') return initialProducts;
    const stored = localStorage.getItem(`catalogue_admin_${storageKey}`);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return initialProducts;
      }
    }
    return initialProducts;
  });

  // Persist to localStorage whenever products change (only if admin has made edits)
  const persist = useCallback((updated: T[]) => {
    setProducts(updated);
    localStorage.setItem(`catalogue_admin_${storageKey}`, JSON.stringify(updated));
  }, [storageKey]);

  const updateProduct = useCallback((id: string, updates: Partial<T>) => {
    const updated = products.map(p =>
      (p as any)[idField] === id ? { ...p, ...updates } : p
    );
    persist(updated);
  }, [products, idField, persist]);

  const deleteProduct = useCallback((id: string) => {
    const updated = products.filter(p => (p as any)[idField] !== id);
    persist(updated);
  }, [products, idField, persist]);

  const resetToDefault = useCallback(() => {
    localStorage.removeItem(`catalogue_admin_${storageKey}`);
    setProducts(initialProducts);
  }, [storageKey, initialProducts]);

  return { products, isAdmin, updateProduct, deleteProduct, resetToDefault };
}
