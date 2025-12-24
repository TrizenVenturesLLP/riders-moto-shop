import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, Truck, HeadphonesIcon, Award } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary to-primary/90 text-primary-foreground py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6">About Riders Moto Shop</h1>
            <p className="text-base md:text-xl text-primary-foreground/90">
              Your trusted partner for premium motorcycle parts and accessories since 2020
            </p>
          </div>
        </div>
      </div>

      {/* Story Section */}
      <div className="container mx-auto px-4 py-8 md:py-16">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 md:mb-16">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4 md:mb-6">Our Story</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Founded by passionate riders for riders, Riders Moto Shop was born from a simple idea: 
                every motorcyclist deserves access to high-quality parts and accessories at fair prices.
              </p>
              <p>
                What started as a small garage operation has grown into a trusted online destination 
                for motorcycle enthusiasts across the country. We've built our reputation on three 
                core principles: quality products, exceptional service, and a genuine love for motorcycles.
              </p>
              <p>
                Today, we serve thousands of riders, from weekend warriors to daily commuters, 
                helping them keep their bikes running smoothly and looking great.
              </p>
            </div>
          </div>

          {/* Values Grid */}
          <div className="mb-8 md:mb-16">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6 md:mb-8 text-center">Why Choose Us</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <Card>
                <CardContent className="p-4 md:p-6">
                  <div className="flex items-start space-x-3 md:space-x-4">
                    <div className="bg-primary/10 p-2 md:p-3 rounded-lg flex-shrink-0">
                      <Shield className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-base md:text-lg font-semibold text-foreground mb-2">Quality Guaranteed</h3>
                      <p className="text-sm md:text-base text-muted-foreground">
                        We source only from trusted manufacturers and stand behind every product we sell.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 md:p-6">
                  <div className="flex items-start space-x-3 md:space-x-4">
                    <div className="bg-primary/10 p-2 md:p-3 rounded-lg flex-shrink-0">
                      <Truck className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-base md:text-lg font-semibold text-foreground mb-2">Fast Shipping</h3>
                      <p className="text-sm md:text-base text-muted-foreground">
                        Get your parts quickly with our expedited shipping options and reliable delivery.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 md:p-6">
                  <div className="flex items-start space-x-3 md:space-x-4">
                    <div className="bg-primary/10 p-2 md:p-3 rounded-lg flex-shrink-0">
                      <HeadphonesIcon className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-base md:text-lg font-semibold text-foreground mb-2">Expert Support</h3>
                      <p className="text-sm md:text-base text-muted-foreground">
                        Our team of motorcycle enthusiasts is here to help you find the right parts.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 md:p-6">
                  <div className="flex items-start space-x-3 md:space-x-4">
                    <div className="bg-primary/10 p-2 md:p-3 rounded-lg flex-shrink-0">
                      <Award className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-base md:text-lg font-semibold text-foreground mb-2">Best Prices</h3>
                      <p className="text-sm md:text-base text-muted-foreground">
                        Competitive pricing without compromising on quality or service.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Mission Section */}
          <div className="bg-card rounded-lg p-6 md:p-8 shadow-sm border border-border">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4 text-center">Our Mission</h2>
            <p className="text-base md:text-lg text-muted-foreground text-center leading-relaxed">
              To empower riders with the best motorcycle parts and accessories, backed by 
              exceptional service and expertise. We're not just selling parts – we're supporting 
              a lifestyle and a community of passionate riders.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
