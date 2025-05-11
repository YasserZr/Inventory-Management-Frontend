import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LoginRequest } from '../../models/login-request.model';
import { finalize } from 'rxjs/operators';
import { ErrorHandlingService } from '../../services/error-handling.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="login-container">
      <div class="card">
        <div class="card-header">
          <h2>Login</h2>
        </div>
        <div class="card-body">
          <div *ngIf="errorMessage" class="alert alert-danger">
            {{ errorMessage }}
          </div>
          <form (ngSubmit)="onSubmit()" #loginForm="ngForm">
            <div class="form-group">
              <label for="username">Username or Email</label>
              <input
                type="text"
                class="form-control"
                id="username"
                name="username"
                [(ngModel)]="loginRequest.username"
                required
                autocomplete="username"
              />
            </div>
            <div class="form-group">
              <label for="password">Password</label>
              <input
                type="password"
                class="form-control"
                id="password"
                name="password"
                [(ngModel)]="loginRequest.password"
                required
                autocomplete="current-password"
              />
            </div>
            <button
              type="submit"
              class="btn btn-primary"
              [disabled]="!loginForm.form.valid || isLoading"
            >
              {{ isLoading ? 'Loading...' : 'Login' }}
            </button>
          </form>
          <div class="register-link">
            <p>Don't have an account? <a routerLink="/register">Register</a></p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 80vh;
    }
    .card {
      width: 400px;
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
    }
    .btn:disabled {
      background-color: #cccccc;
    }
    .register-link {
      margin-top: 20px;
      text-align: center;
    }
  `]
})
export class LoginComponent {
  loginRequest: LoginRequest = { username: '', password: '' };
  isLoading = false;
  errorMessage = '';
  returnUrl = '/dashboard';

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private errorHandler: ErrorHandlingService
  ) {
    // Get return URL from route parameters or default to dashboard
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
      // Auto-logout if user was redirected here from an expired session
    const state = this.router.getCurrentNavigation()?.extras?.state;
    if (state?.['error']) {
      this.errorMessage = state['error'];
    }
  }
  
  onSubmit() {
    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.loginRequest)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: () => {
          // Redirect to return URL after successful login
          this.router.navigateByUrl(this.returnUrl);
        },
        error: (error) => {
          this.errorMessage = this.errorHandler.handleError(error);
        }
      });
  }
}