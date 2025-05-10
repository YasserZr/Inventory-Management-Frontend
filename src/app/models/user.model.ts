import { PurchaseOrder } from './purchase-order';
import { Offer } from './offer';

export interface User {
    id?: number;
    username?: string;
    email?: string;
    password?: string; // Note: Password should generally not be sent to the frontend
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
    createdAt?: string; // LocalDateTime maps to string in ISO format
    updatedAt?: string; // LocalDateTime maps to string in ISO format
    image?: string;
    purchaseOrders?: PurchaseOrder[];
    offersMade?: Offer[];
}
