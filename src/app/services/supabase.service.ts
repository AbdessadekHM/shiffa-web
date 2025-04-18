import { Injectable } from '@angular/core';
   import { createClient, SupabaseClient } from '@supabase/supabase-js';
   import { environment } from '../../environments/environment';

   @Injectable({
     providedIn: 'root',
   })
   export class SupabaseService {
     private supabase: SupabaseClient;

     constructor() {
       this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
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

     async createProfile(userId: string, email: string, username: string, fullName?: string, phone?: string) {
       return await this.supabase
         .from('profiles')
         .insert([{ id: userId, email, username, full_name: fullName, phone }]);
     }

     async updateProfile(userId: string, updates: { username?: string; full_name?: string; phone?: string }) {
       return await this.supabase
         .from('profiles')
         .update(updates)
         .eq('id', userId);
     }
   }