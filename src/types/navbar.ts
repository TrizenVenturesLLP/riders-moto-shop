export interface NavbarItem {
  title: string;
  link?: string;
  submenu?: NavbarItem[];
}

export interface NavbarData {
  navbar: NavbarItem[];
}
