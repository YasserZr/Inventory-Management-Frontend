import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/user';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SupplierService {
  private apiUrl = `${environment.apiUrl}/api/suppliers`;

  constructor(private http: HttpClient) {}

  getSuppliers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  getSupplier(id: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  createSupplier(supplier: User): Observable<User> {
    return this.http.post<User>(this.apiUrl, supplier);
  }

  updateSupplier(id: string, supplier: User): Observable<User> {
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
