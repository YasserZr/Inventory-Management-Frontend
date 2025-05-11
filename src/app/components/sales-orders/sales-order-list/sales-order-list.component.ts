import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PurchaseOrder } from '../../../models/purchase-order.model';
import { SalesOrderService } from '../../../services/sales-order.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-sales-order-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './sales-order-list.component.html',
  styleUrl: './sales-order-list.component.scss'
})
export class SalesOrderListComponent implements OnInit {
  salesOrders: PurchaseOrder[] = [];
  filteredOrders: PurchaseOrder[] = [];
  searchTerm: string = '';
  statusFilter: string = 'ALL';
  loading: boolean = false;
  error: string | null = null;
  
  constructor(private salesOrderService: SalesOrderService) { }

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.loading = true;
    this.error = null;
    
    this.salesOrderService.getOrders()
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (data) => {
          this.salesOrders = data;
          this.applyFilters();
        },
        error: (err) => {
          console.error('Failed to load orders:', err);
          this.error = 'Failed to load orders. Please try again.';
          // Fallback to mock data in case of error (for development)
          this.salesOrders = this.getMockOrders();
          this.applyFilters();
        }
      });
  }

  // Mock data for development/testing purposes
  getMockOrders(): PurchaseOrder[] {
    return [
      {
        poId: 1,
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
        orderedBy: { id: 10, firstname: 'John', lastname: 'Doe', email: 'john.doe@example.com' },
        supplier: { id: 1, firstname: 'Dell', lastname: 'Inc.', email: 'supplier@dell.com' }
      },
      {
        poId: 2,
        status: 'DELIVERED',
        totalAmount: 4999.95,
        orderDate: '2025-04-25T11:15:00',
        deliveryDate: '2025-05-02T10:30:00',
        paymentStatus: 'PAID',
        paymentMethod: 'BANK_TRANSFER',
        shippingAddress: '456 Oak Ave, Business Park, USA',
        billingAddress: '789 Corporate Blvd, Business Park, USA',
        notes: 'Fragile items included',
        createdAt: '2025-04-25T11:15:00',
        updatedAt: '2025-05-02T10:30:00',
        orderedBy: { id: 11, firstname: 'Jane', lastname: 'Smith', email: 'jane.smith@example.com' },
        supplier: { id: 2, firstname: 'Apple', lastname: 'Inc.', email: 'supplier@apple.com' }
      },
      {
        poId: 3,
        status: 'PENDING',
        totalAmount: 799.50,
        orderDate: '2025-05-03T15:45:00',
        deliveryDate: undefined, // Changed from null to undefined
        paymentStatus: 'PENDING',
        paymentMethod: 'CREDIT_CARD',
        shippingAddress: '789 Pine St, Anytown, USA',
        billingAddress: '789 Pine St, Anytown, USA',
        notes: 'Call before delivery',
        createdAt: '2025-05-03T15:45:00',
        updatedAt: '2025-05-03T15:45:00',
        orderedBy: { id: 12, firstname: 'Robert', lastname: 'Johnson', email: 'robert.j@example.com' },
        supplier: { id: 3, firstname: 'Samsung', lastname: 'Electronics', email: 'supplier@samsung.com' }
      },
      {
        poId: 4,
        status: 'CANCELLED',
        totalAmount: 349.99,
        orderDate: '2025-04-29T10:00:00',
        deliveryDate: undefined, // Changed from null to undefined
        paymentStatus: 'REFUNDED',
        paymentMethod: 'PAYPAL',
        shippingAddress: '101 Elm St, Othertown, USA',
        billingAddress: '101 Elm St, Othertown, USA',
        notes: 'Order cancelled due to stock issues',
        createdAt: '2025-04-29T10:00:00',
        updatedAt: '2025-04-30T16:20:00',
        orderedBy: { id: 13, firstname: 'Emma', lastname: 'Davis', email: 'emma.d@example.com' },
        supplier: { id: 4, firstname: 'Sony', lastname: 'Interactive', email: 'supplier@sony.com' }
      }
    ];
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  onStatusFilterChange(): void {
    this.applyFilters();
  }

  applyFilters(): void {
    let filtered = [...this.salesOrders];

    // Apply status filter if not ALL
    if (this.statusFilter !== 'ALL') {
      filtered = filtered.filter(order => order.status === this.statusFilter);
    }

    // Apply search term if exists
    if (this.searchTerm.trim()) {
      const search = this.searchTerm.toLowerCase();
      filtered = filtered.filter(order => 
        order.poId?.toString().includes(search) ||
        order.orderedBy?.firstname?.toLowerCase().includes(search) ||
        order.orderedBy?.lastname?.toLowerCase().includes(search) ||
        order.supplier?.firstname?.toLowerCase().includes(search) ||
        order.supplier?.lastname?.toLowerCase().includes(search)
      );
    }

    this.filteredOrders = filtered;
  }

  getStatusLabel(status: string | undefined): string {
    if (!status) return 'Unknown';
    return this.salesOrderService.getStatusLabel(status);
  }

  getStatusClass(status: string | undefined): string {
    if (!status) return 'bg-secondary';
    
    const statusClasses: { [key: string]: string } = {
      'PENDING': 'bg-warning text-dark',
      'PROCESSING': 'bg-info',
      'SHIPPED': 'bg-primary',
      'DELIVERED': 'bg-success',
      'CANCELLED': 'bg-danger'
    };
    return statusClasses[status] || 'bg-secondary';
  }

  getPaymentStatusLabel(status: string | undefined): string {
    if (!status) return 'Unknown';
    return this.salesOrderService.getPaymentStatusLabel(status);
  }

  getPaymentStatusClass(status: string | undefined): string {
    if (!status) return 'bg-secondary';
    
    const statusClasses: { [key: string]: string } = {
      'PENDING': 'bg-warning text-dark',
      'PAID': 'bg-success',
      'REFUNDED': 'bg-info',
      'FAILED': 'bg-danger'
    };
    return statusClasses[status] || 'bg-secondary';
  }

  deleteOrder(id: number): void {
    if (confirm('Are you sure you want to delete this order?')) {
      this.salesOrderService.deleteOrder(id.toString()).subscribe({
        next: () => {
          this.salesOrders = this.salesOrders.filter(order => order.poId !== id);
          this.applyFilters();
        },
        error: (err) => {
          console.error('Failed to delete order:', err);
          alert('Failed to delete the order. Please try again.');
        }
      });
    }
  }
}
