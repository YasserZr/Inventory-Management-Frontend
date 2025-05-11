import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Product } from '../../../models/product.model';
import { ProductService } from '../../../services/product.service';
import { CategoryService } from '../../../services/category.service';
import { Category } from '../../../models/category.model';
import { finalize } from 'rxjs/operators';

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
  categories: Category[] = [];
  searchTerm: string = '';
  categoryFilter: string = '';
  statusFilter: string = '';
  loading: boolean = true;

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService
  ) { }

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();
  }

  loadProducts(): void {
    this.loading = true;
    this.productService.getAllProducts()
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (data) => {
          this.products = data;
          this.filteredProducts = [...this.products];
        },
        error: (error) => {
          console.error('Error loading products:', error);
          // Fallback to mock data in case of error
          this.products = this.getMockProducts();
          this.filteredProducts = [...this.products];
        }
      });
  }

  loadCategories(): void {
    this.categoryService.getAllCategories().subscribe({
      next: (data) => {
        this.categories = data;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        // You might want to add some mock categories in case of error
      }
    });
  }

  // Mock data for demonstration or testing purposes
  getMockProducts(): ProductWithSelection[] {
    return [
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
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(id.toString()).subscribe({
        next: () => {
          this.products = this.products.filter(product => product.id !== id);
          this.applyFilter(); // Re-apply the filter to update the view
        },
        error: (error) => {
          console.error('Error deleting product:', error);
          alert('Failed to delete product. Please try again.');
        }
      });
    }
  }

  getStatusBadgeClass(status: string): string {
    return this.productService.getStatusBadgeClass(status);
  }

  getStatusLabel(status: string): string {
    return this.productService.getStatusLabel(status);
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
      
      // Create an array of deletion observables
      const deleteObservables = selectedIds.map(id => 
        this.productService.deleteProduct(id!.toString())
      );
      
      // In a real implementation, you might want to use forkJoin or similar
      // to handle multiple deletion requests
      Promise.all(deleteObservables.map(obs => 
        obs.toPromise().catch(err => console.error('Error deleting product:', err))
      )).then(() => {
        this.products = this.products.filter(product => !selectedIds.includes(product.id));
        this.applyFilter(); // Re-apply the filter to update the view
      });
    }
  }
}
