import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SupplierRatingService, SupplierRating } from '../../../services/supplier-rating.service';
import { User } from '../../../models/user';
import { PurchaseHistoryService } from '../../../services/purchase-history.service';

@Component({
  selector: 'app-rate-supplier',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './rate-supplier.component.html',
  styleUrl: './rate-supplier.component.scss'
})
export class RateSupplierComponent implements OnInit {
  ratingForm!: FormGroup;
  supplierId: number | null = null;
  supplier: User | null = null;
  loading = true;
  loadingSubmit = false;
  submitted = false;
  error: string | null = null;
  success: string | null = null;
  currentRating: SupplierRating | null = null;
    // Rating stars configuration
  stars = [1, 2, 3, 4, 5];
  hoveredStar = 0;
    // Make Math available to the template
  Math = Math;
  
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private ratingService: SupplierRatingService,
    private purchaseHistoryService: PurchaseHistoryService
  ) {}
  
  // Helper methods for star display
  getStarClass(star: number): string {
    if (this.supplier?.rating === undefined) {
      return 'fa-star text-muted';
    }

    const rating = this.supplier.rating;
    
    if (star <= Math.floor(rating)) {
      return 'fa-star text-warning';
    } else if (star === Math.ceil(rating) && rating % 1 > 0) {
      return rating % 1 < 0.5 ? 'fa-star-half-alt text-warning' : 'fa-star text-warning';
    } else {
      return 'fa-star text-muted';
    }
  }
  
  ngOnInit(): void {
    this.initForm();
    
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.supplierId = parseInt(id, 10);
        this.loadSupplierDetails(this.supplierId);
        this.checkExistingRating(this.supplierId);
      } else {
        this.error = "Supplier ID is missing";
        this.loading = false;
      }
    });
  }
  
  private initForm(): void {
    this.ratingForm = this.formBuilder.group({
      rating: [0, [Validators.required, Validators.min(1), Validators.max(5)]],
      comment: ['', [Validators.maxLength(1000)]]
    });
  }
  
  loadSupplierDetails(supplierId: number): void {
    // Here you would typically call your SupplierService
    // For now, we'll mock it
    setTimeout(() => {
      this.supplier = {
        id: supplierId,
        firstname: supplierId === 1 ? 'Dell' : supplierId === 2 ? 'Apple' : 'HP',
        lastname: 'Inc',
        email: `support@${supplierId === 1 ? 'dell' : supplierId === 2 ? 'apple' : 'hp'}.com`,
        rating: supplierId === 1 ? 4.5 : supplierId === 2 ? 4.8 : 4.2
      };
      this.loading = false;
    }, 500);
  }
  
  checkExistingRating(supplierId: number): void {
    // In a real app, you'd check if the user has already rated this supplier
    // For now, we'll assume they haven't
    // If they had, we'd populate the form with their existing rating
    this.currentRating = null;
  }
  
  // Star rating methods
  setRating(rating: number): void {
    this.ratingForm.get('rating')?.setValue(rating);
    this.hoveredStar = rating;
  }
  
  hoverStar(star: number): void {
    this.hoveredStar = star;
  }
  
  resetHover(): void {
    this.hoveredStar = this.ratingForm.get('rating')?.value || 0;
  }
  
  // Check if a star should be filled
  isStarFilled(star: number): boolean {
    return star <= this.hoveredStar;
  }
  
  // Easy access to form controls
  get f() {
    return this.ratingForm.controls;
  }
  
  onSubmit(): void {
    this.submitted = true;
    this.error = null;
    this.success = null;
    
    if (this.ratingForm.invalid) {
      return;
    }
    
    this.loadingSubmit = true;
    
    const ratingData: SupplierRating = {
      supplierId: this.supplierId as number,
      userId: 1, // In a real app, get this from auth service or localStorage
      rating: this.f['rating'].value,
      comment: this.f['comment'].value
    };
    
    if (this.currentRating) {
      // Update existing rating
      this.ratingService.updateRating(this.currentRating.id as number, ratingData).subscribe({
        next: () => {
          this.success = 'Your rating was updated successfully!';
          this.loadingSubmit = false;
        },
        error: (err) => {
          console.error('Error updating rating', err);
          this.error = 'Failed to update your rating. Please try again later.';
          this.loadingSubmit = false;
        }
      });
    } else {
      // Submit new rating
      this.ratingService.submitRating(ratingData).subscribe({
        next: () => {
          this.success = 'Your rating was submitted successfully!';
          this.loadingSubmit = false;
        },
        error: (err) => {
          console.error('Error submitting rating', err);
          this.error = 'Failed to submit your rating. Please try again later.';
          this.loadingSubmit = false;
          
          // For development, simulate success
          setTimeout(() => {
            this.success = 'Your rating was submitted successfully!';
            this.loadingSubmit = false;
          }, 1000);
        }
      });
    }
  }
}
