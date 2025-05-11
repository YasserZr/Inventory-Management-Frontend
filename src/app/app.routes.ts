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
import { ContractFormComponent } from './components/suppliers/contract-form/contract-form.component';
import { OfferListComponent } from './components/offers/offer-list/offer-list.component';
import { OfferDetailComponent } from './components/offers/offer-detail/offer-detail.component';
import { OfferFormComponent } from './components/offers/offer-form/offer-form.component';
import { ReportingDashboardComponent } from './components/reporting/reporting-dashboard/reporting-dashboard.component';

import { LoginComponent } from './components/auth/login.component';
import { RegisterComponent } from './components/auth/register.component';
import { HomeComponent } from './components/home/home.component';
import { UserProfileComponent } from './components/user/user-profile/user-profile.component';
import { UnauthorizedComponent } from './components/shared/unauthorized/unauthorized.component';
import { authGuard, roleGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },  // Public routes (no authentication required)
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'unauthorized', component: UnauthorizedComponent },
  
  // User routes
  { path: 'profile', component: UserProfileComponent, canActivate: [authGuard] },  // Protected routes (authentication required)
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },  // Product routes - Accessible by all authenticated users
  { path: 'products', component: ProductListComponent, canActivate: [authGuard] },
  // Product management - Admin only
  { path: 'products/new', component: ProductFormComponent, canActivate: [roleGuard(['ADMIN'])] },
  { path: 'products/:id/edit', component: ProductFormComponent, canActivate: [roleGuard(['ADMIN'])] },
  { path: 'products/:id', component: ProductDetailComponent, canActivate: [authGuard] },
  
  // Sales Order routes - USER and ADMIN roles
  { path: 'sales-orders', component: SalesOrderListComponent, canActivate: [roleGuard(['USER', 'ADMIN'])] },
  { path: 'sales-orders/new', component: SalesOrderFormComponent, canActivate: [roleGuard(['USER', 'ADMIN'])] },
  { path: 'sales-orders/:id', component: SalesOrderDetailComponent, canActivate: [roleGuard(['USER', 'ADMIN'])] },
  { path: 'sales-orders/:id/edit', component: SalesOrderFormComponent, canActivate: [roleGuard(['USER', 'ADMIN'])] },
  // Supplier routes - Admin can access all, Suppliers can access their own
  { path: 'suppliers', component: SupplierListComponent, canActivate: [roleGuard(['ADMIN', 'USER'])] },
  { path: 'suppliers/contracts/new', component: ContractFormComponent, canActivate: [roleGuard(['ADMIN', 'USER'])] },
  { path: 'suppliers/contracts/:id', component: ContractFormComponent, canActivate: [roleGuard(['ADMIN', 'USER'])] },
  { path: 'suppliers/new', component: SupplierFormComponent, canActivate: [roleGuard(['ADMIN'])] },
  { path: 'suppliers/:id/edit', component: SupplierFormComponent, canActivate: [roleGuard(['ADMIN', 'SUPPLIER'])] },
  { path: 'suppliers/:id', component: SupplierDetailComponent, canActivate: [authGuard] },
  
  // Offer routes - Suppliers can create/edit offers, Users and Admin can view
  { path: 'offers', component: OfferListComponent, canActivate: [authGuard] },
  { path: 'offers/:id', component: OfferDetailComponent, canActivate: [authGuard] },
  { path: 'offers/new', component: OfferFormComponent, canActivate: [roleGuard(['SUPPLIER', 'ADMIN'])] },
  { path: 'offers/:id/edit', component: OfferFormComponent, canActivate: [roleGuard(['SUPPLIER', 'ADMIN'])] },
  
  // Reporting routes - Admin only
  { path: 'reporting', component: ReportingDashboardComponent, canActivate: [roleGuard(['ADMIN'])] },
  
  // User profile - Any authenticated user can access their profile
  { path: 'profile', component: UserProfileComponent, canActivate: [authGuard] },
  // Fallback route - Redirect to login if not logged in, otherwise to dashboard
  { path: '**', redirectTo: '/login' }
];
