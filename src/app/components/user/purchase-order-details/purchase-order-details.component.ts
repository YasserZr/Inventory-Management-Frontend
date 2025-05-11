import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PurchaseHistoryService } from '../../../services/purchase-history.service';
import { PurchaseOrder } from '../../../models/purchase-order';
import { Product } from '../../../models/product';

@Component({
  selector: 'app-purchase-order-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './purchase-order-details.component.html',
  styleUrl: './purchase-order-details.component.scss'
})
export class PurchaseOrderDetailsComponent implements OnInit {
  orderId: number | null = null;
  order: PurchaseOrder | null = null;
  loading = true;
  error = false;
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private purchaseHistoryService: PurchaseHistoryService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.orderId = +params['id'];
        this.loadOrderDetails();
      } else {
        this.router.navigate(['/user/purchase-history']);
      }
    });
  }

  loadOrderDetails(): void {
    if (!this.orderId) return;

    this.loading = true;
    this.purchaseHistoryService.getPurchaseOrderById(this.orderId)
      .subscribe({
        next: (order) => {
          this.order = order;
          this.loading = false;
        },
        error: (err) => {
          console.error('Error loading order details', err);
          this.error = true;
          this.loading = false;
        }
      });
  }

  getOrderStatusClass(status: string): string {
    switch (status?.toUpperCase()) {
      case 'PENDING': return 'status-pending';
      case 'PROCESSING': return 'status-processing';
      case 'SHIPPED': return 'status-shipped';
      case 'DELIVERED': return 'status-delivered';
      case 'CANCELLED': return 'status-cancelled';
      default: return '';
    }
  }

  getOrderStatusIcon(status: string): string {
    switch (status?.toUpperCase()) {
      case 'PENDING': return 'fa-clock';
      case 'PROCESSING': return 'fa-cogs';
      case 'SHIPPED': return 'fa-truck';
      case 'DELIVERED': return 'fa-check-circle';
      case 'CANCELLED': return 'fa-times-circle';
      default: return 'fa-question-circle';
    }
  }

  getTotalDiscount(): number {
    if (!this.order || !this.order.orderLines) return 0;
    
    return this.order.orderLines.reduce((sum, line) => {
      const discount = line.discountAmount || 0;
      return sum + discount;
    }, 0);
  }

  getSubtotal(): number {
    if (!this.order || !this.order.orderLines) return 0;
    
    return this.order.orderLines.reduce((sum, line) => {
      const lineTotal = line.quantity * line.pricePerUnit;
      return sum + lineTotal;
    }, 0);
  }

  navigateBack(): void {
    this.router.navigate(['/user/purchase-history']);
  }

  canRateSupplier(): boolean {
    if (!this.order) return false;
    
    // Only allow rating if order is delivered and has a supplier
    return this.order.status?.toUpperCase() === 'DELIVERED' && 
      !!this.order.supplierId;
  }

  rateSupplier(): void {
    if (this.order?.supplierId) {
      this.router.navigate(['/user/rate-supplier', this.order.supplierId]);
    }
  }
  
  reorder(): void {
    if (!this.order || !this.order.orderLines || this.order.orderLines.length === 0) {
      console.error('Cannot reorder: Order has no items');
      return;
    }
    
    // Since we've removed the cart, we'll go straight to purchase order page
    // In a real app, we would pass the order lines through a state management system 
    // or use a service to temporarily store the order details
    
    // For now, we'll just navigate to the purchase order page
    // In a real implementation, you would pass the items to reorder
    this.router.navigate(['/user/purchase-order']);
  }
}