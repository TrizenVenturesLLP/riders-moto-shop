import { Truck, Clock, Shield, CreditCard, Facebook, Instagram, Youtube, ChevronUp } from 'lucide-react';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-surface border-t border-border">
      {/* Feature Section */}
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-center gap-4">
            <Truck className="text-primary" size={32} />
            <div>
              <h4 className="font-semibold text-surface-foreground">FREE SHIPPING</h4>
              <p className="text-muted-foreground text-sm">Free shipping on all orders</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Clock className="text-primary" size={32} />
            <div>
              <h4 className="font-semibold text-surface-foreground">24/7 SUPPORT</h4>
              <p className="text-muted-foreground text-sm">Contact us anytime, anywhere</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Shield className="text-primary" size={32} />
            <div>
              <h4 className="font-semibold text-surface-foreground">100% AUTHENTIC</h4>
              <p className="text-muted-foreground text-sm">Genuine parts with warranty</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <CreditCard className="text-primary" size={32} />
            <div>
              <h4 className="font-semibold text-surface-foreground">PAYMENT SECURE</h4>
              <p className="text-muted-foreground text-sm">We ensure secure payment</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="bg-background border-t border-border">
        <div className="container mx-auto px-6 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Company Info */}
            <div className="lg:col-span-1">
              <h2 className="text-2xl font-bold text-primary mb-4">RIDERS MOTO SHOP</h2>
              <p className="text-muted-foreground leading-relaxed">
                We are one of the leading motorcycle parts and accessories retailer 
                with expertise in quality products and exceptional service. 
                We drive excellence with our passionate and experienced team.
              </p>
            </div>

            {/* Info Links */}
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">Info</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">About Us</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Contact Us</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">FAQ</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Store Locator</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Blog</a></li>
              </ul>
            </div>

            {/* Policy Links */}
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">Policy</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Return, Refund & Replacement Policy</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Shipping Policy</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Terms of Warranty</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Terms & Conditions</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="bg-surface border-t border-border">
        <div className="container mx-auto px-6 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Copyright */}
            <div className="text-muted-foreground text-sm">
              © 2025, Riders Moto Shop. Built with passion for riders.
            </div>

            {/* Social Icons & Back to Top */}
            <div className="flex items-center gap-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Youtube size={20} />
              </a>
              
              <button
                onClick={scrollToTop}
                className="ml-4 p-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors"
                aria-label="Back to top"
              >
                <ChevronUp size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;