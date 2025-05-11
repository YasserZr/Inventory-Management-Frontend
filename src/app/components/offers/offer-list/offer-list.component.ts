import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Offer } from '../../../models/offer.model';
import { OfferService } from '../../../services/offer.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-offer-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './offer-list.component.html',
  styleUrl: './offer-list.component.scss'
})
export class OfferListComponent implements OnInit {
  offers: Offer[] = [];
  filteredOffers: Offer[] = [];
  loading: boolean = true;
  error: string | null = null;
  searchTerm: string = '';
  statusFilter: string = '';
  selectedOffers: Set<number> = new Set();
  
  constructor(public offerService: OfferService) { }
  
  ngOnInit(): void {
    this.loadOffers();
  }
  
  loadOffers(): void {
    this.loading = true;
    this.error = null;
    
    this.offerService.getOffers()
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (data) => {
          this.offers = data;
          this.filteredOffers = [...this.offers];
        },
        error: (err) => {
          console.error('Failed to load offers:', err);
          this.error = 'Failed to load offers. Please try again.';
          
          // Fallback to mock data for development
          this.offers = this.getMockOffers();
          this.filteredOffers = [...this.offers];
        }
      });
  }
  
  // Mock data for development/testing purposes
  getMockOffers(): Offer[] {
    return [
      {
        offerId: 101,
        title: 'Bulk Laptop Discount',
        description: 'Special pricing for orders of 10+ laptops',
        status: 'ACTIVE',
        product: { id: 1, name: 'Dell XPS 13' },
        supplier: { id: 1, firstname: 'Dell', lastname: 'Computers' },
        minimumQuantity: 10,
        discountValue: 15,
        discountType: 'PERCENTAGE',
        startDate: '2025-04-01',
        endDate: '2025-07-31'
      },
      {
        offerId: 102,
        title: 'Server Bundle Deal',
        description: 'Servers with complimentary installation service',
        status: 'ACTIVE',
        product: { id: 5, name: 'Dell PowerEdge Server' },
        supplier: { id: 1, firstname: 'Dell', lastname: 'Computers' },
        minimumQuantity: 2,
        discountValue: 500,
        discountType: 'FIXED',
        startDate: '2025-03-15',
        endDate: '2025-06-15'
      },
      {
        offerId: 103,
        title: 'Keyboard Bulk Purchase',
        description: 'Special pricing on large orders of keyboards',
        status: 'ACTIVE',
        product: { id: 7, name: 'Logitech MX Keys' },
        supplier: { id: 3, firstname: 'Logitech', lastname: 'International' },
        minimumQuantity: 20,
        discountValue: 10,
        discountType: 'PERCENTAGE',
        startDate: '2025-04-15',
        endDate: '2025-08-30'
      },
      {
        offerId: 104,
        title: 'Printer Package',
        description: 'Printers with complimentary ink cartridges',
        status: 'PENDING',
        product: { id: 9, name: 'HP LaserJet Pro' },
        supplier: { id: 2, firstname: 'HP', lastname: 'Inc' },
        minimumQuantity: 5,
        discountValue: 75,
        discountType: 'FIXED',
        startDate: '2025-06-01',
        endDate: '2025-09-30'
      },
      {
        offerId: 105,
        title: 'Last Year\'s Monitor Models',
        description: 'Clearance sale on last year\'s monitors',
        status: 'EXPIRED',
        product: { id: 12, name: 'HP 27" Monitor' },
        supplier: { id: 2, firstname: 'HP', lastname: 'Inc' },
        minimumQuantity: 3,
        discountValue: 25,
        discountType: 'PERCENTAGE',
        startDate: '2024-11-01',
        endDate: '2025-01-31'
      }
    ];
  }
  
  applyFilters(): void {
    this.filteredOffers = this.offers.filter(offer => {
      // Apply text search
      const titleMatch = offer.title?.toLowerCase().includes(this.searchTerm.toLowerCase());
      const productMatch = offer.product?.name?.toLowerCase().includes(this.searchTerm.toLowerCase());
      const descriptionMatch = offer.description?.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const textMatch = !this.searchTerm || titleMatch || productMatch || descriptionMatch;
      
      // Apply status filter
      const statusMatch = !this.statusFilter || offer.status === this.statusFilter;
      
      return textMatch && statusMatch;
    });
  }
  
  resetFilters(): void {
    this.searchTerm = '';
    this.statusFilter = '';
    this.filteredOffers = [...this.offers];
  }
  
  toggleSelectOffer(id: number | undefined): void {
    if (id === undefined) return;
    
    if (this.selectedOffers.has(id)) {
      this.selectedOffers.delete(id);
    } else {
      this.selectedOffers.add(id);
    }
  }
  
  isOfferSelected(id: number | undefined): boolean {
    return id !== undefined && this.selectedOffers.has(id);
  }
  
  hasSelectedOffers(): boolean {
    return this.selectedOffers.size > 0;
  }
  
  toggleSelectAll(): void {
    const allSelected = this.selectedOffers.size === this.filteredOffers.length;
    
    if (allSelected) {
      // If all are selected, unselect all
      this.selectedOffers.clear();
    } else {
      // Otherwise select all
      this.filteredOffers.forEach(offer => {
        if (offer.offerId !== undefined) {
          this.selectedOffers.add(offer.offerId);
        }
      });
    }
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
  
  deleteSelected(): void {
    if (confirm(`Are you sure you want to delete ${this.selectedOffers.size} offer(s)?`)) {
      // For a real implementation, you would use forkJoin to wait for all deletes to complete
      Array.from(this.selectedOffers).forEach(id => {
        this.offerService.deleteOffer(id.toString()).subscribe({
          next: () => {
            console.log(`Successfully deleted offer ${id}`);
          },
          error: (error) => {
            console.error(`Error deleting offer ${id}:`, error);
          }
        });
      });
      
      // Update the local lists
      this.offers = this.offers.filter(o => o.offerId === undefined || !this.selectedOffers.has(o.offerId));
      this.filteredOffers = this.filteredOffers.filter(o => o.offerId === undefined || !this.selectedOffers.has(o.offerId));
      this.selectedOffers.clear();
    }
  }
}
