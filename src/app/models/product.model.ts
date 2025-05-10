import { Category } from './category.model';
import { User } from './user.model';

export interface Product {
    id?: number;
    name?: string;
    description?: string;
    price?: number; // BigDecimal maps to number
    stockQuantity?: number;
    status?: string;
    category?: Category;
    supplier?: User;
    createdAt?: string; // LocalDateTime maps to string in ISO format
    updatedAt?: string; // LocalDateTime maps to string in ISO format
}
