import { HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { finalize } from 'rxjs/operators';
import { inject } from '@angular/core';
import { LoadingService } from '../services/loading.service';

export const LOADING_INTERCEPTOR_FN: HttpInterceptorFn = (req, next) => {
  const loadingService = inject(LoadingService);
  const taskId = getTaskIdFromRequest(req);
  
  // Start loading
  loadingService.setLoading(true, taskId);
  
  return next(req).pipe(
    finalize(() => {
      // Stop loading when request completes (whether success or error)
      loadingService.setLoading(false, taskId);
    })
  );
};

/**
 * Generate a unique task ID for a request to track loading state
 */
function getTaskIdFromRequest(request: HttpRequest<any>): string {
  // Create a unique task ID based on the request method and URL
  return `${request.method}-${request.urlWithParams}`;
}
