import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-auth-status',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="auth-status" [ngClass]="{'authenticated': isAuthenticated}">
      <ng-container *ngIf="isAuthenticated; else loginLink">
        <span class="user-info">
          <i class="fas fa-user-check me-2"></i>
          {{ username }}
        </span>
      </ng-container>
      <ng-template #loginLink>
        <a routerLink="/login" class="login-link">
          <i class="fas fa-sign-in-alt me-2"></i>
          Login
        </a>
      </ng-template>
    </div>
  `,
  styles: [`
    .auth-status {
      display: flex;
      align-items: center;
      padding: 5px 10px;
      border-radius: 4px;
      font-size: 0.9rem;
      background-color: #f8f9fa;
    }
    .auth-status.authenticated {
      background-color: #e8f5e9;
    }
    .user-info {
      color: #2e7d32;
    }
    .login-link {
      color: #1976d2;
      text-decoration: none;
    }
    .login-link:hover {
      text-decoration: underline;
    }
  `]
})
export class AuthStatusComponent implements OnInit {
  isAuthenticated = false;
  username = '';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    // Subscribe to auth status changes
    this.authService.authStatus$.subscribe(status => {
      this.isAuthenticated = status;
      if (status) {
        const user = this.authService.getCurrentUser();
        this.username = user?.username || 'User';
      } else {
        this.username = '';
      }
    });

    // Initial check
    this.isAuthenticated = this.authService.isAuthenticated();
    if (this.isAuthenticated) {
      const user = this.authService.getCurrentUser();
      this.username = user?.username || 'User';
    }
  }
}
