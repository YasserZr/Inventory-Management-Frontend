export interface Category {
    categoryId?: number;
    name?: string;
    description?: string;
    createdAt?: string; // LocalDateTime maps to string in ISO format
    updatedAt?: string; // LocalDateTime maps to string in ISO format
}
