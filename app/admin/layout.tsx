"use client"

import { useState } from "react"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { motion } from "framer-motion"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarCollapsed] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar />
      <motion.main
        initial={false}
        animate={{ marginLeft: sidebarCollapsed ? 80 : 280 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="min-h-screen"
        style={{ marginLeft: 280 }}
      >
        <div className="p-6">
          {children}
        </div>
      </motion.main>
    </div>
  )
}
