import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /**
   * Generic GET request
   * @param endpoint API endpoint relative to base URL
   * @param options HTTP options object
   */
  get<T>(endpoint: string, options = {}): Observable<T> {
    return this.http.get<T>(`${this.apiUrl}/${endpoint}`, options);
  }

  /**
   * Generic POST request
   * @param endpoint API endpoint relative to base URL
   * @param data Request body
   * @param options HTTP options object
   */
  post<T>(endpoint: string, data: any, options = {}): Observable<T> {
    return this.http.post<T>(`${this.apiUrl}/${endpoint}`, data, options);
  }

  /**
   * Generic PUT request
   * @param endpoint API endpoint relative to base URL
   * @param data Request body
   * @param options HTTP options object
   */
  put<T>(endpoint: string, data: any, options = {}): Observable<T> {
    return this.http.put<T>(`${this.apiUrl}/${endpoint}`, data, options);
  }

  /**
   * Generic PATCH request
   * @param endpoint API endpoint relative to base URL
   * @param data Request body
   * @param options HTTP options object
   */
  patch<T>(endpoint: string, data: any, options = {}): Observable<T> {
    return this.http.patch<T>(`${this.apiUrl}/${endpoint}`, data, options);
  }

  /**
   * Generic DELETE request
   * @param endpoint API endpoint relative to base URL
   * @param options HTTP options object
   */
  delete<T>(endpoint: string, options = {}): Observable<T> {
    return this.http.delete<T>(`${this.apiUrl}/${endpoint}`, options);
  }
}
