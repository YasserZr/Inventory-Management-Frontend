import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ProductListComponent } from './components/products/product-list/product-list.component';
import { ProductDetailComponent } from './components/products/product-detail/product-detail.component';
import { ProductFormComponent } from './components/products/product-form/product-form.component';
import { SalesOrderListComponent } from './components/sales-orders/sales-order-list/sales-order-list.component';
import { SalesOrderDetailComponent } from './components/sales-orders/sales-order-detail/sales-order-detail.component';
import { SalesOrderFormComponent } from './components/sales-orders/sales-order-form/sales-order-form.component';
import { SupplierListComponent } from './components/suppliers/supplier-list/supplier-list.component';
import { SupplierDetailComponent } from './components/suppliers/supplier-detail/supplier-detail.component';
import { SupplierFormComponent } from './components/suppliers/supplier-form/supplier-form.component';
import { OfferListComponent } from './components/offers/offer-list/offer-list.component';
import { OfferDetailComponent } from './components/offers/offer-detail/offer-detail.component';
import { OfferFormComponent } from './components/offers/offer-form/offer-form.component';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  // Product routes
  { path: 'products', component: ProductListComponent },
  { path: 'products/new', component: ProductFormComponent },
  { path: 'products/:id', component: ProductDetailComponent },
  { path: 'products/:id/edit', component: ProductFormComponent },
  // Sales Order routes
  { path: 'sales-orders', component: SalesOrderListComponent },
  { path: 'sales-orders/new', component: SalesOrderFormComponent },
  { path: 'sales-orders/:id', component: SalesOrderDetailComponent },
  { path: 'sales-orders/:id/edit', component: SalesOrderFormComponent },
  // Supplier routes
  { path: 'suppliers', component: SupplierListComponent },
  { path: 'suppliers/new', component: SupplierFormComponent },
  { path: 'suppliers/:id', component: SupplierDetailComponent },
  { path: 'suppliers/:id/edit', component: SupplierFormComponent },
  // Offer routes
  { path: 'offers', component: OfferListComponent },
  { path: 'offers/new', component: OfferFormComponent },
  { path: 'offers/:id', component: OfferDetailComponent },
  { path: 'offers/:id/edit', component: OfferFormComponent },
  { path: '**', redirectTo: '/dashboard' } // Redirect any unknown routes to dashboard
];
