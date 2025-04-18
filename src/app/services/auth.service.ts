import { Injectable } from '@angular/core';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private supabase: SupabaseClient;
  private currentUser = new BehaviorSubject<User | null>(null);

  constructor() {
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseKey
    );

    // Listen for auth state changes
    this.supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        this.currentUser.next(session?.user ?? null);
      } else if (event === 'SIGNED_OUT') {
        this.currentUser.next(null);
      }
    });

    // Load initial session
    this.loadSession();
  }

  private async loadSession() {
    const { data: { session } } = await this.supabase.auth.getSession();
    this.currentUser.next(session?.user ?? null);
  }

  getCurrentUser(): Observable<User | null> {
    return this.currentUser.asObservable();
  }

  async getSession() {
    const { data: { session } } = await this.supabase.auth.getSession();
    return session;
  }

  async signInWithGoogle() {
    try {
      const { data, error } = await this.supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/register`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent'
          }
        }
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error signing in with Google:', error);
      throw error;
    }
  }

  async signOut() {
    await this.supabase.auth.signOut();
  }
} 