import { Product } from './product';
import { User } from './user';

export interface Offer {
    offerId?: number;
    title?: string;
    description?: string;
    product?: Product;
    supplier?: User;
    minimumQuantity?: number;
    discountValue?: number; // BigDecimal maps to number
    discountType?: string;
    status?: string;
    startDate?: string; // LocalDateTime maps to string in ISO format
    endDate?: string; // LocalDateTime maps to string in ISO format
    createdAt?: string; // LocalDateTime maps to string in ISO format
    updatedAt?: string; // LocalDateTime maps to string in ISO format
}
