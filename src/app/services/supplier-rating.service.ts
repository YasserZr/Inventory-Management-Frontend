import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user';
import { environment } from '../../environments/environment';

export interface SupplierRating {
  id?: number;
  supplierId: number;
  userId: number;
  rating: number;
  comment?: string;
  createdAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class SupplierRatingService {
  private apiUrl = `${environment.apiUrl}/api/ratings`;

  constructor(private http: HttpClient) { }
  
  // Get all ratings for a supplier
  getSupplierRatings(supplierId: number): Observable<SupplierRating[]> {
    return this.http.get<SupplierRating[]>(`${this.apiUrl}/supplier/${supplierId}`);
  }
  
  // Get average rating for a supplier
  getSupplierAverageRating(supplierId: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/supplier/${supplierId}/average`);
  }
  
  // Submit a new rating
  submitRating(rating: SupplierRating): Observable<SupplierRating> {
    return this.http.post<SupplierRating>(this.apiUrl, rating);
  }
  
  // Update an existing rating
  updateRating(id: number, rating: SupplierRating): Observable<SupplierRating> {
    return this.http.put<SupplierRating>(`${this.apiUrl}/${id}`, rating);
  }
  
  // Delete a rating
  deleteRating(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
  
  // Check if user has already rated a supplier
  hasUserRatedSupplier(supplierId: number, userId: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/check?supplierId=${supplierId}&userId=${userId}`);
  }
}
