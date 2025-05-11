import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { Product } from '../../../models/product.model';
import { Category } from '../../../models/category.model';
import { User } from '../../../models/user.model';
import { ProductService } from '../../../services/product.service';
import { CategoryService } from '../../../services/category.service';
import { SupplierService } from '../../../services/supplier.service';

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
    private supplierService: SupplierService
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
    this.supplierService.getSuppliers().subscribe({
      next: (data) => {
        this.suppliers = data;
      },
      error: (error) => {
        console.error('Error loading suppliers:', error);
        this.error = 'Failed to load suppliers. Please try again.';
        // You might want to add fallback mock data for development
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
              status: product.status,
              categoryId: product.category?.categoryId,
              supplierId: product.supplier?.id
            });
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
      { id: 1, username: 'dell_supplier', firstname: 'Dell', lastname: 'Inc.', email: 'supplier@dell.com', role: 'SUPPLIER' },
      { id: 2, username: 'apple_supplier', firstname: 'Apple', lastname: 'Inc.', email: 'supplier@apple.com', role: 'SUPPLIER' },
      { id: 3, username: 'samsung_supplier', firstname: 'Samsung', lastname: 'Electronics', email: 'supplier@samsung.com', role: 'SUPPLIER' },
      { id: 4, username: 'sony_supplier', firstname: 'Sony', lastname: 'Interactive', email: 'supplier@sony.com', role: 'SUPPLIER' },
      { id: 5, username: 'nike_supplier', firstname: 'Nike', lastname: 'Inc.', email: 'supplier@nike.com', role: 'SUPPLIER' }
    ];
  }

  onSubmit() {
    this.submitted = true;

    // Check form validity
    if (this.productForm.invalid) {
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

    // Add category and supplier if selected
    if (formValues.categoryId) {
      const category = this.categories.find(c => c.categoryId === +formValues.categoryId);
      if (category) {
        productData.category = category;
      }
    }
    
    if (formValues.supplierId) {
      const supplier = this.suppliers.find(s => s.id === +formValues.supplierId);
      if (supplier) {
        productData.supplier = supplier;
      }
    }

    // Call the appropriate service method based on whether it's an edit or create
    const request = this.isEditMode 
      ? this.productService.updateProduct(this.productId!.toString(), productData)
      : this.productService.createProduct(productData);

    request.pipe(finalize(() => this.submitting = false))
      .subscribe({
        next: () => {
          // Navigate back to products on success
          this.router.navigate(['/products']);
        },
        error: (error) => {
          console.error('Error saving product:', error);
          this.error = 'Failed to save product. Please try again.';
        }
      });
  }

  cancel() {
    this.router.navigate(['/products']);
  }
}
