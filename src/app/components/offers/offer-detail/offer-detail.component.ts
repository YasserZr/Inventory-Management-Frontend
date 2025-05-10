import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Offer } from '../../../models/offer';

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

  constructor(
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    console.log('OfferDetailComponent initialized');
    // Show an alert for debugging
    alert('OfferDetailComponent loaded!');
    
    this.offerId = this.route.snapshot.paramMap.get('id');
    if (this.offerId) {
      // Mock data for debugging
      this.offer = {
        offerId: parseInt(this.offerId),
        title: 'Bulk Laptop Discount',
        status: 'ACTIVE',
        product: { id: 1, name: 'Dell XPS 13' }
      };
    }
  }
  // Helper methods removed for debugging
}
