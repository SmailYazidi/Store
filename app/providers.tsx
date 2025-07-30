"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import { ThemeProvider } from "@/components/theme-provider"

interface LanguageContextType {
  language: "ar" | "fr"
  setLanguage: (lang: "ar" | "fr") => void
  t: (key: string) => string
}

const translations = {
  ar: {
    store: "المتجر",
    products: "المنتجات",
    categories: "الفئات",
    orders: "الطلبات",
    trackOrder: "تتبع الطلب",
    admin: "الإدارة",
    dashboard: "لوحة التحكم",
    login: "تسجيل الدخول",
    password: "كلمة المرور",
    loading: "جاري التحميل...",
    search: "البحث",
    addToCart: "إضافة للسلة",
    orderNow: "اطلب الآن",
    price: "السعر",
    description: "الوصف",
    category: "الفئة",
    name: "الاسم",
    email: "البريد الإلكتروني",
    phone: "رقم الهاتف",
    address: "العنوان",
    submit: "إرسال",
    cancel: "إلغاء",
    save: "حفظ",
    delete: "حذف",
    edit: "تعديل",
    add: "إضافة",
    back: "رجوع",
    next: "التالي",
    previous: "السابق",
    total: "المجموع",
    subtotal: "المجموع الفرعي",
    shipping: "الشحن",
    tax: "الضريبة",
    discount: "الخصم",
    quantity: "الكمية",
    status: "الحالة",
    pending: "في الانتظار",
    processing: "قيد المعالجة",
    shipped: "تم الشحن",
    delivered: "تم التسليم",
    cancelled: "ملغي",
    paymentMethod: "طريقة الدفع",
    creditCard: "بطاقة ائتمان",
    cashOnDelivery: "الدفع عند الاستلام",
    bankTransfer: "تحويل بنكي",
  },
  fr: {
    store: "Magasin",
    products: "Produits",
    categories: "Catégories",
    orders: "Commandes",
    trackOrder: "Suivre commande",
    admin: "Administration",
    dashboard: "Tableau de bord",
    login: "Connexion",
    password: "Mot de passe",
    loading: "Chargement...",
    search: "Rechercher",
    addToCart: "Ajouter au panier",
    orderNow: "Commander maintenant",
    price: "Prix",
    description: "Description",
    category: "Catégorie",
    name: "Nom",
    email: "Email",
    phone: "Téléphone",
    address: "Adresse",
    submit: "Soumettre",
    cancel: "Annuler",
    save: "Sauvegarder",
    delete: "Supprimer",
    edit: "Modifier",
    add: "Ajouter",
    back: "Retour",
    next: "Suivant",
    previous: "Précédent",
    total: "Total",
    subtotal: "Sous-total",
    shipping: "Livraison",
    tax: "Taxe",
    discount: "Remise",
    quantity: "Quantité",
    status: "Statut",
    pending: "En attente",
    processing: "En cours",
    shipped: "Expédié",
    delivered: "Livré",
    cancelled: "Annulé",
    paymentMethod: "Méthode de paiement",
    creditCard: "Carte de crédit",
    cashOnDelivery: "Paiement à la livraison",
    bankTransfer: "Virement bancaire",
  },
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}

export function Providers({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<"ar" | "fr">("ar")

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.ar] || key
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
      <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>
    </ThemeProvider>
  )
}
