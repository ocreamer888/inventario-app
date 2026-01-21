'use client';

import { useAuth } from '@/app/contexts/AuthContext';
import PublicMenu from './PublicMenu';
import AuthenticatedMenu from './AuthenticatedMenu';

export function AppHeader() {
  const { user, loading } = useAuth();

  // Show loading state or nothing while checking auth
  if (loading) {
    return null;
  }

  // Conditionally render menu based on auth state
  return user ? <AuthenticatedMenu /> : <PublicMenu />;
}
