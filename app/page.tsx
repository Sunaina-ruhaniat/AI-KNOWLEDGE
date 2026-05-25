"use client"

import { useState } from "react"
import { LoginScreen } from "@/components/login-screen"
import { Dashboard } from "@/components/dashboard"
import { LoanForm, LoanFormData } from "@/components/loan-form"
import { AdminDocumentUpload } from "@/components/admin-document-upload"
import { AIRecommendation } from "@/components/ai-recommendation"
import { AdminGuidelineManagement } from "@/components/admin-guideline-management"

type View = "login" | "dashboard" | "loan-form" | "admin-documents" | "ai-recommendation" | "admin-guidelines"

export default function Home() {
  const [currentView, setCurrentView] = useState<View>("login")
  const [isAdmin, setIsAdmin] = useState(false)
  const [userEmail, setUserEmail] = useState("")
  const [loanFormData, setLoanFormData] = useState<LoanFormData | null>(null)
  const [selectedApplicationId, setSelectedApplicationId] = useState("")

  const handleLogin = (email: string, _password: string, admin: boolean) => {
    setUserEmail(email)
    setIsAdmin(admin)
    setCurrentView("dashboard")
  }

  const handleLogout = () => {
    setUserEmail("")
    setIsAdmin(false)
    setLoanFormData(null)
    setCurrentView("login")
  }

  const handleNewApplication = () => {
    setCurrentView("loan-form")
  }

  const handleLoanFormSubmit = (data: LoanFormData) => {
    setLoanFormData(data)
    setCurrentView("ai-recommendation")
  }

  const handleViewDocuments = (applicationId: string) => {
    setSelectedApplicationId(applicationId)
    setCurrentView("admin-documents")
  }

  const handleManageGuidelines = () => {
    setCurrentView("admin-guidelines")
  }

  const handleBackToDashboard = () => {
    setCurrentView("dashboard")
  }

  const renderCurrentView = () => {
    switch (currentView) {
      case "login":
        return <LoginScreen onLogin={handleLogin} />
      
      case "dashboard":
        return (
          <Dashboard
            isAdmin={isAdmin}
            userEmail={userEmail}
            onLogout={handleLogout}
            onNewApplication={handleNewApplication}
            onViewDocuments={handleViewDocuments}
            onManageGuidelines={handleManageGuidelines}
          />
        )
      
      case "loan-form":
        return (
          <LoanForm
            onSubmit={handleLoanFormSubmit}
            onBack={handleBackToDashboard}
          />
        )
      
      case "admin-documents":
        return (
          <AdminDocumentUpload
            applicationId={selectedApplicationId}
            onBack={handleBackToDashboard}
          />
        )
      
      case "admin-guidelines":
        return (
          <AdminGuidelineManagement
            onBack={handleBackToDashboard}
          />
        )
      
      case "ai-recommendation":
        return loanFormData ? (
          <AIRecommendation
            formData={loanFormData}
            onBack={() => setCurrentView("loan-form")}
            onNewApplication={handleNewApplication}
          />
        ) : null
      
      default:
        return <LoginScreen onLogin={handleLogin} />
    }
  }

  return (
    <main className="min-h-screen bg-background">
      {renderCurrentView()}
    </main>
  )
}
