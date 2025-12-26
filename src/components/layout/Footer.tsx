import React, { useState } from 'react';
import { Truck, Clock, Shield, CreditCard, Facebook, Instagram, Youtube, ChevronUp, Calendar, ChevronDown } from 'lucide-react';
import rmsLogo from '@/assets/rms-logo.jpg';

const Footer = () => {
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [isPolicyOpen, setIsPolicyOpen] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-background border-t border-border">
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Feature Section - Top Row */}
        <div className="mb-4 sm:mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {/* FREE SHIPPING */}
            {/* <div className="flex items-center gap-2.5">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Truck className="text-primary" size={18} />
                </div>
              </div>
              <div>
                <h4 className="font-bold text-foreground text-sm mb-0.5 uppercase tracking-wide">FREE SHIPPING</h4>
                <p className="text-muted-foreground text-xs leading-relaxed">Free shipping on all orders</p>
              </div>
            </div> */}
            
            {/* SUPPORT (MON TO SAT) */}
            {/* <div className="flex items-center gap-2.5 ml-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Calendar className="text-primary" size={18} />
                </div>
              </div>
              <div>
                <h4 className="font-bold text-foreground text-sm mb-0.5 uppercase tracking-wide">SUPPORT (MON TO SAT)</h4>
                <p className="text-muted-foreground text-xs leading-relaxed">Contact us 10:00AM to 6:00PM</p>
              </div>
            </div> */}
            
            {/* 100% TRUST */}
            {/* <div className="flex items-center gap-2.5 ml-8">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Shield className="text-primary" size={18} />
                </div>
              </div>
              <div>
                <h4 className="font-bold text-foreground text-sm mb-0.5 uppercase tracking-wide">100% TRUST</h4>
                <p className="text-muted-foreground text-xs leading-relaxed">We provide install guide</p>
              </div>
            </div> */}
            
            {/* PAYMENT SECURE */}
            {/* <div className="flex items-center gap-2.5 ml-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <CreditCard className="text-primary" size={18} />
                </div>
              </div>
              <div>
                <h4 className="font-bold text-foreground text-sm mb-0.5 uppercase tracking-wide">PAYMENT SECURE</h4>
                <p className="text-muted-foreground text-xs leading-relaxed">We ensure secure payment</p>
              </div>
            </div> */}
          </div>
        </div>

        {/* Main Footer Content - Middle Section */}
        <div className="mb-4 sm:mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 lg:gap-12 items-start">
            {/* Company Info - Left Column */}
            <div className="md:col-span-1 md:-mt-10">
              <div className="mb-3 md:mb-2">
                <img 
                  src={rmsLogo}
                  alt="Riders Moto Shop" 
                  className="h-20 sm:h-24 md:h-[150px] w-auto object-contain mx-auto md:mx-0"
                />
              </div>
              <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed line-clamp-3 mt-2 text-center md:text-left">
                We are one of the leading Two Wheeler Accessories Manufacturer and Supplier 
                whose has the roots in manufacturing & supplying since 1996. We Drive the 
                Management with Young, Skilled and Experienced Team.
              </p>
            </div>

            {/* Info Links - Middle Column */}
            <div className="md:col-span-1 md:ml-28 border-t md:border-t-0 border-border pt-4 md:pt-0 mt-4 md:mt-0">
              <button
                onClick={() => setIsInfoOpen(!isInfoOpen)}
                className="w-full md:w-auto flex items-center justify-between md:justify-start gap-2 text-sm font-bold text-foreground mb-3 md:mb-4 uppercase tracking-wide text-left py-2 md:py-0"
              >
                <span>Info</span>
                <ChevronDown 
                  className={`h-4 w-4 md:hidden transition-transform ${isInfoOpen ? 'rotate-180' : ''}`}
                />
              </button>
              <ul className={`space-y-2 mt-2 text-left transition-all duration-200 ${isInfoOpen ? 'block' : 'hidden md:block'}`}>
                <li>
                  <a href="/about" className="text-muted-foreground hover:text-primary transition-colors text-xs sm:text-sm inline-block">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="/contact" className="text-muted-foreground hover:text-primary transition-colors text-xs sm:text-sm inline-block">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="/faq" className="text-muted-foreground hover:text-primary transition-colors text-xs sm:text-sm inline-block">
                    FAQ
                  </a>
                </li>
              </ul>
            </div>

            {/* Policy Links - Right Column */}
            <div className="md:col-span-1 md:ml-10 border-t md:border-t-0 border-border pt-4 md:pt-0 mt-4 md:mt-0">
              <button
                onClick={() => setIsPolicyOpen(!isPolicyOpen)}
                className="w-full md:w-auto flex items-center justify-between md:justify-start gap-2 text-sm font-bold text-foreground mb-3 md:mb-4 uppercase tracking-wide text-left py-2 md:py-0"
              >
                <span>Policy</span>
                <ChevronDown 
                  className={`h-4 w-4 md:hidden transition-transform ${isPolicyOpen ? 'rotate-180' : ''}`}
                />
              </button>
              <ul className={`space-y-2 mt-2 text-left transition-all duration-200 ${isPolicyOpen ? 'block' : 'hidden md:block'}`}>
                <li>
                  <a href="/privacy-policy" className="text-muted-foreground hover:text-primary transition-colors text-xs sm:text-sm inline-block">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="/return-policy" className="text-muted-foreground hover:text-primary transition-colors text-xs sm:text-sm inline-block">
                    Return, Refund & Replacement Policy
                  </a>
                </li>
                <li>
                  <a href="/shipping-policy" className="text-muted-foreground hover:text-primary transition-colors text-xs sm:text-sm inline-block">
                    Shipping Policy
                  </a>
                </li>
                <li>
                  <a href="/warranty" className="text-muted-foreground hover:text-primary transition-colors text-xs sm:text-sm inline-block">
                    Terms of Warranty
                  </a>
                </li>
                <li>
                  <a href="/terms" className="text-muted-foreground hover:text-primary transition-colors text-xs sm:text-sm inline-block">
                    Terms & Conditions
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Section - Copyright and Social Media */}
        <div className="pt-4 border-t border-border">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4">
            {/* Copyright - Left */}
            <div className="text-muted-foreground text-[10px] xs:text-xs sm:text-sm text-center sm:text-left order-2 sm:order-1">
              © 2025, Riders Moto Shop. Designed & Developed with passion for riders.
            </div>

            {/* Social Icons & Back to Top - Right */}
            <div className="flex items-center gap-2 sm:gap-3 order-1 sm:order-2">
              <a 
                href="https://facebook.com" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors p-1.5 sm:p-2 hover:bg-accent rounded-full"
                aria-label="Facebook"
              >
                <Facebook size={16} className="sm:w-[18px] sm:h-[18px]" />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors p-1.5 sm:p-2 hover:bg-accent rounded-full"
                aria-label="Instagram"
              >
                <Instagram size={16} className="sm:w-[18px] sm:h-[18px]" />
              </a>
              <a 
                href="https://youtube.com" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors p-1.5 sm:p-2 hover:bg-accent rounded-full"
                aria-label="YouTube"
              >
                <Youtube size={16} className="sm:w-[18px] sm:h-[18px]" />
              </a>
              
              {/* Scroll to Top Button */}
              <button
                onClick={scrollToTop}
                className="ml-1 p-2 sm:p-2.5 bg-primary/10 text-primary rounded-full hover:bg-primary/20 transition-colors shadow-md hover:shadow-lg"
                aria-label="Back to top"
              >
                <ChevronUp size={14} className="sm:w-4 sm:h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;