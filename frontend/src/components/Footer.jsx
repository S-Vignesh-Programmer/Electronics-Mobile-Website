import React, { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Linkedin,
  Youtube,
  Heart,
  ArrowUp,
  Sparkles,
  ChevronUp,
} from "lucide-react";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [isHovered, setIsHovered] = useState(null);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    console.log("Newsletter signup:", email);
    setEmail("");
  };

  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: "Home", href: "/" },
    { name: "Products", href: "/products" },
    { name: "About Us", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  const services = [
    { name: "Analytics", href: "/services/analytics" },
    { name: "Integrations", href: "/services/integrations" },
    { name: "Support", href: "/services/support" },
    { name: "Training", href: "/services/training" },
  ];

  const socialLinks = [
    { Icon: Facebook, color: "hover:text-blue-600", href: "#facebook" },
    { Icon: Twitter, color: "hover:text-sky-500", href: "#twitter" },
    { Icon: Linkedin, color: "hover:text-blue-700", href: "#linkedin" },
    { Icon: Youtube, color: "hover:text-red-500", href: "#youtube" },
  ];

  return (
    <footer className="relative bg-white text-gray-800 overflow-hidden border-t border-gray-100">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Floating decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-20 left-10 w-2 h-2 bg-blue-200 rounded-full animate-bounce"
          style={{ animationDelay: "0s" }}
        />
        <div
          className="absolute top-40 right-20 w-1 h-1 bg-purple-200 rounded-full animate-bounce"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute bottom-40 left-1/4 w-1.5 h-1.5 bg-pink-200 rounded-full animate-bounce"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute bottom-20 right-1/3 w-2 h-2 bg-indigo-200 rounded-full animate-bounce"
          style={{ animationDelay: "3s" }}
        />
      </div>

      {/* Main Footer Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-10">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Company Info */}
          <div className="space-y-8 lg:col-span-1">
            <div className="group">
              <div className="flex items-center space-x-2 mb-6">
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Sparkles size={20} className="text-white" />
                  </div>
                  <div/>
                </div>
                <h3 className="text-3xl font-bold bg-gradient-to-r from-gray-800 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                  FormNotify
                </h3>
              </div>
              <p className="text-gray-600 leading-relaxed text-lg mb-8">
                Streamline your notifications and stay connected with powerful
                form management solutions that scale with your business.
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-8">
            <div className="relative">
              <h3 className="text-2xl font-bold text-gray-800 mb-8 flex items-center">
                Quick Links
              </h3>
              <div className="absolute bottom-0 left-0 w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" />
            </div>
            <ul className="space-y-4">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a
                    className="text-gray-600 hover:text-blue-600 transition-all duration-300 flex items-center group text-lg py-2"
                    onMouseEnter={() => setIsHovered(`quick-${index}`)}
                    onMouseLeave={() => setIsHovered(null)}
                  >
                    <div
                      className={`w-2 h-2 bg-blue-500 rounded-full mr-4 transition-all duration-300 ${
                        isHovered === `quick-${index}`
                          ? "scale-150 bg-purple-500"
                          : "scale-0"
                      }`}
                    />
                    <span className="relative">
                      {link.name}
                      <div
                        className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 ${
                          isHovered === `quick-${index}` ? "w-full" : "w-0"
                        }`}
                      />
                    </span>
                    <ChevronUp
                      size={16}
                      className={`ml-auto text-gray-400 transition-all duration-300 ${
                        isHovered === `quick-${index}`
                          ? "rotate-90 text-blue-500"
                          : ""
                      }`}
                    />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-8">
            <div className="relative">
              <h3 className="text-2xl font-bold text-gray-800 mb-8 flex items-center">
                Services
              </h3>
              <div className="absolute bottom-0 left-0 w-16 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" />
            </div>
            <ul className="space-y-4">
              {services.map((service, index) => (
                <li key={index}>
                  <a
                    className="text-gray-600 hover:text-purple-600 transition-all duration-300 flex items-center group text-lg py-2"
                    onMouseEnter={() => setIsHovered(`service-${index}`)}
                    onMouseLeave={() => setIsHovered(null)}
                  >
                    <div
                      className={`w-2 h-2 bg-purple-500 rounded-full mr-4 transition-all duration-300 ${
                        isHovered === `service-${index}`
                          ? "scale-150 bg-pink-500"
                          : "scale-0"
                      }`}
                    />
                    <span className="relative">
                      {service.name}
                      <div
                        className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300 ${
                          isHovered === `service-${index}` ? "w-full" : "w-0"
                        }`}
                      />
                    </span>
                    <ChevronUp
                      size={16}
                      className={`ml-auto text-gray-400 transition-all duration-300 ${
                        isHovered === `service-${index}`
                          ? "rotate-90 text-purple-500"
                          : ""
                      }`}
                    />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-8">
            <div className="relative">
              <h3 className="text-2xl font-bold text-gray-800 mb-8 flex items-center">
                Get in Touch
              </h3>
              <div className="absolute bottom-0 left-0 w-16 h-1 bg-gradient-to-r from-pink-500 to-red-500 rounded-full" />
            </div>

            <div className="space-y-6">
              <div className="flex items-start group cursor-pointer p-4 rounded-2xl hover:bg-gray-50 transition-all duration-300">
                <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-3 rounded-2xl mr-5 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                  <MapPin size={20} className="text-white" />
                </div>
                <div>
                  <p className="text-gray-600 group-hover:text-gray-800 transition-colors duration-300 leading-relaxed text-lg">
                    123 Business Street
                    <br />
                    Chennai, Tamil Nadu 600001
                    <br />
                    India
                  </p>
                </div>
              </div>

              <div className="flex items-center group cursor-pointer p-4 rounded-2xl hover:bg-gray-50 transition-all duration-300">
                <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-3 rounded-2xl mr-5 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                  <Phone size={20} className="text-white" />
                </div>
                <p className="text-gray-600 group-hover:text-gray-800 transition-colors duration-300 text-lg font-medium">
                  +91 510421106057
                </p>
              </div>

              <div className="flex items-center group cursor-pointer p-4 rounded-2xl hover:bg-gray-50 transition-all duration-300">
                <div className="bg-gradient-to-br from-pink-500 to-rose-600 p-3 rounded-2xl mr-5 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                  <Mail size={20} className="text-white" />
                </div>
                <p className="text-gray-600 group-hover:text-gray-800 transition-colors duration-300 text-lg font-medium">
                  hello@formnotify.com
                </p>
              </div>
            </div>

            {/* Social Media */}
            <div className="pt-4">
              <h4 className="font-bold mb-6 text-gray-800 text-xl flex items-center">
                <Sparkles size={20} className="mr-2 text-purple-600" />
                Follow Us
              </h4>
              <div className="flex space-x-3">
                {socialLinks.map(({ Icon, color, href }, index) => (
                  <a
                    key={index}
                    className={`bg-white border-2 border-gray-200 ${color} p-4 rounded-2xl hover:scale-110 hover:-translate-y-2 hover:shadow-xl transition-all duration-300 group`}
                  >
                    <Icon
                      size={22}
                      className="group-hover:rotate-12 transition-transform duration-300"
                    />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>


        {/* Bottom Section */}
        <div className="flex flex-col lg:flex-row justify-between items-center space-y-8 lg:space-y-0">
          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-8 text-center sm:text-left">
            <p className="text-gray-600 flex items-center text-lg">
              © {currentYear} FormNotify. Made with
              <Heart size={18} className="mx-2 text-red-500 animate-pulse" />
              in India
            </p>
            <div className="flex space-x-8 text-base">
              {["Privacy Policy", "Terms of Service", "Cookie Policy"].map(
                (link, index) => (
                  <a
                    key={index}
                    className="text-gray-500 hover:text-gray-800 transition-all duration-300 relative group"
                  >
                    {link}
                    <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 group-hover:w-full transition-all duration-300" />
                  </a>
                )
              )}
            </div>
          </div>

          {/* Back to Top Button */}
          <button
            onClick={scrollToTop}
            className="group relative bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 p-4 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-110 hover:-translate-y-2 active:scale-95"
            aria-label="Back to top"
          >
            <ArrowUp
              size={24}
              className="text-white group-hover:-translate-y-1 group-hover:rotate-12 transition-all duration-300"
            />
          </button>
        </div>
      </div>
    </footer>
  );
};

const SimpleFooterPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Footer Component */}
      <Footer />
    </div>
  );
};

export default SimpleFooterPage;
