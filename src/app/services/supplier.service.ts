import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { User } from '../models/user.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SupplierService {
  private apiUrl = `${environment.apiUrl}/api/users`;

  constructor(private http: HttpClient) {}
  getSuppliers(): Observable<User[]> {
    // Get all suppliers, regardless of contracts
    return this.http.get<User[]>(`${this.apiUrl}/role/SUPPLIER`);
  }
  
  getSuppliersWithActiveContracts(): Observable<User[]> {
    // Get only suppliers with active contracts for the current user
    return this.http.get<User[]>(`${this.apiUrl}/suppliers/contracted`);
  }

  getSupplier(id: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  createSupplier(supplier: User): Observable<User> {
    // Make sure the role is set to SUPPLIER
    supplier.role = 'SUPPLIER';
    return this.http.post<User>(this.apiUrl, supplier);
  }

  updateSupplier(id: string, supplier: User): Observable<User> {
    // Make sure the role is set to SUPPLIER
    supplier.role = 'SUPPLIER';
    return this.http.put<User>(`${this.apiUrl}/${id}`, supplier);
  }

  deleteSupplier(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Helper method to get service quality labels
  getServiceQualityLabel(quality: string): string {
    const qualityMap: {[key: string]: string} = {
      'EXCELLENT': 'Excellent',
      'GOOD': 'Good',
      'AVERAGE': 'Average',
      'BELOW_AVERAGE': 'Below Average',
      'POOR': 'Poor'
    };
    
    return qualityMap[quality] || quality;
  }
}
