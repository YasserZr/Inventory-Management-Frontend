import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Offer } from '../../../models/offer.model';
import { OfferService } from '../../../services/offer.service';
import { Product } from '../../../models/product.model';
import { User } from '../../../models/user.model';
import { HttpClientModule } from '@angular/common/http';
import { ProductService } from '../../../services/product.service';
import { SupplierService } from '../../../services/supplier.service';
import { finalize, forkJoin } from 'rxjs';

@Component({
  selector: 'app-offer-form',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './offer-form.component.html',
  styleUrl: './offer-form.component.scss'
})
export class OfferFormComponent implements OnInit {
  offerForm!: FormGroup;
  isEditMode = false;
  offerId: string | null = null;
  loading = true;
  submitted = false;
  
  products: Product[] = [];
  suppliers: User[] = [];
  
  discountTypes = [
    { value: 'PERCENTAGE', label: 'Percentage' },
    { value: 'FIXED', label: 'Fixed Amount' }
  ];
  
  statusOptions = [
    { value: 'ACTIVE', label: 'Active' },
    { value: 'PENDING', label: 'Pending' },
    { value: 'EXPIRED', label: 'Expired' },
    { value: 'CANCELLED', label: 'Cancelled' }
  ];

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private offerService: OfferService,
    private productService: ProductService,
    private supplierService: SupplierService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadInitialData();
  }
  
  loadInitialData(): void {
    this.loading = true;
    
    // Load products and suppliers simultaneously
    forkJoin({
      products: this.productService.getAllProducts(),
      suppliers: this.supplierService.getSuppliers()
    })
    .pipe(finalize(() => {
      // Check if in edit mode
      this.route.paramMap.subscribe(params => {
        this.offerId = params.get('id');
        
        if (this.offerId) {
          this.isEditMode = true;
          this.loadOfferDetails(this.offerId);
        } else {
          this.loading = false;
        }
      });
    }))
    .subscribe({
      next: (result) => {
        this.products = result.products;
        this.suppliers = result.suppliers;
      },
      error: (error) => {
        console.error('Error loading data:', error);
        // Fallback to mock data
        this.products = this.getMockProducts();
        this.suppliers = this.getMockSuppliers();
      }
    });
  }
  
  // Mock data for development/testing purposes
  getMockProducts(): Product[] {
    return [
      { id: 1, name: 'Dell XPS 13', price: 1299 },
      { id: 2, name: 'MacBook Pro', price: 1799 },
      { id: 3, name: 'HP Spectre', price: 1199 }
    ];
  }
  
  getMockSuppliers(): User[] {
    return [
      { id: 1, username: 'dell_supplier', firstname: 'Dell', lastname: 'Inc', email: 'supplier@dell.com', role: 'SUPPLIER' },
      { id: 2, username: 'apple_supplier', firstname: 'Apple', lastname: 'Inc', email: 'supplier@apple.com', role: 'SUPPLIER' },
      { id: 3, username: 'hp_supplier', firstname: 'HP', lastname: 'Inc', email: 'supplier@hp.com', role: 'SUPPLIER' }
    ];
  }
  
  // Init form with validation
  private initForm(): void {
    this.offerForm = this.formBuilder.group({
      title: ['', [Validators.required]],
      description: [''],
      productId: ['', [Validators.required]],
      supplierId: ['', [Validators.required]],
      minimumQuantity: [1, [Validators.required, Validators.min(1)]],
      discountValue: [0, [Validators.required, Validators.min(0)]],
      discountType: ['PERCENTAGE', [Validators.required]],
      status: ['ACTIVE', [Validators.required]],
      startDate: ['', [Validators.required]],
      endDate: ['', [Validators.required]]
    });
  }
  
  // Load offer details for editing
  private loadOfferDetails(id: string): void {
    this.offerService.getOffer(id).subscribe({
      next: (offer) => {
        this.offerForm.patchValue({
          title: offer.title,
          description: offer.description,
          productId: offer.product?.id,
          supplierId: offer.supplier?.id,
          minimumQuantity: offer.minimumQuantity,
          discountValue: offer.discountValue,
          discountType: offer.discountType,
          status: offer.status,
          startDate: offer.startDate ? offer.startDate.split('T')[0] : '',
          endDate: offer.endDate ? offer.endDate.split('T')[0] : ''
        });
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading offer', error);
        this.loading = false;
      }
    });
  }
  
  // Form control getter for easier access in template
  get f() {
    return this.offerForm.controls;
  }
  
  // Submit form handler
  onSubmit(): void {
    this.submitted = true;
    
    if (this.offerForm.invalid) {
      return;
    }
    
    const offerData: Offer = {
      title: this.f['title'].value,
      description: this.f['description'].value,
      product: { id: this.f['productId'].value },
      supplier: { id: this.f['supplierId'].value },
      minimumQuantity: this.f['minimumQuantity'].value,
      discountValue: this.f['discountValue'].value,
      discountType: this.f['discountType'].value,
      status: this.f['status'].value,
      startDate: this.f['startDate'].value,
      endDate: this.f['endDate'].value
    };
    
    if (this.isEditMode && this.offerId) {
      this.offerService.updateOffer(this.offerId, offerData).subscribe({
        next: () => this.router.navigate(['/offers']),
        error: (error) => console.error('Error updating offer', error)
      });
    } else {
      this.offerService.createOffer(offerData).subscribe({
        next: () => this.router.navigate(['/offers']),
        error: (error) => console.error('Error creating offer', error)
      });
    }
  }
}
