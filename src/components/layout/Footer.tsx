import { Truck, Clock, Shield, CreditCard, Facebook, Instagram, Youtube, ChevronUp } from 'lucide-react';
import rmsLogo from '@/assets/rms-logo.jpg';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-background border-t border-border">
      {/* Feature Section */}
      <div className="bg-muted border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Truck className="text-primary" size={18} />
                </div>
              </div>
            <div>
                <h4 className="font-semibold text-foreground text-sm mb-1">FREE SHIPPING</h4>
                <p className="text-muted-foreground text-xs leading-relaxed">Free shipping on all orders</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Clock className="text-primary" size={18} />
            </div>
          </div>
            <div>
                <h4 className="font-semibold text-foreground text-sm mb-1">24/7 SUPPORT</h4>
                <p className="text-muted-foreground text-xs leading-relaxed">Contact us anytime, anywhere</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Shield className="text-primary" size={18} />
            </div>
          </div>
            <div>
                <h4 className="font-semibold text-foreground text-sm mb-1">100% AUTHENTIC</h4>
                <p className="text-muted-foreground text-xs leading-relaxed">Genuine parts with warranty</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <CreditCard className="text-primary" size={18} />
            </div>
          </div>
            <div>
                <h4 className="font-semibold text-foreground text-sm mb-1">PAYMENT SECURE</h4>
                <p className="text-muted-foreground text-xs leading-relaxed">We ensure secure payment</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="bg-background">
        <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {/* Company Info */}
            <div className="lg:col-span-2">
              <img 
                src={rmsLogo}
                alt="Riders Moto Shop" 
                className="h-10 mb-2 object-contain"
              />
              <p className="text-muted-foreground text-xs leading-relaxed max-w-md">
                We are one of the leading motorcycle parts and accessories retailer 
                with expertise in quality products and exceptional service. 
                We drive excellence with our passionate and experienced team.
              </p>
            </div>

            {/* Info Links */}
            <div>
              <h3 className="text-xs font-semibold text-foreground mb-3 uppercase tracking-wide">Info</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-muted-foreground hover:text-primary transition-colors text-xs inline-block">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-primary transition-colors text-xs inline-block">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-primary transition-colors text-xs inline-block">
                    FAQ
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-primary transition-colors text-xs inline-block">
                    Store Locator
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-primary transition-colors text-xs inline-block">
                    Blog
                  </a>
                </li>
              </ul>
            </div>

            {/* Policy Links */}
            <div>
              <h3 className="text-xs font-semibold text-foreground mb-3 uppercase tracking-wide">Policy</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-muted-foreground hover:text-primary transition-colors text-xs inline-block">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-primary transition-colors text-xs inline-block">
                    Return, Refund & Replacement Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-primary transition-colors text-xs inline-block">
                    Shipping Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-primary transition-colors text-xs inline-block">
                    Terms of Warranty
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-primary transition-colors text-xs inline-block">
                    Terms & Conditions
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="bg-foreground border-t border-border">
        <div className="container mx-auto px-4 sm:px-6 py-3">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
            {/* Copyright */}
            <div className="text-background text-xs sm:text-sm">
              © 2025, Riders Moto Shop. Built with passion for riders.
            </div>

            {/* Social Icons & Back to Top */}
            <div className="flex items-center gap-4">
              <a 
                href="#" 
                className="text-background/70 hover:text-primary transition-colors p-1.5 hover:bg-foreground/80 rounded"
                aria-label="Facebook"
              >
                <Facebook size={16} />
              </a>
              <a 
                href="#" 
                className="text-background/70 hover:text-primary transition-colors p-1.5 hover:bg-foreground/80 rounded"
                aria-label="Instagram"
              >
                <Instagram size={16} />
              </a>
              <a 
                href="#" 
                className="text-background/70 hover:text-primary transition-colors p-1.5 hover:bg-foreground/80 rounded"
                aria-label="YouTube"
              >
                <Youtube size={16} />
              </a>
              
              <button
                onClick={scrollToTop}
                className="ml-2 p-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors shadow-lg hover:shadow-xl"
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