export interface RegisterRequest {
    username: string;
    email: string;
    password: string;
    firstname?: string;
    lastname?: string;
    name?: string; // Used if first/last name are not available
    role?: string; // Default to "USER" if not specified
    address?: string;
    phoneNumber?: string;
    companyName?: string; // For suppliers
    companyEmail?: string; // For suppliers
    companyAddress?: string; // For suppliers
}
