import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BaseChartDirective, provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';
import { ReportingService, KpiData, ChartData, RecentOrder } from '../../../services/reporting.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-reporting-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, BaseChartDirective, HttpClientModule],
  providers: [provideCharts(withDefaultRegisterables())],
  templateUrl: './reporting-dashboard.component.html',
  styleUrl: './reporting-dashboard.component.scss'
})
export class ReportingDashboardComponent implements OnInit {
  // Expose Math to template
  Math = Math;
  
  // Time period filters
  selectedTimePeriod: string = 'month';
  dateRange: { start: Date, end: Date } = {
    start: new Date(new Date().setMonth(new Date().getMonth() - 1)),
    end: new Date()
  };
  
  // Helper methods for null safety
  getRevenueChange(): number {
    return this.kpiData.previousPeriodRevenueChange ?? 0;
  }

  getOrderCountChange(): number {
    return this.kpiData.previousPeriodOrderCountChange ?? 0;
  }

  getAOVChange(): number {
    return this.kpiData.previousPeriodAOVChange ?? 0;
  }
  
  // Sales data
  salesChartData: ChartConfiguration['data'] = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Sales Revenue ($)',
        backgroundColor: 'rgba(63, 81, 181, 0.5)',
        borderColor: 'rgb(63, 81, 181)',
        pointBackgroundColor: 'rgb(63, 81, 181)',
      }
    ]
  };
  salesChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true
      }
    }
  };
  
  // Product distribution data
  productPieChartData: ChartConfiguration['data'] = {
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: [
          'rgba(63, 81, 181, 0.7)',
          'rgba(77, 182, 172, 0.7)',
          'rgba(66, 165, 245, 0.7)',
          'rgba(156, 39, 176, 0.7)',
          'rgba(255, 152, 0, 0.7)'
        ]
      }
    ]
  };
  
  // Supplier performance data
  supplierBarChartData: ChartConfiguration['data'] = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'On-Time Delivery (%)',
        backgroundColor: 'rgba(77, 182, 172, 0.7)'
      },
      {
        data: [],
        label: 'Quality Rating (%)',
        backgroundColor: 'rgba(66, 165, 245, 0.7)'
      }
    ]
  };
    // KPI data
  kpiData: KpiData = {
    totalRevenue: 0,
    orderCount: 0,
    averageOrderValue: 0,
    topSellingProduct: '',
    returnRate: 0,
    customerSatisfaction: 0,
    previousPeriodRevenueChange: 0,
    previousPeriodOrderCountChange: 0, 
    previousPeriodAOVChange: 0
  };
  
  // Recent orders
  recentOrders: RecentOrder[] = [];
  
  // Chart loading states
  chartsLoading = {
    sales: true,
    products: true,
    suppliers: true
  };
  
  // For dynamic data loading
  isLoading = true;
  
  constructor(private reportingService: ReportingService) {}
  
  loadDashboardData(): void {
    this.isLoading = true;
    
    // Load KPI data
    this.reportingService.getKpiData(this.selectedTimePeriod).subscribe(data => {
      this.kpiData = data;
    });
    
    // Load chart data
    this.updateChartsBasedOnTimePeriod();
    
    // Load recent orders
    this.reportingService.getRecentOrders(5).subscribe(orders => {
      this.recentOrders = orders;
      this.isLoading = false;
    });
  }
  
  ngOnInit(): void {
    this.loadDashboardData();
  }
  
  updateChartsBasedOnTimePeriod(): void {
    // Load sales chart data
    this.chartsLoading.sales = true;
    this.reportingService.getSalesChartData(this.selectedTimePeriod).subscribe(data => {
      this.salesChartData.labels = data.labels;
      this.salesChartData.datasets[0].data = data.datasets[0].data;
      this.chartsLoading.sales = false;
    });
    
    // Load product distribution data
    this.chartsLoading.products = true;
    this.reportingService.getProductCategoryDistribution().subscribe(data => {
      this.productPieChartData.labels = data.labels;
      this.productPieChartData.datasets[0].data = data.data;
      this.chartsLoading.products = false;
    });
    
    // Load supplier performance data
    this.chartsLoading.suppliers = true;
    this.reportingService.getSupplierPerformance().subscribe(data => {
      this.supplierBarChartData.labels = data.labels;
      this.supplierBarChartData.datasets[0].data = data.onTimeDelivery;
      this.supplierBarChartData.datasets[1].data = data.qualityRating;
      this.chartsLoading.suppliers = false;
    });
  }
  
  formatDateForInput(date: Date): string {
    // Format date as YYYY-MM-DD for input[type=date]
    return date.toISOString().split('T')[0];
  }
  
  updateStartDate(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target.value) {
      this.dateRange.start = new Date(target.value);
      this.updateChartsBasedOnTimePeriod();
    }
  }
  
  updateEndDate(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target.value) {
      this.dateRange.end = new Date(target.value);
      this.updateChartsBasedOnTimePeriod();
    }
  }
  
  formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  }
  
  exportToPdf(): void {
    console.log('Exporting to PDF...');
    // Simulate PDF generation process
    this.simulateExport('PDF');
  }
  
  exportToExcel(): void {
    console.log('Exporting to Excel...');
    // Simulate Excel generation process
    this.simulateExport('Excel');
  }
  
  printReport(): void {
    console.log('Printing report...');
    
    // Add a temporary message
    const messageTip = document.createElement('div');
    messageTip.className = 'print-message';
    messageTip.innerHTML = `
      <div class="alert alert-info" role="alert">
        <i class="fas fa-info-circle me-2"></i>
        Preparing for print...
      </div>
    `;
    document.body.appendChild(messageTip);
    
    // Remove the message after 1 second and trigger print
    setTimeout(() => {
      document.body.removeChild(messageTip);
      window.print();
    }, 1000);
  }
  
  private simulateExport(type: string): void {
    // Show loading indicator
    const loadingEl = document.createElement('div');
    loadingEl.className = 'export-loading';
    loadingEl.innerHTML = `
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <span class="ms-2">Generating ${type} report...</span>
    `;
    document.body.appendChild(loadingEl);
    
    // Simulate processing time
    setTimeout(() => {
      document.body.removeChild(loadingEl);
      
      // Show success notification
      const now = new Date();
      const dateStr = now.toLocaleDateString();
      const fileName = `BuyNGo_Report_${dateStr.replace(/\//g, '-')}.${type === 'PDF' ? 'pdf' : 'xlsx'}`;
      
      const notificationEl = document.createElement('div');
      notificationEl.className = 'export-notification';
      notificationEl.innerHTML = `
        <div class="alert alert-success" role="alert">
          <i class="fas fa-check-circle me-2"></i>
          ${type} report "${fileName}" generated successfully!
        </div>
      `;
      document.body.appendChild(notificationEl);
      
      // Remove notification after a few seconds
      setTimeout(() => {
        document.body.removeChild(notificationEl);
      }, 4000);
    }, 2000);
  }
}
