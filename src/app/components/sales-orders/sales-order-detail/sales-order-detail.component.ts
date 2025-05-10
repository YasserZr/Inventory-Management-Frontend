import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { PurchaseOrder } from '../../../models/purchase-order';
import { PurchaseOrderLine } from '../../../models/purchase-order-line';

// Create extended interface for template access
interface DisplayPurchaseOrderLine extends PurchaseOrderLine {
  productName: string;
  unitPrice: number;
  totalPrice: number;
}

@Component({
  selector: 'app-sales-order-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sales-order-detail.component.html',
  styleUrls: ['./sales-order-detail.component.scss']
})
export class SalesOrderDetailComponent implements OnInit {
  order: PurchaseOrder | null = null;
  orderLines: DisplayPurchaseOrderLine[] = [];
  loading = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    // Inject your order service here
  ) {}

  ngOnInit(): void {
    const orderId = this.route.snapshot.paramMap.get('id');
    if (orderId) {
      this.loadOrderDetails(orderId);
    }
  }

  loadOrderDetails(orderId: string): void {
    this.loading = true;
    // Replace with your actual service call
    // this.orderService.getOrderById(orderId).subscribe({
    //   next: (data) => {
    //     this.order = data;
    //     this.orderLines = this.mapOrderLines(data.orderLines || []);
    //     this.loading = false;
    //   },
    //   error: (err) => {
    //     this.error = 'Failed to load order details';
    //     this.loading = false;
    //     console.error(err);
    //   }
    // });
      // Temporary mock data for development
    setTimeout(() => {
      const now = new Date();
      const deliveryDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      
      this.order = {
        poId: parseInt(orderId),
        orderDate: now.toISOString(),
        deliveryDate: deliveryDate.toISOString(),
        status: 'PROCESSING',
        paymentStatus: 'PAID',
        paymentMethod: 'Credit Card',
        totalAmount: 1250.99,
        notes: 'Please deliver to the back entrance',
        shippingAddress: '123 Delivery St, Shipping City, SC 12345',
        billingAddress: '456 Billing Ave, Invoice City, IC 67890',
        updatedAt: now.toISOString()
      };
      
      const rawOrderLines = [
        { 
          id: 1, 
          product: {
            id: 101,
            name: 'Laptop',
            price: 499.99
          }, 
          quantity: 2, 
          priceAtPurchase: 499.99 
        },
        { 
          id: 2, 
          product: {
            id: 203,
            name: 'Wireless Mouse',
            price: 29.99
          }, 
          quantity: 3, 
          priceAtPurchase: 29.99 
        },
        { 
          id: 3, 
          product: {
            id: 305,
            name: 'USB-C Cable',
            price: 12.99
          }, 
          quantity: 5, 
          priceAtPurchase: 12.99 
        }
      ];
      
      // Convert the raw order lines to DisplayPurchaseOrderLine objects
      this.orderLines = this.mapOrderLines(rawOrderLines);
      
      this.loading = false;
    }, 800);
  }

  // Helper method to map PurchaseOrderLine to DisplayPurchaseOrderLine
  mapOrderLines(lines: PurchaseOrderLine[]): DisplayPurchaseOrderLine[] {
    return lines.map(line => ({
      ...line,
      productName: line.product.name || 'Unknown Product',
      unitPrice: line.priceAtPurchase,
      totalPrice: line.quantity * line.priceAtPurchase
    }));
  }

  getStatusClass(status: string): string {
    const statusMap: {[key: string]: string} = {
      'NEW': 'bg-info',
      'PROCESSING': 'bg-warning text-dark',
      'SHIPPED': 'bg-primary',
      'DELIVERED': 'bg-success',
      'CANCELLED': 'bg-danger',
      'RETURNED': 'bg-secondary'
    };
    
    return statusMap[status] || 'bg-secondary';
  }
  
  getPaymentStatusClass(status: string): string {
    const statusMap: {[key: string]: string} = {
      'PAID': 'text-success',
      'PENDING': 'text-warning',
      'FAILED': 'text-danger',
      'REFUNDED': 'text-info'
    };
    
    return statusMap[status] || '';
  }
  
  getPaymentStatusIcon(status: string): string {
    const iconMap: {[key: string]: string} = {
      'PAID': 'fa-check-circle',
      'PENDING': 'fa-clock',
      'FAILED': 'fa-times-circle',
      'REFUNDED': 'fa-undo'
    };
    
    return iconMap[status] || 'fa-question-circle';
  }
}
