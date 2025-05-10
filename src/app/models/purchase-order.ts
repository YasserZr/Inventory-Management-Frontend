import { User } from './user';
import { PurchaseHistory } from './purchase-history';
import { PurchaseOrderLine } from './purchase-order-line';

export interface PurchaseOrder {
    poId?: number;
    status?: string;
    totalAmount?: number; 
    orderDate?: string; 
    deliveryDate?: string; 
    paymentStatus?: string;
    paymentMethod?: string;
    shippingAddress?: string;
    billingAddress?: string;
    notes?: string;
    createdAt?: string; 
    updatedAt?: string; 
    orderedBy?: User;
    supplier?: User;
    purchaseHistory?: PurchaseHistory;
    purchaseOrderLines?: PurchaseOrderLine[];
}
