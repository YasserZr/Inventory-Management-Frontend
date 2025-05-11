import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private loadingMap: Map<string, boolean> = new Map<string, boolean>();

  /**
   * Observable that components can subscribe to for loading state changes
   */
  public loading$: Observable<boolean> = this.loadingSubject.asObservable();

  /**
   * Set loading state for a specific task
   * @param loading boolean indicating if task is loading
   * @param taskId unique identifier for the task (optional)
   */
  setLoading(loading: boolean, taskId: string = 'global'): void {
    if (loading) {
      this.loadingMap.set(taskId, true);
      this.loadingSubject.next(true);
    } else {
      this.loadingMap.delete(taskId);
      this.loadingSubject.next(this.loadingMap.size > 0);
    }
  }

  /**
   * Check if any tasks are currently loading
   */
  isLoading(): boolean {
    return this.loadingSubject.value;
  }

  /**
   * Check if a specific task is currently loading
   * @param taskId unique identifier for the task
   */
  isTaskLoading(taskId: string = 'global'): boolean {
    return this.loadingMap.has(taskId);
  }
}
