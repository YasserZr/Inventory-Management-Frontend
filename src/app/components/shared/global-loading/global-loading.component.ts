import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingService } from '../../../services/loading.service';
import { SpinnerComponent } from '../spinner/spinner.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-global-loading',
  standalone: true,
  imports: [CommonModule, SpinnerComponent],
  template: `
    <app-spinner 
      *ngIf="isLoading" 
      [overlay]="true" 
      [color]="'primary'" 
      [size]="3"
      [message]="'Loading...'"
    ></app-spinner>
  `,
  styles: []
})
export class GlobalLoadingComponent implements OnInit, OnDestroy {
  isLoading = false;
  private loadingSubscription!: Subscription;

  constructor(private loadingService: LoadingService) {}

  ngOnInit(): void {
    this.loadingSubscription = this.loadingService.loading$.subscribe(
      (isLoading) => {
        // Add a small delay to prevent flickering for quick requests
        if (isLoading) {
          setTimeout(() => {
            if (this.loadingService.isLoading()) {
              this.isLoading = true;
            }
          }, 200);
        } else {
          this.isLoading = false;
        }
      }
    );
  }

  ngOnDestroy(): void {
    if (this.loadingSubscription) {
      this.loadingSubscription.unsubscribe();
    }
  }
}
