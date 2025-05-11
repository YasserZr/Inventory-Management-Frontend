import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { PurchaseOrder } from '../../../models/purchase-order.model';
import { PurchaseOrderLine } from '../../../models/purchase-order-line.model';
import { Product } from '../../../models/product.model';
import { User } from '../../../models/user.model';
import { SalesOrderService } from '../../../services/sales-order.service';
import { ProductService } from '../../../services/product.service';
import { SupplierService } from '../../../services/supplier.service';
import { finalize, forkJoin } from 'rxjs';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-sales-order-form',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './sales-order-form.component.html',
  styleUrl: './sales-order-form.component.scss'
})
export class SalesOrderFormComponent implements OnInit {
  orderForm!: FormGroup;
  isEditMode = false;
  orderId: string | null = null;
  loading = true;
  submitted = false;
  error: string | null = null;
  
  products: Product[] = [];
  suppliers: User[] = [];
  currentUser: User | null = null;
  
  statusOptions = [
    { value: 'PENDING', label: 'Pending' },
    { value: 'PROCESSING', label: 'Processing' },
    { value: 'SHIPPED', label: 'Shipped' },
    { value: 'DELIVERED', label: 'Delivered' },
    { value: 'CANCELLED', label: 'Cancelled' }
  ];
  
  paymentStatusOptions = [
    { value: 'PENDING', label: 'Pending' },
    { value: 'PAID', label: 'Paid' },
    { value: 'REFUNDED', label: 'Refunded' },
    { value: 'FAILED', label: 'Failed' }
  ];
  
