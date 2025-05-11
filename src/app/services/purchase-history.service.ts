import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PurchaseHistory } from '../models/purchase-history';
import { PurchaseOrder } from '../models/purchase-order';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PurchaseHistoryService {
  private apiUrl = `${environment.apiUrl}/api/purchase-history`;
  private ordersApiUrl = `${environment.apiUrl}/api/orders/user`;

  constructor(private http: HttpClient) { }
  
  // Get all purchase history for current user
  getUserPurchaseHistory(): Observable<PurchaseHistory[]> {
    return this.http.get<PurchaseHistory[]>(this.apiUrl);
  }
  
  // Get purchase history details by ID
  getPurchaseHistoryDetail(id: number): Observable<PurchaseHistory> {
    return this.http.get<PurchaseHistory>(`${this.apiUrl}/${id}`);
  }
  
  // Get all orders for the current user
  getUserOrders(): Observable<PurchaseOrder[]> {
    return this.http.get<PurchaseOrder[]>(this.ordersApiUrl);
  }
    // Get order details by ID
  getOrderDetails(orderId: number): Observable<PurchaseOrder> {
    return this.http.get<PurchaseOrder>(`${this.ordersApiUrl}/${orderId}`);
  }
  
  // Get purchase order by ID - used in purchase order details component
  getPurchaseOrderById(orderId: number): Observable<PurchaseOrder> {
    return this.http.get<PurchaseOrder>(`${this.ordersApiUrl}/${orderId}`);
  }
}
