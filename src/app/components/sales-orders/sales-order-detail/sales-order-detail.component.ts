import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { PurchaseOrder } from '../../../models/purchase-order.model';
import { PurchaseOrderLine } from '../../../models/purchase-order-line.model';
import { SalesOrderService } from '../../../services/sales-order.service';
import { finalize } from 'rxjs/operators';

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
    private salesOrderService: SalesOrderService
  ) {}

  ngOnInit(): void {
    const orderId = this.route.snapshot.paramMap.get('id');
    if (orderId) {
      this.loadOrderDetails(orderId);
    } else {
      this.error = 'No order ID provided';
      this.loading = false;
    }
  }
  
  loadOrderDetails(orderId: string): void {
    this.loading = true;
    this.error = null;
    
    this.salesOrderService.getOrder(orderId)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (data) => {
          this.order = data;
          // Map order lines for display directly
          this.orderLines = this.mapOrderLines(data.purchaseOrderLines || []);
        },
        error: (err) => {
          console.error('Failed to load order details:', err);
          this.error = 'Failed to load order details. Please try again.';
          
          // Fallback to mock data for development
          const mockOrder = this.getMockOrder(parseInt(orderId));
          this.order = mockOrder;
          this.orderLines = this.mapOrderLines(mockOrder.purchaseOrderLines || []);
        }
      });
  }
  
  // Helper method to map order lines for display
  mapOrderLines(lines: any[]): DisplayPurchaseOrderLine[] {
    return lines.map(line => {
      const productName = line.product?.name || 'Unknown Product';
      const unitPrice = line.product?.price || 0;
      const quantity = line.quantity || 0;
      const totalPrice = unitPrice * quantity;
      
      // Create a PurchaseOrderLine compatible object
      const convertedLine: PurchaseOrderLine = {
        id: line.id || line.lineId,
        lineId: line.lineId || line.id,
        product: line.product ? {
          id: line.product.id,
          name: line.product.name,
          price: line.product.price,
          description: line.product.description,
          stockQuantity: line.product.stockQuantity
        } : undefined,
        quantity: quantity,
        lineTotal: line.lineTotal || totalPrice,
        priceAtPurchase: line.priceAtPurchase
      };
      
      // Return DisplayPurchaseOrderLine with added display properties
      return {
        ...convertedLine,
        productName,
        unitPrice,
        totalPrice
      };
    });
  }
  
  // Mock data for development/testing purposes
  getMockOrder(id: number): PurchaseOrder {
    return {
      poId: id,
      status: 'PROCESSING',
      totalAmount: 1299.98,
      orderDate: '2025-05-01T09:30:00',
      deliveryDate: '2025-05-08T14:00:00',
      paymentStatus: 'PAID',
      paymentMethod: 'CREDIT_CARD',
      shippingAddress: '123 Main St, Anytown, USA',
      billingAddress: '123 Main St, Anytown, USA',
      notes: 'Please deliver to reception',
      createdAt: '2025-05-01T09:30:00',
      updatedAt: '2025-05-01T09:30:00',
      orderedBy: { 
        id: 10, 
        firstname: 'John', 
        lastname: 'Doe', 
        email: 'john.doe@example.com', 
        role: 'USER', 
        username: 'johndoe' 
      },
      supplier: { 
        id: 1, 
        firstname: 'Dell', 
        lastname: 'Inc.', 
        email: 'supplier@dell.com', 
        role: 'SUPPLIER', 
        username: 'dell_supplier' 
      },
      purchaseOrderLines: [
        {
          id: 101,
          product: { 
            id: 1, 
            name: 'Dell XPS 13', 
            price: 1299.99,
            description: 'High-end laptop',
            stockQuantity: 10
          },
          quantity: 1,
          priceAtPurchase: 1299.99
        }
      ]
    };
  }

  getStatusClass(status: string | undefined): string {
    if (!status) return 'bg-secondary';
    
    const classMap: {[key: string]: string} = {
      'PENDING': 'bg-warning text-dark',
      'PROCESSING': 'bg-info',
      'SHIPPED': 'bg-primary',
      'DELIVERED': 'bg-success',
      'CANCELLED': 'bg-danger'
    };
    
    return classMap[status] || 'bg-secondary';
  }

  getStatusLabel(status: string | undefined): string {
    if (!status) return 'Unknown';
    return this.salesOrderService.getStatusLabel(status);
  }

  getPaymentStatusClass(status: string | undefined): string {
    if (!status) return 'bg-secondary';
    
    const classMap: {[key: string]: string} = {
      'PENDING': 'bg-warning text-dark',
      'PAID': 'bg-success',
      'REFUNDED': 'bg-info',
      'FAILED': 'bg-danger'
    };
    
    return classMap[status] || 'bg-secondary';
  }

  getPaymentStatusLabel(status: string | undefined): string {
    if (!status) return 'Unknown';
    return this.salesOrderService.getPaymentStatusLabel(status);
  }

  getPaymentStatusIcon(status: string | undefined): string {
    if (!status) return 'fa-question-circle';
    
    const iconMap: {[key: string]: string} = {
      'PENDING': 'fa-clock',
      'PAID': 'fa-check-circle',
      'REFUNDED': 'fa-exchange-alt',
      'FAILED': 'fa-times-circle'
    };
    
    return iconMap[status] || 'fa-question-circle';
  }

  formatDate(date: string | undefined): string {
    if (!date) return 'N/A';
    
    try {
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return date;
    }
  }
}