import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { User } from '../../../models/user.model';
import { SupplierService } from '../../../services/supplier.service';
import { HttpClientModule } from '@angular/common/http';

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
  submitted = false;
  
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
      username: ['', [Validators.required]],
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
  }
  
  // Load supplier details for editing
  private loadSupplierDetails(id: string): void {
    this.supplierService.getSupplier(id).subscribe({
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
          serviceQuality: supplier.serviceQuality,
          image: supplier.image
        });
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading supplier', error);
        this.loading = false;
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
    
    if (this.supplierForm.invalid) {
      return;
    }
    
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
    
    if (this.isEditMode && this.supplierId) {
      this.supplierService.updateSupplier(this.supplierId, supplierData).subscribe({
        next: () => this.router.navigate(['/suppliers']),
        error: (error) => console.error('Error updating supplier', error)
      });
    } else {
      this.supplierService.createSupplier(supplierData).subscribe({
        next: () => this.router.navigate(['/suppliers']),
        error: (error) => console.error('Error creating supplier', error)
      });
    }
  }
}
