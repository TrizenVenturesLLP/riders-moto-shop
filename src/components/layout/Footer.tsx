import {
  Truck,
  Clock,
  Shield,
  CreditCard,
  Facebook,
  Instagram,
  Youtube,
  ChevronUp
} from 'lucide-react';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-surface border-t border-border text-sm">
      {/* Feature Strip */}
      <div className="container mx-auto px-6 py-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { Icon: Truck, title: 'FREE SHIPPING', desc: 'On all orders' },
            { Icon: Clock, title: '24/7 SUPPORT', desc: 'Always available' },
            { Icon: Shield, title: '100% AUTHENTIC', desc: 'Genuine products' },
            { Icon: CreditCard, title: 'SECURE PAYMENTS', desc: 'Safe checkout' }
          ].map(({ Icon, title, desc }) => (
            <div key={title} className="flex items-start gap-3">
              <Icon className="text-primary mt-0.5" size={22} />
              <div>
                <h4 className="text-xs font-semibold text-foreground leading-tight">
                  {title}
                </h4>
                <p className="text-xs text-muted-foreground leading-snug">
                  {desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Footer */}
      <div className="bg-background border-t border-border">
        <div className="container mx-auto px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Brand */}
            <div>
              <img src="/rms-logo.jpeg" alt="Riders Moto Shop" className="h-12 mb-3" />
              <p className="text-xs text-muted-foreground leading-relaxed max-w-sm">
                Premium motorcycle parts and accessories built for riders who
                value quality, performance, and reliability.
              </p>
            </div>

            {/* Info */}
            <div>
              <h3 className="text-sm font-semibold mb-3">Info</h3>
              <ul className="space-y-2">
                {['About Us', 'Contact Us', 'FAQ', 'Store Locator', 'Blog'].map(item => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-xs text-muted-foreground hover:text-primary transition-colors"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Policy */}
            <div>
              <h3 className="text-sm font-semibold mb-3">Policy</h3>
              <ul className="space-y-2">
                {[
                  'Privacy Policy',
                  'Return & Refund Policy',
                  'Shipping Policy',
                  'Warranty Terms',
                  'Terms & Conditions'
                ].map(item => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-xs text-muted-foreground hover:text-primary transition-colors"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-surface border-t border-border">
        <div className="container mx-auto px-6 py-3">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
            <p className="text-xs text-muted-foreground">
              © 2025 Riders Moto Shop. All rights reserved.
            </p>

            <div className="flex items-center gap-3">
              {[Facebook, Instagram, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <Icon size={18} />
                </a>
              ))}

              <button
                onClick={scrollToTop}
                className="ml-2 p-1.5 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition"
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
