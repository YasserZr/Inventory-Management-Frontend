import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Product } from '../../../models/product.model';
import { Category } from '../../../models/category.model';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.scss'
})
export class ProductFormComponent implements OnInit {
  productForm!: FormGroup;
  isEditMode: boolean = false;
  loading: boolean = false;
  submitting: boolean = false;
  submitted: boolean = false;
  productId?: number;
  categories: Category[] = [];
  suppliers: User[] = [];

  // Mock data for demonstration
  mockProducts: Product[] = [
    {
      id: 1,
      name: 'Laptop Dell XPS 13',
      description: 'High-performance laptop with InfinityEdge display',
      price: 1299.99,
      stockQuantity: 15,
      status: 'ACTIVE',
      category: { categoryId: 1, name: 'Electronics' },
      supplier: { id: 1, firstname: 'Dell', lastname: 'Inc.', email: 'supplier@dell.com', role: 'SUPPLIER' },
      createdAt: '2025-04-15T10:30:00',
      updatedAt: '2025-05-01T14:22:00'
    },
    {
      id: 2,
      name: 'iPhone 15 Pro',
      description: 'Latest Apple smartphone with advanced camera system',
      price: 999.99,
      stockQuantity: 8,
      status: 'ACTIVE',
      category: { categoryId: 1, name: 'Electronics' },
      supplier: { id: 2, firstname: 'Apple', lastname: 'Inc.', email: 'supplier@apple.com', role: 'SUPPLIER' },
      createdAt: '2025-04-18T09:15:00',
      updatedAt: '2025-05-02T11:45:00'
    }
  ];

  mockCategories: Category[] = [
    { categoryId: 1, name: 'Electronics' },
    { categoryId: 2, name: 'Footwear' },
    { categoryId: 3, name: 'Clothing' },
    { categoryId: 4, name: 'Home & Kitchen' },
    { categoryId: 5, name: 'Books' }
  ];

  mockSuppliers: User[] = [
    { id: 1, firstname: 'Dell', lastname: 'Inc.', email: 'supplier@dell.com', role: 'SUPPLIER' },
    { id: 2, firstname: 'Apple', lastname: 'Inc.', email: 'supplier@apple.com', role: 'SUPPLIER' },
    { id: 3, firstname: 'Samsung', lastname: 'Electronics', email: 'supplier@samsung.com', role: 'SUPPLIER' },
    { id: 4, firstname: 'Sony', lastname: 'Interactive', email: 'supplier@sony.com', role: 'SUPPLIER' },
    { id: 5, firstname: 'Nike', lastname: 'Inc.', email: 'supplier@nike.com', role: 'SUPPLIER' }
  ];

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initForm();
    
    // Get categories and suppliers
    this.categories = this.mockCategories;
    this.suppliers = this.mockSuppliers;
    
    // Check if edit mode
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isEditMode = true;
        this.productId = +id;
        this.loadProduct(this.productId);
      } else {
        this.loading = false;
      }
    });
  }

  // Getter for easy access to form controls
  get f() { 
    return this.productForm.controls; 
  }

  initForm() {
    this.productForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      description: [''],
      price: [null, [Validators.required, Validators.min(0)]],
      stockQuantity: [null, [Validators.required, Validators.min(0)]],
      status: ['ACTIVE'],
      categoryId: [null],
      supplierId: [null]
    });
  }

  loadProduct(id: number) {
    this.loading = true;
    
    // Simulate API call
    setTimeout(() => {
      const product = this.mockProducts.find(p => p.id === id);
      
      if (product) {
        // Set form values
        this.productForm.patchValue({
          name: product.name,
          description: product.description,
          price: product.price,
          stockQuantity: product.stockQuantity,
          status: product.status,
          categoryId: product.category?.categoryId,
          supplierId: product.supplier?.id
        });
      }
      
      this.loading = false;
    }, 1000);
  }

  onSubmit() {
    this.submitted = true;

    // Check form validity
    if (this.productForm.invalid) {
      return;
    }

    this.submitting = true;

    // Prepare product data
    const productData = {
      ...this.productForm.value,
      id: this.isEditMode ? this.productId : undefined
    };

    // Convert IDs to objects
    if (productData.categoryId) {
      productData.category = this.categories.find(c => c.categoryId === +productData.categoryId);
      delete productData.categoryId;
    }
    
    if (productData.supplierId) {
      productData.supplier = this.suppliers.find(s => s.id === +productData.supplierId);
      delete productData.supplierId;
    }

    console.log('Product data:', productData);

    // Simulate API call
    setTimeout(() => {
      // In a real app, would call service to save to API
      this.submitting = false;
      
      // Navigate back to products
      this.router.navigate(['/products']);
    }, 1500);
  }

  cancel() {
    this.router.navigate(['/products']);
  }
}
