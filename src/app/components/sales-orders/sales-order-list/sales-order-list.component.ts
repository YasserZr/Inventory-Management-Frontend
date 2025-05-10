import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PurchaseOrder } from '../../../models/purchase-order';

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
  
  constructor() { }

  ngOnInit(): void {
    // Mock data - would be replaced with API call
    this.salesOrders = [
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
    this.filterOrders();
  }

  filterOrders(): void {
    this.filteredOrders = this.salesOrders.filter(order => {
      const matchesSearch = this.searchTerm.trim() === '' || 
        order.poId?.toString().includes(this.searchTerm) ||
        order.orderedBy?.firstname?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        order.orderedBy?.lastname?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        order.supplier?.firstname?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        order.totalAmount?.toString().includes(this.searchTerm);
      
      const matchesStatus = this.statusFilter === 'ALL' || order.status === this.statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }

  onSearchChange(): void {
    this.filterOrders();
  }

  onStatusFilterChange(): void {
    this.filterOrders();
  }

  getStatusClass(status: string | undefined): string {
    if (!status) return 'bg-secondary';
    
    switch(status) {
      case 'PROCESSING': return 'bg-info';
      case 'DELIVERED': return 'bg-success';
      case 'PENDING': return 'bg-warning';
      case 'CANCELLED': return 'bg-danger';
      default: return 'bg-secondary';
    }
  }

  getPaymentStatusClass(status: string | undefined): string {
    if (!status) return 'text-secondary';
    
    switch(status) {
      case 'PAID': return 'text-success';
      case 'PENDING': return 'text-warning';
      case 'REFUNDED': return 'text-danger';
      default: return 'text-secondary';
    }
  }
}
