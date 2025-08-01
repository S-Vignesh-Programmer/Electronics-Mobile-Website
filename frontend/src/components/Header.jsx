// src/components/Header.jsx
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";

export default function Header() {
  const { token, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  // Add scroll effect for professional header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when window is resized to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Listen for cart updates
  useEffect(() => {
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      const totalItems = cart.reduce(
        (sum, item) => sum + (item.quantity || 1),
        0
      );
      setCartCount(totalItems);
    };

    // Initial load
    updateCartCount();

    // Listen for cart updates
    window.addEventListener("cartUpdated", updateCartCount);

    return () => {
      window.removeEventListener("cartUpdated", updateCartCount);
    };
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white shadow-lg border-b border-gray-100" : "bg-white"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 lg:h-18">
          {/* Professional Logo */}
          <div className="flex-shrink-0">
            <Link
              to="/"
              className="flex items-center space-x-3 group"
              onClick={closeMobileMenu}
            >
              {/* Logo Icon */}
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center shadow-sm group-hover:shadow-md transition-all duration-200">
                <svg
                  className="w-5 h-5 lg:w-6 lg:h-6 text-white"
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
              </div>
              {/* Logo Text */}
              <div className="flex flex-col">
                <span className="text-xl lg:text-2xl font-bold text-gray-900 tracking-tight">
                  ElectroMart
                </span>
                <span className="text-xs text-gray-500 font-medium -mt-1 hidden sm:block">
                  Premium Electronics
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <Link
              to="/"
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-all duration-200"
            >
              Home
            </Link>

            {token ? (
              <>
                <Link
                  to="/cart"
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-all duration-200 flex items-center space-x-2"
                >
                  <div className="relative">
                    <svg
                      className="w-5 h-5"
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
                    {/* Dynamic Cart Badge */}
                    {cartCount > 0 && (
                      <div className="absolute -top-2 -right-2 min-w-[20px] h-5 bg-red-500 rounded-full text-xs text-white flex items-center justify-center font-semibold shadow-sm px-1">
                        {cartCount > 99 ? "99+" : cartCount}
                      </div>
                    )}
                  </div>
                  <span className="hidden lg:inline">Cart</span>
                </Link>

                {/* Professional User Menu */}
                <div className="flex items-center space-x-3 ml-4 pl-4 border-l border-gray-200">
                  <div className="hidden lg:flex flex-col text-right">
                    <span className="text-sm font-medium text-gray-900">
                      Welcome back
                    </span>
                    <span className="text-xs text-gray-500">Customer</span>
                  </div>
                  <button
                    onClick={logout}
                    className="flex items-center space-x-2 px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
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
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                    <span className="hidden lg:inline">Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3 ml-4">
                <Link
                  to="/signup"
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-all duration-200"
                >
                  Sign Up
                </Link>
                <Link
                  to="/login"
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  Login
                </Link>
              </div>
            )}
          </nav>

          {/* Professional Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200"
              aria-expanded={isMobileMenuOpen}
              aria-label="Toggle navigation menu"
            >
              <div className="w-6 h-6 relative">
                <span
                  className={`absolute block w-full h-0.5 bg-current transform transition-all duration-200 ${
                    isMobileMenuOpen ? "rotate-45 top-2.5" : "top-1.5"
                  }`}
                ></span>
                <span
                  className={`absolute block w-full h-0.5 bg-current transform transition-all duration-200 top-2.5 ${
                    isMobileMenuOpen ? "opacity-0" : "opacity-100"
                  }`}
                ></span>
                <span
                  className={`absolute block w-full h-0.5 bg-current transform transition-all duration-200 ${
                    isMobileMenuOpen ? "-rotate-45 top-2.5" : "top-3.5"
                  }`}
                ></span>
              </div>
            </button>
          </div>
        </div>

        {/* Professional Mobile Navigation Menu */}
        <div
          className={`md:hidden transition-all duration-300 ease-out overflow-hidden ${
            isMobileMenuOpen ? "max-h-96 opacity-100 pb-4" : "max-h-0 opacity-0"
          }`}
        >
          <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
            <div className="space-y-1">
              <Link
                to="/"
                className="block px-4 py-3 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-white rounded-lg transition-all duration-200"
                onClick={closeMobileMenu}
              >
                <div className="flex items-center space-x-3">
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                  <span>Home</span>
                </div>
              </Link>

              {token ? (
                <>
                  <Link
                    to="/cart"
                    className="block px-4 py-3 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-white rounded-lg transition-all duration-200"
                    onClick={closeMobileMenu}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <svg
                          className="w-5 h-5 text-gray-400"
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
                        <span>Shopping Cart</span>
                      </div>
                      {cartCount > 0 && (
                        <div className="min-w-[24px] h-6 bg-red-500 rounded-full text-xs text-white flex items-center justify-center font-semibold px-1">
                          {cartCount > 99 ? "99+" : cartCount}
                        </div>
                      )}
                    </div>
                  </Link>

                  <div className="px-4 py-3 border-t border-gray-200 mt-3 pt-3">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Logged in as
                        </p>
                        <p className="text-sm text-gray-500">Customer</p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        logout();
                        closeMobileMenu();
                      }}
                      className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gray-900 hover:bg-gray-800 text-white text-base font-medium rounded-lg transition-all duration-200"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        />
                      </svg>
                      <span>Logout</span>
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <Link
                    to="/signup"
                    className="block px-4 py-3 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-white rounded-lg transition-all duration-200"
                    onClick={closeMobileMenu}
                  >
                    <div className="flex items-center space-x-3">
                      <svg
                        className="w-5 h-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                        />
                      </svg>
                      <span>Create Account</span>
                    </div>
                  </Link>

                  <Link
                    to="/login"
                    className="block px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white text-base font-medium rounded-lg transition-all duration-200 mt-3"
                    onClick={closeMobileMenu}
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                        />
                      </svg>
                      <span>Sign In</span>
                    </div>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
