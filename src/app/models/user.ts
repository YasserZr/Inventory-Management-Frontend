import { PurchaseOrder } from './purchase-order';
import { Offer } from './offer';

export interface User {
    id?: number;
    username?: string;
    email?: string;
    password?: string; 
    firstname?: string;
    lastname?: string;
    address?: string;
    phoneNumber?: string;
    workAddress?: string;
    companyContactNumber?: string;
    companyEmail?: string;
    role?: string;
    rating?: number;
    serviceQuality?: string;
    createdAt?: string; 
    updatedAt?: string; 
    image?: string;
    purchaseOrders?: PurchaseOrder[];
    offersMade?: Offer[];
}