  paymentMethodOptions = [
    { value: 'CREDIT_CARD', label: 'Credit Card' },
    { value: 'DEBIT_CARD', label: 'Debit Card' },
    { value: 'BANK_TRANSFER', label: 'Bank Transfer' },
    { value: 'PAYPAL', label: 'PayPal' },
    { value: 'CASH', label: 'Cash' }
  ];

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private salesOrderService: SalesOrderService,
    private productService: ProductService,
    private supplierService: SupplierService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadInitialData();
  }
  
  loadInitialData(): void {
    this.loading = true;
    
    // Get the current user from AuthService
    this.currentUser = this.authService.getCurrentUser();
    
    // Load products and suppliers simultaneously
    forkJoin({
      products: this.productService.getAllProducts(),
      suppliers: this.supplierService.getSuppliers()
    })
    .pipe(finalize(() => {
      // Check if in edit mode
      this.route.paramMap.subscribe(params => {
        this.orderId = params.get('id');
        
        if (this.orderId) {
          this.isEditMode = true;
          this.loadOrderDetails(this.orderId);
        } else {
          this.loading = false;
        }
      });
    }))
    .subscribe({
      next: (result) => {
        this.products = result.products;
        this.suppliers = result.suppliers;
      },
      error: (error: any) => {
        console.error('Error loading data:', error);
        // Fallback to mock data
        this.products = this.getMockProducts();
        this.suppliers = this.getMockSuppliers();
      }
    });
  }
  
  // Mock data for development/testing purposes
  getMockProducts(): Product[] {
    return [
      { id: 1, name: 'Dell XPS 13', price: 1299.99, stockQuantity: 10 },
      { id: 2, name: 'MacBook Pro', price: 1799.99, stockQuantity: 5 },
      { id: 3, name: 'HP Spectre', price: 1199.99, stockQuantity: 8 }
    ];
  }
  
  getMockSuppliers(): User[] {
    return [
      { id: 1, username: 'dell_supplier', firstname: 'Dell', lastname: 'Inc', email: 'supplier@dell.com', role: 'SUPPLIER' },
      { id: 2, username: 'apple_supplier', firstname: 'Apple', lastname: 'Inc', email: 'supplier@apple.com', role: 'SUPPLIER' },
      { id: 3, username: 'hp_supplier', firstname: 'HP', lastname: 'Inc', email: 'supplier@hp.com', role: 'SUPPLIER' }
    ];
  }
  
  // Initialize form with validation
  private initForm(): void {
    this.orderForm = this.formBuilder.group({
      status: ['PENDING', [Validators.required]],
      orderDate: [this.formatDateForInput(new Date()), [Validators.required]],
      deliveryDate: [''],
      paymentStatus: ['PENDING', [Validators.required]],
      paymentMethod: ['CREDIT_CARD', [Validators.required]],
      shippingAddress: ['', [Validators.required]],
      billingAddress: ['', [Validators.required]],
      notes: [''],
      supplierId: ['', [Validators.required]],
      orderLines: this.formBuilder.array([])
    });
    
    // Add at least one order line by default
    this.addOrderLine();
  }
  
  // Load order details for editing
  private loadOrderDetails(id: string): void {
    this.salesOrderService.getOrder(id).subscribe({
      next: (order) => {
        // Patch the main form values
        this.orderForm.patchValue({
          status: order.status,
          orderDate: order.orderDate ? order.orderDate.split('T')[0] : '',
          deliveryDate: order.deliveryDate ? order.deliveryDate.split('T')[0] : '',
          paymentStatus: order.paymentStatus,
          paymentMethod: order.paymentMethod,
          shippingAddress: order.shippingAddress,
          billingAddress: order.billingAddress,
          notes: order.notes,
          supplierId: order.supplier?.id,
        });
        
        // Clear existing order lines and add ones from the order
        const orderLinesFormArray = this.orderForm.get('orderLines') as FormArray;
        orderLinesFormArray.clear();
        
        if (order.purchaseOrderLines && order.purchaseOrderLines.length > 0) {
          order.purchaseOrderLines.forEach(line => {
            const productPrice = line.product?.price || 0;
            const quantity = line.quantity || 0;
            const calculatedLineTotal = this.calculateLineTotal(productPrice, quantity);
            
            orderLinesFormArray.push(this.formBuilder.group({
              productId: [line.product?.id, [Validators.required]],
              quantity: [quantity, [Validators.required, Validators.min(1)]],
              lineTotal: [calculatedLineTotal]
            }));
          });
        } else {
          // Add a blank line if no lines exist
          this.addOrderLine();
        }
        
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error loading order', error);
        this.error = 'Failed to load order details. Please try again.';
        this.loading = false;
      }
    });
  }
  
  // Form array getter for order lines
  get orderLines(): FormArray {
    return this.orderForm.get('orderLines') as FormArray;
  }
  
  // Form control getter for easier access in template
  get f() {
    return this.orderForm.controls;
  }
  
  // Add a new order line to the form
  addOrderLine(): void {
    this.orderLines.push(this.formBuilder.group({
      productId: ['', [Validators.required]],
      quantity: [1, [Validators.required, Validators.min(1)]],
      lineTotal: [0]
    }));
  }
  
  // Remove an order line from the form
  removeOrderLine(index: number): void {
    if (this.orderLines.length > 1) {
      this.orderLines.removeAt(index);
    } else {
      alert('At least one product is required.');
    }
  }
  
  // Calculate the line total based on product price and quantity
  updateLineTotal(index: number): void {
    const lineGroup = this.orderLines.at(index);
    const productId = lineGroup.get('productId')?.value;
    const quantity = lineGroup.get('quantity')?.value;
    
    if (productId && quantity) {
      const product = this.products.find(p => p.id === parseInt(productId));
      if (product) {
        const lineTotal = this.calculateLineTotal(product.price || 0, quantity);
        lineGroup.get('lineTotal')?.setValue(lineTotal);
      }
    }
  }
  
  calculateLineTotal(price: number, quantity: number): number {
    return price * quantity;
  }
  
  // Calculate the total order amount
  calculateOrderTotal(): number {
    let total = 0;
    for (let i = 0; i < this.orderLines.length; i++) {
      const lineTotal = this.orderLines.at(i).get('lineTotal')?.value || 0;
      total += lineTotal;
    }
    return total;
  }
  
  // Helper to format date for input field
  formatDateForInput(date: Date): string {
    return date.toISOString().split('T')[0];
  }
  
  // Copy shipping address to billing address
  copyAddress(): void {
    const shippingAddress = this.orderForm.get('shippingAddress')?.value;
    this.orderForm.get('billingAddress')?.setValue(shippingAddress);
  }
  
  // Submit form handler
  onSubmit(): void {
    this.submitted = true;
    this.error = null;
    
    if (this.orderForm.invalid) {
      return;
    }
    
    this.loading = true;
    
    // Prepare the order data
    const orderData: PurchaseOrder = {
      status: this.f['status'].value,
      orderDate: this.f['orderDate'].value,
      deliveryDate: this.f['deliveryDate'].value,
      paymentStatus: this.f['paymentStatus'].value,
      paymentMethod: this.f['paymentMethod'].value,
      shippingAddress: this.f['shippingAddress'].value,
      billingAddress: this.f['billingAddress'].value,
      notes: this.f['notes'].value,
      totalAmount: this.calculateOrderTotal(),
      supplier: { id: this.f['supplierId'].value },
      orderedBy: this.currentUser || undefined,
      purchaseOrderLines: this.orderLines.controls.map(control => {
        const productId = control.get('productId')?.value;
        const product = this.products.find(p => p.id === parseInt(productId));
        const quantity = control.get('quantity')?.value || 0;
        const lineTotal = control.get('lineTotal')?.value || 0;
        
        return {
          product: { id: productId },
          quantity: quantity,
          lineTotal: lineTotal,
          priceAtPurchase: product?.price || 0
        };
      })
    };
    
    if (this.isEditMode && this.orderId) {
      this.salesOrderService.updateOrder(this.orderId, orderData)
        .pipe(finalize(() => this.loading = false))
        .subscribe({
          next: () => {
            this.router.navigate(['/sales-orders']);
          },
          error: (error: any) => {
            console.error('Error updating order', error);
            this.error = 'Failed to update order. Please try again.';
          }
        });
    } else {
      this.salesOrderService.createOrder(orderData)
        .pipe(finalize(() => this.loading = false))
        .subscribe({
          next: () => {
            this.router.navigate(['/sales-orders']);
          },
          error: (error: any) => {
            console.error('Error creating order', error);
            this.error = 'Failed to create order. Please try again.';
          }
        });
    }
  }

  // Added getter to match the template's orderLineControls
  get orderLineControls() {
    return this.orderForm.get('orderLines') as FormArray;
  }
  
  // Added method for copy shipping to billing
  copyShippingToBilling() {
    const shippingAddress = this.orderForm.get('shippingAddress')?.value;
    this.orderForm.get('billingAddress')?.setValue(shippingAddress);
  }
  
  // Added method for product selected
  onProductSelected(index: number, event: any) {
    const productId = event.target.value;
    if (productId) {
      const selectedProduct = this.products.find(p => p.id === parseInt(productId));
      if (selectedProduct) {
        const quantity = this.orderLineControls.at(index).get('quantity')?.value || 1;
        const lineTotal = this.calculateLineTotal(selectedProduct.price || 0, quantity);
        this.orderLineControls.at(index).get('lineTotal')?.setValue(lineTotal);
      }
    }
  }
  
  // Renamed to match template
  calculateTotal(): number {
    let total = 0;
    for (let i = 0; i < this.orderLineControls.length; i++) {
      const lineTotal = this.orderLineControls.at(i).get('lineTotal')?.value || 0;
      total += lineTotal;
    }
    return total;
  }
}
