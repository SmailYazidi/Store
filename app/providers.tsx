"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface LanguageContextType {
  language: "ar" | "fr"
  setLanguage: (lang: "ar" | "fr") => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

const translations = {
  ar: {
    store: "المتجر",
    products: "المنتجات",
    categories: "الفئات",
    orders: "الطلبات",
    trackOrder: "تتبع الطلب",
    search: "البحث",
    admin: "الإدارة",
    dashboard: "لوحة التحكم",
    logout: "تسجيل الخروج",
    addProduct: "إضافة منتج",
    addCategory: "إضافة فئة",
    price: "السعر",
    noProducts: "لا توجد منتجات",
    noCategories: "لا توجد فئات",
    noOrders: "لا توجد طلبات",
    orderNow: "اطلب الآن",
    orderOnline: "طلب عبر الإنترنت",
    orderWhatsApp: "طلب عبر واتساب",
    description: "الوصف",
    name: "الاسم",
    phone: "الهاتف",
    email: "البريد الإلكتروني",
    address: "العنوان",
    continue: "متابعة",
    loading: "جاري التحميل...",
    error: "حدث خطأ",
    orderCode: "رمز الطلب",
    customer: "العميل",
    status: "الحالة",
    processing: "قيد المعالجة",
    confirmed: "مؤكد",
    delivered: "تم التسليم",
    rejected: "مرفوض",
    forgotCode: "نسيت رمز الطلب؟",
    contactUs: "اتصل بنا",
    orderSuccess: "تم إنشاء الطلب بنجاح",
    orderDetails: "تفاصيل الطلب",
    copyCode: "نسخ الرمز",
    codeCopied: "تم نسخ الرمز",
    productName: "اسم المنتج",
    total: "المجموع",
    date: "التاريخ",
    payNow: "ادفع الآن",
    orderSummary: "ملخص الطلب",
    orderInfo: "معلومات الطلب",
  },
  fr: {
    store: "Magasin",
    products: "Produits",
    categories: "Catégories",
    orders: "Commandes",
    trackOrder: "Suivre commande",
    search: "Rechercher",
    admin: "Administration",
    dashboard: "Tableau de bord",
    logout: "Déconnexion",
    addProduct: "Ajouter produit",
    addCategory: "Ajouter catégorie",
    price: "Prix",
    noProducts: "Aucun produit",
    noCategories: "Aucune catégorie",
    noOrders: "Aucune commande",
    orderNow: "Commander maintenant",
    orderOnline: "Commander en ligne",
    orderWhatsApp: "Commander via WhatsApp",
    description: "Description",
    name: "Nom",
    phone: "Téléphone",
    email: "Email",
    address: "Adresse",
    continue: "Continuer",
    loading: "Chargement...",
    error: "Une erreur s'est produite",
    orderCode: "Code commande",
    customer: "Client",
    status: "Statut",
    processing: "En cours",
    confirmed: "Confirmé",
    delivered: "Livré",
    rejected: "Rejeté",
    forgotCode: "Code oublié?",
    contactUs: "Nous contacter",
    orderSuccess: "Commande créée avec succès",
    orderDetails: "Détails de la commande",
    copyCode: "Copier le code",
    codeCopied: "Code copié",
    productName: "Nom du produit",
    total: "Total",
    date: "Date",
    payNow: "Payer maintenant",
    orderSummary: "Résumé de la commande",
    orderInfo: "Informations de commande",
  },
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<"ar" | "fr">("ar")

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as "ar" | "fr"
    if (savedLanguage) {
      setLanguage(savedLanguage)
    }
  }, [])

  const handleSetLanguage = (lang: "ar" | "fr") => {
    setLanguage(lang)
    localStorage.setItem("language", lang)
  }

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.ar] || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
