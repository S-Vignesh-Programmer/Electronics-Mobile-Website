// src/utils/cartUtils.js

/**
 * Add item to cart and update cart counter
 */
export const addToCart = (product, quantity = 1) => {
  try {
    // Get existing cart
    const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");

    // Check if product already exists in cart
    const existingItemIndex = existingCart.findIndex(
      (item) => item.id === product.id
    );

    if (existingItemIndex > -1) {
      // Update quantity if item exists
      existingCart[existingItemIndex].quantity += quantity;
    } else {
      // Add new item to cart
      existingCart.push({
        ...product,
        quantity: quantity,
      });
    }

    // Save updated cart
    localStorage.setItem("cart", JSON.stringify(existingCart));

    // Trigger cart update event for header component
    window.dispatchEvent(new Event("cartUpdated"));

    return true;
  } catch (error) {
    console.error("Error adding to cart:", error);
    return false;
  }
};

/**
 * Remove item from cart
 * @param {string|number} productId - Product ID to remove
 */
export const removeFromCart = (productId) => {
  try {
    const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");
    const updatedCart = existingCart.filter((item) => item.id !== productId);

    localStorage.setItem("cart", JSON.stringify(updatedCart));
    window.dispatchEvent(new Event("cartUpdated"));

    return true;
  } catch (error) {
    console.error("Error removing from cart:", error);
    return false;
  }
};

/**
 * Update item quantity in cart
 */
export const updateCartQuantity = (productId, newQuantity) => {
  try {
    const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");
    const itemIndex = existingCart.findIndex((item) => item.id === productId);

    if (itemIndex > -1) {
      if (newQuantity <= 0) {
        // Remove item if quantity is 0 or less
        existingCart.splice(itemIndex, 1);
      } else {
        existingCart[itemIndex].quantity = newQuantity;
      }

      localStorage.setItem("cart", JSON.stringify(existingCart));
      window.dispatchEvent(new Event("cartUpdated"));
    }

    return true;
  } catch (error) {
    console.error("Error updating cart quantity:", error);
    return false;
  }
};

/**
 * Get cart items
 */
export const getCartItems = () => {
  try {
    return JSON.parse(localStorage.getItem("cart") || "[]");
  } catch (error) {
    console.error("Error getting cart items:", error);
    return [];
  }
};

/**
 * Get total cart count
 */
export const getCartCount = () => {
  try {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    return cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  } catch (error) {
    console.error("Error getting cart count:", error);
    return 0;
  }
};

/**
 * Clear entire cart
 */
export const clearCart = () => {
  try {
    localStorage.removeItem("cart");
    window.dispatchEvent(new Event("cartUpdated"));
    return true;
  } catch (error) {
    console.error("Error clearing cart:", error);
    return false;
  }
};

