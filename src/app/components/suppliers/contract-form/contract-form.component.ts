import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { User } from '../../../models/user.model';
import { SupplierContract } from '../../../models/supplier-contract.model';
import { SupplierService } from '../../../services/supplier.service';
import { SupplierContractService } from '../../../services/supplier-contract.service';
import { AuthService } from '../../../services/auth.service';
import { finalize } from 'rxjs/operators';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-contract-form',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, MatSnackBarModule],
  template: `
    <div class="contract-form fade-in">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 class="mb-1">{{ isEditMode ? 'Edit Contract' : 'Create New Contract' }}</h1>
          <p class="text-muted">{{ isEditMode ? 'Update contract details' : 'Create a new contract with a supplier' }}</p>
        </div>
        <button (click)="goBack()" class="btn btn-outline-secondary">
          <i class="fas fa-arrow-left me-2"></i> Back to Suppliers
        </button>
      </div>

      <div class="card border-0 shadow-sm">
        <div class="card-body p-4">
          <!-- Loading Indicator -->
          <div *ngIf="loading" class="text-center py-5">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
            <p class="mt-2 text-muted">Loading contract details...</p>
          </div>

          <!-- Error Alert -->
          <div *ngIf="error" class="alert alert-danger mb-4">
            <i class="fas fa-exclamation-circle me-2"></i> {{ error }}
          </div>

          <!-- Success Message -->
          <div *ngIf="successMessage" class="alert alert-success mb-4">
            <i class="fas fa-check-circle me-2"></i> {{ successMessage }}
          </div>

          <!-- Contract Form -->
          <form *ngIf="!loading" [formGroup]="contractForm" (ngSubmit)="onSubmit()">
            <!-- Supplier Selection -->
            <div class="mb-4">
              <label for="supplier" class="form-label">Select Supplier</label>
              <select 
                id="supplier" 
                formControlName="supplierId"
                class="form-select" 
                [ngClass]="{'is-invalid': submitted && f['supplierId'].errors}"
              >
                <option value="">-- Select a Supplier --</option>
                <option *ngFor="let supplier of suppliers" [value]="supplier.id">
                  {{ supplier.firstname }} {{ supplier.lastname }} ({{ supplier.companyEmail || supplier.email }})
                </option>
              </select>
              <div *ngIf="submitted && f['supplierId'].errors" class="invalid-feedback">
                <div *ngIf="f['supplierId'].errors['required']">Please select a supplier</div>
              </div>
            </div>

            <!-- Contract Number -->
            <div class="mb-4">
              <label for="contractNumber" class="form-label">Contract Number</label>
              <input 
                type="text" 
                id="contractNumber" 
                formControlName="contractNumber" 
                class="form-control"
                [ngClass]="{'is-invalid': submitted && f['contractNumber'].errors}"
                placeholder="e.g., CONT-2025-001"
              >
              <div *ngIf="submitted && f['contractNumber'].errors" class="invalid-feedback">
                <div *ngIf="f['contractNumber'].errors['required']">Contract number is required</div>
              </div>
            </div>

            <!-- Contract Dates -->
            <div class="row">
              <div class="col-md-6 mb-4">
                <label for="startDate" class="form-label">Start Date</label>
                <input 
                  type="date" 
                  id="startDate" 
                  formControlName="startDate" 
                  class="form-control"
                  [ngClass]="{'is-invalid': submitted && f['startDate'].errors}"
                >
                <div *ngIf="submitted && f['startDate'].errors" class="invalid-feedback">
                  <div *ngIf="f['startDate'].errors['required']">Start date is required</div>
                </div>
              </div>
              <div class="col-md-6 mb-4">
                <label for="endDate" class="form-label">End Date</label>
                <input 
                  type="date" 
                  id="endDate" 
                  formControlName="endDate" 
                  class="form-control"
                  [ngClass]="{'is-invalid': submitted && f['endDate'].errors}"
                >
                <div *ngIf="submitted && f['endDate'].errors" class="invalid-feedback">
                  <div *ngIf="f['endDate'].errors['required']">End date is required</div>
                </div>
              </div>
            </div>

            <!-- Contract Terms -->
            <div class="mb-4">
              <label for="terms" class="form-label">Contract Terms</label>
              <textarea 
                id="terms" 
                formControlName="terms" 
                class="form-control" 
                rows="5"
                [ngClass]="{'is-invalid': submitted && f['terms'].errors}"
                placeholder="Enter the terms and conditions of the contract..."
              ></textarea>
              <div *ngIf="submitted && f['terms'].errors" class="invalid-feedback">
                <div *ngIf="f['terms'].errors['required']">Contract terms are required</div>
              </div>
            </div>

            <!-- Status (for edit mode) -->
            <div class="mb-4" *ngIf="isEditMode">
              <label for="status" class="form-label">Status</label>
              <select 
                id="status" 
                formControlName="status"
                class="form-select" 
                [ngClass]="{'is-invalid': submitted && f['status'].errors}"
              >
                <option value="ACTIVE">Active</option>
                <option value="EXPIRED">Expired</option>
                <option value="TERMINATED">Terminated</option>
                <option value="DRAFT">Draft</option>
              </select>
            </div>

            <!-- Submit Button -->
            <div class="d-flex justify-content-end">
              <button 
                type="submit" 
                class="btn btn-primary"
                [disabled]="submitting"
              >
                <span *ngIf="submitting" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                {{ isEditMode ? 'Update Contract' : 'Create Contract' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .contract-form {
      max-width: 800px;
      margin: 0 auto;
      padding: 2rem 1rem;
    }
    
    .fade-in {
      animation: fadeIn 0.5s;
    }
    
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
  `]
})
export class ContractFormComponent implements OnInit {
  contractForm!: FormGroup;
  isEditMode = false;
  contractId: string | null = null;
  loading = false;
  submitting = false;
  submitted = false;
  error: string | null = null;
  successMessage: string | null = null;
  suppliers: User[] = [];
  currentUser: User | null = null;
  
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private supplierService: SupplierService,
    private contractService: SupplierContractService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}
  ngOnInit(): void {
    // Check if user is authenticated
    if (!this.authService.isAuthenticated()) {
      this.error = "You must be logged in to create a contract";
      this.router.navigate(['/login']);
      return;
    }
    
    this.currentUser = this.authService.getCurrentUser();    // Force-reload current user just to be sure
    this.authService.refreshUserData().subscribe({
      next: (user: User) => {
        this.currentUser = user;
        console.log('Current user:', this.currentUser);
        this.initForm();
        this.loadSuppliers();
      },
      error: (err: any) => {
        console.error('Failed to refresh user data:', err);
        this.initForm();
        this.loadSuppliers();
      }
    });
    
    // Check if in edit mode
    this.route.paramMap.subscribe(params => {
      this.contractId = params.get('id');
      
      if (this.contractId) {
        this.isEditMode = true;
        this.loadContract();
      } else {
        this.loading = false;
      }
    });
  }
  
  // Getter for form controls
  get f() { return this.contractForm.controls; }
  
  initForm(): void {
    this.contractForm = this.formBuilder.group({
      supplierId: ['', Validators.required],
      contractNumber: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      terms: ['', Validators.required],
      status: ['ACTIVE']
    });
  }
    loadSuppliers(): void {
    this.loading = true;
    
    // Get only users with SUPPLIER role
    this.supplierService.getSuppliers()
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (data) => {
          // Filter to ensure we only have suppliers
          this.suppliers = data.filter(user => user.role === 'SUPPLIER');
          console.log('Loaded suppliers:', this.suppliers);
        },
        error: (err) => {
          console.error('Failed to load suppliers:', err);
          this.error = 'Failed to load suppliers. Please try again.';
        }
      });
  }
  
  loadContract(): void {
    if (!this.contractId) return;
    
    this.loading = true;
    
    this.contractService.getContractById(this.contractId)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (data) => {
          // Format dates for form
          const startDate = data.startDate ? new Date(data.startDate).toISOString().substring(0, 10) : '';
          const endDate = data.endDate ? new Date(data.endDate).toISOString().substring(0, 10) : '';
          
          this.contractForm.patchValue({
            supplierId: data.supplier?.id,
            contractNumber: data.contractNumber,
            startDate: startDate,
            endDate: endDate,
            terms: data.terms,
            status: data.status || 'ACTIVE'
          });
        },
        error: (err) => {
          console.error('Failed to load contract:', err);
          this.error = 'Failed to load contract. Please try again.';
        }
      });
  }
  
  onSubmit(): void {
    this.submitted = true;
    
    if (this.contractForm.invalid) {
      return;
    }
    
    this.submitting = true;
    this.error = null;
    this.successMessage = null;
    
    // Prepare the contract data
    const formData = this.contractForm.value;
    
    const contract: SupplierContract = {
      contractNumber: formData.contractNumber,
      status: formData.status || 'ACTIVE',
      startDate: formData.startDate,
      endDate: formData.endDate,
      terms: formData.terms,
      user: { id: this.currentUser?.id },
      supplier: { id: formData.supplierId }
    };
    
    if (this.isEditMode && this.contractId) {
      // Update existing contract
      this.contractService.updateContract(this.contractId, contract)
        .pipe(finalize(() => this.submitting = false))
        .subscribe({
          next: () => {
            this.successMessage = 'Contract updated successfully!';
            this.snackBar.open('Contract updated successfully!', 'Close', { duration: 3000 });
            setTimeout(() => this.router.navigate(['/suppliers']), 1500);
          },
          error: (err) => {
            console.error('Error updating contract:', err);
            this.error = 'Failed to update contract. Please try again.';
          }
        });
    } else {
      // Create new contract
      this.contractService.createContract(contract)
        .pipe(finalize(() => this.submitting = false))
        .subscribe({
          next: () => {
            this.successMessage = 'Contract created successfully!';
            this.snackBar.open('Contract created successfully!', 'Close', { duration: 3000 });
            setTimeout(() => this.router.navigate(['/suppliers']), 1500);
          },
          error: (err) => {
            console.error('Error creating contract:', err);
            this.error = 'Failed to create contract. Please try again.';
          }
        });
    }
  }
  
  goBack(): void {
    this.router.navigate(['/suppliers']);
  }
}
