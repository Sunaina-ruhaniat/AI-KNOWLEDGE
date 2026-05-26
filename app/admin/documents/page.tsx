"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  FileText,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Archive,
  RefreshCw,
  GitCompare,
  CheckCircle,
  Clock,
  AlertCircle,
  XCircle,
  Loader2,
  Building2,
  Calendar,
  Upload,
  Download,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface Document {
  id: string
  name: string
  bank: string
  category: string
  version: string
  indexStatus: "indexed" | "processing" | "failed" | "pending"
  uploadDate: string
  lastUpdated: string
  uploadedBy: string
  status: "active" | "draft" | "archived" | "processing" | "failed"
}

const mockDocuments: Document[] = [
  {
    id: "1",
    name: "HDFC Home Loan Policy",
    bank: "HDFC Bank",
    category: "Bank Policies",
    version: "2.3",
    indexStatus: "indexed",
    uploadDate: "2024-01-15",
    lastUpdated: "2024-01-20",
    uploadedBy: "Admin",
    status: "active",
  },
  {
    id: "2",
    name: "ICICI FOIR Guidelines",
    bank: "ICICI Bank",
    category: "FOIR Guidelines",
    version: "1.5",
    indexStatus: "indexed",
    uploadDate: "2024-01-10",
    lastUpdated: "2024-01-18",
    uploadedBy: "John Doe",
    status: "active",
  },
  {
    id: "3",
    name: "Axis Bank Credit Risk Rules",
    bank: "Axis Bank",
    category: "Credit Risk Rules",
    version: "3.0",
    indexStatus: "processing",
    uploadDate: "2024-01-22",
    lastUpdated: "2024-01-22",
    uploadedBy: "Admin",
    status: "processing",
  },
  {
    id: "4",
    name: "SBI Eligibility Matrix",
    bank: "State Bank of India",
    category: "Eligibility Matrix",
    version: "1.0",
    indexStatus: "pending",
    uploadDate: "2024-01-21",
    lastUpdated: "2024-01-21",
    uploadedBy: "Jane Smith",
    status: "draft",
  },
  {
    id: "5",
    name: "Kotak ROI Policy",
    bank: "Kotak Mahindra Bank",
    category: "ROI Policies",
    version: "2.1",
    indexStatus: "indexed",
    uploadDate: "2024-01-05",
    lastUpdated: "2024-01-15",
    uploadedBy: "Admin",
    status: "active",
  },
  {
    id: "6",
    name: "Yes Bank Underwriting Rules",
    bank: "Yes Bank",
    category: "Underwriting Rules",
    version: "1.2",
    indexStatus: "failed",
    uploadDate: "2024-01-19",
    lastUpdated: "2024-01-19",
    uploadedBy: "Mike Johnson",
    status: "failed",
  },
  {
    id: "7",
    name: "IndusInd CIBIL Policy",
    bank: "IndusInd Bank",
    category: "CIBIL Policies",
    version: "1.8",
    indexStatus: "indexed",
    uploadDate: "2024-01-08",
    lastUpdated: "2024-01-12",
    uploadedBy: "Admin",
    status: "archived",
  },
  {
    id: "8",
    name: "PNB Home Loan Guidelines",
    bank: "Punjab National Bank",
    category: "Bank Policies",
    version: "1.0",
    indexStatus: "indexed",
    uploadDate: "2024-01-03",
    lastUpdated: "2024-01-10",
    uploadedBy: "Sarah Wilson",
    status: "active",
  },
]

const statusConfig = {
  active: { label: "Active", color: "bg-success/20 text-success", icon: CheckCircle },
  draft: { label: "Draft", color: "bg-warning/20 text-warning", icon: Clock },
  archived: { label: "Archived", color: "bg-muted text-muted-foreground", icon: Archive },
  processing: { label: "Processing", color: "bg-chart-2/20 text-chart-2", icon: Loader2 },
  failed: { label: "Failed", color: "bg-destructive/20 text-destructive", icon: XCircle },
}

const indexStatusConfig = {
  indexed: { label: "Indexed", color: "bg-success/20 text-success" },
  processing: { label: "Processing", color: "bg-chart-2/20 text-chart-2" },
  failed: { label: "Failed", color: "bg-destructive/20 text-destructive" },
  pending: { label: "Pending", color: "bg-warning/20 text-warning" },
}

export default function DocumentLibraryPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")

  const filteredDocuments = mockDocuments.filter((doc) => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.bank.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || doc.status === statusFilter
    const matchesCategory = categoryFilter === "all" || doc.category === categoryFilter
    return matchesSearch && matchesStatus && matchesCategory
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Document Library</h1>
          <p className="text-muted-foreground mt-1">
            Manage all uploaded policy documents and guidelines
          </p>
        </div>
        <Button asChild className="bg-primary hover:bg-primary/90">
          <Link href="/admin/knowledge-base">
            <Upload className="w-4 h-4 mr-2" />
            Upload New
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search documents..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Bank Policies">Bank Policies</SelectItem>
                <SelectItem value="Underwriting Rules">Underwriting Rules</SelectItem>
                <SelectItem value="FOIR Guidelines">FOIR Guidelines</SelectItem>
                <SelectItem value="ROI Policies">ROI Policies</SelectItem>
                <SelectItem value="Credit Risk Rules">Credit Risk Rules</SelectItem>
                <SelectItem value="Eligibility Matrix">Eligibility Matrix</SelectItem>
                <SelectItem value="CIBIL Policies">CIBIL Policies</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Document Table */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            Documents
          </CardTitle>
          <CardDescription>
            {filteredDocuments.length} documents found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-secondary/30 hover:bg-secondary/30">
                  <TableHead>Document Name</TableHead>
                  <TableHead>Bank</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Version</TableHead>
                  <TableHead>AI Index</TableHead>
                  <TableHead>Upload Date</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead>Uploaded By</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDocuments.map((doc, index) => {
                  const status = statusConfig[doc.status]
                  const indexStatus = indexStatusConfig[doc.indexStatus]
                  const StatusIcon = status.icon

                  return (
                    <motion.tr
                      key={doc.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="group hover:bg-secondary/20"
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                            <FileText className="w-4 h-4 text-primary" />
                          </div>
                          <span className="font-medium">{doc.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-muted-foreground" />
                          {doc.bank}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {doc.category}
                        </Badge>
                      </TableCell>
                      <TableCell>v{doc.version}</TableCell>
                      <TableCell>
                        <Badge className={`${indexStatus.color} border-0 text-xs`}>
                          {indexStatus.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="w-3 h-3" />
                          {doc.uploadDate}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {doc.lastUpdated}
                      </TableCell>
                      <TableCell className="text-sm">{doc.uploadedBy}</TableCell>
                      <TableCell>
                        <Badge className={`${status.color} border-0 text-xs`}>
                          <StatusIcon className={`w-3 h-3 mr-1 ${doc.status === "processing" ? "animate-spin" : ""}`} />
                          {status.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="w-4 h-4 mr-2" />
                              View
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="w-4 h-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Download className="w-4 h-4 mr-2" />
                              Download
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <RefreshCw className="w-4 h-4 mr-2" />
                              Reindex
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <GitCompare className="w-4 h-4 mr-2" />
                              Compare Versions
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Archive className="w-4 h-4 mr-2" />
                              Archive
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </motion.tr>
                  )
                })}
              </TableBody>
            </Table>
          </div>

          {/* Pagination placeholder */}
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-muted-foreground">
              Showing 1-{filteredDocuments.length} of {filteredDocuments.length} documents
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button variant="outline" size="sm" disabled>
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
