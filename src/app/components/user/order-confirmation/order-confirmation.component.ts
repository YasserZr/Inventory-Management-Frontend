import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { PurchaseOrder } from '../../../models/purchase-order';
import { PurchaseHistoryService } from '../../../services/purchase-history.service';

@Component({
  selector: 'app-order-confirmation',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './order-confirmation.component.html',
  styleUrl: './order-confirmation.component.scss'
})
export class OrderConfirmationComponent implements OnInit {
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
        // If no order ID is provided, redirect to home
        this.router.navigate(['/dashboard']);
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
          
          // For demo purposes, create a mock order if API fails
          setTimeout(() => {
            this.createMockOrder();
            this.loading = false;
            this.error = false;
          }, 1000);
        }
      });
  }
  
  createMockOrder(): void {    this.order = {
      poId: this.orderId || 12345,
      // Using orderedBy instead of userId to match the PurchaseOrder interface
      orderedBy: { id: 1, username: 'user1', email: 'user1@example.com' },
      orderDate: new Date().toISOString(),
      status: 'PENDING',
      totalAmount: 1299.95,
      shippingCost: 15.00,
      taxAmount: 104.00,
      paymentMethod: 'CREDIT_CARD',
      paymentStatus: 'PAID',
      shippingAddress: {
        name: 'John Doe',
        street: '123 Main St',
        city: 'Boston',
        state: 'MA',
        zipCode: '02108',
        country: 'USA',
        phone: '555-123-4567',
        email: 'john.doe@example.com'
      },
      billingAddress: {
        name: 'John Doe',
        street: '123 Main St',
        city: 'Boston',
        state: 'MA',
        zipCode: '02108',
        country: 'USA',
        phone: '555-123-4567',
        email: 'john.doe@example.com'
      },
      orderLines: [
        {
          id: 1,
          productId: 101,
          productName: 'Dell XPS 13',
          productCode: 'DXPS13-2025',
          quantity: 1,
          pricePerUnit: 1199.99,
          discountAmount: 119.99,
          supplierName: 'Dell Computers'
        }
      ]
    };
  }
  
  continueShopping(): void {
    this.router.navigate(['/user/offers']);
  }
  
  viewOrderDetails(): void {
    if (this.orderId) {
      this.router.navigate(['/user/purchase-order', this.orderId]);
    }
  }
  
  viewAllOrders(): void {
    this.router.navigate(['/user/purchase-history']);
  }
}
