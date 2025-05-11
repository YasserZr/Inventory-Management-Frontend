import { Component, OnInit, ErrorHandler, Injectable } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { GlobalLoadingComponent } from './components/shared/global-loading/global-loading.component';
import { ConfirmDialogComponent } from './components/shared/confirm-dialog/confirm-dialog.component';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  handleError(error: any): void {
    console.error('Global error handler caught an error:', error);
  }
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, GlobalLoadingComponent, ConfirmDialogComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [
    { provide: ErrorHandler, useClass: GlobalErrorHandler }
  ]
})
export class AppComponent implements OnInit {
  title = 'inventory-management-frontend';
  
  ngOnInit(): void {
    console.log('Application initialized');
  }
}
