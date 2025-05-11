import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { User } from '../../../models/user.model';
import { SupplierService } from '../../../services/supplier.service';
import { HttpClientModule } from '@angular/common/http';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-supplier-form',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './supplier-form.component.html',
  styleUrl: './supplier-form.component.scss'
})
export class SupplierFormComponent implements OnInit {
  supplierForm!: FormGroup;
  isEditMode = false;
  supplierId: string | null = null;
  loading = true;
  submitting = false;
  submitted = false;
  error: string | null = null;
  successMessage: string | null = null;
  
  // Service quality options
  serviceQualityOptions = [
    { value: 'EXCELLENT', label: 'Excellent' },
    { value: 'GOOD', label: 'Good' },
    { value: 'AVERAGE', label: 'Average' },
    { value: 'BELOW_AVERAGE', label: 'Below Average' },
    { value: 'POOR', label: 'Poor' }
  ];

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private supplierService: SupplierService
  ) {}

  ngOnInit(): void {
    this.initForm();
    
    // Check if in edit mode
    this.route.paramMap.subscribe(params => {
      this.supplierId = params.get('id');
      
      if (this.supplierId) {
        this.isEditMode = true;
        this.loadSupplierDetails(this.supplierId);
      } else {
        this.loading = false;
      }
    });
  }
  
  // Initialize form with validation
  private initForm(): void {
    this.supplierForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(4)]],
      email: ['', [Validators.required, Validators.email]],
      firstname: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
      address: [''],
      phoneNumber: ['', [Validators.pattern(/^[0-9\+\-\s]+$/)]],
      workAddress: [''],
      companyContactNumber: ['', [Validators.pattern(/^[0-9\+\-\s]+$/)]],
      companyEmail: ['', [Validators.email]],
      role: ['SUPPLIER'], // Fixed as SUPPLIER
      rating: [0, [Validators.min(0), Validators.max(5)]],
      serviceQuality: ['AVERAGE'],
      image: ['']
    });
    
    // Add password fields only for new suppliers
    if (!this.isEditMode) {
      this.supplierForm.addControl('password', this.formBuilder.control('', [
        Validators.required,
        Validators.minLength(8)
      ]));
      
      this.supplierForm.addControl('confirmPassword', this.formBuilder.control('', [
        Validators.required
      ]));
      
      this.supplierForm.setValidators(this.passwordMatchValidator());
    }
  }
  
  // Custom validator to ensure passwords match
  private passwordMatchValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const password = control.get('password');
      const confirmPassword = control.get('confirmPassword');
      
      if (password && confirmPassword && password.value !== confirmPassword.value) {
        confirmPassword.setErrors({ passwordMismatch: true });
        return { passwordMismatch: true };
      }
      
      return null;
    };
  }
  
  // Load supplier details for editing
  private loadSupplierDetails(id: string): void {
    this.loading = true;
    this.error = null;
    
    this.supplierService.getSupplier(id)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (supplier) => {
          this.supplierForm.patchValue({
            username: supplier.username,
            email: supplier.email,
            firstname: supplier.firstname,
            lastname: supplier.lastname,
            address: supplier.address,
            phoneNumber: supplier.phoneNumber,
            workAddress: supplier.workAddress,
            companyContactNumber: supplier.companyContactNumber,
            companyEmail: supplier.companyEmail,
            role: 'SUPPLIER', // Always SUPPLIER for this form
            rating: supplier.rating || 0,
            serviceQuality: supplier.serviceQuality || 'AVERAGE',
            image: supplier.image
          });
        },
        error: (error) => {
          console.error('Error loading supplier', error);
          this.error = 'Failed to load supplier details. Please try again.';
        }
      });
  }
  
  // Form control getter for easier access in template
  get f() {
    return this.supplierForm.controls;
  }
  
  // Submit form handler
  onSubmit(): void {
    this.submitted = true;
    this.error = null;
    this.successMessage = null;
    
    if (this.supplierForm.invalid) {
      // Mark all fields as touched to trigger validation visuals
      Object.keys(this.supplierForm.controls).forEach(key => {
        const control = this.supplierForm.get(key);
        if (control) {
          control.markAsTouched();
        }
      });
      return;
    }
    
    this.submitting = true;
    
    const supplierData: User = {
      username: this.f['username'].value,
      email: this.f['email'].value,
      firstname: this.f['firstname'].value,
      lastname: this.f['lastname'].value,
      address: this.f['address'].value,
      phoneNumber: this.f['phoneNumber'].value,
      workAddress: this.f['workAddress'].value,
      companyContactNumber: this.f['companyContactNumber'].value,
      companyEmail: this.f['companyEmail'].value,
      role: 'SUPPLIER',
      rating: this.f['rating'].value,
      serviceQuality: this.f['serviceQuality'].value,
      image: this.f['image'].value
    };
    
    // Add password only for new suppliers
    if (!this.isEditMode && this.f['password']) {
      supplierData.password = this.f['password'].value;
    }
    
    if (this.isEditMode && this.supplierId) {
      this.supplierService.updateSupplier(this.supplierId, supplierData)
        .pipe(finalize(() => this.submitting = false))
        .subscribe({
          next: (updatedSupplier) => {
            this.successMessage = 'Supplier updated successfully!';
            setTimeout(() => this.router.navigate(['/suppliers']), 1500);
          },
          error: (error) => {
            console.error('Error updating supplier', error);
            this.handleError(error);
          }
        });
    } else {
      this.supplierService.createSupplier(supplierData)
        .pipe(finalize(() => this.submitting = false))
        .subscribe({
          next: (createdSupplier) => {
            this.successMessage = 'New supplier created successfully!';
            setTimeout(() => this.router.navigate(['/suppliers']), 1500);
          },
          error: (error) => {
            console.error('Error creating supplier', error);
            this.handleError(error);
          }
        });
    }
  }
  
  // Handle API errors with specific messages
  private handleError(error: any): void {
    if (error.status === 400) {
      if (error.error?.message?.includes('username')) {
        this.error = 'Username already exists. Please choose a different username.';
      } else if (error.error?.message?.includes('email')) {
        this.error = 'Email already in use. Please use a different email address.';
      } else {
        this.error = 'Invalid data. Please check the form and try again.';
      }
    } else if (error.status === 403) {
      this.error = 'You do not have permission to perform this action.';
    } else {
      this.error = 'An error occurred. Please try again later.';
    }
  }
}
