
"use client";

import Link from "next/link";
import { Mail, MessageCircle, ArrowLeft } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/constant/lang";
export default function ContactPage() {
const lang = useLanguage();
const t = translations[lang as "en" | "fr" | "ar"];

  return (
         <div className="bg-white text-gray-900 w-full min-h-screen">
      <div className="bg-white text-gray-900 w-full min-h-screen px-4 py-8 max-w-7xl mx-auto">
                <div className="flex items-center gap-4 mb-6">
          <Link
            href={`/`}
            className="p-2 rounded-full hover:bg-gray-100"

          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-bold">{t.contactUs}</h1>
        </div>

        <div className="flex flex-col gap-6 w-full">
          {/* WhatsApp */}
          <Link
            href="https://wa.me/212719270155"
            target="_blank"
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-green-600 hover:bg-green-700 text-white px-6 py-4 rounded-lg transition"
          >
            <div className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              <span className="font-medium">{t.whatsapp}</span>
            </div>
        
          </Link>

          {/* Email */}
          <Link
            href="mailto:smail.yazidi.contact@gmail.com"
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 rounded-lg transition"
          >
            <div className="flex items-center gap-2">
              <Mail className="w-5 h-5" />
              <span className="font-medium">{t.email}</span>
            </div>

          </Link>
        </div>
      </div>
    </div>    
  );
}
