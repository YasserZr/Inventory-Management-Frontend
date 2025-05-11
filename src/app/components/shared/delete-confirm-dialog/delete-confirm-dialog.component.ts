import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

export interface DeleteDialogData {
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
}

@Component({
  selector: 'app-delete-confirm-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  template: `
    <div class="delete-dialog">
      <h2 mat-dialog-title>{{ data.title }}</h2>
      <mat-dialog-content>
        <p>{{ data.message }}</p>
      </mat-dialog-content>
      <mat-dialog-actions align="end">
        <button mat-button (click)="onNoClick()">{{ data.cancelText }}</button>
        <button mat-button color="warn" [mat-dialog-close]="true">{{ data.confirmText }}</button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .delete-dialog {
      min-width: 300px;
      padding: 10px;
    }
  `]
})
export class DeleteConfirmDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<DeleteConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DeleteDialogData
  ) {}

  onNoClick(): void {
    this.dialogRef.close(false);
  }
}
