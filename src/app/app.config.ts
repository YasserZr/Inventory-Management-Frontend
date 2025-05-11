import { ApplicationConfig, provideZoneChangeDetection, importProvidersFrom, ErrorHandler } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { authInterceptor } from './interceptors/auth.interceptor';

// A custom error handler for additional error logging
import { Injectable } from '@angular/core';

@Injectable()
class GlobalErrorHandler implements ErrorHandler {
  handleError(error: any): void {
    console.error('Global error caught:', error);
    // Here you can add additional error reporting logic
    // like sending errors to a monitoring service
  }
}

import { AUTH_ERROR_INTERCEPTOR_FN } from './interceptors/auth-error-fn';
import { LOADING_INTERCEPTOR_FN } from './interceptors/loading.interceptor';

export const appConfig: ApplicationConfig = {  
  providers: [
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes), 
    provideClientHydration(withEventReplay()),
    provideAnimations(),
    provideHttpClient(
      withFetch(), 
      withInterceptors([
        authInterceptor, 
        AUTH_ERROR_INTERCEPTOR_FN,
        LOADING_INTERCEPTOR_FN
      ])
    )
  ]
};
