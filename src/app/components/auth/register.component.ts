import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { RegisterRequest } from '../../models/register-request.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="register-container">
      <div class="card">
        <div class="card-header">
          <h2>Create an Account</h2>
        </div>
        <div class="card-body">
          <div *ngIf="errorMessage" class="alert alert-danger">
            {{ errorMessage }}
          </div>
          <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
            <!-- Username -->
            <div class="form-group mb-3">
              <label for="username">Username</label>
              <input
                type="text"
                class="form-control"
                id="username"
                formControlName="username"
                autocomplete="username"
              />
              <div *ngIf="f['username'].touched && f['username'].errors" class="text-danger">
                <small *ngIf="f['username'].errors && f['username'].errors['required']">Username is required</small>
                <small *ngIf="f['username'].errors && f['username'].errors['minlength']">Username must be at least 3 characters</small>
              </div>
            </div>
            
            <!-- First Name -->
            <div class="form-group mb-3">
              <label for="firstname">First Name</label>
              <input
                type="text"
                class="form-control"
                id="firstname"
                formControlName="firstname"
              />
              <div *ngIf="f['firstname'].touched && f['firstname'].errors" class="text-danger">
                <small *ngIf="f['firstname'].errors && f['firstname'].errors['required']">First name is required</small>
              </div>
            </div>
            
            <!-- Last Name -->
            <div class="form-group mb-3">
              <label for="lastname">Last Name</label>
              <input
                type="text"
                class="form-control"
                id="lastname"
                formControlName="lastname"
              />
              <div *ngIf="f['lastname'].touched && f['lastname'].errors" class="text-danger">
                <small *ngIf="f['lastname'].errors && f['lastname'].errors['required']">Last name is required</small>
              </div>
            </div>
            
            <!-- Email -->
            <div class="form-group mb-3">
              <label for="email">Email</label>
              <input
                type="email"
                class="form-control"
                id="email"
                formControlName="email"
                autocomplete="email"
              />
              <div *ngIf="f['email'].touched && f['email'].errors" class="text-danger">
                <small *ngIf="f['email'].errors && f['email'].errors['required']">Email is required</small>
                <small *ngIf="f['email'].errors && f['email'].errors['email']">Please enter a valid email</small>
              </div>
            </div>
            
            <!-- Password -->
            <div class="form-group mb-3">
              <label for="password">Password</label>
              <input
                type="password"
                class="form-control"
                id="password"
                formControlName="password"
                autocomplete="new-password"
              />
              <div *ngIf="f['password'].touched && f['password'].errors" class="text-danger">
                <small *ngIf="f['password'].errors && f['password'].errors['required']">Password is required</small>
                <small *ngIf="f['password'].errors && f['password'].errors['minlength']">Password must be at least 6 characters</small>
              </div>
            </div>
            
            <!-- Confirm Password -->
            <div class="form-group mb-3">
              <label for="confirmPassword">Confirm Password</label>
              <input
                type="password"
                class="form-control"
                id="confirmPassword"
                formControlName="confirmPassword"
                autocomplete="new-password"
              />
              <div *ngIf="f['confirmPassword'].touched && f['confirmPassword'].errors" class="text-danger">
                <small *ngIf="f['confirmPassword'].errors && f['confirmPassword'].errors['required']">Please confirm your password</small>
                <small *ngIf="f['confirmPassword'].errors && f['confirmPassword'].errors['passwordMismatch']">Passwords do not match</small>
              </div>
            </div>
            
            <!-- Role Selection -->
            <div class="form-group mb-3">
              <label for="role">Account Type</label>
              <select 
                class="form-control" 
                id="role" 
                formControlName="role"
                (change)="onRoleChange()"
              >
                <option value="USER">Customer</option>
                <option value="SUPPLIER">Supplier</option>
              </select>
            </div>
            
            <!-- Supplier specific fields -->
            <div *ngIf="f['role'].value === 'SUPPLIER'" class="supplier-fields">
              <div class="form-group mb-3">
                <label for="companyName">Company Name</label>
                <input
                  type="text"
                  class="form-control"
                  id="companyName"
                  formControlName="companyName"
                />
                <div *ngIf="isSupplier && f['companyName'].touched && f['companyName'].errors" class="text-danger">
                  <small *ngIf="f['companyName'].errors && f['companyName'].errors['required']">Company name is required for suppliers</small>
                </div>
              </div>
            </div>
            
            <button
              type="submit"
              class="btn btn-primary w-100 mt-3"
              [disabled]="registerForm.invalid || isLoading"
            >
              {{ isLoading ? 'Creating account...' : 'Register' }}
            </button>
          </form>
          <div class="login-link mt-3 text-center">
            <p>Already have an account? <a routerLink="/login">Login</a></p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .register-container {
      display: flex;
      justify-content: center;
      padding: 30px 0;
    }
    .card {
      width: 500px;
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }
    .form-group {
      margin-bottom: 15px;
    }
    .form-control {
      width: 100%;
      padding: 10px;
      border: 1px solid #ccc;
      border-radius: 4px;
    }
    .btn {
      padding: 10px 20px;
      background-color: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 500;
    }
    .btn:disabled {
      background-color: #cccccc;
    }
    .text-danger {
      color: #dc3545;
      font-size: 0.875rem;
      margin-top: 5px;
    }
    .supplier-fields {
      border-top: 1px solid #dee2e6;
      margin-top: 15px;
      padding-top: 15px;
    }
  `]
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  loading = false;
  submitted = false;
  isSupplier = false;
  isLoading = false;
  errorMessage = '';
  
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {}
  
  ngOnInit(): void {
    this.initializeForm();
  }
  
  // Convenience getter for easy access to form fields
  get f() { 
    return this.registerForm.controls; 
  }
  
  initializeForm(): void {
    this.registerForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      role: ['USER'], // Default to USER role
      companyName: [''] // Only required for suppliers
    }, {
      validators: this.passwordMatchValidator
    });
  }
  
  // Check if passwords match
  passwordMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;
    
    if (password && confirmPassword && password !== confirmPassword) {
      formGroup.get('confirmPassword')?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    
    return null;
  }
  
  onRoleChange(): void {
    const roleControl = this.registerForm.get('role');
    const companyNameControl = this.registerForm.get('companyName');
    
    if (roleControl?.value === 'SUPPLIER') {
      this.isSupplier = true;
      companyNameControl?.setValidators([Validators.required]);
    } else {
      this.isSupplier = false;
      companyNameControl?.clearValidators();
    }
    
    companyNameControl?.updateValueAndValidity();
  }
  
  onSubmit(): void {
    this.submitted = true;
    
    // Stop if form is invalid
    if (this.registerForm.invalid) {
      return;
    }
    
    this.isLoading = true;
    this.errorMessage = '';
    
    const registerData: RegisterRequest = {
      username: this.registerForm.value.username,
      firstname: this.registerForm.value.firstname,
      lastname: this.registerForm.value.lastname,
      email: this.registerForm.value.email,
      password: this.registerForm.value.password,
      role: this.registerForm.value.role
    };
    
    // Add company name for suppliers
    if (this.isSupplier) {
      registerData.companyName = this.registerForm.value.companyName;
    }
    
    this.authService.register(registerData)
      .subscribe({
        next: () => {
          // Navigate to login page after successful registration
          this.router.navigate(['/login'], { 
            queryParams: { registered: 'true' } 
          });
        },
        error: (err) => {
          this.errorMessage = err.message || 'Registration failed. Please try again.';
          this.isLoading = false;
        },
        complete: () => {
          this.isLoading = false;
        }
      });
  }
}