import { UserRole } from "@/types/enums";

export interface NavItem {
  label: string;
  href: string;
  icon: string; // lucide icon name
}

export const userNavItems: NavItem[] = [
  { label: "Beranda", href: "/dashboard", icon: "home" },
  { label: "Pesanan", href: "/orders", icon: "package" },
  { label: "Order", href: "/order", icon: "plus-circle" },
  { label: "Dompet", href: "/wallet", icon: "wallet" },
  { label: "Profil", href: "/profile", icon: "user" },
];

export const courierNavItems: NavItem[] = [
  { label: "Beranda", href: "/dashboard", icon: "home" },
  { label: "Misi", href: "/mission", icon: "navigation" },
  { label: "Riwayat", href: "/history", icon: "clock" },
  { label: "Dompet", href: "/wallet", icon: "wallet" },
  { label: "Profil", href: "/profile", icon: "user" },
];

export const adminNavItems: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: "layout-dashboard" },
  { label: "Tarif", href: "/pricing", icon: "tag" },
  { label: "Armada", href: "/fleet", icon: "truck" },
  { label: "Terminal", href: "/terminal", icon: "scan-line" },
  { label: "Pengguna", href: "/users", icon: "users" },
  { label: "Kurir", href: "/couriers", icon: "bike" },
  { label: "Keuangan", href: "/finance", icon: "banknote" },
  { label: "Pengaturan", href: "/settings", icon: "settings" },
];

export function getNavItems(role: UserRole): NavItem[] {
  switch (role) {
    case UserRole.USER:
      return userNavItems;
    case UserRole.COURIER:
      return courierNavItems;
    case UserRole.ADMIN:
      return adminNavItems;
    default:
      return [];
  }
}
