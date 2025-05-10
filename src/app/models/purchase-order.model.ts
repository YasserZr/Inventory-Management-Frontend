import { User } from './user';
import { PurchaseHistory } from './purchase-history';
import { PurchaseOrderLine } from './purchase-order-line';

export interface PurchaseOrder {
    poId?: number;
    status?: string;
    totalAmount?: number; // BigDecimal maps to number
    orderDate?: string; // LocalDateTime maps to string in ISO format
    deliveryDate?: string; // LocalDateTime maps to string in ISO format
    paymentStatus?: string;
    paymentMethod?: string;
    shippingAddress?: string;
    billingAddress?: string;
    notes?: string;
    createdAt?: string; // LocalDateTime maps to string in ISO format
    updatedAt?: string; // LocalDateTime maps to string in ISO format
    orderedBy?: User;
    supplier?: User;
    purchaseHistory?: PurchaseHistory;
    purchaseOrderLines?: PurchaseOrderLine[];
}
