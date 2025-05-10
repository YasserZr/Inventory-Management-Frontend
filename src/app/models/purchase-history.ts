import { User } from './user';
import { Product } from './product';

export interface PurchaseHistory {
    id?: number;
    user: User;
    product: Product;
    quantity: number;
    totalPrice: number;
    purchaseDate: Date;
}
