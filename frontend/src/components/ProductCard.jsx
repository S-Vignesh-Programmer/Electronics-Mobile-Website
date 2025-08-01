// src/components/ProductCard.jsx
import { useState, useRef, useEffect, useCallback } from "react";

export default function ProductCard({ product, onAddToCart, onQuickView }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [shouldLoadImage, setShouldLoadImage] = useState(false);
  const cardRef = useRef(null);
  const imageRef = useRef(null);

  // Enhanced Intersection Observer for better lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
        // Load image when element is close to viewport (improved lazy loading)
        if (entry.isIntersecting || entry.intersectionRatio > 0) {
          setShouldLoadImage(true);
        }
      },
      {
        threshold: [0, 0.1, 0.5],
        rootMargin: "100px 0px 100px 0px", // Load images 100px before they enter viewport
      }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, []);

  // Optimized image loading handlers
  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
    setImageError(false);
  }, []);

  const handleImageError = useCallback(() => {
    setImageError(true);
    setImageLoaded(true);
  }, []);

  // Event handlers with better performance
  const handleAddToCart = useCallback(
    (e) => {
      e.stopPropagation();
      e.preventDefault();
      onAddToCart?.(product);
    },
    [onAddToCart, product]
  );

  const handleQuickView = useCallback(
    (e) => {
      e.stopPropagation();
      e.preventDefault();
      onQuickView?.(product);
    },
    [onQuickView, product]
  );

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  // Calculate discount percentage
  const discountPercentage =
    product.originalPrice && product.price
      ? Math.round(
          ((product.originalPrice - product.price) / product.originalPrice) *
            100
        )
      : 0;

  return (
    <article
      ref={cardRef}
      className={`group relative bg-gradient-to-br from-white via-white to-gray-50/50 shadow-md hover:shadow-2xl transition-all duration-500 ease-out p-3 sm:p-4 md:p-5 lg:p-6 rounded-xl sm:rounded-2xl border border-gray-100/60 hover:border-gray-200/80 transform cursor-pointer overflow-hidden backdrop-blur-sm ${
        isInView ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
      } ${
        isHovered
          ? "scale-[1.02] sm:scale-105 -translate-y-1 sm:-translate-y-2 md:-translate-y-4 shadow-2xl"
          : "hover:scale-[1.01] sm:hover:scale-[1.02] hover:-translate-y-1 sm:hover:-translate-y-2"
      }`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        transitionDelay: isInView ? "0ms" : "200ms",
      }}
      role="button"
      tabIndex={0}
      aria-label={`Product: ${product.name}`}
    >
      {/* Gradient overlay background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl sm:rounded-2xl" />

      {/* Enhanced Image Container - Fully Responsive */}
      <div className="relative h-32 xs:h-36 sm:h-40 md:h-44 lg:h-48 xl:h-52 2xl:h-56 w-full mb-3 sm:mb-4 md:mb-5 lg:mb-6 bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-lg sm:rounded-xl overflow-hidden group/image">
        {/* Discount Badge - Responsive positioning */}
        {discountPercentage > 0 && (
          <div className="absolute top-2 left-2 sm:top-3 sm:left-3 z-20 bg-gradient-to-r from-red-500 via-pink-500 to-red-600 text-white px-1.5 py-1 sm:px-2.5 sm:py-1.5 rounded-md sm:rounded-lg text-xs font-bold shadow-lg animate-pulse">
            -{discountPercentage}%
          </div>
        )}

        {/* Enhanced Loading skeleton with better responsive design */}
        {!imageLoaded && shouldLoadImage && (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse">
            <div className="flex flex-col items-center space-y-2 sm:space-y-3">
              <svg
                className="w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 text-gray-400 animate-bounce"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <div className="text-xs sm:text-sm text-gray-500 font-medium">
                Loading...
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Error state - Responsive */}
        {imageError ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 text-gray-500">
            <svg
              className="w-8 h-8 xs:w-9 xs:h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 mb-2 sm:mb-3 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-xs sm:text-sm font-medium text-center px-2">
              Image unavailable
            </span>
          </div>
        ) : (
          shouldLoadImage && (
            <img
              ref={imageRef}
              src={product.imageUrl}
              alt={product.name || "Product image"}
              className={`h-full w-full object-contain transition-all duration-700 ease-out group-hover/image:scale-105 sm:group-hover/image:scale-110 ${
                imageLoaded ? "opacity-100 scale-100" : "opacity-0 scale-95"
              }`}
              onLoad={handleImageLoad}
              onError={handleImageError}
              loading="lazy"
              decoding="async"
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          )
        )}

        {/* Enhanced hover overlay with gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-lg sm:rounded-xl" />

        {/* Action buttons overlay - Responsive */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 sm:translate-y-4 group-hover:translate-y-0">
          <div className="flex space-x-2 sm:space-x-3">
            {/* Quick view button - Responsive sizing */}
            <button
              onClick={handleQuickView}
              className="bg-white/95 hover:bg-white backdrop-blur-sm p-2 sm:p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-2 sm:focus:ring-4 focus:ring-indigo-500/30 group/btn"
              aria-label={`Quick view ${product.name}`}
              type="button"
            >
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700 group-hover/btn:text-indigo-600 transition-colors duration-200"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
            </button>

            {/* Wishlist button - Responsive sizing */}
            <button
              className="bg-white/95 hover:bg-white backdrop-blur-sm p-2 sm:p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-2 sm:focus:ring-4 focus:ring-pink-500/30 group/btn"
              aria-label={`Add ${product.name} to wishlist`}
              type="button"
            >
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700 group-hover/btn:text-pink-600 transition-colors duration-200"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
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
        </div>

        {/* Stock status indicator - Responsive */}
        <div className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3">
          <span
            className={`inline-flex items-center px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-xs font-semibold backdrop-blur-sm shadow-lg ${
              product.inStock !== false
                ? "bg-green-100/90 text-green-800 border border-green-200/50"
                : "bg-red-100/90 text-red-800 border border-red-200/50"
            }`}
          >
            <span
              className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full mr-1 sm:mr-1.5 animate-pulse ${
                product.inStock !== false ? "bg-green-500" : "bg-red-500"
              }`}
              aria-hidden="true"
            />
            <span className="hidden xs:inline">
              {product.inStock !== false ? "In Stock" : "Out of Stock"}
            </span>
            <span className="xs:hidden">
              {product.inStock !== false ? "✓" : "✗"}
            </span>
          </span>
        </div>
      </div>

      {/* Enhanced Content Container - Fully Responsive */}
      <div className="relative z-10 space-y-2 sm:space-y-3 md:space-y-4">
        {/* Product Name with enhanced responsive typography */}
        <h2 className="text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-gray-900 line-clamp-2 group-hover:text-indigo-700 transition-colors duration-300 leading-tight tracking-tight">
          {product.name}
        </h2>

        {/* Product Description - Responsive with better line clamping */}
        {product.description && (
          <p className="text-gray-600 text-xs xs:text-sm sm:text-base line-clamp-2 leading-relaxed font-medium">
            {product.description}
          </p>
        )}

        {/* Enhanced Rating Section - Responsive */}
        {product.rating && (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1 sm:space-x-2">
              <div
                className="flex items-center"
                role="img"
                aria-label={`Rating: ${product.rating} out of 5 stars`}
              >
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-3 h-3 xs:w-4 xs:h-4 ${
                      i < Math.floor(product.rating)
                        ? "text-yellow-400"
                        : i < product.rating
                        ? "text-yellow-300"
                        : "text-gray-300"
                    } transition-colors duration-200`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-xs sm:text-sm font-medium text-gray-600">
                {product.rating}
                {product.reviewCount && (
                  <span className="text-gray-500 ml-0.5 sm:ml-1">
                    ({product.reviewCount})
                  </span>
                )}
              </span>
            </div>
          </div>
        )}

        {/* Enhanced Price Section - Fully Responsive */}
        <div className="flex items-end justify-between pt-2 border-t border-gray-100/80 gap-2">
          <div className="flex flex-col space-y-1 min-w-0 flex-1">
            <div className="flex items-baseline space-x-1 sm:space-x-2 flex-wrap">
              <span className="text-lg xs:text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-transparent bg-gradient-to-r from-green-600 via-emerald-600 to-green-700 bg-clip-text">
                ₹{product.price?.toLocaleString("en-IN")}
              </span>
              {product.originalPrice &&
                product.originalPrice > product.price && (
                  <span className="text-xs xs:text-sm sm:text-base text-gray-500 line-through font-medium">
                    ₹{product.originalPrice?.toLocaleString("en-IN")}
                  </span>
                )}
            </div>
            {discountPercentage > 0 && (
              <div className="text-xs font-semibold text-green-600 bg-green-50 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-md inline-flex items-center w-fit">
                <svg
                  className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-0.5 sm:mr-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.293l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="truncate">
                  Save ₹
                  {(product.originalPrice - product.price)?.toLocaleString(
                    "en-IN"
                  )}
                </span>
              </div>
            )}
          </div>

          {/* Enhanced Add to cart button - Fully Responsive */}
          <button
            onClick={handleAddToCart}
            disabled={product.inStock === false}
            className={`px-2 xs:px-3 sm:px-4 md:px-6 py-1.5 xs:py-2 sm:py-2.5 md:py-3 rounded-lg sm:rounded-xl text-xs xs:text-sm sm:text-base font-bold transition-all duration-300 transform focus:outline-none focus:ring-2 sm:focus:ring-4 focus:ring-offset-1 sm:focus:ring-offset-2 shadow-lg hover:shadow-xl flex items-center space-x-1 sm:space-x-2 relative overflow-hidden group/btn flex-shrink-0 ${
              product.inStock === false
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:via-indigo-700 hover:to-blue-800 text-white hover:scale-105 focus:ring-blue-500/30"
            }`}
            aria-label={
              product.inStock === false
                ? "Out of stock"
                : `Add ${product.name} to cart`
            }
            type="button"
          >
            <span className="relative z-10 flex items-center space-x-1 sm:space-x-2">
              <svg
                className={`w-3 h-3 xs:w-4 xs:h-4 sm:w-5 sm:h-5 transition-transform duration-300 ${
                  product.inStock !== false
                    ? "group-hover/btn:scale-110 group-hover/btn:rotate-12"
                    : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.293 1.293A1 1 0 006 15h11M17 21a2 2 0 100-4 2 2 0 000 4zM9 21a2 2 0 100-4 2 2 0 000 4z"
                />
              </svg>
              <span className="hidden sm:inline">
                {product.inStock === false ? "Out of Stock" : "Add to Cart"}
              </span>
              <span className="sm:hidden">
                {product.inStock === false ? "Out" : "Add"}
              </span>
            </span>
            {product.inStock !== false && (
              <div className="absolute inset-0 bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 transform scale-x-0 group-hover/btn:scale-x-100 transition-transform duration-300 origin-left" />
            )}
          </button>
        </div>

        {/* Additional product features/tags - Responsive */}
        {(product.features || product.tags) && (
          <div className="flex flex-wrap gap-1 sm:gap-2 pt-1 sm:pt-2">
            {(product.features || product.tags || [])
              .slice(0, window.innerWidth < 640 ? 2 : 3)
              .map((feature, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-xs font-medium bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 border border-indigo-200/50 truncate max-w-[120px] sm:max-w-none"
                  title={feature}
                >
                  {feature}
                </span>
              ))}
          </div>
        )}
      </div>

      {/* Subtle animated border on hover */}
      <div className="absolute inset-0 rounded-xl sm:rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div className="absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 blur-sm" />
      </div>
    </article>
  );
}
