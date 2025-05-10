import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { PurchaseOrder } from '../../../models/purchase-order';
import { PurchaseOrderLine } from '../../../models/purchase-order-line';
import { Product } from '../../../models/product';
import { User } from '../../../models/user';
import { SalesOrderService } from '../../../services/sales-order.service';

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
  
  // Mock data (would come from API in a real app)
  products: Product[] = [
    { id: 1, name: 'Dell XPS 13', price: 1299 },
    { id: 2, name: 'MacBook Pro', price: 1799 },
    { id: 3, name: 'HP Spectre', price: 1199 }
  ];
  
  suppliers: User[] = [
    { id: 1, username: 'dell_supplier', firstname: 'Dell', lastname: 'Inc' },
    { id: 2, username: 'apple_supplier', firstname: 'Apple', lastname: 'Inc' },
    { id: 3, username: 'hp_supplier', firstname: 'HP', lastname: 'Inc' }
  ];
  
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
    { value: 'REFUNDED', label: 'Refunded' }
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
    private salesOrderService: SalesOrderService
  ) {}

  ngOnInit(): void {
    this.initForm();
    
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
  
  // Format date to YYYY-MM-DD for input fields
  private formatDateForInput(date: Date): string {
    return date.toISOString().split('T')[0];
  }
  
  // Load order details for editing
  private loadOrderDetails(id: string): void {
    this.salesOrderService.getOrder(id).subscribe({
      next: (order) => {
        // Clear existing order lines
        while (this.orderLineControls.length > 0) {
          this.orderLineControls.removeAt(0);
        }
        
        // Set form values
        this.orderForm.patchValue({
          status: order.status,
          orderDate: order.orderDate ? order.orderDate.split('T')[0] : '',
          deliveryDate: order.deliveryDate ? order.deliveryDate.split('T')[0] : '',
          paymentStatus: order.paymentStatus,
          paymentMethod: order.paymentMethod,
          shippingAddress: order.shippingAddress,
          billingAddress: order.billingAddress,
          notes: order.notes,
          supplierId: order.supplier?.id
        });
          // Add order lines
        if (order.purchaseOrderLines && order.purchaseOrderLines.length > 0) {
          order.purchaseOrderLines.forEach(line => {
            this.orderLineControls.push(
              this.formBuilder.group({
                productId: [line.product?.id, [Validators.required]],
                quantity: [line.quantity, [Validators.required, Validators.min(1)]],
                unitPrice: [line.priceAtPurchase, [Validators.required, Validators.min(0)]]
              })
            );
          });
        } else {
          // Add at least one order line if none exists
          this.addOrderLine();
        }
        
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading order', error);
        this.loading = false;
      }
    });
  }
  
  // Get access to order line controls
  get orderLineControls() {
    return this.orderForm.get('orderLines') as FormArray;
  }
    // Add a new order line
  addOrderLine(): void {
    this.orderLineControls.push(
      this.formBuilder.group({
        productId: ['', [Validators.required]],
        quantity: [1, [Validators.required, Validators.min(1)]],
        unitPrice: [0, [Validators.required, Validators.min(0)]] // We keep 'unitPrice' in the form but map it to 'priceAtPurchase' when saving
      })
    );
  }
  
  // Remove an order line
  removeOrderLine(index: number): void {
    this.orderLineControls.removeAt(index);
  }
    // Auto-fill product price when product is selected
  onProductSelected(index: number, event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const productId = parseInt(selectElement.value);
    const product = this.products.find(p => p.id === productId);
    
    if (product) {
      (this.orderLineControls.at(index) as FormGroup).patchValue({
        unitPrice: product.price // Form control is named 'unitPrice' but will be mapped to 'priceAtPurchase' when saving
      });
    }
  }
  
  // Calculate order total
  calculateTotal(): number {
    let total = 0;
    for (let i = 0; i < this.orderLineControls.length; i++) {
      const line = this.orderLineControls.at(i) as FormGroup;
      const quantity = line.get('quantity')?.value || 0;
      const unitPrice = line.get('unitPrice')?.value || 0;
      total += quantity * unitPrice;
    }
    return total;
  }
  
  // Easy access to form controls
  get f() {
    return this.orderForm.controls;
  }
  
  // Copy shipping address to billing address
  copyShippingToBilling(): void {
    const shippingAddress = this.f['shippingAddress'].value;
    this.orderForm.patchValue({
      billingAddress: shippingAddress
    });
  }
  
  // Submit form handler
  onSubmit(): void {
    this.submitted = true;
    
    if (this.orderForm.invalid) {
      return;
    }
      // Prepare order lines
    const orderLines: PurchaseOrderLine[] = this.orderLineControls.controls.map(control => {
      const line = control as FormGroup;
      return {
        product: { id: line.get('productId')?.value },
        quantity: line.get('quantity')?.value,
        priceAtPurchase: line.get('unitPrice')?.value
      };
    });
    
    // Prepare order data
    const orderData: PurchaseOrder = {
      status: this.f['status'].value,
      totalAmount: this.calculateTotal(),
      orderDate: this.f['orderDate'].value,
      deliveryDate: this.f['deliveryDate'].value,
      paymentStatus: this.f['paymentStatus'].value,
      paymentMethod: this.f['paymentMethod'].value,
      shippingAddress: this.f['shippingAddress'].value,
      billingAddress: this.f['billingAddress'].value,
      notes: this.f['notes'].value,
      supplier: { id: this.f['supplierId'].value },
      purchaseOrderLines: orderLines
    };
    
    if (this.isEditMode && this.orderId) {
      this.salesOrderService.updateOrder(this.orderId, orderData).subscribe({
        next: () => this.router.navigate(['/sales-orders']),
        error: (error) => console.error('Error updating order', error)
      });
    } else {
      this.salesOrderService.createOrder(orderData).subscribe({
        next: () => this.router.navigate(['/sales-orders']),
        error: (error) => console.error('Error creating order', error)
      });
    }
  }
}
