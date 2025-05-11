import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="home-container">
      <div class="hero-section">
        <div class="hero-content">
          <h1>Welcome to BuyNGo Inventory Management</h1>
          <p class="lead">
            Your complete solution for efficient inventory management, procurement, 
            and supplier relationship management
          </p>
          <div class="cta-buttons">
            <button *ngIf="!isAuthenticated" class="btn btn-primary btn-lg" [routerLink]="['/login']">
              Login
            </button>
            <button *ngIf="isAuthenticated" class="btn btn-primary btn-lg" [routerLink]="['/dashboard']">
              Go to Dashboard
            </button>
            <button *ngIf="!isAuthenticated" class="btn btn-outline-secondary btn-lg ms-3" [routerLink]="['/register']">
              Register
            </button>
          </div>
        </div>
      </div>

      <div class="features-section">
        <div class="container">
          <h2 class="text-center mb-5">Key Features</h2>
          <div class="row">
            <div class="col-md-4">
              <div class="feature-card">
                <div class="feature-icon">
                  <i class="bi bi-box-seam"></i>
                </div>
                <h3>Inventory Management</h3>
                <p>Track your inventory in real-time with automated alerts for low stock levels and expiring items.</p>
              </div>
            </div>
            <div class="col-md-4">
              <div class="feature-card">
                <div class="feature-icon">
                  <i class="bi bi-shop"></i>
                </div>
                <h3>Supplier Management</h3>
                <p>Manage supplier relationships, compare offers, and maintain supplier performance ratings.</p>
              </div>
            </div>
            <div class="col-md-4">
              <div class="feature-card">
                <div class="feature-icon">
                  <i class="bi bi-graph-up"></i>
                </div>
                <h3>Reporting & Analytics</h3>
                <p>Generate comprehensive reports on inventory turnover, supplier performance, and procurement costs.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .home-container {
      min-height: 100vh;
    }
    
    .hero-section {
      background: linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), 
                  url('/assets/images/warehouse.jpg') center/cover no-repeat;
      height: 500px;
      display: flex;
      align-items: center;
      color: white;
      text-align: center;
      padding: 2rem;
    }
    
    .hero-content {
      max-width: 800px;
      margin: 0 auto;
    }
    
    .hero-content h1 {
      font-size: 2.5rem;
      margin-bottom: 1rem;
    }
    
    .hero-content .lead {
      font-size: 1.25rem;
      margin-bottom: 2rem;
    }
    
    .cta-buttons {
      margin-top: 2rem;
    }
    
    .features-section {
      padding: 5rem 0;
      background-color: #f8f9fa;
    }
    
    .feature-card {
      background-color: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      height: 100%;
      text-align: center;
      transition: transform 0.3s;
    }
    
    .feature-card:hover {
      transform: translateY(-10px);
    }
    
    .feature-icon {
      font-size: 2.5rem;
      color: #007bff;
      margin-bottom: 1.5rem;
    }
    
    .feature-card h3 {
      margin-bottom: 1rem;
    }
  `]
})
export class HomeComponent implements OnInit {
  isAuthenticated = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Check if user is already logged in
    this.isAuthenticated = this.authService.isAuthenticated();
    
    // Subscribe to auth status changes
    this.authService.authStatus$.subscribe(status => {
      this.isAuthenticated = status;
    });
  }
}
