import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    this.registerForm = this.formBuilder.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      verifyPassword: ['', [Validators.required]],
      userType: ['user', [Validators.required]],
      description: ['']
    }, { validator: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    // Watch for userType changes to handle description field validation
    this.registerForm.get('userType')?.valueChanges.subscribe(value => {
      const descriptionControl = this.registerForm.get('description');
      if (value === 'doctor') {
        descriptionControl?.setValidators([Validators.required, Validators.maxLength(250)]);
      } else {
        descriptionControl?.clearValidators();
      }
      descriptionControl?.updateValueAndValidity();
    });
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
    if (this.registerForm.valid) {
      console.log('Form submitted:', this.registerForm.value);
      // Add your registration logic here
    }
  }
} 