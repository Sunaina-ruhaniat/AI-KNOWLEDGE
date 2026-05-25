"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Sparkles,
  FileText,
  Users,
  TrendingUp,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Plus,
  Search,
  Bell,
  Settings,
  LogOut,
  ChevronRight,
  BarChart3,
  Home
} from "lucide-react"
import { Input } from "@/components/ui/input"

interface DashboardProps {
  isAdmin: boolean
  userEmail: string
  onLogout: () => void
  onNewApplication: () => void
  onViewDocuments: (applicationId: string) => void
  onManageGuidelines?: () => void
}

const recentApplications = [
  { id: "APP-001", name: "Rajesh Kumar", amount: 2500000, status: "approved", date: "2024-01-15", score: 87 },
  { id: "APP-002", name: "Priya Sharma", amount: 1800000, status: "pending", date: "2024-01-14", score: 72 },
  { id: "APP-003", name: "Amit Patel", amount: 3500000, status: "conditional", date: "2024-01-14", score: 65 },
  { id: "APP-004", name: "Sunita Reddy", amount: 2000000, status: "rejected", date: "2024-01-13", score: 42 },
  { id: "APP-005", name: "Vikram Singh", amount: 4500000, status: "approved", date: "2024-01-12", score: 91 },
]

export function Dashboard({ isAdmin, userEmail, onLogout, onNewApplication, onViewDocuments, onManageGuidelines }: DashboardProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const stats = {
    totalApplications: 156,
    approved: 89,
    pending: 34,
    rejected: 33,
    avgScore: 74,
    totalDisbursed: 125000000,
  }

  const getStatusBadge = (status: string) => {
    const styles = {
      approved: { bg: "bg-primary/20", text: "text-primary", icon: CheckCircle2 },
      pending: { bg: "bg-warning/20", text: "text-warning", icon: Clock },
      conditional: { bg: "bg-warning/20", text: "text-warning", icon: AlertCircle },
      rejected: { bg: "bg-destructive/20", text: "text-destructive", icon: XCircle },
    }
    const style = styles[status as keyof typeof styles] || styles.pending
    const Icon = style.icon

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${style.bg} ${style.text}`}>
        <Icon className="w-3 h-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    )
  }

  const filteredApplications = recentApplications.filter(app =>
    app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.id.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <span className="text-lg font-semibold text-foreground">LoanAI</span>
                <span className="hidden md:inline text-xs text-muted-foreground ml-2">
                  {isAdmin ? "Admin Dashboard" : "User Dashboard"}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden md:flex relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search applications..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64 pl-9 bg-input border-border text-foreground"
                />
              </div>

              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                <Bell className="w-5 h-5" />
              </Button>

              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                <Settings className="w-5 h-5" />
              </Button>

              <div className="flex items-center gap-3 pl-4 border-l border-border">
                <div className="hidden md:block text-right">
                  <p className="text-sm font-medium text-foreground">{userEmail}</p>
                  <p className="text-xs text-muted-foreground">{isAdmin ? "Administrator" : "User"}</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onLogout}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <LogOut className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Welcome back, {userEmail.split("@")[0]}
            </h1>
            <p className="text-muted-foreground mt-1">
              {isAdmin 
                ? "Manage loan applications and review documents" 
                : "Track your loan applications and submit new ones"}
            </p>
          </div>
          <Button
            onClick={onNewApplication}
            className="mt-4 md:mt-0 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Application
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <Card className="bg-card border-border">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stats.totalApplications}</p>
                  <p className="text-xs text-muted-foreground">Total Applications</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stats.approved}</p>
                  <p className="text-xs text-muted-foreground">Approved</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stats.pending}</p>
                  <p className="text-xs text-muted-foreground">Pending</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                  <XCircle className="w-5 h-5 text-destructive" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stats.rejected}</p>
                  <p className="text-xs text-muted-foreground">Rejected</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stats.avgScore}%</p>
                  <p className="text-xs text-muted-foreground">Avg Score</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">₹{(stats.totalDisbursed / 10000000).toFixed(1)}Cr</p>
                  <p className="text-xs text-muted-foreground">Disbursed</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Applications */}
          <Card className="lg:col-span-2 bg-card border-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg text-foreground">Recent Applications</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Latest loan applications and their status
                  </CardDescription>
                </div>
                <Button variant="ghost" className="text-primary hover:text-primary/80">
                  View All
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filteredApplications.map((app) => (
                  <div
                    key={app.id}
                    className="flex items-center justify-between p-4 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors cursor-pointer"
                    onClick={() => isAdmin && onViewDocuments(app.id)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Users className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{app.name}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>{app.id}</span>
                          <span>•</span>
                          <span>₹{(app.amount / 100000).toFixed(1)}L</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="text-right hidden md:block">
                        <p className="text-sm font-medium text-foreground">Score: {app.score}</p>
                        <p className="text-xs text-muted-foreground">{app.date}</p>
                      </div>
                      {getStatusBadge(app.status)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-lg text-foreground">Quick Actions</CardTitle>
              <CardDescription className="text-muted-foreground">
                Common tasks and shortcuts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start border-border text-foreground hover:bg-secondary"
                onClick={onNewApplication}
              >
                <Plus className="w-4 h-4 mr-3 text-primary" />
                Start New Application
              </Button>
              
              {isAdmin && (
                <>
                  <Button
                    variant="outline"
                    className="w-full justify-start border-border text-foreground hover:bg-secondary"
                    onClick={() => onViewDocuments("APP-001")}
                  >
                    <FileText className="w-4 h-4 mr-3 text-primary" />
                    Review Documents
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="w-full justify-start border-border text-foreground hover:bg-secondary"
                    onClick={onManageGuidelines}
                  >
                    <Settings className="w-4 h-4 mr-3 text-primary" />
                    AI Guidelines
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="w-full justify-start border-border text-foreground hover:bg-secondary"
                  >
                    <Users className="w-4 h-4 mr-3 text-primary" />
                    Manage Users
                  </Button>
                </>
              )}
              
              <Button
                variant="outline"
                className="w-full justify-start border-border text-foreground hover:bg-secondary"
              >
                <BarChart3 className="w-4 h-4 mr-3 text-primary" />
                View Analytics
              </Button>
              
              <Button
                variant="outline"
                className="w-full justify-start border-border text-foreground hover:bg-secondary"
              >
                <Home className="w-4 h-4 mr-3 text-primary" />
                Property Calculator
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* AI Insights */}
        <Card className="mt-6 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-primary/20">
          <CardContent className="py-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">AI-Powered Insights</h3>
                  <p className="text-sm text-muted-foreground">
                    Based on recent trends, approval rates have increased by 12% this month
                  </p>
                </div>
              </div>
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                View Full Report
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
