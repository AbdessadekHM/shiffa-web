import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { SupabaseService } from '../../services/supabase.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  
  loginForm: FormGroup; 
  isLoading = false;
  error:string | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private supabaseService: SupabaseService,
    private router: Router
  ) {
    
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    // Check if user is already authenticated
    this.authService.getCurrentUser().subscribe(user => {
      if (user) {
        this.router.navigate(['/register']);
      }
    });
  }

  ngOnInit(): void {
    // Check URL parameters for auth callback
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    if (code) {
      this.handleAuthCallback();
    }
  }

  private async handleAuthCallback() {
    try {
      this.isLoading = true;
      const session = await this.authService.getSession();
      if (session) {
        this.router.navigate(['/register']);
      }
    } catch (error) {
      console.error('Authentication error:', error);
      // Handle error appropriately
    } finally {
      this.isLoading = false;
    }
  }
  
  onSubmit(): void {
    if (this.loginForm.valid) {
      console.log('Form submitted:', this.loginForm.value);
      this.signInWithEmail();
      // Add your login logic here
    }
  }
    async signInWithGoogle() {
       const { error } = await this.supabaseService.signInWithGoogle();
       if (error) {
         this.error = error.message;
         
       }
     }

     async signInWithEmail() {
       const { error } = await this.supabaseService.signInWithEmail(this.loginForm.value.email,this.loginForm.value.password);
       if (error) {
         this.error = error.message;
         
       }
     }
}
