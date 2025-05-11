import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlingService {
  constructor(private router: Router) {}

  /**
   * Handle HTTP errors and return appropriate error messages
   */
  handleError(error: HttpErrorResponse): string {
    if (error.status === 0) {
      // A client-side or network error occurred
      console.error('A network error occurred:', error.error);
      return 'A network error occurred. Please check your connection and try again.';
    } else if (error.status === 401) {
      // Authentication error
      return 'Authentication failed. Please log in again.';
    } else if (error.status === 403) {
      // Forbidden error
      return 'You do not have permission to perform this action.';
    } else if (error.status === 404) {
      // Not found error
      return 'The requested resource was not found.';
    } else if (error.status === 422) {
      // Validation error
      if (error.error?.errors) {
        const errors = error.error.errors;
        return Array.isArray(errors) 
          ? errors.join(', ') 
          : Object.values(errors).join(', ');
      }
      return error.error?.message || 'Validation error occurred. Please check your input.';
    } else if (error.status >= 500) {
      // Server error
      console.error('Server error:', error);
      return 'A server error occurred. Please try again later.';
    } else {
      // Other errors
      console.error('An error occurred:', error);
      return error.error?.message || 'An unexpected error occurred. Please try again.';
    }
  }

  /**
   * Handle errors specific to authentication
   */
  handleAuthError(error: HttpErrorResponse): void {
    if (error.status === 401 || error.status === 403) {
      // Redirect to login page with return URL
      this.router.navigate(['/login'], { 
        queryParams: { returnUrl: this.router.url },
        state: { error: 'Your session has expired. Please log in again.' }
      });
    }
  }
}
