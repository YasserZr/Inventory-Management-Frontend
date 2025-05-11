import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Offer } from '../models/offer.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OfferService {
  private apiUrl = `${environment.apiUrl}/api/offers`;

  constructor(private http: HttpClient) {}

  getOffers(): Observable<Offer[]> {
    return this.http.get<Offer[]>(this.apiUrl);
  }

  getOffer(id: string): Observable<Offer> {
    return this.http.get<Offer>(`${this.apiUrl}/${id}`);
  }

  createOffer(offer: Offer): Observable<Offer> {
    return this.http.post<Offer>(this.apiUrl, offer);
  }

  updateOffer(id: string, offer: Offer): Observable<Offer> {
    return this.http.put<Offer>(`${this.apiUrl}/${id}`, offer);
  }

  deleteOffer(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Method to get status labels
  getStatusLabel(status: string): string {
    const statusMap: {[key: string]: string} = {
      'ACTIVE': 'Active',
      'PENDING': 'Pending',
      'EXPIRED': 'Expired',
      'CANCELLED': 'Cancelled'
    };
    
    return statusMap[status] || status;
  }

  // Method to get discount type labels
  getDiscountTypeLabel(type: string): string {
    const typeMap: {[key: string]: string} = {
      'PERCENTAGE': 'Percentage',
      'FIXED': 'Fixed Amount'
    };
    
    return typeMap[type] || type;
  }
}
