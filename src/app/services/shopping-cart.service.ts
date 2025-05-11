import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from '../models/product';
import { Offer } from '../models/offer';

export interface CartItem {
  product: Product;
  quantity: number;
  appliedOffer?: Offer;
  pricePerUnit: number;
  totalPrice: number;
}

@Injectable({
  providedIn: 'root'
})
export class ShoppingCartService {
  private cartItems: CartItem[] = [];
  private cartSubject = new BehaviorSubject<CartItem[]>([]);
  private isBrowser: boolean;
  
  constructor() {
    // Check if we're running in a browser environment
    this.isBrowser = typeof window !== 'undefined';
    
    // Load cart from localStorage when service initializes (only in browser)
    if (this.isBrowser) {
      this.loadCart();
    }
  }
  
  // Get all items in cart
  getCartItems(): Observable<CartItem[]> {
    return this.cartSubject.asObservable();
  }
  
  // Add item to cart
  addToCart(product: Product, quantity: number = 1, offer?: Offer): void {
    const existingItemIndex = this.cartItems.findIndex(item => item.product.id === product.id);
    
    if (existingItemIndex !== -1) {
      // Update existing item quantity
      this.cartItems[existingItemIndex].quantity += quantity;
      this.updateItemTotals(existingItemIndex, offer);
    } else {      // Add new item
      const pricePerUnit = offer && offer.discountValue 
        ? this.calculateDiscountedPrice(product.price || 0, offer) 
        : product.price || 0;
        
      const newItem: CartItem = {
        product,
        quantity,
        appliedOffer: offer,
        pricePerUnit,
        totalPrice: pricePerUnit * quantity
      };
      
      this.cartItems.push(newItem);
    }
    
    this.updateCart();
  }
  
  // Update an item's quantity
  updateQuantity(productId: number, quantity: number): void {
    const index = this.cartItems.findIndex(item => item.product.id === productId);
    
    if (index !== -1) {
      this.cartItems[index].quantity = quantity;
      this.updateItemTotals(index);
      this.updateCart();
    }
  }
  
  // Remove an item from cart
  removeFromCart(productId: number): void {
    this.cartItems = this.cartItems.filter(item => item.product.id !== productId);
    this.updateCart();
  }
  
  // Clear the entire cart
  clearCart(): void {
    this.cartItems = [];
    this.updateCart();
  }
  
  // Get cart total
  getCartTotal(): number {
    return this.cartItems.reduce((total, item) => total + item.totalPrice, 0);
  }
  
  // Get total number of items in cart
  getCartItemCount(): number {
    return this.cartItems.reduce((count, item) => count + item.quantity, 0);
  }
  
  // Check if a product exists in the cart
  isInCart(productId: number): boolean {
    return this.cartItems.some(item => item.product.id === productId);
  }
  
  // Calculate discounted price
  private calculateDiscountedPrice(originalPrice: number, offer: Offer): number {
    if (!offer || !offer.discountValue) {
      return originalPrice;
    }
    
    if (offer.discountType === 'PERCENTAGE') {
      return originalPrice * (1 - offer.discountValue / 100);
    } else if (offer.discountType === 'FIXED') {
      return Math.max(0, originalPrice - offer.discountValue);
    }
    
    return originalPrice;
  }
    // Update item totals (price, etc.)
  private updateItemTotals(index: number, offer?: Offer): void {
    const item = this.cartItems[index];
    
    if (offer) {
      item.appliedOffer = offer;
      item.pricePerUnit = this.calculateDiscountedPrice(item.product.price || 0, offer);
    }
    
    item.totalPrice = item.pricePerUnit * item.quantity;
  }
  
  // Save cart to localStorage and notify subscribers
  private updateCart(): void {
    localStorage.setItem('cart', JSON.stringify(this.cartItems));
    this.cartSubject.next([...this.cartItems]);
  }
  
  // Load cart from localStorage
  private loadCart(): void {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        this.cartItems = JSON.parse(savedCart);
        this.cartSubject.next([...this.cartItems]);
      } catch (e) {
        console.error('Error loading cart from localStorage', e);
        this.cartItems = [];
      }
    }
  }
}
