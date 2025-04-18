import { Injectable } from '@angular/core';
import { createClient, Session, SupabaseClient, User } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { FileMetadata } from '../models';



   @Injectable({
     providedIn: 'root',
   })
   export class SupabaseService {
     private supabase: SupabaseClient;
     sessionSubject = new BehaviorSubject<Session | null>(null);
     session$: Observable<Session | null> = this.sessionSubject.asObservable();
     private loadingSubject = new BehaviorSubject<boolean>(true);
     loading$ = this.loadingSubject.asObservable();

     constructor(
      private router: Router
     ) {
       this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
       this.supabase.auth.onAuthStateChange((event, session) => {
        
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
           redirectTo: window.location.origin + '/auth',
         },
       });

      }
      async hasProfile(userId: string): Promise<boolean> {
        try {
          this.loadingSubject.next(true);

          const { data, error } = await this.supabase
            .from('profiles')
            .select('id')
            .eq('id', userId)
            .single();
          if (error && error.code === 'PGRST116') return false; // No rows found
          if (error) throw new Error(error.message);
          console.log(data)
          this.loadingSubject.next(false);
          return !!data;
        } catch (error) {
          console.error('Check profile error:', error);
          return false;
        }
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

     async createProfile(userId: string, email: string, username: string, firstName:string, lastName:string, type: string, phone?: string, specialization?:string, description?:string) {
      console.log(userId)
       return await this.supabase
         .from('profiles')
         .insert([{ id: userId, email, username, firstname:firstName, lastname: lastName, phone, specialization, description, role: type }]);
     }

     async updateProfile(userId: string, updates: { username?: string; firstname:string, lastname:string; phone?: string, specialization?:string, description?:string }) {
       return await this.supabase
         .from('profiles')
         .update(updates)
         .eq('id', userId);
     }

     async signOut() {
      console.log("signing out")
    return await this.supabase.auth.signOut();
    }

    getCurrentSession(): Session | null {
      return this.sessionSubject.value;
    }

    getCurrentUser(): User | null {
      return this.sessionSubject.value?.user || null;
    }
    async AuthenticationRedirect(){
      while(!this.loading$);
      const user = this.getCurrentUser();
      if(user){

        const isProfileExist = await this.hasProfile(user.id);
        if(isProfileExist){
          console.log("user has profile")
          this.router.navigate(['/dashboard']);
        }else{
          this.router.navigate(['/register']);
        }
      }
    }

    //to get the profile for the current user
    async getProfile(userId: string): Promise<{ data: Profile | null; error: string | null }> {
    try {
      const { data, error } = await this.supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      if (error) throw new Error(error.message);
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error as string };
    }
  }

    //files handling, man it's 22:28PM and I am tired
    

    async uploadFile(
    file: File,
    type: 'report' | 'prescription' | 'certificate' | 'image' | 'other',
    description?: string
  ): Promise<{ data: FileMetadata | null; error: string | null }> {
    try {
      const user = this.getCurrentUser();
      if (!user) throw new Error('No authenticated user');

      const { data: profile, error: profileError } = await this.getProfile(user.id);
      if (profileError || !profile) throw new Error('Profile not found');

      // Organize file path by role
      const rolePath = profile.type === 'doctor' ? 'doctor' : 'patient';
      const filePath = `${rolePath}/${user.id}/${Date.now()}_${file.name}`;

      // Upload file to Supabase Storage
      const { data: uploadData, error: uploadError } = await this.supabase.storage
        .from('medical-files')
        .upload(filePath, file);
      
      if (uploadError) throw new Error(uploadError.message);

      // Get public URL (or signed URL for private buckets)
      const { data: urlData } = this.supabase.storage
        .from('medical-files')
        .getPublicUrl(filePath);
      
      if (!urlData) throw new Error('Failed to get file URL');

      // Insert metadata into files table
      const { data: fileData, error: insertError } = await this.supabase
        .from('files')
        .insert([{ user_id: user.id, file_url: urlData.publicUrl, type, description }])
        .select()
        .single();
      
      if (insertError) throw new Error(insertError.message);

      return { data: fileData, error: null };
    } catch (error) {
      return { data: null, error: error as string };
    }
  }

  async getUserFiles(): Promise<{ data: FileMetadata[] | null; error: string | null }> {
    try {
      const user = this.getCurrentUser();
      if (!user) throw new Error('No authenticated user');

      const { data, error } = await this.supabase
        .from('files')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw new Error(error.message);
      
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error as string };
    }
  }
   }