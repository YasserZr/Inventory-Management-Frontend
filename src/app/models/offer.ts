import { Product } from './product';
import { User } from './user';

export interface Offer {
    offerId?: number;
    title?: string;
    description?: string;
    product?: Product;
    supplier?: User;
    minimumQuantity?: number;
    discountValue?: number; 
    discountType?: string;
    status?: string;
    startDate?: string; 
    endDate?: string; 
    createdAt?: string; 
    updatedAt?: string; 
}
