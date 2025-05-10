import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { environment } from '../../environments/environment';

// Interfaces for data models
export interface KpiData {
  totalRevenue: number;
  orderCount: number;
  averageOrderValue: number;
  topSellingProduct: string;
  returnRate: number;
  customerSatisfaction: number;
  previousPeriodRevenueChange?: number;
  previousPeriodOrderCountChange?: number;
  previousPeriodAOVChange?: number;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string;
    pointBackgroundColor?: string;
  }[];
}

export interface SupplierPerformanceData {
  labels: string[];
  onTimeDelivery: number[];
  qualityRating: number[];
}

export interface ProductCategoryData {
  labels: string[];
  data: number[];
}

export interface SalesData {
  labels: string[];
  data: number[];
}

export interface RecentOrder {
  id: string;
  customer: string;
  products: string;
  date: string;
  amount: number;
  status: 'Completed' | 'Shipped' | 'Processing' | 'Cancelled';
}

@Injectable({
  providedIn: 'root'
})
export class ReportingService {
  private apiUrl = `${environment.apiUrl}/reporting`;

  constructor(private http: HttpClient) { }

  // In a real application, these methods would make HTTP requests
  // For now, we'll simulate data with mock responses

  getKpiData(timePeriod: string = 'month', dateRange?: { start: Date, end: Date }): Observable<KpiData> {
    // Mock data based on time period
    let mockData: KpiData;
    
    switch (timePeriod) {
      case 'week':
        mockData = {
          totalRevenue: 109000,
          orderCount: 97,
          averageOrderValue: 1124,
          topSellingProduct: 'Dell XPS 13',
          returnRate: 1.8,
          customerSatisfaction: 96,
          previousPeriodRevenueChange: 12.5,
          previousPeriodOrderCountChange: 8.9,
          previousPeriodAOVChange: 3.2
        };
        break;
      case 'month':
        mockData = {
          totalRevenue: 377000,
          orderCount: 423,
          averageOrderValue: 889,
          topSellingProduct: 'Dell XPS 13',
          returnRate: 2.3,
          customerSatisfaction: 94,
          previousPeriodRevenueChange: 8.2,
          previousPeriodOrderCountChange: 5.7,
          previousPeriodAOVChange: 2.4
        };
        break;
      case 'quarter':
        mockData = {
          totalRevenue: 1010000,
          orderCount: 1278,
          averageOrderValue: 790,
          topSellingProduct: 'HP EliteBook',
          returnRate: 2.7,
          customerSatisfaction: 91,
          previousPeriodRevenueChange: 6.4,
          previousPeriodOrderCountChange: 7.2,
          previousPeriodAOVChange: -0.8
        };
        break;
      case 'year':
        mockData = {
          totalRevenue: 4680000,
          orderCount: 5325,
          averageOrderValue: 879,
          topSellingProduct: 'HP EliteBook',
          returnRate: 2.5,
          customerSatisfaction: 92,
          previousPeriodRevenueChange: 15.3,
          previousPeriodOrderCountChange: 12.6,
          previousPeriodAOVChange: 2.1
        };
        break;
      default:
        mockData = {
          totalRevenue: 377000,
          orderCount: 423,
          averageOrderValue: 889,
          topSellingProduct: 'Dell XPS 13',
          returnRate: 2.3,
          customerSatisfaction: 94,
          previousPeriodRevenueChange: 8.2,
          previousPeriodOrderCountChange: 5.7,
          previousPeriodAOVChange: 2.4
        };
    }

    // Simulate network delay
    return of(mockData).pipe(delay(500));
  }

  getSalesData(period: string, dateRange?: { start: Date, end: Date }): Observable<SalesData> {
    // Mock data
    let labels: string[] = [];
    let data: number[] = [];

    switch (period) {
      case 'week':
        labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        data = [12000, 18000, 15000, 17000, 22000, 16000, 9000];
        break;
      case 'month':
        labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
        data = [85000, 92000, 104000, 96000];
        break;
      case 'quarter':
        labels = ['Jan', 'Feb', 'Mar'];
        data = [340000, 290000, 380000];
        break;
      case 'year':
        labels = ['Q1', 'Q2', 'Q3', 'Q4'];
        data = [1010000, 1240000, 980000, 1450000];
        break;
      default:
        labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May'];
        data = [65000, 59000, 80000, 81000, 92000];
    }

    return of({ labels, data }).pipe(delay(500));
  }
  getSalesChartData(period: string, startDate?: Date, endDate?: Date): Observable<ChartData> {
    // Mock data
    let labels: string[] = [];
    let data: number[] = [];

    switch (period) {
      case 'week':
        labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        data = [12000, 18000, 15000, 17000, 22000, 16000, 9000];
        break;
      case 'month':
        labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
        data = [85000, 92000, 104000, 96000];
        break;
      case 'quarter':
        labels = ['Jan', 'Feb', 'Mar'];
        data = [340000, 290000, 380000];
        break;
      case 'year':
        labels = ['Q1', 'Q2', 'Q3', 'Q4'];
        data = [1010000, 1240000, 980000, 1450000];
        break;
      default:
        labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May'];
        data = [65000, 59000, 80000, 81000, 92000];
    }

    const mockData: ChartData = {
      labels: labels,
      datasets: [
        {
          label: 'Sales Revenue ($)',
          data: data,
          backgroundColor: 'rgba(63, 81, 181, 0.5)',
          borderColor: 'rgb(63, 81, 181)',
          pointBackgroundColor: 'rgb(63, 81, 181)'
        }
      ]
    };

    return of(mockData).pipe(delay(500));
  }

  getProductCategoryDistribution(): Observable<ProductCategoryData> {
    const mockData: ProductCategoryData = {
      labels: ['Laptops', 'Desktops', 'Monitors', 'Peripherals', 'Servers'],
      data: [35, 25, 15, 15, 10]
    };

    return of(mockData).pipe(delay(600));
  }

  getSupplierPerformance(): Observable<SupplierPerformanceData> {
    const mockData: SupplierPerformanceData = {
      labels: ['Dell', 'HP', 'Logitech', 'Apple', 'Lenovo'],
      onTimeDelivery: [85, 78, 92, 89, 76],
      qualityRating: [92, 86, 88, 95, 82]
    };

    return of(mockData).pipe(delay(700));
  }

  getRecentOrders(limit: number = 5): Observable<RecentOrder[]> {
    const mockOrders: RecentOrder[] = [
      {
        id: 'ORD-2023-0587',
        customer: 'TechCorp Inc',
        products: 'Dell XPS 13 x5',
        date: 'May 8, 2025',
        amount: 6495.00,
        status: 'Completed'
      },
      {
        id: 'ORD-2023-0586',
        customer: 'Global Systems Ltd',
        products: 'PowerEdge Server x2',
        date: 'May 7, 2025',
        amount: 7280.00,
        status: 'Shipped'
      },
      {
        id: 'ORD-2023-0585',
        customer: 'StartUp Solutions',
        products: 'HP LaserJet Pro x3',
        date: 'May 5, 2025',
        amount: 1197.00,
        status: 'Processing'
      },
      {
        id: 'ORD-2023-0584',
        customer: 'Creative Studios',
        products: 'Logitech MX Keys x15',
        date: 'May 3, 2025',
        amount: 1485.00,
        status: 'Completed'
      },
      {
        id: 'ORD-2023-0583',
        customer: 'EdTech Academy',
        products: 'HP 27" Monitor x8',
        date: 'May 2, 2025',
        amount: 2232.00,
        status: 'Shipped'
      }
    ];

    return of(mockOrders.slice(0, limit)).pipe(delay(300));
  }
}