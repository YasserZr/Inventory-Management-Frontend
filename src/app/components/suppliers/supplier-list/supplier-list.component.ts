import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { User } from '../../../models/user';
import { SupplierService } from '../../../services/supplier.service';

@Component({
  selector: 'app-supplier-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './supplier-list.component.html',
  styleUrl: './supplier-list.component.scss'
})
export class SupplierListComponent implements OnInit {
  suppliers: User[] = [];
  filteredSuppliers: User[] = [];
  loading: boolean = true;
  searchTerm: string = '';
  qualityFilter: string = '';
  selectedSuppliers: Set<number> = new Set();
  
  constructor(public supplierService: SupplierService) { }
  
  ngOnInit(): void {
    console.log('SupplierListComponent initialized');
    this.loadSuppliers();
  }
    loadSuppliers(): void {
    this.loading = true;
    // Hard-coded test data
    setTimeout(() => {
      this.suppliers = [
        {
          id: 1,
          username: 'dell_supplier',
          email: 'supplier@dell.com',
          firstname: 'Dell',
          lastname: 'Computers',
          companyEmail: 'b2b@dell.com',
          companyContactNumber: '+1-800-456-7890',
          serviceQuality: 'EXCELLENT',
          rating: 4.8
        },
        {
          id: 2,
          username: 'hp_supplier',
          email: 'supplier@hp.com',
          firstname: 'HP',
          lastname: 'Inc',
          companyEmail: 'procurement@hp.com',
          companyContactNumber: '+1-800-123-4567',
          serviceQuality: 'GOOD',
          rating: 4.2
        },
        {
          id: 3,
          username: 'logitech_supplier',
          email: 'supplier@logitech.com',
          firstname: 'Logitech',
          lastname: 'International',
          companyEmail: 'orders@logitech.com',
          companyContactNumber: '+1-877-555-8833',
          serviceQuality: 'EXCELLENT',
          rating: 4.9      }
      ];
      this.filteredSuppliers = [...this.suppliers];
      this.loading = false;
    }, 800);
  }
  
  applyFilters(): void {
    this.filteredSuppliers = this.suppliers.filter(supplier => {
      // Apply text search
      const nameMatch = `${supplier.firstname} ${supplier.lastname}`.toLowerCase().includes(this.searchTerm.toLowerCase());
      const emailMatch = supplier.email?.toLowerCase().includes(this.searchTerm.toLowerCase());
      const companyEmailMatch = supplier.companyEmail?.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const textMatch = !this.searchTerm || nameMatch || emailMatch || companyEmailMatch;
      
      // Apply quality filter
      const qualityMatch = !this.qualityFilter || supplier.serviceQuality === this.qualityFilter;
      
      return textMatch && qualityMatch;
    });
  }
  
  resetFilters(): void {
    this.searchTerm = '';
    this.qualityFilter = '';
    this.filteredSuppliers = [...this.suppliers];
  }
  
  toggleSelectSupplier(id: number | undefined): void {
    if (id === undefined) return;
    
    if (this.selectedSuppliers.has(id)) {
      this.selectedSuppliers.delete(id);
    } else {
      this.selectedSuppliers.add(id);
    }
  }
  
  isSupplierSelected(id: number | undefined): boolean {
    return id !== undefined && this.selectedSuppliers.has(id);
  }
    hasSelectedSuppliers(): boolean {
    return this.selectedSuppliers.size > 0;
  }
  
  toggleSelectAll(): void {
    const allSelected = this.selectedSuppliers.size === this.filteredSuppliers.length;
    
    if (allSelected) {
      // If all are selected, unselect all
      this.selectedSuppliers.clear();
    } else {
      // Otherwise select all
      this.filteredSuppliers.forEach(supplier => {
        if (supplier.id !== undefined) {
          this.selectedSuppliers.add(supplier.id);
        }
      });
    }
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
  
  deleteSelected(): void {
    // In a real application, this would call the service to delete selected suppliers
    console.log(`Would delete ${this.selectedSuppliers.size} suppliers in production.`);
    
    // For the mock application, just filter them out
    this.suppliers = this.suppliers.filter(s => s.id === undefined || !this.selectedSuppliers.has(s.id));
    this.filteredSuppliers = this.filteredSuppliers.filter(s => s.id === undefined || !this.selectedSuppliers.has(s.id));
    this.selectedSuppliers.clear();
  }
}
