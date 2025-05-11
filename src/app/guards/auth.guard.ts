import { inject } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  // Store the attempted URL for redirecting after login
  router.navigate(['/login'], { 
    queryParams: { returnUrl: state.url }
  });
  
  return false;
};

export const roleGuard = (allowedRoles: string[]) => {
  return (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    const authService = inject(AuthService);
    const router = inject(Router);
    
    if (!authService.isAuthenticated()) {
      router.navigate(['/login'], { 
        queryParams: { returnUrl: state.url }
      });
      return false;
    }
      const user = authService.getCurrentUser();
    
    if (!user) {
      router.navigate(['/login']);
      return false;
    }
    
    if (user.role && allowedRoles.includes(user.role)) {
      return true;
    }
    
    // If user doesn't have required role, redirect to unauthorized page
    router.navigate(['/unauthorized']);
    return false;
  };
};
