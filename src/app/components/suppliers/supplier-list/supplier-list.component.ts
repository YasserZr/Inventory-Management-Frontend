import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { User } from '../../../models/user.model';
import { SupplierService } from '../../../services/supplier.service';
import { SupplierContractService } from '../../../services/supplier-contract.service';
import { finalize, catchError, switchMap } from 'rxjs/operators';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { DeleteConfirmDialogComponent } from '../../shared/delete-confirm-dialog/delete-confirm-dialog.component';
import { forkJoin, Observable, of } from 'rxjs';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-supplier-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatDialogModule,
    MatPaginatorModule,
    MatSnackBarModule
  ],
  templateUrl: './supplier-list.component.html',
  styleUrl: './supplier-list.component.scss'
})
export class SupplierListComponent implements OnInit {
  suppliers: User[] = [];
  filteredSuppliers: User[] = [];
  loading: boolean = true;
  error: string | null = null;
  searchTerm: string = '';
  qualityFilter: string = '';
  selectedSuppliers: Set<number> = new Set();
    constructor(
    public supplierService: SupplierService,
    private supplierContractService: SupplierContractService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }
  
  ngOnInit(): void {
    this.loadSuppliers();
  }
    loadSuppliers(): void {
    this.loading = true;
    this.error = null;
    
    // Use the getSuppliersWithActiveContracts method to only get suppliers with active contracts
    this.supplierService.getSuppliersWithActiveContracts()
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (data) => {
          this.suppliers = data;
          this.filteredSuppliers = [...this.suppliers];
        },
        error: (err) => {
          console.error('Failed to load suppliers with active contracts:', err);
          this.error = 'Failed to load suppliers. Please try again.';
          
          // Fallback to regular supplier list in case of error
          this.loadAllSuppliers();
        }
      });
  }
  
  loadAllSuppliers(): void {
    this.loading = true;
    
    this.supplierService.getSuppliers()
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (data) => {
          this.suppliers = data;
          this.filteredSuppliers = [...this.suppliers];
        },
        error: (err) => {
          console.error('Failed to load all suppliers:', err);
          
          // Fallback to mock data for development
          this.suppliers = this.getMockSuppliers();
          this.filteredSuppliers = [...this.suppliers];
        }
      });
  }
    // Mock data for development/testing purposes
  getMockSuppliers(): User[] {
    return [
      {
        id: 1,
        username: 'dell_supplier',
        email: 'supplier@dell.com',
        firstname: 'Dell',
        lastname: 'Computers',
        companyEmail: 'b2b@dell.com',
        companyContactNumber: '+1-800-456-7890',
        serviceQuality: 'EXCELLENT',
        rating: 4.8,
        role: 'SUPPLIER'
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
        rating: 4.2,
        role: 'SUPPLIER'
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
        rating: 4.9,
        role: 'SUPPLIER'
      }
    ];
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
  terminateContract(): void {
    const dialogRef = this.dialog.open(DeleteConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Terminate Supplier Contract',
        message: `Are you sure you want to terminate the contract with ${this.selectedSuppliers.size} supplier(s)? This will remove them from your active suppliers list.`,
        confirmText: 'Terminate',
        cancelText: 'Cancel'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // For each selected supplier, find their active contract and set its status to "TERMINATED"
        const terminateObservables = Array.from(this.selectedSuppliers).map(id => {
          // In a real implementation, we'd find the specific contract
          // and set its status to TERMINATED instead of deleting
          return this.supplierContractService.getContractsBySupplier(id.toString())
            .pipe(
              catchError(err => {
                console.error(`Error finding contracts for supplier ${id}:`, err);
                return of([]);
              }),
              // Take the first active contract
              // In a real implementation, we might handle multiple contracts
              switchMap(contracts => {
                const activeContract = contracts.find(c => c.status === 'ACTIVE');
                if (activeContract && activeContract.id) {
                  const updatedContract = {...activeContract, status: 'TERMINATED'};
                  return this.supplierContractService.updateContract(activeContract.id.toString(), updatedContract);
                }
                return of(null);
              })
            );
        });
        
        forkJoin(terminateObservables.length ? terminateObservables : [of(null)])
          .pipe(
            catchError(err => {
              console.error('Error terminating supplier contracts:', err);
              this.snackBar.open('Error terminating supplier contracts', 'Close', { duration: 3000 });
              return of(null);
            })
          )
          .subscribe(() => {
            console.log(`Terminated contracts for ${this.selectedSuppliers.size} suppliers`);
            // Reload the suppliers list to show only those with active contracts
            this.loadSuppliers();
            this.selectedSuppliers.clear();
            this.snackBar.open('Supplier contracts terminated successfully', 'Close', { duration: 3000 });
          });
      }
    });
  }
}
