import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Offer } from '../../../models/offer';
import { OfferService } from '../../../services/offer.service';
import { SupplierRatingService } from '../../../services/supplier-rating.service';
import { Product } from '../../../models/product';

@Component({
  selector: 'app-offers-view',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './offers-view.component.html',
  styleUrl: './offers-view.component.scss'
})
export class OffersViewComponent implements OnInit {
  offers: Offer[] = [];
  filteredOffers: Offer[] = [];
  loading = true;
  error: string | null = null;
  searchTerm = '';
  categoryFilter = '';
  supplierFilter = '';
  priceRangeFilter = '';
  sortOption = 'newest';
  minPrice = 0;
  maxPrice = 5000;
  discountOnlyFilter = false;
    // Mock categories for filtering
  categories = [
    { categoryId: 1, name: 'Electronics' },
    { categoryId: 2, name: 'Office Equipment' },
    { categoryId: 3, name: 'Computer Accessories' }
  ];
  
  // Mock suppliers for filtering
  suppliers = [
    { id: 1, name: 'Dell Computers' },
    { id: 2, name: 'HP Inc' },
    { id: 3, name: 'Logitech International' }
  ];
  
  // Store supplier ratings
  supplierRatings: { [key: number]: number } = {};  
  constructor(
    private offerService: OfferService,
    private ratingService: SupplierRatingService
  ) {}
  
  ngOnInit(): void {
    this.loadOffers();
  }
  
  loadOffers(): void {
    this.loading = true;
    this.error = null;
    
    // In a real app, this would call the service to get active offers
    this.offerService.getActiveOffers().subscribe({
      next: (offers) => {
        this.offers = offers;
        this.processOffersData();
      },
      error: (err) => {
        console.error('Error loading offers', err);
        this.error = 'Failed to load offers. Please try again later.';
        this.loading = false;
        
        // For demo purposes, load mock data if the API fails
        setTimeout(() => {
          this.error = null;
          this.loadMockOffers();
        }, 1000);
      }
    });
  }
    loadMockOffers(): void {
    // Mock data
    setTimeout(() => {
      this.offers = [
          {
            offerId: 101,
            title: 'Bulk Laptop Discount',
            description: 'Special pricing for orders of 10+ laptops',
            status: 'ACTIVE',
            product: {            id: 1, 
            name: 'Dell XPS 13',
            description: 'High-performance laptop with InfinityEdge display',
            price: 1299.99,
            category: { categoryId: 1, name: 'Electronics' }
            },
            supplier: { id: 1, firstname: 'Dell', lastname: 'Computers' },
            minimumQuantity: 1,
            discountValue: 15,
            discountType: 'PERCENTAGE',
            startDate: '2023-04-01',
            endDate: '2023-07-31'
          },
          {
            offerId: 102,
            title: 'Server Bundle Deal',
            description: 'Servers with complimentary installation service',
            status: 'ACTIVE',
            product: {            id: 5, 
            name: 'Dell PowerEdge Server',
            description: 'Enterprise-grade server for business applications',
            price: 2999.99,
            category: { categoryId: 1, name: 'Electronics' }
            },
            supplier: { id: 1, firstname: 'Dell', lastname: 'Computers' },
            minimumQuantity: 1,
            discountValue: 500,
            discountType: 'FIXED',
            startDate: '2023-03-15',
            endDate: '2023-06-15'
          },
          {
            offerId: 103,
            title: 'Keyboard Bulk Purchase',
            description: 'Special pricing on large orders of keyboards',
            status: 'ACTIVE',
            product: {            id: 7, 
            name: 'Logitech MX Keys',
            description: 'Premium wireless keyboard with backlight',
            price: 99.99,
            category: { categoryId: 3, name: 'Computer Accessories' }
            },
            supplier: { id: 3, firstname: 'Logitech', lastname: 'International' },
            minimumQuantity: 1,
            discountValue: 10,
            discountType: 'PERCENTAGE',
            startDate: '2023-04-15',
            endDate: '2023-08-30'
          },
          {
            offerId: 104,
            title: 'Printer Package',
            description: 'Printers with complimentary ink cartridges',
            status: 'ACTIVE',
            product: {            id: 9, 
            name: 'HP LaserJet Pro',
            description: 'Professional laser printer for office use',
            price: 349.99,
            category: { categoryId: 2, name: 'Office Equipment' }
            },
            supplier: { id: 2, firstname: 'HP', lastname: 'Inc' },
            minimumQuantity: 1,
            discountValue: 75,
            discountType: 'FIXED',
            startDate: '2023-06-01',
            endDate: '2023-09-30'
          },
          {
            offerId: 105,
            title: 'Monitor Special Deal',
            description: 'High-quality monitors at special prices',
            status: 'ACTIVE',
            product: {            id: 12, 
            name: 'HP 27" Monitor',
            description: 'Full HD IPS display with eye comfort technology',
            price: 249.99,
            category: { categoryId: 1, name: 'Electronics' }
            },
            supplier: { id: 2, firstname: 'HP', lastname: 'Inc' },
            minimumQuantity: 1,
            discountValue: 15,
            discountType: 'PERCENTAGE',
            startDate: '2023-05-01',
            endDate: '2023-08-31'
          }
        ];
        this.processOffersData();
    }, 800);
  }
  
  processOffersData(): void {
    this.filteredOffers = [...this.offers];
    
    // Set min/max prices based on data
    if (this.offers.length > 0) {
      const prices = this.offers.map(offer => this.getDiscountedPrice(offer));
      this.minPrice = Math.floor(Math.min(...prices));
      this.maxPrice = Math.ceil(Math.max(...prices));
    }
    
    // Load supplier ratings
    this.loadSupplierRatings();
    
    // Sort offers
    this.sortOffers();
    
    this.loading = false;
  }
  
