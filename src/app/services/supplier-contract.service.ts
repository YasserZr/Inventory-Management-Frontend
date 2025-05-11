import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SupplierContract } from '../models/supplier-contract.model';
import { environment } from '../../environments/environment';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class SupplierContractService {
  private apiUrl = `${environment.apiUrl}/api/contracts`;

  constructor(private http: HttpClient) {}

  getAllContracts(): Observable<SupplierContract[]> {
    return this.http.get<SupplierContract[]>(this.apiUrl);
  }

  getContractById(id: string): Observable<SupplierContract> {
    return this.http.get<SupplierContract>(`${this.apiUrl}/${id}`);
  }

  getContractsByUser(userId: string): Observable<SupplierContract[]> {
    return this.http.get<SupplierContract[]>(`${this.apiUrl}/user/${userId}`);
  }

  getContractsBySupplier(supplierId: string): Observable<SupplierContract[]> {
    return this.http.get<SupplierContract[]>(`${this.apiUrl}/supplier/${supplierId}`);
  }

  getActiveContractsByUser(userId: string): Observable<SupplierContract[]> {
    return this.http.get<SupplierContract[]>(`${this.apiUrl}/active/user/${userId}`);
  }

  createContract(contract: SupplierContract): Observable<SupplierContract> {
    return this.http.post<SupplierContract>(this.apiUrl, contract);
  }

  updateContract(id: string, contract: SupplierContract): Observable<SupplierContract> {
    return this.http.put<SupplierContract>(`${this.apiUrl}/${id}`, contract);
  }

  deleteContract(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
