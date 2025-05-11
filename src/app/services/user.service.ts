import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private endpoint = 'api/users';

  constructor(private apiService: ApiService) {}

  /**
   * Get the current user's profile
   */
  getCurrentUserProfile(): Observable<User> {
    return this.apiService.get<User>(`${this.endpoint}/profile`);
  }

  /**
   * Update the current user's profile
   */
  updateProfile(userData: Partial<User>): Observable<User> {
    return this.apiService.put<User>(`${this.endpoint}/profile`, userData);
  }

  /**
   * Change the user's password
   */
  changePassword(currentPassword: string, newPassword: string): Observable<any> {
    return this.apiService.post<any>(`${this.endpoint}/change-password`, {
      currentPassword,
      newPassword
    });
  }

  /**
   * Get all users (admin only)
   */
  getAllUsers(): Observable<User[]> {
    return this.apiService.get<User[]>(this.endpoint);
  }

  /**
   * Get user by ID (admin only)
   */
  getUserById(id: number): Observable<User> {
    return this.apiService.get<User>(`${this.endpoint}/${id}`);
  }

  /**
   * Get user by username
   */
  getUserByUsername(username: string): Observable<User> {
    return this.apiService.get<User>(`${this.endpoint}/username/${username}`);
  }

  /**
   * Search users by name
   */
  searchUsers(query: string): Observable<User[]> {
    return this.apiService.get<User[]>(`${this.endpoint}/search?name=${query}`);
  }

  /**
   * Create a new user (admin only)
   */
  createUser(user: Partial<User>): Observable<User> {
    return this.apiService.post<User>(this.endpoint, user);
  }

  /**
   * Update a user (admin only)
   */
  updateUser(id: number, user: Partial<User>): Observable<User> {
    return this.apiService.put<User>(`${this.endpoint}/${id}`, user);
  }

  /**
   * Delete a user (admin only)
   */
  deleteUser(id: number): Observable<void> {
    return this.apiService.delete<void>(`${this.endpoint}/${id}`);
  }
}