  // Load supplier ratings for all offers
  loadSupplierRatings(): void {
    // Create a set of unique supplier IDs from all offers
    const supplierIds = new Set<number>();
    this.offers.forEach(offer => {
      if (offer.supplier && offer.supplier.id) {
        supplierIds.add(offer.supplier.id);
      }
    });
    
    // Fetch rating for each supplier
    supplierIds.forEach(supplierId => {
      this.ratingService.getSupplierAverageRating(supplierId).subscribe({
        next: (rating) => {
          this.supplierRatings[supplierId] = rating;
        },
        error: (err) => {
          console.error(`Error loading rating for supplier ${supplierId}`, err);
          // Use a default/fallback rating
          this.supplierRatings[supplierId] = 0;
        }
      });
    });
  }
  
  // Get the rating for a specific supplier
  getSupplierRating(supplierId?: number): number {
    if (!supplierId) return 0;
    return this.supplierRatings[supplierId] || 0;
  }
  
  // Generate an array for star display based on rating
  getRatingStars(rating: number): number[] {
    // Round to nearest half star
    const roundedRating = Math.round(rating * 2) / 2;
    const fullStars = Math.floor(roundedRating);
    const halfStar = roundedRating % 1 !== 0;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    
    // Return array with star types: 1 = full, 0.5 = half, 0 = empty
    return [
      ...Array(fullStars).fill(1),
      ...(halfStar ? [0.5] : []),
      ...Array(emptyStars).fill(0)
    ];
  }
  
  applyFilters(): void {
    this.filteredOffers = this.offers.filter(offer => {
      const price = offer.product?.price || 0;
      const discountedPrice = this.getDiscountedPrice(offer);
      
      // Text search (product name, description, title)
      const textMatch = !this.searchTerm || 
        offer.title?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        offer.description?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        offer.product?.name?.toLowerCase().includes(this.searchTerm.toLowerCase());
        // Category filter
      const categoryMatch = !this.categoryFilter || 
        offer.product?.category?.categoryId?.toString() === this.categoryFilter;
      
      // Supplier filter
      const supplierMatch = !this.supplierFilter || 
        offer.supplier?.id?.toString() === this.supplierFilter;
      
      // Price range filter
      let priceMatch = true;
      if (this.priceRangeFilter) {
        const [min, max] = this.priceRangeFilter.split('-').map(Number);
        priceMatch = discountedPrice >= min && discountedPrice <= max;
      }
      
      // Discount only filter
      const discountMatch = !this.discountOnlyFilter || 
        (offer.discountValue && offer.discountValue > 0);
      
      return textMatch && categoryMatch && supplierMatch && priceMatch && discountMatch;
    });
    
    // Apply sorting
    this.sortOffers();
  }
  
  sortOffers(): void {
    switch(this.sortOption) {
      case 'priceAsc':
        this.filteredOffers.sort((a, b) => 
          this.getDiscountedPrice(a) - this.getDiscountedPrice(b));
        break;
      case 'priceDesc':
        this.filteredOffers.sort((a, b) => 
          this.getDiscountedPrice(b) - this.getDiscountedPrice(a));
        break;
      case 'discountHighest':
        this.filteredOffers.sort((a, b) => {
          const discountA = a.discountValue || 0;
          const discountB = b.discountValue || 0;
          return discountB - discountA;
        });
        break;
      case 'newest':
        this.filteredOffers.sort((a, b) => {
          const dateA = new Date(a.startDate || '').getTime();
          const dateB = new Date(b.startDate || '').getTime();
          return dateB - dateA;
        });
        break;
      default:
        // Default: newest first
        this.filteredOffers.sort((a, b) => {
          const dateA = new Date(a.startDate || '').getTime();
          const dateB = new Date(b.startDate || '').getTime();
          return dateB - dateA;
        });
    }
  }
  
  resetFilters(): void {
    this.searchTerm = '';
    this.categoryFilter = '';
    this.supplierFilter = '';
    this.priceRangeFilter = '';
    this.sortOption = 'newest';
    this.discountOnlyFilter = false;
    this.filteredOffers = [...this.offers];
    this.sortOffers();
  }
  
  getDiscountDisplay(offer: Offer): string {
    if (!offer.discountValue) return 'N/A';
    
    if (offer.discountType === 'PERCENTAGE') {
      return `${offer.discountValue}% OFF`;
    } else {
      return `$${offer.discountValue} OFF`;
    }
  }
  
  getOriginalPrice(offer: Offer): number {
    return offer.product?.price || 0;
  }
  
  getDiscountedPrice(offer: Offer): number {
    const price = offer.product?.price || 0;
    
    if (!offer.discountValue) return price;
    
    if (offer.discountType === 'PERCENTAGE') {
      return price * (1 - offer.discountValue / 100);
    } else {
      return Math.max(0, price - offer.discountValue);
    }
  }
    placeOrder(offer: Offer): void {
    if (!offer.product) return;
    
    // Navigate to purchase order page with offer ID
    // This would typically navigate to the purchase order form
    alert(`Please proceed to create a purchase order for ${offer.product.name}`);
    // In a real implementation, you'd use the router to navigate with the offer data
    // this.router.navigate(['/user/purchase-order/new'], { queryParams: { offerId: offer.offerId } });
  }
    isProductInCart(productId: number | undefined): boolean {
    // Since we removed the cart functionality, this will always return false
    return false;
  }
}
