import type { User, UserRole } from '@/store/auth-store';
import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';

export interface SessionUser {
  id: string;
  email: string;
  role: UserRole;
  full_name: string | null;
  avatar_url: string | null;
  is_verified: boolean;
  is_suspended: boolean;
}

export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const supabase = createClient();

  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single();

  if (userError || !userData) {
    return null;
  }

  return {
    id: userData.id,
    email: userData.email,
    role: userData.role,
    full_name: userData.full_name,
    avatar_url: userData.avatar_url,
    is_verified: userData.is_verified,
    is_suspended: userData.is_suspended,
  };
}

export async function isAuthenticated(): Promise<boolean> {
  const session = await getSession();
  return !!session;
}

export async function hasRole(role: UserRole): Promise<boolean> {
  const session = await getSession();
  return session?.role === role;
}

export async function isCreator(): Promise<boolean> {
  return hasRole('creator');
}

export async function isBrand(): Promise<boolean> {
  return hasRole('brand');
}

export async function isAdmin(): Promise<boolean> {
  return hasRole('admin');
}