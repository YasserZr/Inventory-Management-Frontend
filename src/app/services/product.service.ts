import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = `${environment.apiUrl}/api/products`;

  constructor(private http: HttpClient) {}

  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }

  getProduct(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  createProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, product);
  }

  updateProduct(id: string, product: Product): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${id}`, product);
  }

  updateProductStock(id: string, quantity: number): Observable<Product> {
    return this.http.patch<Product>(`${this.apiUrl}/${id}/stock?quantity=${quantity}`, {});
  }

  deleteProduct(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  searchProducts(name: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/search?name=${encodeURIComponent(name)}`);
  }

  getProductsByCategory(categoryId: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/category/${categoryId}`);
  }

  getProductsBySupplier(supplierId: string, minQuantity: number = 0): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/supplier/${supplierId}?minQuantity=${minQuantity}`);
  }

  getProductsByStatus(status: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/status/${status}`);
  }

  // Helper method to get status labels
  getStatusLabel(status: string): string {
    const statusMap: {[key: string]: string} = {
      'ACTIVE': 'Active',
      'LOW_STOCK': 'Low Stock',
      'OUT_OF_STOCK': 'Out of Stock',
      'DISCONTINUED': 'Discontinued'
    };
    
    return statusMap[status] || status;
  }
  
  // Helper method to get status badge classes for UI styling
  getStatusBadgeClass(status: string): string {
    const classMap: {[key: string]: string} = {
      'ACTIVE': 'bg-success',
      'LOW_STOCK': 'bg-warning text-dark',
      'OUT_OF_STOCK': 'bg-danger',
      'DISCONTINUED': 'bg-secondary'
    };
    
    return classMap[status] || 'bg-primary';
  }
}
