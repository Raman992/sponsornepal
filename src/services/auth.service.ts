import { createClient } from '@/lib/supabase/server';
import type { User } from '@/store/auth-store';

export interface AuthError {
  message: string;
  status?: number;
}

export class AuthService {
  private supabase = createClient();

  async signInWithEmail(email: string, password: string): Promise<{ user: User | null; error: AuthError | null }> {
    try {
      const { data, error } = await this.supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { user: null, error: { message: error.message } };
      }

      if (data.user) {
        const userData = await this.getUserData(data.user.id);
        return { user: userData, error: null };
      }

      return { user: null, error: { message: 'No user returned' } };
    } catch (error) {
      console.error('Sign in error:', error);
      return { user: null, error: { message: 'An unexpected error occurred' } };
    }
  }

  async signUpWithEmail(
    email: string,
    password: string,
    fullName: string,
    role: 'creator' | 'brand'
  ): Promise<{ user: User | null; error: AuthError | null }> {
    try {
      const { data, error } = await this.supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: role,
          },
        },
      });

      if (error) {
        return { user: null, error: { message: error.message } };
      }

      if (data.user) {
        const userData = await this.getUserData(data.user.id);
        return { user: userData, error: null };
      }

      return { user: null, error: { message: 'No user returned' } };
    } catch (error) {
      console.error('Sign up error:', error);
      return { user: null, error: { message: 'An unexpected error occurred' } };
    }
  }

  async signInWithGoogle(role?: 'creator' | 'brand'): Promise<{ error: AuthError | null }> {
    try {
      const { error } = await this.supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          queryParams: {
            prompt: 'select_account',
          },
          redirectTo: `${window.location.origin}/auth/callback?role=${role || 'creator'}`,
        },
      });

      if (error) {
        return { error: { message: error.message } };
      }

      return { error: null };
    } catch (error) {
      console.error('Google sign in error:', error);
      return { error: { message: 'An unexpected error occurred' } };
    }
  }

  async signOut(): Promise<{ error: AuthError | null }> {
    try {
      const { error } = await this.supabase.auth.signOut();
      return { error };
    } catch (error) {
      console.error('Sign out error:', error);
      return { error: { message: 'An unexpected error occurred' } };
    }
  }

  async resetPassword(email: string): Promise<{ error: AuthError | null }> {
    try {
      const { error } = await this.supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (error) {
        return { error: { message: error.message } };
      }

      return { error: null };
    } catch (error) {
      console.error('Reset password error:', error);
      return { error: { message: 'An unexpected error occurred' } };
    }
  }

  async updatePassword(newPassword: string): Promise<{ error: AuthError | null }> {
    try {
      const { error } = await this.supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        return { error: { message: error.message } };
      }

      return { error: null };
    } catch (error) {
      console.error('Update password error:', error);
      return { error: { message: 'An unexpected error occurred' } };
    }
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const { data: { user } } = await this.supabase.auth.getUser();
      
      if (!user) {
        return null;
      }

      return await this.getUserData(user.id);
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  }

  async getUserData(userId: string): Promise<User | null> {
    try {
      const { data, error } = await this.supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user data:', error);
        return null;
      }

      return {
        id: data.id,
        email: data.email,
        role: data.role,
        full_name: data.full_name,
        avatar_url: data.avatar_url,
        is_verified: data.is_verified,
        is_suspended: data.is_suspended,
      };
    } catch (error) {
      console.error('Error getting user data:', error);
      return null;
    }
  }

  async updateProfile(updates: {
    full_name?: string;
    avatar_url?: string;
  }): Promise<{ user: User | null; error: AuthError | null }> {
    try {
      const { data: { user } } = await this.supabase.auth.getUser();
      
      if (!user) {
        return { user: null, error: { message: 'Not authenticated' } };
      }

      const { data, error } = await this.supabase
        .from('users')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();

      if (error) {
        return { user: null, error: { message: error.message } };
      }

      return {
        user: {
          id: data.id,
          email: data.email,
          role: data.role,
          full_name: data.full_name,
          avatar_url: data.avatar_url,
          is_verified: data.is_verified,
          is_suspended: data.is_suspended,
        },
        error: null,
      };
    } catch (error) {
      console.error('Update profile error:', error);
      return { user: null, error: { message: 'An unexpected error occurred' } };
    }
  }
}

export const authService = new AuthService();