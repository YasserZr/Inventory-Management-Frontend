import { PurchaseOrder } from './purchase-order';
import { Offer } from './offer';

export interface User {
    id?: number;
    username: string;
    email: string;
    password?: string; // Note: Password should generally not be sent to the frontend
    firstname?: string;
    lastname?: string;
    name?: string; // Combined first and last name for convenience
    address?: string;
    phoneNumber?: string;
    workAddress?: string;
    companyContactNumber?: string;
    companyEmail?: string;
    role: string;
    rating?: number;
    serviceQuality?: string;
    createdAt?: string; // LocalDateTime maps to string in ISO format
    updatedAt?: string; // LocalDateTime maps to string in ISO format
    image?: string;
      // Relationships
    offers?: Offer[];
    
    // Utility properties - these can be used in the frontend
    isAdmin?: boolean;
    isSupplier?: boolean;
    isUser?: boolean;
    purchaseOrders?: PurchaseOrder[];
    offersMade?: Offer[];
}
