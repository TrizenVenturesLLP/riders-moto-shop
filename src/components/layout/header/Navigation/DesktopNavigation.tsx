import { Link } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { ShopByBikeDropdown } from "./ShopByBikeDropdown";
import { BikeBrandGroup } from "../hooks/useBikesByBrand";
import { NavbarItem } from "@/types/navbar";
import {
  Wrench,
  Shield,
  Zap,
  Settings,
  Headphones,
  Camera,
  Lock,
  Star,
} from "lucide-react";

interface DesktopNavigationProps {
  navigationData: NavbarItem[];
  bikesByBrand: Record<string, BikeBrandGroup>;
  isLoadingBikes: boolean;
  accessoryCategories: Array<{ name: string; slug: string }>;
  isScrolledDown: boolean;
}

// Helper function to get appropriate icon for accessory categories
const getAccessoryIcon = (categoryTitle: string) => {
  const title = categoryTitle.toLowerCase();
  if (
    title.includes("protection") ||
    title.includes("safety") ||
    title.includes("guard")
  )
    return Shield;
  if (
    title.includes("performance") ||
    title.includes("exhaust") ||
    title.includes("engine")
  )
    return Zap;
  if (
    title.includes("tool") ||
    title.includes("maintenance") ||
    title.includes("repair")
  )
    return Wrench;
  if (
    title.includes("audio") ||
    title.includes("sound") ||
    title.includes("speaker")
  )
    return Headphones;
  if (
    title.includes("camera") ||
    title.includes("recording") ||
    title.includes("dash")
  )
    return Camera;
  if (
    title.includes("security") ||
    title.includes("alarm") ||
    title.includes("lock")
  )
    return Lock;
  if (
    title.includes("premium") ||
    title.includes("luxury") ||
    title.includes("special")
  )
    return Star;
  return Settings; // Default icon
};

export const DesktopNavigation = ({
  navigationData,
  bikesByBrand,
  isLoadingBikes,
  accessoryCategories,
  isScrolledDown,
}: DesktopNavigationProps) => {
  return (
    <div
      className={`hidden md:flex items-center py-1.5 bg-background border-t border-border w-full transition-[transform,opacity,height] duration-300 ease-in-out relative z-10 ${
        isScrolledDown
          ? "-translate-y-full opacity-0 h-0 overflow-hidden pointer-events-none"
          : "translate-y-0 opacity-100"
      }`}
    >
      <div className="container mx-auto px-4">
        <NavigationMenu>
          <NavigationMenuList className="flex space-x-6">
            {navigationData.map((item, index) => (
              <NavigationMenuItem key={index}>
                {item.submenu ? (
                  <NavigationMenuTrigger className="text-foreground hover:text-primary focus:text-foreground data-[active]:text-foreground data-[state=open]:text-foreground font-medium text-sm bg-transparent hover:bg-transparent focus:bg-transparent data-[active]:bg-transparent data-[state=open]:bg-transparent rounded-none px-3 py-1.5 h-auto">
                    {item.title}
                  </NavigationMenuTrigger>
                ) : (
                  <Link
                    to={item.link}
                    className="text-foreground hover:text-primary transition-colors px-3 py-1.5 font-medium text-sm"
                  >
                    {item.title}
                  </Link>
                )}

                {item.submenu && (
                  <NavigationMenuContent className="overflow-visible p-0 left-0">
                    <div className="max-h-[70vh] overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent bg-popover">
                      {item.title === "Shop by Bike" ? (
                        <ShopByBikeDropdown
                          bikesByBrand={bikesByBrand}
                          isLoadingBikes={isLoadingBikes}
                          accessoryCategories={accessoryCategories}
                        />
                      ) : item.title === "Shop by Accessories" ? (
                        <div className="grid grid-cols-3 gap-6 p-6 w-screen max-w-7xl">
                          {item.submenu.map((category) => {
                            const IconComponent = getAccessoryIcon(
                              category.title
                            );
                            return (
                              <div key={category.title} className="group">
                                {/* Category Header */}
                                <div className="flex items-center gap-3 mb-4 pb-3 border-b border-border">
                                  <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                                    <IconComponent className="h-5 w-5 text-primary" />
                                  </div>
                                  <h4 className="font-bold text-base text-foreground group-hover:text-primary transition-colors">
                                    {category.title}
                                  </h4>
                                </div>

                                {/* Accessory Items */}
                                <div className="space-y-2">
                                  {category.submenu?.map((accessoryItem) => (
                                    <Link
                                      key={accessoryItem.title}
                                      to={accessoryItem.link}
                                      className="block text-sm text-muted-foreground hover:text-primary hover:bg-accent px-3 py-2 rounded-lg transition-all duration-200 group/item"
                                    >
                                      <span className="group-hover/item:translate-x-1 transition-transform inline-block">
                                        {accessoryItem.title}
                                      </span>
                                    </Link>
                                  ))}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : item.title === "Scooters" ? (
                        <div className="grid grid-cols-2 gap-4 p-6 w-80">
                          {item.submenu.map((scooter) => (
                            <a
                              key={scooter.title}
                              href={scooter.link}
                              className="block text-sm text-muted-foreground hover:text-foreground transition-colors p-2 rounded hover:bg-accent"
                            >
                              {scooter.title}
                            </a>
                          ))}
                        </div>
                      ) : item.title === "EV Bikes" ? (
                        <div className="grid grid-cols-1 gap-4 p-6 w-64">
                          {item.submenu.map((brand) => (
                            <div key={brand.title} className="space-y-2">
                              <h4 className="font-semibold text-sm text-primary">
                                {brand.title}
                              </h4>
                              <div className="space-y-1">
                                {brand.submenu?.map((model) => (
                                  <a
                                    key={model.title}
                                    href={model.link}
                                    className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                                  >
                                    {model.title}
                                  </a>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 gap-2 p-6 max-w-xs">
                          {item.submenu.map((subItem) => (
                            <a
                              key={subItem.title}
                              href={subItem.link}
                              className="block text-sm text-muted-foreground hover:text-foreground transition-colors p-2 rounded hover:bg-accent"
                            >
                              {subItem.title}
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  </NavigationMenuContent>
                )}
              </NavigationMenuItem>
            ))}
            {/* Apparels Link */}
            <NavigationMenuItem>
              <Link
                to="/apparels"
                className="text-foreground hover:text-primary transition-colors px-3 py-1.5 font-medium text-sm"
              >
                Apparels
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </div>
  );
};
