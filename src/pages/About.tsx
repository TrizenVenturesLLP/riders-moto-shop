import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Shield, 
  Truck, 
  HeadphonesIcon, 
  Award,
  TrendingUp,
  Heart,
  Wrench,
  CheckCircle2
} from 'lucide-react';
import { Link } from 'react-router-dom';

const About = () => {
  const stats = [
    { label: 'OVER', value: '5+', description: 'Years of Excellence' },
    { label: 'WITH', value: '98%', description: 'Customer Satisfaction' },
    { label: 'SERVING', value: '1000+', description: 'Happy Riders' },
  ];

  const values = [
    {
      icon: Heart,
      title: 'Passion for Riding',
      description: 'We\'re not just sellers, we\'re passionate riders who understand your needs.',
    },
    {
      icon: Shield,
      title: 'Quality Guaranteed',
      description: 'Every product is carefully selected and tested to meet our high standards.',
    },
    {
      icon: Truck,
      title: 'Fast & Reliable Shipping',
      description: 'Get your parts delivered quickly and safely to your doorstep.',
    },
    {
      icon: HeadphonesIcon,
      title: 'Expert Support',
      description: 'Our team of motorcycle enthusiasts is always ready to help you.',
    },
    {
      icon: Award,
      title: 'Best Prices',
      description: 'Competitive pricing without compromising on quality or service.',
    },
    {
      icon: Wrench,
      title: 'Installation Guides',
      description: 'Comprehensive guides to help you install products with confidence.',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section - Rooted in Legacy */}
      <section className="relative bg-gradient-to-br from-primary via-primary/95 to-primary/90 text-primary-foreground py-16 md:py-24 overflow-hidden">
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        ></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Rooted in Legacy,<br />Fueled by Innovation
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/90 leading-relaxed max-w-3xl mx-auto">
              Riders Moto Shop began its journey with a simple vision: to provide motorcycle enthusiasts 
              with premium parts and accessories that combine quality, performance, and style. With years 
              of experience behind us, we continue to push boundaries with a relentless focus on excellence 
              and innovation.
            </p>
          </div>
        </div>
      </section>

      {/* Story Section - Driven by Riders */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Text Content */}
              <div className="space-y-6">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                  Driven by Riders, Built for the Road
                </h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed text-base md:text-lg">
                  <p>
                    We're not just manufacturers or sellers—we're passionate riders. Our young, dynamic, 
                    and skilled team, backed by deep industry experience, curates products that are tested 
                    on real streets, highways, and off-road trails.
                  </p>
                  <p>
                    We understand what bikers crave: raw power, rugged durability, and head-turning design— 
                    because we live the same passion. Every product in our catalog has been carefully selected 
                    to meet the demands of real-world riding.
                  </p>
                  <p>
                    From daily commuters to weekend adventurers, we serve riders who demand the best for their 
                    machines. Our commitment to quality and customer satisfaction drives everything we do.
                  </p>
                </div>
                <div className="pt-4">
                  <Link to="/products">
                    <Button size="lg" className="rounded-none">
                      Explore Our Products
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Image Placeholder - You can replace this with an actual image */}
              <div className="relative">
                <div className="aspect-square rounded-lg overflow-hidden bg-muted border border-border shadow-lg">
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted to-muted/50">
                    <Wrench className="h-24 w-24 text-muted-foreground/30" />
                  </div>
                </div>
                {/* Decorative elements */}
                <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-primary/10 rounded-lg -z-10"></div>
                <div className="absolute -top-4 -left-4 w-24 h-24 bg-primary/5 rounded-lg -z-10"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section - Why Riders Moto Shop */}
      <section className="py-16 md:py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Why Riders Moto Shop?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {stats.map((stat, index) => (
                <Card key={index} className="bg-primary-foreground/10 border-primary-foreground/20 backdrop-blur-sm">
                  <CardContent className="p-8 text-center">
                    <p className="text-sm md:text-base font-semibold uppercase tracking-wider mb-2 text-primary-foreground/80">
                      {stat.label}
                    </p>
                    <p className="text-5xl md:text-6xl font-bold mb-3 text-primary-foreground">
                      {stat.value}
                    </p>
                    <p className="text-base md:text-lg text-primary-foreground/90">
                      {stat.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                What Sets Us Apart
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Our core values drive everything we do, ensuring you get the best experience 
                every time you shop with us.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {values.map((value, index) => {
                const Icon = value.icon;
                return (
                  <Card key={index} className="border-border hover:shadow-lg transition-shadow duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="bg-primary/10 p-3 rounded-lg flex-shrink-0">
                          <Icon className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-foreground mb-2">
                            {value.title}
                          </h3>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {value.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 md:py-24 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="border-border shadow-lg">
              <CardContent className="p-8 md:p-12">
                <div className="text-center space-y-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                    <TrendingUp className="h-8 w-8 text-primary" />
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                    Our Mission
                  </h2>
                  <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                    To empower riders with the best motorcycle parts and accessories, backed by 
                    exceptional service and expertise. We're not just selling parts—we're supporting 
                    a lifestyle and a community of passionate riders who share our love for the open road.
                  </p>
                  <div className="pt-6 flex flex-wrap justify-center gap-4">
                    <div className="flex items-center space-x-2 text-muted-foreground">
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                      <span>Quality Products</span>
                    </div>
                    <div className="flex items-center space-x-2 text-muted-foreground">
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                      <span>Expert Support</span>
                    </div>
                    <div className="flex items-center space-x-2 text-muted-foreground">
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                      <span>Fast Delivery</span>
                    </div>
                    <div className="flex items-center space-x-2 text-muted-foreground">
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                      <span>Best Prices</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Ready to Upgrade Your Ride?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Explore our extensive collection of premium motorcycle parts and accessories. 
              Join thousands of satisfied riders who trust Riders Moto Shop.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/products">
                <Button size="lg" className="rounded-none">
                  Shop Now
                </Button>
              </Link>
              <Link to="/contact">
                <Button size="lg" variant="outline" className="rounded-none">
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
