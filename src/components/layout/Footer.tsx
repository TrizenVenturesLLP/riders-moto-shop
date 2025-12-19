import { Truck, Clock, Shield, CreditCard, Facebook, Instagram, Youtube, ChevronUp } from 'lucide-react';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-white border-t border-gray-200">
      {/* Feature Section */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 py-5 sm:py-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
                <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
                  <Truck className="text-red-600" size={18} />
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 text-sm mb-1">FREE SHIPPING</h4>
                <p className="text-gray-600 text-xs leading-relaxed">Free shipping on all orders</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
                <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
                  <Clock className="text-red-600" size={18} />
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 text-sm mb-1">24/7 SUPPORT</h4>
                <p className="text-gray-600 text-xs leading-relaxed">Contact us anytime, anywhere</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
                <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
                  <Shield className="text-red-600" size={18} />
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 text-sm mb-1">100% AUTHENTIC</h4>
                <p className="text-gray-600 text-xs leading-relaxed">Genuine parts with warranty</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
                <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
                  <CreditCard className="text-red-600" size={18} />
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 text-sm mb-1">PAYMENT SECURE</h4>
                <p className="text-gray-600 text-xs leading-relaxed">We ensure secure payment</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="bg-white">
        <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {/* Company Info */}
            <div className="lg:col-span-2">
              <h2 className="text-xl font-bold text-red-600 mb-3 uppercase tracking-wide">RIDERS MOTO SHOP</h2>
              <p className="text-gray-600 text-sm leading-relaxed max-w-md">
                We are one of the leading motorcycle parts and accessories retailer 
                with expertise in quality products and exceptional service. 
                We drive excellence with our passionate and experienced team.
              </p>
            </div>

            {/* Info Links */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide">Info</h3>
              <ul className="space-y-2.5">
                <li>
                  <a href="#" className="text-gray-600 hover:text-red-600 transition-colors text-sm inline-block">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-red-600 transition-colors text-sm inline-block">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-red-600 transition-colors text-sm inline-block">
                    FAQ
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-red-600 transition-colors text-sm inline-block">
                    Store Locator
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-red-600 transition-colors text-sm inline-block">
                    Blog
                  </a>
                </li>
              </ul>
            </div>

            {/* Policy Links */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide">Policy</h3>
              <ul className="space-y-2.5">
                <li>
                  <a href="#" className="text-gray-600 hover:text-red-600 transition-colors text-sm inline-block">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-red-600 transition-colors text-sm inline-block">
                    Return, Refund & Replacement Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-red-600 transition-colors text-sm inline-block">
                    Shipping Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-red-600 transition-colors text-sm inline-block">
                    Terms of Warranty
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-red-600 transition-colors text-sm inline-block">
                    Terms & Conditions
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="bg-gray-900 border-t border-gray-800">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            {/* Copyright */}
            <div className="text-gray-400 text-xs sm:text-sm">
              © 2025, Riders Moto Shop. Built with passion for riders.
            </div>

            {/* Social Icons & Back to Top */}
            <div className="flex items-center gap-4">
              <a 
                href="#" 
                className="text-gray-400 hover:text-red-600 transition-colors p-1.5 hover:bg-gray-800 rounded"
                aria-label="Facebook"
              >
                <Facebook size={16} />
              </a>
              <a 
                href="#" 
                className="text-gray-400 hover:text-red-600 transition-colors p-1.5 hover:bg-gray-800 rounded"
                aria-label="Instagram"
              >
                <Instagram size={16} />
              </a>
              <a 
                href="#" 
                className="text-gray-400 hover:text-red-600 transition-colors p-1.5 hover:bg-gray-800 rounded"
                aria-label="YouTube"
              >
                <Youtube size={16} />
              </a>
              
              <button
                onClick={scrollToTop}
                className="ml-2 p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors shadow-lg hover:shadow-xl"
                aria-label="Back to top"
              >
                <ChevronUp size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;