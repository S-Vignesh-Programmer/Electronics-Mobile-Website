import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import API from "../services/api";
import { addToCart } from "../utils/cartUtils"; // Import the cart utility

// Lazy Loading Image Component
const LazyImage = ({
  src,
  alt,
  className,
  priority = false,
  onClick = null,
}) => {
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

  const handleClick = () => {
    if (onClick) onClick();
  };

  return (
    <div
      ref={imgRef}
      className="w-full h-full bg-gray-100 flex items-center justify-center"
      onClick={handleClick}
      style={{ cursor: onClick ? "pointer" : "default" }}
    >
      {imageSrc ? (
        <img
          src={imageSrc}
          alt={alt}
          className={className}
          onError={(e) => {
            e.target.src = "/api/placeholder/400/400";
          }}
        />
      ) : (
        <div className="w-full h-full bg-gray-200 animate-pulse flex items-center justify-center">
          <svg
            className="w-10 h-10 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 002 2z"
            />
          </svg>
        </div>
      )}
    </div>
  );
};

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [added, setAdded] = useState(false);
  const [cartLoading, setCartLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fix 1: Use correct endpoint with product id
        const response = await API.get(`/products/${id}`);
        setProduct(response.data); // Fix 2: Use response.data instead of res.data

        // Fetch related products (optional)
        try {
          const relatedRes = await API.get(
            `/products?category=${response.data.category}&limit=4`
          );
          setRelatedProducts(
            relatedRes.data.filter(
              (p) => p.id !== response.data.id || p._id !== response.data._id
            )
          );
        } catch (relatedErr) {
          console.log("Failed to load related products:", relatedErr);
        }
      } catch (err) {
        console.error("Failed to load product:", err);

        // Better error handling based on status code
        if (err.response?.status === 403) {
          setError("Access denied. Please log in to view product details.");
        } else if (err.response?.status === 404) {
          setError("Product not found.");
        } else {
          setError("Failed to load product details. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  // Updated addToCart function using utility
  const handleAddToCart = async () => {
    if (!product) return;

    try {
      setCartLoading(true);

      // Create product object for cart
      const cartProduct = {
        id: product.id || product._id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl || product.images?.[0],
        stock: product.stock,
      };

      // Use the cart utility function
      const success = addToCart(cartProduct, quantity);

      if (success) {
        // Also call your backend API if needed
        try {
          await API.post("/cart/add", {
            productId: product.id || product._id,
            quantity: quantity,
          });
        } catch (apiErr) {
          console.log(
            "Backend API call failed, but local cart updated:",
            apiErr
          );
        }

        setAdded(true);
        setTimeout(() => setAdded(false), 3000);
      } else {
        throw new Error("Failed to add to local cart");
      }
    } catch (err) {
      console.error("Add to cart failed", err);

      // Handle authentication errors for cart operations
      if (err.response?.status === 403 || err.response?.status === 401) {
        alert("Please log in to add items to cart.");
      } else {
        alert("Failed to add item to cart. Please try again.");
      }
    } finally {
      setCartLoading(false);
    }
  };

  // New Buy Now function
  const handleBuyNow = async () => {
    if (!product) return;

    try {
      // First add to cart
      const cartProduct = {
        id: product.id || product._id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl || product.images?.[0],
        stock: product.stock,
      };

      addToCart(cartProduct, quantity);

      // Then navigate to checkout
      navigate("/checkout");
    } catch (err) {
      console.error("Buy now failed:", err);
      alert("Failed to proceed to checkout. Please try again.");
    }
  };

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= (product.stock || 99)) {
      setQuantity(newQuantity);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Loading Skeleton */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            {/* Breadcrumb Skeleton */}
            <div className="h-4 bg-gray-200 rounded w-64 mb-8"></div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
              {/* Image Skeleton */}
              <div className="space-y-4">
                <div className="h-96 bg-gray-200 rounded-2xl"></div>
                <div className="flex space-x-2">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className="h-20 w-20 bg-gray-200 rounded-xl"
                    ></div>
                  ))}
                </div>
              </div>

              {/* Details Skeleton */}
              <div className="space-y-6">
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-6 bg-gray-200 rounded w-32"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                </div>
                <div className="h-12 bg-gray-200 rounded-xl w-48"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md mx-4">
          <div className="mb-4">
            <svg
              className="mx-auto h-16 w-16 text-red-500"
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
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {error.includes("Access denied")
              ? "Access Denied"
              : "Product Not Found"}
          </h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="space-y-3">
            {error.includes("Access denied") ? (
              <button
                onClick={() => navigate("/login")}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105"
              >
                Go to Login
              </button>
            ) : (
              <button
                onClick={() => window.location.reload()}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105"
              >
                Try Again
              </button>
            )}
            <button
              onClick={() => navigate("/")}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-medium transition-all duration-200"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!product) return null;

  const productImages = product.images || [
    product.imageUrl || "/api/placeholder/400/400",
  ];
  const currentImage = productImages[selectedImage] || productImages[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-8">
          <Link
            to="/"
            className="hover:text-blue-600 transition-colors duration-200"
          >
            Home
          </Link>
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
          <Link
            to="/"
            className="hover:text-blue-600 transition-colors duration-200"
          >
            Products
          </Link>
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
          <span className="text-gray-900 font-medium truncate">
            {product.name}
          </span>
        </nav>

        {/* Main Product Section */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 p-6 lg:p-8">
            {/* Product Images */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative bg-gray-50 rounded-2xl overflow-hidden group">
                <LazyImage
                  src={currentImage}
                  alt={product.name}
                  className="w-full h-96 lg:h-[500px] object-contain transition-transform duration-500 group-hover:scale-110"
                  priority={true}
                />

                {/* Discount Badge */}
                {product.discount && (
                  <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                    {product.discount}% OFF
                  </div>
                )}

                {/* Wishlist Button */}
                <button className="absolute top-4 right-4 bg-white bg-opacity-90 hover:bg-opacity-100 p-3 rounded-full shadow-lg transition-all duration-200 transform hover:scale-110">
                  <svg
                    className="w-5 h-5 text-gray-700"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </button>
              </div>

              {/* Thumbnail Images */}
              {productImages.length > 1 && (
                <div className="flex space-x-2 overflow-x-auto pb-2">
                  {productImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                        selectedImage === index
                          ? "border-blue-500 ring-2 ring-blue-200"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <LazyImage
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                        priority={index < 4}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className="space-y-6">
              {/* Product Title & Rating */}
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                  {product.name}
                </h1>

                {/* Rating Stars */}
                <div className="flex items-center space-x-2 mb-4">
                  <div className="flex space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-5 h-5 ${
                          i < (product.rating || 4)
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">
                    ({product.rating || 4.0}) • {product.reviews || 127} reviews
                  </span>
                </div>
              </div>

              {/* Price Section */}
              <div className="space-y-2">
                <div className="flex items-baseline space-x-2">
                  <span className="text-3xl lg:text-4xl font-bold text-green-600">
                    ₹{product.price?.toLocaleString("en-IN")}
                  </span>
                  {product.originalPrice &&
                    product.originalPrice > product.price && (
                      <span className="text-xl text-gray-500 line-through">
                        ₹{product.originalPrice?.toLocaleString("en-IN")}
                      </span>
                    )}
                </div>
                {product.discount && (
                  <p className="text-sm text-green-600 font-medium">
                    You save ₹
                    {(
                      (product.originalPrice || product.price) - product.price
                    ).toLocaleString("en-IN")}{" "}
                    ({product.discount}% off)
                  </p>
                )}
              </div>

              {/* Stock Status */}
              <div className="flex items-center space-x-2">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    product.inStock !== false
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full mr-2 ${
                      product.inStock !== false ? "bg-green-400" : "bg-red-400"
                    }`}
                  />
                  {product.inStock !== false ? "In Stock" : "Out of Stock"}
                </span>
                {product.stock && (
                  <span className="text-sm text-gray-600">
                    {product.stock} items available
                  </span>
                )}
              </div>

              {/* Description */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-900">
                  Description
                </h3>
                <div className="text-gray-600 leading-relaxed">
                  {showFullDescription ? (
                    <p>{product.description}</p>
                  ) : (
                    <p>
                      {product.description?.length > 200
                        ? `${product.description.substring(0, 200)}...`
                        : product.description}
                    </p>
                  )}
                  {product.description?.length > 200 && (
                    <button
                      onClick={() =>
                        setShowFullDescription(!showFullDescription)
                      }
                      className="text-blue-600 hover:text-blue-500 font-medium mt-1"
                    >
                      {showFullDescription ? "Show Less" : "Read More"}
                    </button>
                  )}
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-900">
                  Quantity
                </h3>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
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
                  <span className="w-16 text-center text-lg font-semibold">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= (product.stock || 99)}
                    className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
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
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-4">
                <button
                  onClick={handleAddToCart}
                  disabled={cartLoading || product.inStock === false}
                  className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 shadow-lg hover:shadow-xl ${
                    added
                      ? "bg-green-500 hover:bg-green-600 text-white focus:ring-green-500"
                      : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white focus:ring-blue-500"
                  } disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
                >
                  {cartLoading ? (
                    <div className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
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
                      Adding to Cart...
                    </div>
                  ) : added ? (
                    <div className="flex items-center justify-center">
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Added to Cart!
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.293 1.293A1 1 0 006 15h11M17 21a2 2 0 100-4 2 2 0 000 4zM9 21a2 2 0 100-4 2 2 0 000 4z"
                        />
                      </svg>
                      Add to Cart
                    </div>
                  )}
                </button>

                <button
                  onClick={handleBuyNow}
                  disabled={product.inStock === false}
                  className="w-full py-4 px-6 border-2 border-gray-300 text-gray-700 rounded-xl font-bold text-lg hover:bg-gray-50 transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="flex items-center justify-center">
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                    Buy Now
                  </div>
                </button>
              </div>

              {/* Product Features */}
              <div className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-200">
                <div className="flex items-center space-x-2">
                  <svg
                    className="w-5 h-5 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2a2 2 0 01-2 2H7a2 2 0 01-2-2v-8a2 2 0 012-2h5a2 2 0 012 2v1"
                    />
                  </svg>
                  <span className="text-sm text-gray-600">Secure Payment</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="bg-white rounded-2xl shadow-xl p-6 lg:p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Related Products
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.slice(0, 4).map((relatedProduct, index) => (
                <Link
                  key={relatedProduct.id || relatedProduct._id}
                  to={`/products/${relatedProduct.id || relatedProduct._id}`}
                  className="group bg-gray-50 rounded-xl p-4 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="h-40 bg-white rounded-lg mb-3 overflow-hidden">
                    <LazyImage
                      src={
                        relatedProduct.imageUrl || "/api/placeholder/300/200"
                      }
                      alt={relatedProduct.name}
                      className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                      priority={index < 2}
                    />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2 group-hover:text-blue-600">
                    {relatedProduct.name}
                  </h3>
                  <p className="text-lg font-bold text-green-600">
                    ₹{relatedProduct.price?.toLocaleString("en-IN")}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
