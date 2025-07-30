"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

interface LanguageContextType {
  language: "ar" | "fr"
  setLanguage: (lang: "ar" | "fr") => void
  t: (key: string) => string
}

const translations = {
  ar: {
    // Navigation
    home: "الرئيسية",
    products: "المنتجات",
    categories: "الفئات",
    orders: "الطلبات",
    trackOrder: "تتبع الطلب",
    admin: "الإدارة",
    dashboard: "لوحة التحكم",

    // Common
    search: "البحث",
    filter: "تصفية",
    all: "الكل",
    loading: "جاري التحميل...",
    save: "حفظ",
    cancel: "إلغاء",
    delete: "حذف",
    edit: "تعديل",
    add: "إضافة",
    confirm: "تأكيد",
    login: "تسجيل الدخول",
    logout: "تسجيل الخروج",
    password: "كلمة المرور",

    // Products
    productName: "اسم المنتج",
    productPrice: "سعر المنتج",
    description: "الوصف",
    category: "الفئة",
    images: "الصور",
    mainImage: "الصورة الرئيسية",
    addProduct: "إضافة منتج",
    editProduct: "تعديل المنتج",
    deleteProduct: "حذف المنتج",
    noProducts: "لا توجد منتجات",
    searchProducts: "البحث في المنتجات",
    uploadImages: "رفع الصور",
    selectMainImage: "اختيار كصورة رئيسية",
    visible: "مرئي",
    hidden: "مخفي",
    selectCategory: "اختر الفئة",

    // Categories
    categoryName: "اسم الفئة",
    addCategory: "إضافة فئة",
    editCategory: "تعديل الفئة",
    deleteCategory: "حذف الفئة",

    // Orders
    orderCode: "رمز الطلب",
    customerName: "اسم العميل",
    customerPhone: "هاتف العميل",
    customerEmail: "بريد العميل",
    customerAddress: "عنوان العميل",
    orderStatus: "حالة الطلب",
    paymentStatus: "حالة الدفع",
    searchOrders: "البحث في الطلبات",
    noOrders: "لا توجد طلبات",

    // Order Status
    processing: "قيد المعالجة",
    confirmed: "مؤكد",
    delivered: "تم التسليم",
    rejected: "مرفوض",

    // Payment Status
    pending: "في الانتظار",
    paid: "مدفوع",
    failed: "فشل",

    // Form
    required: "مطلوب",
    invalidEmail: "بريد إلكتروني غير صحيح",
    invalidPhone: "رقم هاتف غير صحيح",

    // Messages
    success: "تم بنجاح",
    error: "حدث خطأ",
    deleteConfirm: "هل أنت متأكد من الحذف؟",

    // Track Order
    trackOrderTitle: "تتبع الطلب",
    enterOrderCode: "أدخل رمز الطلب",
    trackButton: "تتبع الطلب",
    orderNotFound: "الطلب غير موجود",

    // Order Form
    orderNow: "اطلب الآن",
    customerInfo: "معلومات العميل",
    fullName: "الاسم الكامل",
    phone: "رقم الهاتف",
    email: "البريد الإلكتروني",
    address: "العنوان",
    submitOrder: "إرسال الطلب",

    // Footer
    contactUs: "اتصل بنا",
    followUs: "تابعنا",

    // Status
    status: "الحالة",
  },
  fr: {
    // Navigation
    home: "Accueil",
    products: "Produits",
    categories: "Catégories",
    orders: "Commandes",
    trackOrder: "Suivre commande",
    admin: "Administration",
    dashboard: "Tableau de bord",

    // Common
    search: "Rechercher",
    filter: "Filtrer",
    all: "Tout",
    loading: "Chargement...",
    save: "Enregistrer",
    cancel: "Annuler",
    delete: "Supprimer",
    edit: "Modifier",
    add: "Ajouter",
    confirm: "Confirmer",
    login: "Connexion",
    logout: "Déconnexion",
    password: "Mot de passe",

    // Products
    productName: "Nom du produit",
    productPrice: "Prix du produit",
    description: "Description",
    category: "Catégorie",
    images: "Images",
    mainImage: "Image principale",
    addProduct: "Ajouter produit",
    editProduct: "Modifier produit",
    deleteProduct: "Supprimer produit",
    noProducts: "Aucun produit",
    searchProducts: "Rechercher produits",
    uploadImages: "Télécharger images",
    selectMainImage: "Sélectionner comme image principale",
    visible: "Visible",
    hidden: "Masqué",
    selectCategory: "Sélectionner catégorie",

    // Categories
    categoryName: "Nom de catégorie",
    addCategory: "Ajouter catégorie",
    editCategory: "Modifier catégorie",
    deleteCategory: "Supprimer catégorie",

    // Orders
    orderCode: "Code commande",
    customerName: "Nom client",
    customerPhone: "Téléphone client",
    customerEmail: "Email client",
    customerAddress: "Adresse client",
    orderStatus: "Statut commande",
    paymentStatus: "Statut paiement",
    searchOrders: "Rechercher commandes",
    noOrders: "Aucune commande",

    // Order Status
    processing: "En cours",
    confirmed: "Confirmé",
    delivered: "Livré",
    rejected: "Rejeté",

    // Payment Status
    pending: "En attente",
    paid: "Payé",
    failed: "Échoué",

    // Form
    required: "Requis",
    invalidEmail: "Email invalide",
    invalidPhone: "Téléphone invalide",

    // Messages
    success: "Succès",
    error: "Erreur",
    deleteConfirm: "Êtes-vous sûr de supprimer?",

    // Track Order
    trackOrderTitle: "Suivre commande",
    enterOrderCode: "Entrez le code de commande",
    trackButton: "Suivre commande",
    orderNotFound: "Commande introuvable",

    // Order Form
    orderNow: "Commander maintenant",
    customerInfo: "Informations client",
    fullName: "Nom complet",
    phone: "Téléphone",
    email: "Email",
    address: "Adresse",
    submitOrder: "Envoyer commande",

    // Footer
    contactUs: "Contactez-nous",
    followUs: "Suivez-nous",

    // Status
    status: "Statut",
  },
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<"ar" | "fr">("ar")

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.ar] || key
  }

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
