export interface NavbarItem {
  title: string;
  slug?: string;
  link?: string;
  submenu?: NavbarItem[];
}

export interface NavbarData {
  navbar: NavbarItem[];
}
