import { Product } from './product';
import { PurchaseOrder } from './purchase-order';

export interface PurchaseOrderLine {
  id?: number;
  product: Product;
  quantity: number;
  priceAtPurchase: number;
  // purchaseOrder: PurchaseOrder; // Usually, the parent object (PurchaseOrder) will hold a list of lines, so this might be optional or handled differently depending on API design
}
