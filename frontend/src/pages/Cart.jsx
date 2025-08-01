import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import {
  getCartItems,
  updateCartQuantity,
  removeFromCart,
  clearCart,
} from "../utils/cartUtils";

// Lazy Loading Image Component
const LazyImage = ({ src, alt, className, priority = false }) => {
  const [imageSrc, setImageSrc] = useState(priority ? src : null);
  const [imageRef, setImageRef] = useState();
  const imgRef = useRef();

  useEffect(() => {
    setImageRef(imgRef.current);
  }, []);

  useEffect(() => {
    let observer;

    if (!priority && imageRef && !imageSrc) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setImageSrc(src);
              observer.unobserve(imageRef);
            }
          });
        },
        { threshold: 0.1 }
      );
      observer.observe(imageRef);
    }

    return () => {
      if (observer && imageRef) {
        observer.unobserve(imageRef);
      }
    };
  }, [imageRef, imageSrc, src, priority]);

  return (
    <div
      ref={imgRef}
      className="w-full sm:w-24 h-48 sm:h-24 bg-gray-100 rounded-xl overflow-hidden flex items-center justify-center"
    >
      {imageSrc ? (
        <img
          src={imageSrc}
          alt={alt}
          className={className}
          onError={(e) => {
            e.target.src = "/api/placeholder/300/200";
          }}
        />
      ) : (
        <div className="w-full h-full bg-gray-200 animate-pulse flex items-center justify-center">
          <svg
            className="w-8 h-8 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
      )}
    </div>
  );
};

