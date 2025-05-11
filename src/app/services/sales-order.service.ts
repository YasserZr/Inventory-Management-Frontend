import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, of } from 'rxjs';
import { PurchaseOrder } from '../models/purchase-order.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SalesOrderService {
  private apiUrl = `${environment.apiUrl}/api/orders`;

  constructor(private http: HttpClient) {}

  getOrders(): Observable<PurchaseOrder[]> {
    return this.http.get<PurchaseOrder[]>(this.apiUrl);
  }

  getOrder(id: string): Observable<PurchaseOrder> {
    return this.http.get<PurchaseOrder>(`${this.apiUrl}/${id}`);
  }

  createOrder(order: PurchaseOrder): Observable<PurchaseOrder> {
    return this.http.post<PurchaseOrder>(this.apiUrl, order);
  }

  updateOrder(id: string, order: PurchaseOrder): Observable<PurchaseOrder> {
    return this.http.put<PurchaseOrder>(`${this.apiUrl}/${id}`, order);
  }

  deleteOrder(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Method to convert status codes to readable text
  getStatusLabel(status: string): string {
    const statusMap: {[key: string]: string} = {
      'PENDING': 'Pending',
      'PROCESSING': 'Processing',
      'SHIPPED': 'Shipped',
      'DELIVERED': 'Delivered',
      'CANCELLED': 'Cancelled'
    };
    return statusMap[status] || status;
  }

  getPaymentStatusLabel(status: string): string {
    const statusMap: {[key: string]: string} = {
      'PENDING': 'Pending',
      'PAID': 'Paid',
      'REFUNDED': 'Refunded',
      'FAILED': 'Failed'
    };
    return statusMap[status] || status;
  }
}