import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Offer } from '../../../models/offer.model';
import { OfferService } from '../../../services/offer.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-offer-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './offer-detail.component.html',
  styleUrl: './offer-detail.component.scss'
})
export class OfferDetailComponent implements OnInit {
  offerId: string | null = null;
  offer: Offer | null = null;
  loading: boolean = false;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private offerService: OfferService
  ) {}

  ngOnInit(): void {
    this.offerId = this.route.snapshot.paramMap.get('id');
    if (this.offerId) {
      this.loadOffer(this.offerId);
    } else {
      this.error = 'No offer ID provided';
    }
  }
  
  loadOffer(id: string): void {
    this.loading = true;
    this.error = null;
    
    this.offerService.getOffer(id)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (data) => {
          this.offer = data;
        },
        error: (err) => {
          console.error('Failed to load offer:', err);
          this.error = 'Failed to load offer details. Please try again.';
          
          // Fallback to mock data for development
          this.offer = this.getMockOffer(parseInt(id));
        }
      });
  }
  
  // Mock data for development/testing purposes
  getMockOffer(id: number): Offer {
    return {
      offerId: id,
      title: id === 101 ? 'Bulk Laptop Discount' : 
             id === 102 ? 'Server Bundle Deal' : 
             id === 103 ? 'Keyboard Bulk Purchase' :
             id === 104 ? 'Printer Package' : 'Default Offer',
      description: 'Special pricing for bulk orders',
      status: 'ACTIVE',
      product: { id: 1, name: 'Dell XPS 13' },
      supplier: { id: 1, firstname: 'Dell', lastname: 'Computers' },
      minimumQuantity: 10,
      discountValue: 15,
      discountType: 'PERCENTAGE',
      startDate: '2025-04-01',
      endDate: '2025-07-31'
    };
  }
  
  getStatusClass(status: string | undefined): string {
    if (!status) return '';
    
    const classMap: {[key: string]: string} = {
      'ACTIVE': 'bg-success',
      'PENDING': 'bg-warning text-dark',
      'EXPIRED': 'bg-secondary',
      'CANCELLED': 'bg-danger'
    };
    
    return classMap[status] || '';
  }
  
  getFormattedDate(dateString: string | undefined): string {
    if (!dateString) return 'N/A';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric'
      });
    } catch (e) {
      return dateString;
    }
  }
  
  getDiscountDisplay(offer: Offer): string {
    if (!offer.discountValue || !offer.discountType) return 'N/A';
    
    return offer.discountType === 'PERCENTAGE' 
      ? `${offer.discountValue}%` 
      : `$${offer.discountValue.toFixed(2)}`;
  }
}
