import React, { useState } from 'react';
import { Search, ShoppingCart, User, Menu, X, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';

const navigationData = {
  bikes: {
    "YAMAHA": [
      "AEROX 155", "MT 15", "R15 V4 / M", "R15 V3", "R3 - BS4",
      "FZ V2.0", "FZ V3.0", "FZ V4.0", "FZ 25", "FZ X"
    ],
    "ROYAL ENFIELD": [
      "Super Meteor 650", "Himalayan 450", "HIMALAYAN 411",
      "GUERRILLA 450", "SCRAM 411", "HUNTER 350", "METEOR 350",
      "CLASSIC 350 UPTO 2021", "REBORN CLASSIC 350", "THUNDERBIRD X"
    ],
    "BAJAJ": [
      "NS 125", "NS 160", "NS 200", "NS 400 Z", "RS 200",
      "DOMINAR 250", "DOMINAR 400", "AVENGER STREET",
      "PULSAR N 150", "PULSAR N 160"
    ],
    "HONDA": [
      "HNESS CB 350", "CB 350 2024", "RS CB 350", "CB 200 X",
      "CB 300 F", "CB 300 R", "CBR 250 R", "HORNET 2.0",
      "SHINE BS6", "CB UNICORN"
    ],
    "TVS": [
      "APACHE RR 310", "APACH RTR 310", "APACHE 160 2V",
      "APACHE 180 2V", "APACHE 160 4V", "APACHE 200 4V",
      "RONIN 225", "RAIDER 125", "NTORQ", "JUPITER 125 BS4"
    ],
    "KTM": [
      "ADVENTURE 250", "ADVENTURE 390", "DUKE 200 BS6",
      "DUKE 250/390 BS6", "DUKE 200 OLD", "DUKE 250 GEN 3",
      "DUKE 390 GEN 3", "KTM RC 200 - 2022", "KTM RC 200 BS6",
      "KTM RC 390 BS6"
    ],
    "SUZUKI": [
      "V STROM 250", "V STROM 650", "GIXXER 150 SF", "GIXXER 250 SF",
      "GIXXER NAKED 150cc BS3", "GIXXER NAKED 150cc BS6",
      "GIXXER NAKED 250", "ACCESS 125", "BURGMAN", "AVENIS 125"
    ],
    "KAWASAKI": [
      "Z 900 - 2020", "ZX 10 R", "NINJA 1000 SX", "VERSYS 650",
      "VERSYS 1000", "NINJA 250", "NINJA 300", "KAWASAKI W175", "ER - 6N"
    ],
    "BMW": ["BMW G 310 GS", "BMW G 310 R", "BMW G 310 RR"],
    "BENELLI": ["TRK 251", "TRK 502 X", "TNT 300", "IMPERIALE 400"],
    "JAWA - YEZDI": [
      "JAWA 42", "BOBBER 42", "YEZDI ADVENTURE",
      "YEZDI ROADSTER", "YEZDI SCRAMBLER", "YEZDI ADVENTURE 2025"
    ],
    "TRIUMPH": ["SPEED 400", "TIGER SPORT 660"],
    "HERO": ["XPULSE 200", "XTREME 125 R", "XPULSE 210", "XTREME 250R"],
    "HARLEY DAVIDSON": ["X 440", "STREET 750"],
    "DUCATI": ["SCRAMBLER 800"],
    "MAHINDRA": ["MOJO BS3"],
    "OLA": ["OLA S1 GEN 2"],
    "ATHER": ["ATHER 450 X"],
    "VIDA": ["VIDA VX 2"]
  },
  scooters: [
    "AEROX 155", "RAY ZR", "NTORQ", "JUPITER 125 BS4",
    "JUPITER 110 BS6", "ACCESS 125", "BURGMAN",
    "AVENIS 125", "DIO BS6", "DIO BS4"
  ],
  accessories: {
    "TOURING ACCESSORIES": [
      "BACK REST", "TOPRACK SADDLE STAY", "TOP RACK", "LUGGAGE CARRIER",
      "TOP PLATE, SADDLE STAY", "FOG LIGHT CLAMP", "GPS MOUNT"
    ],
    "PROTECTION ACCESSORIES": [
      "CRASH GUARD", "FRAME SLIDER", "SUMP GUARD", "RADIATOR GUARD",
      "HEAD LIGHT GRILL", "CHAIN PROTECTOR", "SILENCER GUARD"
    ],
    "PERFORMANCE ACCESSORIES": [
      "EXHAUST BEND PIPE", "SILENCER - SILVER", "SILENCER - BLACK"
    ],
    "AUXILLARY ACCESSORIES": [
      "FOOT REST", "MASTER CYLINDER CAP", "PADDOCK STAND", "HANDLE BAR",
      "VISOR", "SIDE STAND BASE", "TAIL TIDY"
    ]
  },
  evBikes: {
    "VIDA": ["VIDA VX 2", "Other VIDA models"],
    "OLA": ["OLA S1", "Other OLA models"],
    "ATHER": ["ATHER 450 X", "Other ATHER models"]
  }
};

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4">
        {/* Main Header */}
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <button 
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
            <h1 className="text-xl font-bold text-glow">
              Riders Moto Shop
            </h1>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search bike parts..."
                className="pl-10 bg-surface border-border focus:border-primary"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" className="hidden md:flex">
              <User className="h-4 w-4 mr-2" />
              Account
            </Button>
            <Button variant="ghost" size="sm" className="relative">
              <ShoppingCart className="h-4 w-4" />
              <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground rounded-full text-xs h-5 w-5 flex items-center justify-center">
                3
              </span>
            </Button>
          </div>
        </div>

        {/* Navigation - Desktop */}
        <div className="hidden md:flex items-center py-4 border-t border-border">
          <NavigationMenu>
            <NavigationMenuList className="flex space-x-6">
              <NavigationMenuItem>
                <a href="#" className="text-foreground hover:text-primary transition-colors px-4 py-2">
                  Home
                </a>
              </NavigationMenuItem>

              {/* Shop by Bike */}
              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-foreground hover:text-primary">
                  Shop by Bike
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="max-h-[70vh] overflow-y-auto scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
                    <div className="grid grid-cols-4 gap-6 p-6 w-[800px]">
                      {Object.entries(navigationData.bikes).map(([brand, models]) => (
                        <div key={brand} className="space-y-2">
                          <h4 className="font-semibold text-sm text-primary">{brand}</h4>
                          <div className="space-y-1">
                            {models.map((model) => (
                              <a
                                key={model}
                                href="#"
                                className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                              >
                                {model}
                              </a>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* Shop by Accessories */}
              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-foreground hover:text-primary">
                  Shop by Accessories
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="max-h-[70vh] overflow-y-auto scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
                    <div className="grid grid-cols-2 gap-6 p-6 w-[600px]">
                      {Object.entries(navigationData.accessories).map(([category, items]) => (
                        <div key={category} className="space-y-2">
                          <h4 className="font-semibold text-sm text-primary">{category}</h4>
                          <div className="space-y-1">
                            {items.map((item) => (
                              <a
                                key={item}
                                href="#"
                                className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                              >
                                {item}
                              </a>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* Scooters */}
              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-foreground hover:text-primary">
                  Scooters
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="max-h-[70vh] overflow-y-auto scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
                    <div className="grid grid-cols-2 gap-4 p-6 w-[400px]">
                      {navigationData.scooters.map((scooter) => (
                        <a
                          key={scooter}
                          href="#"
                          className="block text-sm text-muted-foreground hover:text-foreground transition-colors p-2 rounded hover:bg-accent"
                        >
                          {scooter}
                        </a>
                      ))}
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* EV Bikes */}
              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-foreground hover:text-primary">
                  EV Bikes
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="max-h-[70vh] overflow-y-auto scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
                    <div className="grid grid-cols-1 gap-4 p-6 w-[300px]">
                      {Object.entries(navigationData.evBikes).map(([brand, models]) => (
                        <div key={brand} className="space-y-2">
                          <h4 className="font-semibold text-sm text-primary">{brand}</h4>
                          <div className="space-y-1">
                            {models.map((model) => (
                              <a
                                key={model}
                                href="#"
                                className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                              >
                                {model}
                              </a>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <a href="#" className="text-foreground hover:text-primary transition-colors px-4 py-2">
                  Combo
                </a>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <a href="#" className="text-foreground hover:text-primary transition-colors px-4 py-2">
                  Contact
                </a>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <a href="#" className="text-foreground hover:text-primary transition-colors px-4 py-2">
                  About us
                </a>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            {/* Mobile Search */}
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search bike parts..."
                  className="pl-10 bg-surface border-border"
                />
              </div>
            </div>

            {/* Mobile Navigation */}
            <nav className="space-y-2">
              <a href="#" className="block py-2 text-foreground hover:text-primary">Home</a>
              <a href="#" className="block py-2 text-foreground hover:text-primary">Brakes</a>
              <a href="#" className="block py-2 text-foreground hover:text-primary">Tires</a>
              <a href="#" className="block py-2 text-foreground hover:text-primary">Engine Parts</a>
              <a href="#" className="block py-2 text-foreground hover:text-primary">Accessories</a>
              <a href="#" className="block py-2 text-foreground hover:text-primary">Deals</a>
              <Button variant="ghost" className="w-full justify-start mt-4">
                <User className="h-4 w-4 mr-2" />
                My Account
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;