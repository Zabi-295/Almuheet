import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSettings } from './SettingsContext';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { settings } = useSettings();
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem('almuheet_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('almuheet_cart', JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save cart to localStorage:', e);
    }
  }, [items]);

  const addToCart = (product, quantity = 1) => {
    setItems(prev => {
      const existingIndex = prev.findIndex(item => item.id === product.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        const newQty = updated[existingIndex].quantity + quantity;
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: Math.min(newQty, product.stock_quantity || 99)
        };
        return updated;
      }
      return [...prev, {
        id: product.id,
        name: product.name,
        price: Number(product.price),
        image_url: product.image_url,
        volume: product.volume,
        concentration: product.concentration,
        stock_quantity: product.stock_quantity,
        sku: product.sku,
        quantity: Math.min(quantity, product.stock_quantity || 99)
      }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setItems(prev =>
      prev.map(item =>
        item.id === productId
          ? { ...item, quantity: Math.min(newQuantity, item.stock_quantity || 99) }
          : item
      )
    );
  };

  const removeFromCart = (productId) => {
    setItems(prev => prev.filter(item => item.id !== productId));
  };

  const clearCart = () => {
    setItems([]);
  };

  // Calculations
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const itemCount = items.reduce((count, item) => count + item.quantity, 0);

  const freeThreshold = Number(settings.free_shipping_threshold) || 6000;
  const standardShipping = Number(settings.shipping_fee) || 250;
  const isFreeShipping = subtotal >= freeThreshold;
  const shippingFee = items.length === 0 ? 0 : (isFreeShipping ? 0 : standardShipping);
  const total = subtotal + shippingFee;
  const amountForFreeShipping = Math.max(0, freeThreshold - subtotal);
  const freeShippingProgress = Math.min(100, (subtotal / freeThreshold) * 100);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        subtotal,
        shippingFee,
        total,
        itemCount,
        freeThreshold,
        isFreeShipping,
        amountForFreeShipping,
        freeShippingProgress,
        isCartOpen,
        setIsCartOpen
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}
