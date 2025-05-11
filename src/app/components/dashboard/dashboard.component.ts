import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Product } from '../../models/product.model';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  totalProducts = 0;
  inStockProducts = 0;
  lowStockProducts = 0;
  recentProducts: Product[] = [];
  currentUser: any = null;
  constructor(private authService: AuthService) {}
  
  // Temporary mock data for demonstration
  mockProducts: Product[] = [
    {
      id: 1,
      name: 'Laptop Dell XPS 13',
      description: 'High-performance laptop with InfinityEdge display',
      price: 1299.99,
      stockQuantity: 15,
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 2,
      name: 'iPhone 15 Pro',
      description: 'Latest Apple smartphone with advanced camera system',
      price: 999.99,
      stockQuantity: 8,
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 3,
      name: 'Samsung 4K Smart TV',
      description: '55-inch 4K Ultra HD Smart LED TV',
      price: 699.99,
      stockQuantity: 3,
      status: 'LOW_STOCK',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 4,
      name: 'Sony PlayStation 5',
      description: 'Next-gen gaming console with ultra-high-speed SSD',
      price: 499.99,
      stockQuantity: 0,
      status: 'OUT_OF_STOCK',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  ngOnInit(): void {
    // Get current user information
    this.currentUser = this.authService.getCurrentUser();
    
    // In a real application, these would come from a service
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    // Mock data - in a real application, this would be API calls
    this.recentProducts = this.mockProducts
      .sort((a, b) => new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime())
      .slice(0, 5);
    this.totalProducts = this.mockProducts.length;
    this.inStockProducts = this.mockProducts.filter(p => p.stockQuantity && p.stockQuantity > 5).length;
    this.lowStockProducts = this.mockProducts.filter(p => p.stockQuantity !== undefined && 
                                              p.stockQuantity <= 5 && 
                                              p.stockQuantity > 0).length;
  }
}
