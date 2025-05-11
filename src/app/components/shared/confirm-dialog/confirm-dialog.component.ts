import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmDialogService } from '../../../services/confirm-dialog.service';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="modal" [class.show]="isOpen" [style.display]="isOpen ? 'block' : 'none'" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ title }}</h5>
            <button type="button" class="btn-close" (click)="onCancel()" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <p>{{ message }}</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" (click)="onCancel()">{{ cancelText }}</button>
            <button type="button" class="btn btn-danger" (click)="onConfirm()">{{ confirmText }}</button>
          </div>
        </div>
      </div>
    </div>
    <div *ngIf="isOpen" class="modal-backdrop fade show"></div>
  `,
  styles: [`
    .modal-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      z-index: 1050;
      width: 100vw;
      height: 100vh;
      background-color: rgba(0, 0, 0, 0.5);
    }
  `]
})
export class ConfirmDialogComponent implements OnInit {
  isOpen: boolean = false;
  title: string = '';
  message: string = '';
  confirmText: string = 'Confirm';
  cancelText: string = 'Cancel';

  constructor(private confirmDialogService: ConfirmDialogService) {}

  ngOnInit(): void {
    this.confirmDialogService.dialogState$.subscribe(state => {
      this.isOpen = state.isOpen;
      this.title = state.title;
      this.message = state.message;
      this.confirmText = state.confirmText;
      this.cancelText = state.cancelText;
    });
  }

  onConfirm(): void {
    this.confirmDialogService.onConfirm();
  }

  onCancel(): void {
    this.confirmDialogService.onCancel();
  }
}
