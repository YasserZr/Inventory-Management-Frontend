export interface AuthResponse {
    token: string;
    id?: number;
    username: string;
    email?: string;
    role: string;
    name?: string;
    firstname?: string;
    lastname?: string;
    address?: string;
    phoneNumber?: string;
    createdAt?: string;
    expiresAt?: string;
    tokenType?: string;
}
