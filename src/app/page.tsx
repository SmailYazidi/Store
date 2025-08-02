"use client"

import React, { useState } from "react"
import ClientSidebar from "@/components/client/sidebar"
import ClientHeader from "@/components/client/header"
import ClientMain from "@/components/client/main"

export default function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <div className="relative min-h-screen flex flex-col">

      {isSidebarOpen && (
        <div className="fixed inset-0 z-40">
          {isSidebarOpen && <ClientSidebar onClose={() => setIsSidebarOpen(false)} />}

   <div
            className="fixed inset-0 bg-black opacity-50"
            onClick={() => setIsSidebarOpen(false)}
          />
        </div>
      )}


      <div className="flex-1 flex flex-col">
        <ClientHeader onMenuClick={() => setIsSidebarOpen(prev => !prev)} />
        <ClientMain />
      </div>
    </div>
  )
}
