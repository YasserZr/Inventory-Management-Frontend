import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { finalize, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { Product } from '../../../models/product.model';
import { Category } from '../../../models/category.model';
import { User } from '../../../models/user.model';
import { ProductService } from '../../../services/product.service';
import { CategoryService } from '../../../services/category.service';
import { SupplierService } from '../../../services/supplier.service';
import { UserService } from '../../../services/user.service';

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
  error: string | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private categoryService: CategoryService,
    private supplierService: SupplierService,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.loadCategories();
    this.loadSuppliers();
    
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

  loadCategories(): void {
    this.categoryService.getAllCategories().subscribe({
      next: (data) => {
        this.categories = data;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        this.error = 'Failed to load categories. Please try again.';
        // You might want to add fallback mock data for development
        this.categories = this.getMockCategories();
      }
    });
  }
  loadSuppliers(): void {
    // First try to get users with SUPPLIER role
    this.userService.getUsersByRole('SUPPLIER')
      .pipe(
        catchError(error => {
          console.error('Error loading suppliers by role:', error);
          // If the specific role endpoint isn't available, fall back to getting all users
          return this.userService.getAllUsers().pipe(
            // Filter users with SUPPLIER role
            catchError(err => {
              console.error('Error loading all users:', err);
              // If that fails too, fall back to supplier service
              return this.supplierService.getSuppliers();
            })
          );
        })
      )
      .subscribe({
        next: (data) => {
          // If using getAllUsers, filter for suppliers
          if (data && data.length > 0) {
            // Check if data came from getAllUsers by checking if we need to filter it
            if (data.some(user => user.role !== 'SUPPLIER')) {
              this.suppliers = data.filter(user => user.role === 'SUPPLIER');
              console.log('Filtered users with SUPPLIER role:', this.suppliers);
            } else {
              this.suppliers = data;
              console.log('Loaded suppliers directly:', this.suppliers);
            }
          } else {
            console.warn('No suppliers found in the system');
            this.suppliers = [];
          }
        },
        error: (error) => {
          console.error('All supplier loading methods failed:', error);
          this.error = 'Failed to load suppliers. Please try again or contact support.';
          // Use fallback mock data for development
          this.suppliers = this.getMockSuppliers();
        }
      });
  }

  loadProduct(id: number) {
    this.loading = true;
    
    this.productService.getProduct(id.toString())
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (product) => {
          if (product) {
            // Set form values
            this.productForm.patchValue({
              name: product.name,
              description: product.description,
              price: product.price,
              stockQuantity: product.stockQuantity,
              status: product.status || 'ACTIVE',
              categoryId: product.category?.categoryId,
              supplierId: product.supplier?.id
            });
          } else {
            this.error = 'Product not found';
            setTimeout(() => this.router.navigate(['/products']), 3000);
          }
        },
        error: (error) => {
          console.error('Error loading product:', error);
          this.error = 'Failed to load product details. Please try again.';
        }
      });
  }

  // Mock data for development/fallback
  getMockCategories(): Category[] {
    return [
      { categoryId: 1, name: 'Electronics' },
      { categoryId: 2, name: 'Footwear' },
      { categoryId: 3, name: 'Clothing' },
      { categoryId: 4, name: 'Home & Kitchen' },
      { categoryId: 5, name: 'Books' }
    ];
  }
  // Mock data for development/fallback
  getMockSuppliers(): User[] {
    return [
      { 
        id: 1, 
        username: 'dell_supplier', 
        firstname: 'Dell', 
        lastname: 'Inc.', 
        email: 'supplier@dell.com', 
        companyEmail: 'corporate@dell.com',
        companyContactNumber: '+1-800-624-9897',
        workAddress: '1 Dell Way, Round Rock, TX 78682',
        role: 'SUPPLIER' 
      },
      { 
        id: 2, 
        username: 'apple_supplier', 
        firstname: 'Apple', 
        lastname: 'Inc.', 
        email: 'supplier@apple.com', 
        companyEmail: 'sales@apple.com',
        companyContactNumber: '+1-800-275-2273',
        workAddress: 'One Apple Park Way, Cupertino, CA 95014',
        role: 'SUPPLIER' 
      },
      { 
        id: 3, 
        username: 'samsung_supplier', 
        firstname: 'Samsung', 
        lastname: 'Electronics', 
        email: 'supplier@samsung.com', 
        companyEmail: 'b2b@samsung.com',
        companyContactNumber: '+82-2-2255-0114',
        workAddress: '129 Samsung-ro, Yeongtong-gu, Suwon-si, Gyeonggi-do, South Korea',
        role: 'SUPPLIER' 
      },
      { 
        id: 4, 
        username: 'sony_supplier', 
        firstname: 'Sony', 
        lastname: 'Interactive', 
        email: 'supplier@sony.com', 
        companyEmail: 'corporate@sony.com',
        companyContactNumber: '+81-3-6748-2111',
        workAddress: '1-7-1 Konan, Minato-ku, Tokyo 108-0075, Japan',
        role: 'SUPPLIER' 
      },
      { 
        id: 5, 
        username: 'nike_supplier', 
        firstname: 'Nike', 
        lastname: 'Inc.', 
        email: 'supplier@nike.com', 
        companyEmail: 'wholesale@nike.com',
        companyContactNumber: '+1-800-806-6453',
        workAddress: 'One Bowerman Drive, Beaverton, OR 97005',
        role: 'SUPPLIER' 
      }
    ];
  }

  onSubmit() {
    this.submitted = true;

    // Check form validity
    if (this.productForm.invalid) {
      // Highlight all invalid fields
      Object.keys(this.productForm.controls).forEach(key => {
        const control = this.productForm.get(key);
        if (control && control.invalid) {
          control.markAsTouched();
        }
      });
      return;
    }

    this.submitting = true;
    this.error = null;

    // Prepare product data
    const formValues = this.productForm.value;
    
    // Create product object
    const productData: Product = {
      id: this.isEditMode ? this.productId : undefined,
      name: formValues.name,
      description: formValues.description,
      price: formValues.price,
      stockQuantity: formValues.stockQuantity,
      status: formValues.status,
    };

    // Add category if selected
    if (formValues.categoryId) {
      const category = this.categories.find(c => c.categoryId === +formValues.categoryId);
      if (category) {
        productData.category = category;
      }
    }
    
    // Add supplier if selected 
    if (formValues.supplierId) {
      const supplier = this.suppliers.find(s => s.id === +formValues.supplierId);
      if (supplier) {
        productData.supplier = supplier;
        console.log('Selected supplier:', supplier);
      } else {
        console.warn('Selected supplier ID exists but supplier not found in suppliers array');
      }
    } else {
      console.log('No supplier selected');
    }

    console.log('Submitting product data:', productData);

    // Call the appropriate service method based on whether it's an edit or create
    const request = this.isEditMode 
      ? this.productService.updateProduct(this.productId!.toString(), productData)
      : this.productService.createProduct(productData);

    request.pipe(finalize(() => this.submitting = false))
      .subscribe({
        next: (result) => {
          console.log('Product saved successfully:', result);
          // Navigate back to products on success
          this.router.navigate(['/products']);
        },
        error: (error) => {
          console.error('Error saving product:', error);
          if (error.status === 400) {
            this.error = 'Invalid product data. Please check all fields and try again.';
          } else if (error.status === 403) {
            this.error = 'You do not have permission to save this product.';
          } else if (error.status === 404 && this.isEditMode) {
            this.error = 'The product you are trying to update could not be found.';
          } else {
            this.error = 'Failed to save product. Please try again or contact support.';
          }
        }
      });
  }

  cancel() {
    this.router.navigate(['/products']);
  }
}
