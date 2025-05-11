import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { ErrorHandlingService } from '../services/error-handling.service';
import { Router } from '@angular/router';

export const AUTH_ERROR_INTERCEPTOR_FN: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const errorHandlingService = inject(ErrorHandlingService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // Handle 401 Unauthorized or 403 Forbidden errors
      if ([401, 403].includes(error.status) && authService.isAuthenticated()) {
        console.log('Authentication error intercepted:', error.status);
        // Auto-logout if 401 or 403 response returned from API
        authService.logout();
        router.navigate(['/login'], {
          queryParams: { returnUrl: router.url },
          state: { error: 'Your session has expired. Please log in again.' }
        });
      }
      
      // For other errors, let the error service handle the error message
      return throwError(() => error);
    })
  );
};
