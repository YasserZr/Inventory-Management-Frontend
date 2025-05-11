import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthErrorInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        // Handle 401 Unauthorized or 403 Forbidden errors
        if ([401, 403].includes(error.status) && this.authService.isAuthenticated()) {
          // Auto-logout if 401 or 403 response returned from API
          this.authService.logout();
          this.router.navigate(['/login'], { 
            queryParams: { returnUrl: this.router.url },
            state: { error: 'Your session has expired. Please log in again.' }
          });
        }
        
        return throwError(() => error);
      })
    );
  }
}
