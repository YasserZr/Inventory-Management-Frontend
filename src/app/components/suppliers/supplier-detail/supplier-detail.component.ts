import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { User } from '../../../models/user';

@Component({
  selector: 'app-supplier-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './supplier-detail.component.html',
  styleUrl: './supplier-detail.component.scss'
})
export class SupplierDetailComponent implements OnInit {
  supplierId: string | null = null;
  supplier: User | null = null;
  
  constructor(
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    console.log('SupplierDetailComponent initialized');
    // Show an alert for debugging
    alert('SupplierDetailComponent loaded!');
    
    this.supplierId = this.route.snapshot.paramMap.get('id');
    if (this.supplierId) {
      // Mock data for debugging
      this.supplier = {
        id: parseInt(this.supplierId),
        username: 'dell_supplier',
        email: 'supplier@dell.com',
        firstname: 'Dell',
        lastname: 'Computers'
      };
    }
  }
    // Helper methods removed for debugging
}
