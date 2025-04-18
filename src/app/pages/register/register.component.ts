import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { SupabaseService } from '../../services/supabase.service';
import { User } from '@supabase/supabase-js';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  user:User|null = null;

  constructor(
    private formBuilder: FormBuilder,
    private supabaseService: SupabaseService,
    private router: Router
  ) {
    this.registerForm = this.formBuilder.group({
      firstName: [this.user?.user_metadata['full_name'], [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      verifyPassword: ['', [Validators.required]],
      userType: ['user', [Validators.required]],
      phone: ['', [Validators.required, Validators.pattern(/^\+?[0-9]{10,15}$/)]],
      description: ['']
    }, { validator: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    
    while(!this.supabaseService.loading$);
    this.user = this.supabaseService.getCurrentUser();
    
      
      
    this.registerForm.get('userType')?.valueChanges.subscribe(value => {
      const descriptionControl = this.registerForm.get('description');
      if (value === 'doctor') {
        descriptionControl?.setValidators([Validators.required, Validators.maxLength(250)]);
      } else {
        descriptionControl?.clearValidators();
      }
      descriptionControl?.updateValueAndValidity();
    });
    
    
    //if(!this.user){
     //// this.router.navigate(["/login"]);
    //}
    //const user = this.supabaseService.getCurrentUser();
    //if(user){


      //console.log("user's name", Object.keys(user));
      this.registerForm.get('firstName')?.setValue(this.user?.user_metadata['full_name'].split(" ")[0]);
      this.registerForm.get('lastName')?.setValue(this.user?.user_metadata['full_name'].split(" ")[1]);
      this.registerForm.get('email')?.setValue(this.user?.user_metadata['email']);
      
      

    //}
  }

  
  // Custom validator to check if passwords match
  passwordMatchValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const password = control.get('password');
    const verifyPassword = control.get('verifyPassword');

    if (password?.value !== verifyPassword?.value) {
      return { 'passwordMismatch': true };
    }
    return null;
  }

  onSubmit(): void {
    
    
    //this.supabaseService.updateUserPassword(this.registerForm.value.password).then(({ data, error }) => {
      //if (error) {
        //console.error('Error updating password:', error);
      //} else {
        //console.log('Password updated successfully:', data);
        
      //}
    //})
  
      
      
      
      
        this.supabaseService.createProfile(
        this.user?.id as string,
        this.registerForm.value.email,
        this.registerForm.value.username,
        this.registerForm.value.firstName,
        this.registerForm.value.lastName,
        this.registerForm.value.phone
      ).then(({ data, error }) => {
        if (error) {
          console.error('Error creating profile:', error);
        } else {
          console.log('Profile created successfully:', data);
          this.router.navigate(['/home']);
        }


      })
      
      

        
        
      
      
    
  }
} 