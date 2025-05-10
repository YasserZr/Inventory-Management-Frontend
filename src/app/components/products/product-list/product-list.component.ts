import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Product } from '../../../models/product.model';

interface ProductWithSelection extends Product {
  selected?: boolean;
}

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss'
})
export class ProductListComponent implements OnInit {
  products: ProductWithSelection[] = [];
  filteredProducts: ProductWithSelection[] = [];
  searchTerm: string = '';
  categoryFilter: string = '';
  statusFilter: string = '';
  loading: boolean = true;

  // Mock data for demonstration purposes
  mockProducts: ProductWithSelection[] = [
    {
      id: 1,
      name: 'Laptop Dell XPS 13',
      description: 'High-performance laptop with InfinityEdge display',
      price: 1299.99,
      stockQuantity: 15,
      status: 'ACTIVE',
      category: { categoryId: 1, name: 'Electronics' },
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
      category: { categoryId: 1, name: 'Electronics' },
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
      category: { categoryId: 1, name: 'Electronics' },
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
      category: { categoryId: 1, name: 'Electronics' },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 5,
      name: 'Nike Air Max 270',
      description: 'Men\'s running shoes with Air Max cushioning',
      price: 150,
      stockQuantity: 25,
      status: 'ACTIVE',
      category: { categoryId: 2, name: 'Footwear' },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 6,
      name: 'Adidas Ultraboost 22',
      description: 'Running shoes with responsive Boost cushioning',
      price: 180,
      stockQuantity: 12,
      status: 'ACTIVE',
      category: { categoryId: 2, name: 'Footwear' },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 7,
      name: 'Levi\'s 501 Original Jeans',
      description: 'Classic straight leg jeans with button fly',
      price: 69.50,
      stockQuantity: 40,
      status: 'ACTIVE',
      category: { categoryId: 3, name: 'Clothing' },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 8,
      name: 'Kitchen Aid Stand Mixer',
      description: 'Professional stand mixer for home baking',
      price: 349.99,
      stockQuantity: 5,
      status: 'LOW_STOCK',
      category: { categoryId: 4, name: 'Home & Kitchen' },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  constructor() { }

  ngOnInit(): void {
    // Simulate API loading delay
    setTimeout(() => {
      // In a real app, products would come from a service that calls an API
      this.products = [...this.mockProducts];
      this.filteredProducts = [...this.products];
      this.loading = false;
    }, 1000);
  }

  applyFilter(): void {
    this.filteredProducts = [...this.products];
    
    // Apply search filter if term exists
    if (this.searchTerm) {
      const search = this.searchTerm.toLowerCase();
      this.filteredProducts = this.filteredProducts.filter(product => 
        product.name?.toLowerCase().includes(search) || 
        product.description?.toLowerCase().includes(search) ||
        product.category?.name?.toLowerCase().includes(search)
      );
    }
    
    // Apply category filter if selected
    if (this.categoryFilter) {
      this.filteredProducts = this.filteredProducts.filter(product => 
        product.category?.name === this.categoryFilter
      );
    }
    
    // Apply status filter if selected
    if (this.statusFilter) {
      this.filteredProducts = this.filteredProducts.filter(product => 
        product.status === this.statusFilter
      );
    }
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.categoryFilter = '';
    this.statusFilter = '';
    this.filteredProducts = [...this.products];
  }

  deleteProduct(id: number): void {
    // In a real app, this would call a service to delete the product via API
    if (confirm('Are you sure you want to delete this product?')) {
      this.products = this.products.filter(product => product.id !== id);
      this.applyFilter(); // Re-apply the filter to update the view
    }
  }

  isAllSelected(): boolean {
    return this.filteredProducts.length > 0 && 
           this.filteredProducts.every(product => product.selected);
  }

  toggleSelectAll(): void {
    const selectAll = !this.isAllSelected();
    this.filteredProducts.forEach(product => product.selected = selectAll);
  }

  hasSelectedProducts(): boolean {
    return this.filteredProducts.some(product => product.selected);
  }

  deleteSelected(): void {
    if (!this.hasSelectedProducts()) return;
    
    if (confirm('Are you sure you want to delete all selected products?')) {
      const selectedIds = this.filteredProducts
        .filter(product => product.selected)
        .map(product => product.id);
        
      // In a real app, this would call a service to batch delete via API
      this.products = this.products.filter(product => !selectedIds.includes(product.id));
      this.applyFilter(); // Re-apply the filter to update the view
    }
  }
}
