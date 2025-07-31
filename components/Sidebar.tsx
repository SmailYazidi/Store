"use client"

import { Package, Truck } from "lucide-react"
import Link from "next/link"

import { useLanguage } from "@/app/providers"

export function Sidebar() {
  const { t } = useLanguage()

  const menuItems = [
    {
      title: t("products"),
      icon: Package,
      href: "/",
    },
    {
      title: t("trackOrder"),
      icon: Truck,
      href: "/track-order",
    },
  ]

  return (
null
  )
}
