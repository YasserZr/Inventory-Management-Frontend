import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-unauthorized',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container mt-5">
      <div class="row">
        <div class="col-md-8 offset-md-2">
          <div class="card shadow">
            <div class="card-header bg-danger text-white">
              <h2>Access Denied</h2>
            </div>
            <div class="card-body text-center">
              <div class="mb-4">
                <i class="bi bi-x-circle" style="font-size: 4rem; color: #dc3545;"></i>
              </div>
              <h3 class="mb-4">Unauthorized Access</h3>
              <p class="lead mb-4">
                Sorry, you don't have permission to access this page. Please contact your administrator if you believe this is a mistake.
              </p>
              <div class="d-flex justify-content-center">
                <a [routerLink]="['/']" class="btn btn-primary me-3">
                  Go to Homepage
                </a>
                <a [routerLink]="['/login']" class="btn btn-outline-secondary">
                  Login as Different User
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .bi-x-circle {
      display: inline-block;
    }
    .card {
      border: none;
      border-radius: 0.5rem;
    }
    .card-header {
      border-radius: 0.5rem 0.5rem 0 0;
    }
    .btn {
      padding: 0.5rem 1.5rem;
      border-radius: 0.25rem;
    }
  `]
})
export class UnauthorizedComponent {}
