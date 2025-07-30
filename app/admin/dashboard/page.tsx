"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { Package, ShoppingCart, Folder, LogOut, Plus, Search, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SidebarTrigger } from "@/components/ui/sidebar"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useLanguage } from "@/app/providers"

// Products Manager Component
function ProductsManager() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const { t } = useLanguage()

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/products")
      const data = await response.json()
      setProducts(data)
    } catch (error) {
      console.error("Error fetching products:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="h-8 bg-muted rounded animate-pulse w-32" />
          <div className="h-10 bg-muted rounded animate-pulse w-24" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded animate-pulse" />
                  <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold">{t("products")}</h1>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          {t("addProduct")}
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder={t("search")}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product: any) => (
            <Card key={product._id}>
              <CardHeader>
                <CardTitle className="text-lg">{product.name?.ar || product.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    {t("price")}: {product.price} دج
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(product.createdAt).toLocaleDateString("ar-DZ")}
                  </p>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">{t("noProducts")}</p>
        </div>
      )}
    </div>
  )
}

// Categories Manager Component
function CategoriesManager() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const { t, language } = useLanguage()

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories")
      const data = await response.json()
      setCategories(data)
    } catch (error) {
      console.error("Error fetching categories:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="h-8 bg-muted rounded animate-pulse w-32" />
          <div className="h-10 bg-muted rounded animate-pulse w-24" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded animate-pulse" />
                  <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold">{t("categories")}</h1>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          {t("addCategory")}
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder={t("search")}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {categories.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category: any) => (
            <Card key={category._id}>
              <CardHeader>
                <CardTitle className="text-lg">{category.name?.[language] || category.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">العربية: {category.name?.ar}</p>
                  <p className="text-sm text-muted-foreground">Français: {category.name?.fr}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(category.createdAt).toLocaleDateString("ar-DZ")}
                  </p>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">{t("noCategories")}</p>
        </div>
      )}
    </div>
  )
}

// Orders Manager Component
function OrdersManager() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const { t } = useLanguage()

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const response = await fetch("/api/admin/orders")
      const data = await response.json()
      setOrders(data)
    } catch (error) {
      console.error("Error fetching orders:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-muted rounded animate-pulse w-32" />
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded animate-pulse" />
                  <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{t("orders")}</h1>

      {orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map((order: any) => (
            <Card key={order._id}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">طلب #{order._id.slice(-6)}</h3>
                    <p className="text-sm text-muted-foreground">
                      {order.customerInfo?.name} - {order.customerInfo?.phone}
                    </p>
                    <p className="text-sm text-muted-foreground">المجموع: {order.total} دج</p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        order.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : order.status === "confirmed"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                      }`}
                    >
                      {order.status === "pending" ? "في الانتظار" : order.status === "confirmed" ? "مؤكد" : "ملغي"}
                    </span>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(order.createdAt).toLocaleDateString("ar-DZ")}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">{t("noOrders")}</p>
        </div>
      )}
    </div>
  )
}

// Admin Sidebar Component
function AdminSidebar({ activeTab, setActiveTab }: { activeTab: string; setActiveTab: (tab: string) => void }) {
  const { t } = useLanguage()

  const menuItems = [
    {
      id: "products",
      title: t("products"),
      icon: Package,
    },
    {
      id: "categories",
      title: t("categories"),
      icon: Folder,
    },
    {
      id: "orders",
      title: t("orders"),
      icon: ShoppingCart,
    },
  ]

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{t("admin")}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton asChild isActive={activeTab === item.id}>
                    <Button variant="ghost" className="w-full justify-start" onClick={() => setActiveTab(item.id)}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}

// Admin Header Component
function AdminHeader() {
  const router = useRouter()
  const { t } = useLanguage()

  const handleLogout = () => {
    localStorage.removeItem("adminToken")
    router.push("/admin")
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <h1 className="text-xl font-bold">
            {t("admin")} - {t("dashboard")}
          </h1>
        </div>

        <Button variant="outline" onClick={handleLogout}>
          <LogOut className="h-4 w-4 mr-2" />
          {t("logout")}
        </Button>
      </div>
    </header>
  )
}

// Admin Dashboard Component
function AdminDashboard({ activeTab }: { activeTab: string }) {
  return (
    <div>
      {activeTab === "products" && <ProductsManager />}
      {activeTab === "orders" && <OrdersManager />}
      {activeTab === "categories" && <CategoriesManager />}
    </div>
  )
}

// Main Dashboard Page
export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState("products")
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const adminToken = localStorage.getItem("adminToken")
    if (!adminToken) {
      router.push("/admin")
    } else {
      setIsAuthenticated(true)
    }
  }, [router])

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    )
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <SidebarInset className="flex-1">
          <AdminHeader />
          <main className="flex-1 p-6">
            <AdminDashboard activeTab={activeTab} />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
