import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Offer } from '../../../models/offer';
import { OfferService } from '../../../services/offer.service';
import { Product } from '../../../models/product';
import { User } from '../../../models/user';
import { HttpClientModule } from '@angular/common/http';

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
  
  // Mock data (in real app would come from API)
  products: Product[] = [
    { id: 1, name: 'Dell XPS 13', price: 1299 },
    { id: 2, name: 'MacBook Pro', price: 1799 },
    { id: 3, name: 'HP Spectre', price: 1199 }
  ];
  
  suppliers: User[] = [
    { id: 1, username: 'dell_supplier', firstname: 'Dell', lastname: 'Inc' },
    { id: 2, username: 'apple_supplier', firstname: 'Apple', lastname: 'Inc' },
    { id: 3, username: 'hp_supplier', firstname: 'HP', lastname: 'Inc' }
  ];
  
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
    private offerService: OfferService
  ) {}

  ngOnInit(): void {
    this.initForm();
    
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
