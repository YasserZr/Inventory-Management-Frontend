import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { Product } from '../../../models/product.model';

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

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Simulate API loading delay
    setTimeout(() => {
      // In a real app, this would come from a service that calls an API
      this.product = {
        id: 1,
        name: 'Laptop Dell XPS 13',
        description: 'High-performance laptop with InfinityEdge display',
        price: 1299.99,
        stockQuantity: 15,
        status: 'ACTIVE',
        category: { categoryId: 1, name: 'Electronics' },
        supplier: { id: 1, firstname: 'Dell', lastname: 'Inc.', email: 'contact@dell.com', role: 'SUPPLIER' },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      this.loading = false;
    }, 1000);
  }

  deleteProduct(): void {
    if (confirm('Are you sure you want to delete this product?')) {
      // In a real app, this would call a service to delete the product via API
      alert('Product deleted successfully!');
      this.router.navigate(['/products']);
    }
  }
}
