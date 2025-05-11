import { Product } from './product.model';
import { PurchaseOrder } from './purchase-order.model';

export interface PurchaseOrderLine {
  id?: number;
  lineId?: number;
  product?: Product;
  quantity?: number;
  lineTotal?: number; // Explicitly included for use in components
  priceAtPurchase?: number;
}