export default function Cart() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [removingItems, setRemovingItems] = useState(new Set());

  const fetchCart = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get items from local storage first
      const localCartItems = getCartItems();

      // Transform local cart items to match your existing format
      const transformedItems = localCartItems.map((item) => ({
        id: item.id,
        quantity: item.quantity,
        product: {
          id: item.id,
          name: item.name,
          price: item.price,
          imageUrl: item.imageUrl,
          stock: item.stock,
        },
      }));

      setCartItems(transformedItems);

      // Optional: Also try to fetch from backend API
      try {
        const res = await API.get("/cart");
        console.log("Backend cart API response:", res.data);

        // You can merge backend data with local data if needed
        // For now, we'll prioritize local storage data
      } catch (apiErr) {
        console.log("Backend cart API failed, using local storage:", apiErr);
      }
    } catch (err) {
      console.error("Failed to load cart", err);
      setError("Failed to load cart. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromCart = async (itemId) => {
    try {
      setRemovingItems((prev) => new Set(prev).add(itemId));

      // Remove from local storage
      removeFromCart(itemId);

      // Optional: Also call backend API
      try {
        await API.delete(`/cart/remove/${itemId}`);
      } catch (apiErr) {
        console.log(
          "Backend remove API failed, but local cart updated:",
          apiErr
        );
      }

      // Refresh cart
      await fetchCart();
    } catch (err) {
      console.error("Remove failed", err);
      setError("Failed to remove item. Please try again.");
    } finally {
      setRemovingItems((prev) => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    }
  };

  const handleUpdateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      // Optimistic update
      setCartItems((prev) =>
        prev.map((item) =>
          item.id === itemId ? { ...item, quantity: newQuantity } : item
        )
      );

      // Update local storage
      updateCartQuantity(itemId, newQuantity);

      // Optional: Call backend API
      try {
        await API.put(`/cart/update/${itemId}`, { quantity: newQuantity });
      } catch (apiErr) {
        console.log(
          "Backend update API failed, but local cart updated:",
          apiErr
        );
      }
    } catch (err) {
      console.error("Update failed", err);
      // Revert on error
      fetchCart();
    }
  };

  const handleProceedToCheckout = () => {
    if (cartItems.length === 0) {
      alert(
        "Your cart is empty. Add some items before proceeding to checkout."
      );
      return;
    }
    navigate("/checkout");
  };

  useEffect(() => {
    fetchCart();

    // Listen for cart updates from other components
    const handleCartUpdate = () => {
      fetchCart();
    };

    window.addEventListener("cartUpdated", handleCartUpdate);

    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdate);
    };
  }, []);

  // FIXED: Add safety checks for the reduce operations
  const total = cartItems.reduce((sum, item) => {
    if (
      item &&
      item.product &&
      typeof item.product.price === "number" &&
      typeof item.quantity === "number"
    ) {
      return sum + item.product.price * item.quantity;
    }
    return sum;
  }, 0);

  const totalItems = cartItems.reduce((sum, item) => {
    if (item && typeof item.quantity === "number") {
      return sum + item.quantity;
    }
    return sum;
  }, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-gray-200 rounded w-1/4"></div>
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex space-x-4">
                  <div className="h-20 w-20 bg-gray-200 rounded-lg"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="mb-4">
              <svg
                className="mx-auto h-12 w-12 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Oops! Something went wrong
            </h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={fetchCart}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors duration-200"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="mb-6">
              <svg
                className="mx-auto h-24 w-24 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.293 1.293A1 1 0 006 15h11M17 21a2 2 0 100-4 2 2 0 000 4zM9 21a2 2 0 100-4 2 2 0 000 4z"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Your cart is empty
            </h3>
            <p className="text-gray-600 mb-8">
              Looks like you haven't added any items to your cart yet.
            </p>
            <button
              onClick={() => navigate("/")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Shopping Cart
          </h1>
          <p className="text-gray-600 mt-2">
            {totalItems} {totalItems === 1 ? "item" : "items"} in your cart
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item, index) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 transition-all duration-200 hover:shadow-xl border border-gray-100"
              >
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Product Image with Lazy Loading */}
                  <div className="flex-shrink-0">
                    <LazyImage
                      src={item.product?.imageUrl || "/api/placeholder/300/200"}
                      alt={item.product?.name || "Product"}
                      className="w-full h-full object-contain"
                      priority={index < 2}
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                      {item.product?.name || "Unknown Product"}
                    </h3>

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="space-y-2">
                        <p className="text-2xl font-bold text-green-600">
                          ₹{item.product?.price?.toLocaleString("en-IN") || "0"}
                        </p>
                        <p className="text-sm text-gray-600">
                          Subtotal: ₹
                          {(
                            (item.product?.price || 0) * (item.quantity || 0)
                          )?.toLocaleString("en-IN")}
                        </p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center space-x-3">
                        <label className="text-sm font-medium text-gray-700">
                          Qty:
                        </label>
                        <div className="flex items-center border border-gray-300 rounded-lg">
                          <button
                            onClick={() =>
                              handleUpdateQuantity(item.id, item.quantity - 1)
                            }
                            disabled={item.quantity <= 1}
                            className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M20 12H4"
                              />
                            </svg>
                          </button>
                          <span className="px-4 py-2 font-medium text-gray-900 bg-gray-50 min-w-[3rem] text-center">
                            {item.quantity || 0}
                          </span>
                          <button
                            onClick={() =>
                              handleUpdateQuantity(item.id, item.quantity + 1)
                            }
                            className="p-2 hover:bg-gray-100 transition-colors duration-200"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 4v16m8-8H4"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <div className="flex-shrink-0">
                    <button
                      onClick={() => handleRemoveFromCart(item.id)}
                      disabled={removingItems.has(item.id)}
                      className="w-full sm:w-auto bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 flex items-center justify-center space-x-2"
                    >
                      {removingItems.has(item.id) ? (
                        <>
                          <svg
                            className="animate-spin w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          <span>Removing...</span>
                        </>
                      ) : (
                        <>
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                          <span>Remove</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Order Summary
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({totalItems} items)</span>
                  <span>₹{total?.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between text-xl font-bold text-gray-900">
                    <span>Total</span>
                    <span>₹{total?.toLocaleString("en-IN")}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleProceedToCheckout}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-4 rounded-xl font-bold text-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-lg hover:shadow-xl"
              >
                Proceed to Checkout
              </button>

              <button
                onClick={() => navigate("/")}
                className="w-full mt-4 bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
