import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PurchaseHistoryService } from '../../../services/purchase-history.service';
import { PurchaseOrder } from '../../../models/purchase-order';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-purchase-history',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './purchase-history.component.html',
  styleUrl: './purchase-history.component.scss'
})
export class PurchaseHistoryComponent implements OnInit {
  orders: PurchaseOrder[] = [];
  filteredOrders: PurchaseOrder[] = [];
  loading = true;
  error: string | null = null;
  
  // Filter options
  searchTerm = '';
  statusFilter = '';
  dateFilter: 'all' | 'last30' | 'last90' | 'year' = 'all';
  
  constructor(private purchaseHistoryService: PurchaseHistoryService) { }
  
  ngOnInit(): void {
    this.loadOrders();
  }
  
  loadOrders(): void {
    this.loading = true;
    this.error = null;
    
    this.purchaseHistoryService.getUserOrders().subscribe({
      next: (data) => {
        this.orders = data;
        this.applyFilters();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching orders', err);
        this.error = 'Failed to load your order history. Please try again later.';
        this.loading = false;
        
        // Use mock data for development
        setTimeout(() => {
          this.mockOrders();
          this.loading = false;
          this.error = null;
        }, 500);
      }
    });
  }
  
  // Temporary mock data for development
  mockOrders(): void {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
    const sixMonthsAgo = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);
    
    this.orders = [
      {
        poId: 1,
        status: 'DELIVERED',
        totalAmount: 1299.98,
        orderDate: now.toISOString(),
        deliveryDate: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        paymentStatus: 'PAID',
        paymentMethod: 'CREDIT_CARD',
        shippingAddress: '123 Main St, Anytown, USA',
        supplier: { id: 1, firstname: 'Dell', lastname: 'Inc.' },
        purchaseOrderLines: [
          {
            product: { id: 1, name: 'Dell XPS 13', price: 1299.98 },
            quantity: 1,
            priceAtPurchase: 1299.98
          }
        ]
      },
      {
        poId: 2,
        status: 'DELIVERED',
        totalAmount: 3599.97,
        orderDate: thirtyDaysAgo.toISOString(),
        deliveryDate: new Date(thirtyDaysAgo.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        paymentStatus: 'PAID',
        paymentMethod: 'PAYPAL',
        shippingAddress: '123 Main St, Anytown, USA',
        supplier: { id: 2, firstname: 'Apple', lastname: 'Inc.' },
        purchaseOrderLines: [
          {
            product: { id: 2, name: 'MacBook Pro', price: 1799.99 },
            quantity: 2,
            priceAtPurchase: 1799.99
          }
        ]
      },
      {
        poId: 3,
        status: 'CANCELLED',
        totalAmount: 499.95,
        orderDate: ninetyDaysAgo.toISOString(),
        deliveryDate: undefined,
        paymentStatus: 'REFUNDED',
        paymentMethod: 'DEBIT_CARD',
        shippingAddress: '123 Main St, Anytown, USA',
        supplier: { id: 3, firstname: 'HP', lastname: 'Inc.' },
        purchaseOrderLines: [
          {
            product: { id: 4, name: 'HP Monitor', price: 249.99 },
            quantity: 2,
            priceAtPurchase: 249.99
          }
        ]
      },
      {
        poId: 4,
        status: 'DELIVERED',
        totalAmount: 89.97,
        orderDate: sixMonthsAgo.toISOString(),
        deliveryDate: new Date(sixMonthsAgo.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        paymentStatus: 'PAID',
        paymentMethod: 'CREDIT_CARD',
        shippingAddress: '123 Main St, Anytown, USA',
        supplier: { id: 1, firstname: 'Dell', lastname: 'Inc.' },
        purchaseOrderLines: [
          {
            product: { id: 5, name: 'Keyboard', price: 29.99 },
            quantity: 3,
            priceAtPurchase: 29.99
          }
        ]
      }
    ];
    
    this.applyFilters();
  }
  
  applyFilters(): void {
    let filtered = [...this.orders];
    
    // Apply search filter
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(order => 
        order.supplier?.firstname?.toLowerCase().includes(term) ||
        order.supplier?.lastname?.toLowerCase().includes(term) ||
        order.purchaseOrderLines?.some(line => 
          line.product?.name?.toLowerCase().includes(term)
        ) ||
        order.poId?.toString().includes(term)
      );
    }
    
    // Apply status filter
    if (this.statusFilter) {
      filtered = filtered.filter(order => order.status === this.statusFilter);
    }
    
    // Apply date filter
    if (this.dateFilter !== 'all') {
      const now = new Date();
      let cutoff: Date;
      
      switch(this.dateFilter) {
        case 'last30':
          cutoff = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        case 'last90':
          cutoff = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
          break;
        case 'year':
          cutoff = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
          break;
        default:
          cutoff = new Date(0); // Beginning of time
      }
      
      filtered = filtered.filter(order => {
        if (!order.orderDate) return true;
        return new Date(order.orderDate) >= cutoff;
      });
    }
    
    this.filteredOrders = filtered;
  }
  
  resetFilters(): void {
    this.searchTerm = '';
    this.statusFilter = '';
    this.dateFilter = 'all';
    this.applyFilters();
  }
  
  getStatusClass(status?: string): string {
    if (!status) return 'bg-secondary';
    
    switch(status) {
      case 'PENDING': return 'bg-warning text-dark';
      case 'PROCESSING': return 'bg-info text-dark';
      case 'SHIPPED': return 'bg-primary';
      case 'DELIVERED': return 'bg-success';
      case 'CANCELLED': return 'bg-danger';
      default: return 'bg-secondary';
    }
  }
  
  getPaymentStatusClass(status?: string): string {
    if (!status) return 'bg-secondary';
    
    switch(status) {
      case 'PENDING': return 'bg-warning text-dark';
      case 'PAID': return 'bg-success';
      case 'REFUNDED': return 'bg-info';
      default: return 'bg-secondary';
    }
  }
  
  getFormattedDate(dateStr?: string): string {
    if (!dateStr) return 'N/A';
    
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
}
