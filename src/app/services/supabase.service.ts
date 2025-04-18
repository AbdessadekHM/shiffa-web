import { Injectable } from '@angular/core';
import { createClient, Session, SupabaseClient, User } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';



   @Injectable({
     providedIn: 'root',
   })
   export class SupabaseService {
     private supabase: SupabaseClient;
     sessionSubject = new BehaviorSubject<Session | null>(null);
     session$: Observable<Session | null> = this.sessionSubject.asObservable();
     private loadingSubject = new BehaviorSubject<boolean>(true);
     loading$ = this.loadingSubject.asObservable();

     constructor() {
       this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
       this.supabase.auth.onAuthStateChange((event, session) => {
          console.log('Auth state changed:', event, session);
          this.sessionSubject.next(session);
        });
        this.loadSession();


     }

     private async loadSession() {
        this.loadingSubject.next(true);
        const { data: { session } } = await this.supabase.auth.getSession();
        this.sessionSubject.next(session);
        this.loadingSubject.next(false);
     }

     getSupabase(): SupabaseClient {
       return this.supabase;
     }

     async signInWithGoogle() {
      
       return await this.supabase.auth.signInWithOAuth({
         provider: 'google',
         options: {
           redirectTo: window.location.origin + '/register',
         },
       });

      }

     async signInWithEmail(emailOrUsername: string, password: string) {
       let email = emailOrUsername;
       if (!emailOrUsername.includes('@')) {
         const { data, error } = await this.supabase
           .from('profiles')
           .select('email')
           .eq('username', emailOrUsername)
           .single();
         if (error || !data) return { error: { message: 'Username not found' } };
         email = data.email;
       }
       return await this.supabase.auth.signInWithPassword({ email, password });
     }

     async updateUserPassword(password: string) {
       return await this.supabase.auth.updateUser({ password });
     }

     async getUserProfile(userId: string) {
       return await this.supabase
         .from('profiles')
         .select('*')
         .eq('id', userId)
         .single();
     }

     async createProfile(userId: string, email: string, username: string, firstName:string, lastName:string, phone?: string) {
      console.log(userId)
       return await this.supabase
         .from('profiles')
         .insert([{ id: userId, email, username, firstname:firstName, lastname: lastName, phone }]);
     }

     async updateProfile(userId: string, updates: { username?: string; firstname:string, lastname:string; phone?: string }) {
       return await this.supabase
         .from('profiles')
         .update(updates)
         .eq('id', userId);
     }

     async signOut() {
    return await this.supabase.auth.signOut();
    }

    getCurrentSession(): Session | null {
      return this.sessionSubject.value;
    }

    getCurrentUser(): User | null {
      return this.sessionSubject.value?.user || null;
    }
   }