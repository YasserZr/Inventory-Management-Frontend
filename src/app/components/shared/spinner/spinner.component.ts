import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-spinner',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="spinner-container" [class.overlay]="overlay">
      <div class="spinner">
        <div class="spinner-border" 
             [class]="'text-' + color" 
             [style.width]="size + 'rem'" 
             [style.height]="size + 'rem'" 
             role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <div *ngIf="message" class="spinner-message mt-2">
          {{ message }}
        </div>
      </div>
    </div>
  `,
  styles: [`
    .spinner-container {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 1rem;
    }
    
    .spinner-container.overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(255, 255, 255, 0.7);
      z-index: 9999;
    }
    
    .spinner {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    
    .spinner-message {
      font-size: 1rem;
      color: #666;
    }
  `]
})
export class SpinnerComponent {
  @Input() color: 'primary' | 'secondary' | 'danger' | 'warning' | 'info' | 'success' | 'light' | 'dark' = 'primary';
  @Input() size: number = 2; // rem units
  @Input() message: string = '';
  @Input() overlay: boolean = false;
}
