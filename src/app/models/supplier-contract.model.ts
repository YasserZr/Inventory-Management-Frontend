import { User } from "./user.model";

export interface SupplierContract {
    id?: number;
    user?: User;
    supplier?: User;
    contractNumber?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
    terms?: string;
    createdAt?: string;
    updatedAt?: string;
}
