// /src/constant/constants.ts

export interface SidebarItem {
  label: string
  icon: string
  route: string
  visible: boolean
}

export const sidebarAdminItems: SidebarItem[] = [
  {
    label: "Dashboard",
    icon: "dashboard",
    route: "/admin/dashboard",
    visible: true,
  },
  {
    label: "Products",
    icon: "box",
    route: "/admin/products",
    visible: true,
  },
  {
    label: "Categories",
    icon: "tag",
    route: "/admin/categories",
    visible: true,
  },
  {
    label: "Orders",
    icon: "shopping-cart",
    route: "/admin/orders",
    visible: true,
  },
  {
    label: "Settings",
    icon: "settings",
    route: "/admin/settings",
    visible: true,
  },
]

export const clientSidebarItems: SidebarItem[] = [
  {
    label: "Home",
    icon: "home",
    route: "/",
    visible: true,
  },

  {
    label: "My Orders",
    icon: "package",
    route: "/client/track-order",
    visible: true,
  },
  {
    label: "Contact",
    icon: "phone",
    route: "/contact",
    visible: true,
  },
]
