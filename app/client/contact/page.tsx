import Link from "next/link";
import { Mail, MessageCircle, ArrowLeft } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900 flex items-center justify-center px-4 py-12 relative">
      {/* Go Back Button */}
      <Link
        href="/"
        className="absolute top-6 left-4 flex items-center gap-2 text-gray-700 hover:text-gray-900 text-sm sm:text-base transition"
      >
        <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
        Back
      </Link>

      <div className="w-full max-w-md flex flex-col items-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-center mb-8">
          Contact Us
        </h1>

        <div className="flex flex-col gap-6 w-full">
          {/* WhatsApp */}
          <Link
            href="https://wa.me/212719270155"
            target="_blank"
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-green-600 hover:bg-green-700 text-white px-6 py-4 rounded-lg transition"
          >
            <div className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              <span className="font-medium">WhatsApp</span>
            </div>
            <span className="text-sm break-all sm:text-base">+212 719 270 155</span>
          </Link>

          {/* Email */}
          <Link
            href="mailto:smail.yazidi.contact@gmail.com"
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 rounded-lg transition"
          >
            <div className="flex items-center gap-2">
              <Mail className="w-5 h-5" />
              <span className="font-medium">Email</span>
            </div>
            <span className="text-sm break-all sm:text-base">smail.yazidi.contact@gmail.com</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
