import { Category } from './category';
import { User } from './user';

export interface Product {
    id?: number;
    name?: string;
    description?: string;
    price?: number; 
    stockQuantity?: number;
    status?: string;
    imageUrl?: string;
    category?: Category;
    supplier?: User;
    createdAt?: string; 
    updatedAt?: string; 
}
