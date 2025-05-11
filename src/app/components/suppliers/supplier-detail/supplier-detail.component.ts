import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { User } from '../../../models/user.model';
import { SupplierService } from '../../../services/supplier.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-supplier-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './supplier-detail.component.html',
  styleUrl: './supplier-detail.component.scss'
})
export class SupplierDetailComponent implements OnInit {
  supplierId: string | null = null;
  supplier: User | null = null;
  loading: boolean = false;
  error: string | null = null;
  
  constructor(
    private route: ActivatedRoute,
    private supplierService: SupplierService
  ) {}

  ngOnInit(): void {
    this.supplierId = this.route.snapshot.paramMap.get('id');
    if (this.supplierId) {
      this.loadSupplier(this.supplierId);
    } else {
      this.error = 'No supplier ID provided';
    }
  }

  loadSupplier(id: string): void {
    this.loading = true;
    this.error = null;
    
    this.supplierService.getSupplier(id)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (data) => {
          this.supplier = data;
        },
        error: (err) => {
          console.error('Failed to load supplier:', err);
          this.error = 'Failed to load supplier details. Please try again.';
          
          // Fallback to mock data for development
          this.supplier = this.getMockSupplier(parseInt(id));
        }
      });
  }
    // Mock data for development/testing purposes
  getMockSupplier(id: number): User {
    return {
      id: id,
      username: 'supplier_' + id,
      email: `supplier${id}@example.com`,
      firstname: id === 1 ? 'Dell' : id === 2 ? 'HP' : 'Logitech',
      lastname: id === 1 ? 'Computers' : id === 2 ? 'Inc' : 'International',
      companyEmail: `contact${id}@example.com`,
      companyContactNumber: `+1-800-555-${id.toString().padStart(4, '0')}`,
      serviceQuality: id === 1 ? 'EXCELLENT' : id === 2 ? 'GOOD' : 'AVERAGE',
      rating: id === 1 ? 4.8 : id === 2 ? 4.2 : 3.9,
      role: 'SUPPLIER'
    };
  }
  
  getServiceQualityClass(quality: string | undefined): string {
    if (!quality) return '';
    
    const classMap: {[key: string]: string} = {
      'EXCELLENT': 'bg-success',
      'GOOD': 'bg-primary',
      'AVERAGE': 'bg-info',
      'BELOW_AVERAGE': 'bg-warning text-dark',
      'POOR': 'bg-danger'
    };
    
    return classMap[quality] || '';
  }
  
  getRatingStars(rating: number | undefined): string[] {
    const stars: string[] = [];
    if (rating === undefined) return stars;
    
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    // Add full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push('full');
    }
    
    // Add half star if needed
    if (hasHalfStar) {
      stars.push('half');
    }
    
    // Add empty stars
    while (stars.length < 5) {
      stars.push('empty');
    }
    
    return stars;
  }
}
