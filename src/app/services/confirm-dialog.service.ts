import { Injectable, TemplateRef } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

interface DialogOptions {
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  isOpen: boolean;
  confirmCallback?: () => void;
  cancelCallback?: () => void;
}

@Injectable({
  providedIn: 'root'
})
export class ConfirmDialogService {
  private dialogState = new BehaviorSubject<DialogOptions>({
    title: '',
    message: '',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    isOpen: false
  });

  dialogState$ = this.dialogState.asObservable();

  constructor() {}

  confirm(options: {
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    confirmCallback?: () => void;
    cancelCallback?: () => void;
  }): void {
    this.dialogState.next({
      ...options,
      confirmText: options.confirmText || 'Confirm',
      cancelText: options.cancelText || 'Cancel',
      isOpen: true
    });
  }

  onConfirm(): void {
    const currentDialog = this.dialogState.value;
    if (currentDialog.confirmCallback) {
      currentDialog.confirmCallback();
    }
    this.closeDialog();
  }

  onCancel(): void {
    const currentDialog = this.dialogState.value;
    if (currentDialog.cancelCallback) {
      currentDialog.cancelCallback();
    }
    this.closeDialog();
  }

  private closeDialog(): void {
    this.dialogState.next({
      ...this.dialogState.value,
      isOpen: false
    });
  }
}
