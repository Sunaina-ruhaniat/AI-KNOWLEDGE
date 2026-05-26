"use client"

import { motion } from "framer-motion"
import {
  FileText,
  CheckCircle,
  Database,
  AlertTriangle,
  Building2,
  ClipboardCheck,
  Eye,
  Activity,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Zap,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts"

const statsCards = [
  {
    title: "Total Documents",
    value: "1,247",
    change: "+12%",
    trend: "up",
    icon: FileText,
    color: "text-chart-1",
    bgColor: "bg-chart-1/10",
  },
  {
    title: "Active Policies",
    value: "892",
    change: "+8%",
    trend: "up",
    icon: CheckCircle,
    color: "text-success",
    bgColor: "bg-success/10",
  },
  {
    title: "Indexed Documents",
    value: "1,189",
    change: "+15%",
    trend: "up",
    icon: Database,
    color: "text-chart-2",
    bgColor: "bg-chart-2/10",
  },
  {
    title: "Failed Processing",
    value: "23",
    change: "-5%",
    trend: "down",
    icon: AlertTriangle,
    color: "text-destructive",
    bgColor: "bg-destructive/10",
  },
  {
    title: "Total Lenders",
    value: "45",
    change: "+3",
    trend: "up",
    icon: Building2,
    color: "text-chart-3",
    bgColor: "bg-chart-3/10",
  },
  {
    title: "Pending Approvals",
    value: "18",
    change: "+6",
    trend: "up",
    icon: ClipboardCheck,
    color: "text-warning",
    bgColor: "bg-warning/10",
  },
  {
    title: "Pending Reviews",
    value: "32",
    change: "-2",
    trend: "down",
    icon: Eye,
    color: "text-chart-5",
    bgColor: "bg-chart-5/10",
  },
  {
    title: "AI Retrieval Accuracy",
    value: "94.7%",
    change: "+1.2%",
    trend: "up",
    icon: Activity,
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
]

const uploadTrendsData = [
  { name: "Mon", uploads: 24, indexed: 22 },
  { name: "Tue", uploads: 35, indexed: 32 },
  { name: "Wed", uploads: 28, indexed: 26 },
  { name: "Thu", uploads: 42, indexed: 40 },
  { name: "Fri", uploads: 38, indexed: 35 },
  { name: "Sat", uploads: 15, indexed: 15 },
  { name: "Sun", uploads: 12, indexed: 11 },
]

const categoryDistribution = [
  { name: "Bank Policies", value: 320, color: "var(--chart-1)" },
  { name: "Underwriting Rules", value: 280, color: "var(--chart-2)" },
  { name: "FOIR Guidelines", value: 180, color: "var(--chart-3)" },
  { name: "ROI Policies", value: 150, color: "var(--chart-4)" },
  { name: "Credit Risk", value: 120, color: "var(--chart-5)" },
]

const processingQueueData = [
  { name: "Queued", count: 12 },
  { name: "Processing", count: 8 },
  { name: "Indexing", count: 5 },
  { name: "Complete", count: 45 },
]

const activityFeed = [
  { id: 1, action: "Document Indexed", item: "HDFC Home Loan Policy v2.3", time: "2 min ago", status: "success" },
  { id: 2, action: "Version Updated", item: "ICICI FOIR Guidelines", time: "5 min ago", status: "info" },
  { id: 3, action: "Processing Failed", item: "Axis Bank Credit Rules", time: "12 min ago", status: "error" },
  { id: 4, action: "Approval Pending", item: "SBI Eligibility Matrix", time: "18 min ago", status: "warning" },
  { id: 5, action: "Document Uploaded", item: "Kotak ROI Policy", time: "25 min ago", status: "success" },
  { id: 6, action: "Vector Sync Complete", item: "Knowledge Base", time: "30 min ago", status: "success" },
]

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            AI Knowledge Base Management Overview
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="w-4 h-4" />
          Last synced: 2 minutes ago
        </div>
      </div>

      {/* Stats Grid */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {statsCards.map((stat) => {
          const Icon = stat.icon
          return (
            <motion.div key={stat.title} variants={item}>
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                      <Icon className={`w-5 h-5 ${stat.color}`} />
                    </div>
                    <div className={`flex items-center gap-1 text-xs ${stat.trend === "up" ? "text-success" : "text-destructive"}`}>
                      {stat.trend === "up" ? (
                        <ArrowUpRight className="w-3 h-3" />
                      ) : (
                        <ArrowDownRight className="w-3 h-3" />
                      )}
                      {stat.change}
                    </div>
                  </div>
                  <div className="mt-3">
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-xs text-muted-foreground mt-1">{stat.title}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </motion.div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upload Trends */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2"
        >
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Upload & Indexing Trends
              </CardTitle>
              <CardDescription>Weekly document processing activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={uploadTrendsData}>
                    <defs>
                      <linearGradient id="uploadGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="indexedGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--chart-2)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="var(--chart-2)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={12} />
                    <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--card)",
                        border: "1px solid var(--border)",
                        borderRadius: "8px",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="uploads"
                      stroke="var(--chart-1)"
                      fill="url(#uploadGradient)"
                      strokeWidth={2}
                    />
                    <Area
                      type="monotone"
                      dataKey="indexed"
                      stroke="var(--chart-2)"
                      fill="url(#indexedGradient)"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Category Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5 text-primary" />
                Document Categories
              </CardTitle>
              <CardDescription>Distribution by type</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {categoryDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--card)",
                        border: "1px solid var(--border)",
                        borderRadius: "8px",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 space-y-2">
                {categoryDistribution.slice(0, 3).map((cat) => (
                  <div key={cat.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                      <span className="text-muted-foreground">{cat.name}</span>
                    </div>
                    <span className="font-medium">{cat.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Processing Queue */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-primary" />
                Processing Queue
              </CardTitle>
              <CardDescription>Real-time indexing status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={processingQueueData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
                    <XAxis type="number" stroke="var(--muted-foreground)" fontSize={12} />
                    <YAxis dataKey="name" type="category" stroke="var(--muted-foreground)" fontSize={12} width={80} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--card)",
                        border: "1px solid var(--border)",
                        borderRadius: "8px",
                      }}
                    />
                    <Bar dataKey="count" fill="var(--primary)" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Activity Feed */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="lg:col-span-2"
        >
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" />
                Recent Activity
              </CardTitle>
              <CardDescription>Latest indexing and document events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activityFeed.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center gap-4 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
                  >
                    <div
                      className={`w-2 h-2 rounded-full ${
                        activity.status === "success"
                          ? "bg-success"
                          : activity.status === "error"
                          ? "bg-destructive"
                          : activity.status === "warning"
                          ? "bg-warning"
                          : "bg-chart-2"
                      }`}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {activity.action}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {activity.item}
                      </p>
                    </div>
                    <Badge variant="outline" className="text-xs shrink-0">
                      {activity.time}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
