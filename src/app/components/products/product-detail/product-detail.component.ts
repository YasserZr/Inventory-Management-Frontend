import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { Product } from '../../../models/product.model';
import { ProductService } from '../../../services/product.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss'
})
export class ProductDetailComponent implements OnInit {
  product: Product | null = null;
  loading: boolean = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService
  ) { }

  ngOnInit(): void {
    this.loadProduct();
  }

  loadProduct(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.error = 'Product ID is missing';
      this.loading = false;
      return;
    }

    this.productService.getProduct(id)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (data) => {
          this.product = data;
        },
        error: (error) => {
          console.error('Error loading product:', error);
          this.error = 'Failed to load product details. Please try again.';
          
          // In development mode, we might want to show mock data
          if (false) { // Set to true for dev/testing
            this.product = this.getMockProduct();
          }
        }
      });
  }

  // Mock data for development/testing purposes
  getMockProduct(): Product {
    return {
      id: 1,
      name: 'Laptop Dell XPS 13',
      description: 'High-performance laptop with InfinityEdge display',
      price: 1299.99,
      stockQuantity: 15,
      status: 'ACTIVE',
      category: { categoryId: 1, name: 'Electronics' },
      supplier: { id: 1, username: 'dell_supplier', firstname: 'Dell', lastname: 'Inc.', email: 'contact@dell.com', role: 'SUPPLIER' },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  getStatusBadgeClass(status: string): string {
    return this.productService.getStatusBadgeClass(status);
  }

  getStatusLabel(status: string): string {
    return this.productService.getStatusLabel(status);
  }

  deleteProduct(): void {
    if (!this.product?.id) return;
    
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(this.product.id.toString())
        .subscribe({
          next: () => {
            this.router.navigate(['/products']);
          },
          error: (error) => {
            console.error('Error deleting product:', error);
            alert('Failed to delete product. Please try again.');
          }
        });
    }
  }
}
