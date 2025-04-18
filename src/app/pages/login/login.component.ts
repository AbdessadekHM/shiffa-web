import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
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
    
    private supabaseService: SupabaseService,
    private router: Router
  ) {
    
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    console.log("login")
    // Check if user is already authenticated
    
  }

  ngOnInit(): void {
    // Check URL parameters for auth callback
    //const urlParams = new URLSearchParams(window.location.search);
    //const code = urlParams.get('code');
    //if (code) {
      //this.handleAuthCallback();
    //}
    
    //const user = this.supabaseService.getCurrentUser();
    //if(user){
      //this.router.navigate(["/register"]);
      //console.log("user's name", Object.keys(user));
    //}
    
    
    this.supabaseService.AuthenticationRedirect()
    
    

    //this.authService.getCurrentUser().subscribe(user => {
////      console.log(user)
      //if (user) {
        
        //this.router.navigate(['/register']);
      //}
      
    //});
  }

  //private async handleAuthCallback() {
    //try {
      //this.isLoading = true;
      //const session = await this.authService.getSession();
      //if (session) {
        //this.router.navigate(['/register']);
      //}
    //} catch (error) {
      //console.error('Authentication error:', error);
      //// Handle error appropriately
    //} finally {
      //this.isLoading = false;
    //}
  //}
  
  onSubmit(): void {
    //if (this.loginForm.valid) {
      //console.log('Form submitted:', this.loginForm.value);
      //this.signInWithEmail();


    //}
    const user = this.supabaseService.getCurrentUser();
    console.log(user)
  }
  async signInWithGoogle() {

      const { error } = await this.supabaseService.signInWithGoogle();
      
      if (error) {
        console.log("something went wrong")
      
        this.error = error.message;
        this.router.navigate(['/login']);
         
      }
      
      


    }

    async signInWithEmail() {
      const { error } = await this.supabaseService.signInWithEmail(this.loginForm.value.email,this.loginForm.value.password);
      if (error) {
      console.log("something went wrong")
        this.error = error.message;
         
      }
    }
}
