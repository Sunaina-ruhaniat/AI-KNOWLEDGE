"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Upload,
  FileText,
  X,
  Check,
  Search,
  Filter,
  Plus,
  Trash2,
  Download,
  Eye,
  Clock,
  Tag,
  Building2,
  ArrowLeft,
  MoreVertical,
  History,
  Archive,
  FileUp,
  ChevronDown
} from "lucide-react"

interface AdminGuidelineManagementProps {
  onBack: () => void
}

interface PolicyDocument {
  id: string
  name: string
  bank: string
  version: string
  uploadedBy: string
  uploadDate: string
  status: "active" | "archived" | "draft"
  fileType: string
  fileSize: number
  tags: string[]
}

const banks = ["HDFC", "ICICI", "Axis", "SBI", "Kotak", "Yes Bank", "PNB", "IDFC First"]
const statusOptions = ["active", "archived", "draft"] as const

const mockDocuments: PolicyDocument[] = [
  {
    id: "1",
    name: "HDFC Personal Loan Policy v2",
    bank: "HDFC",
    version: "2.0",
    uploadedBy: "admin@loanai.com",
    uploadDate: "2025-01-15",
    status: "active",
    fileType: "application/pdf",
    fileSize: 2450000,
    tags: ["personal-loan", "eligibility", "roi"]
  },
  {
    id: "2",
    name: "ICICI BT Guideline",
    bank: "ICICI",
    version: "1.5",
    uploadedBy: "admin@loanai.com",
    uploadDate: "2025-01-10",
    status: "active",
    fileType: "application/pdf",
    fileSize: 1800000,
    tags: ["balance-transfer", "bt-policy"]
  },
  {
    id: "3",
    name: "Axis Home Loan Criteria",
    bank: "Axis",
    version: "3.1",
    uploadedBy: "manager@loanai.com",
    uploadDate: "2025-01-08",
    status: "active",
    fileType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    fileSize: 980000,
    tags: ["home-loan", "property", "ltv"]
  },
  {
    id: "4",
    name: "SBI CIBIL Requirements",
    bank: "SBI",
    version: "1.0",
    uploadedBy: "admin@loanai.com",
    uploadDate: "2025-01-05",
    status: "archived",
    fileType: "application/pdf",
    fileSize: 450000,
    tags: ["cibil", "credit-score"]
  },
  {
    id: "5",
    name: "Kotak Income Verification Draft",
    bank: "Kotak",
    version: "0.1",
    uploadedBy: "analyst@loanai.com",
    uploadDate: "2025-01-18",
    status: "draft",
    fileType: "application/pdf",
    fileSize: 1200000,
    tags: ["income", "verification", "draft"]
  },
]

export function AdminGuidelineManagement({ onBack }: AdminGuidelineManagementProps) {
  const [documents, setDocuments] = useState<PolicyDocument[]>(mockDocuments)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedBank, setSelectedBank] = useState<string>("")
  const [selectedStatus, setSelectedStatus] = useState<string>("")
  const [dragOver, setDragOver] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [newDocName, setNewDocName] = useState("")
  const [newDocBank, setNewDocBank] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }, [])

  const handleDragLeave = useCallback(() => {
    setDragOver(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      setShowUploadModal(true)
    }
  }, [])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length > 0) {
      setShowUploadModal(true)
    }
  }

  const handleUpload = async () => {
    if (!newDocName || !newDocBank) return
    
    setUploading(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    const newDoc: PolicyDocument = {
      id: `doc-${Date.now()}`,
      name: newDocName,
      bank: newDocBank,
      version: "1.0",
      uploadedBy: "admin@loanai.com",
      uploadDate: new Date().toISOString().split("T")[0],
      status: "draft",
      fileType: "application/pdf",
      fileSize: 1500000,
      tags: selectedTags
    }
    
    setDocuments(prev => [newDoc, ...prev])
    setUploading(false)
    setShowUploadModal(false)
    setNewDocName("")
    setNewDocBank("")
    setSelectedTags([])
  }

  const toggleDocumentStatus = (id: string) => {
    setDocuments(prev => prev.map(doc => {
      if (doc.id === id) {
        const nextStatus = doc.status === "active" ? "archived" : 
                          doc.status === "archived" ? "draft" : "active"
        return { ...doc, status: nextStatus }
      }
      return doc
    }))
  }

  const deleteDocument = (id: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== id))
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const getStatusBadge = (status: PolicyDocument["status"]) => {
    const styles = {
      active: { bg: "bg-primary/20", text: "text-primary", icon: Check },
      archived: { bg: "bg-muted", text: "text-muted-foreground", icon: Archive },
      draft: { bg: "bg-warning/20", text: "text-warning", icon: Clock },
    }
    const style = styles[status]
    const Icon = style.icon
    
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${style.bg} ${style.text}`}>
        <Icon className="w-3 h-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    )
  }

  const getBankColor = (bank: string) => {
    const colors: Record<string, string> = {
      "HDFC": "bg-blue-500/20 text-blue-400",
      "ICICI": "bg-orange-500/20 text-orange-400",
      "Axis": "bg-pink-500/20 text-pink-400",
      "SBI": "bg-indigo-500/20 text-indigo-400",
      "Kotak": "bg-red-500/20 text-red-400",
      "Yes Bank": "bg-cyan-500/20 text-cyan-400",
      "PNB": "bg-purple-500/20 text-purple-400",
      "IDFC First": "bg-teal-500/20 text-teal-400",
    }
    return colors[bank] || "bg-secondary text-muted-foreground"
  }

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doc.bank.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doc.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesBank = !selectedBank || doc.bank === selectedBank
    const matchesStatus = !selectedStatus || doc.status === selectedStatus
    return matchesSearch && matchesBank && matchesStatus
  })

  const stats = {
    total: documents.length,
    active: documents.filter(d => d.status === "active").length,
    archived: documents.filter(d => d.status === "archived").length,
    draft: documents.filter(d => d.status === "draft").length,
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground">AI Guideline Management</h1>
            <p className="text-muted-foreground mt-1">
              Upload and manage bank policy documents for AI analysis
            </p>
          </div>
          
          <Button
            onClick={() => setShowUploadModal(true)}
            className="mt-4 md:mt-0 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="w-4 h-4 mr-2" />
            Upload Policy
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-card border-border">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stats.total}</p>
                  <p className="text-xs text-muted-foreground">Total Documents</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-card border-border">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Check className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stats.active}</p>
                  <p className="text-xs text-muted-foreground">Active</p>
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
                  <p className="text-2xl font-bold text-foreground">{stats.draft}</p>
                  <p className="text-xs text-muted-foreground">Draft</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-card border-border">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                  <Archive className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stats.archived}</p>
                  <p className="text-xs text-muted-foreground">Archived</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Upload Area */}
        <Card className="mb-6 bg-card border-border">
          <CardContent className="pt-6">
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                dragOver
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
              }`}
            >
              <input
                type="file"
                multiple
                onChange={handleFileSelect}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                accept=".pdf,.doc,.docx"
              />
              
              <FileUp className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-lg font-medium text-foreground">
                Drag & drop policy documents here
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                or click to browse (PDF, DOC, DOCX supported)
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Search and Filters */}
        <Card className="mb-6 bg-card border-border">
          <CardContent className="pt-4 pb-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search documents, banks, or tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 bg-input border-border text-foreground"
                />
              </div>
              
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="border-border text-foreground hover:bg-secondary"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
                <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${showFilters ? "rotate-180" : ""}`} />
              </Button>
            </div>

            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-border">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Filter by Bank</label>
                  <select
                    value={selectedBank}
                    onChange={(e) => setSelectedBank(e.target.value)}
                    className="w-full h-10 px-3 rounded-md bg-input border border-border text-foreground"
                  >
                    <option value="">All Banks</option>
                    {banks.map(bank => (
                      <option key={bank} value={bank}>{bank}</option>
                    ))}
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Filter by Status</label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full h-10 px-3 rounded-md bg-input border border-border text-foreground"
                  >
                    <option value="">All Statuses</option>
                    {statusOptions.map(status => (
                      <option key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Documents Table */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg text-foreground">Policy Documents</CardTitle>
            <CardDescription className="text-muted-foreground">
              {filteredDocuments.length} document(s) found
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Document Name</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Bank</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Version</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Uploaded By</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Upload Date</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDocuments.map((doc) => (
                    <tr key={doc.id} className="border-b border-border hover:bg-secondary/30 transition-colors">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                            <FileText className="w-5 h-5 text-primary" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-foreground truncate">{doc.name}</p>
                            <div className="flex items-center gap-2 mt-1">
                              {doc.tags.slice(0, 2).map(tag => (
                                <span key={tag} className="px-2 py-0.5 rounded-full text-xs bg-secondary text-muted-foreground">
                                  {tag}
                                </span>
                              ))}
                              {doc.tags.length > 2 && (
                                <span className="text-xs text-muted-foreground">+{doc.tags.length - 2}</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getBankColor(doc.bank)}`}>
                          <Building2 className="w-3 h-3" />
                          {doc.bank}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-sm text-foreground">v{doc.version}</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-sm text-muted-foreground">{doc.uploadedBy}</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-sm text-muted-foreground">{doc.uploadDate}</span>
                      </td>
                      <td className="py-4 px-4">
                        {getStatusBadge(doc.status)}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                            <Download className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                            <History className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-muted-foreground hover:text-primary"
                            onClick={() => toggleDocumentStatus(doc.id)}
                          >
                            {doc.status === "active" ? (
                              <Archive className="w-4 h-4" />
                            ) : (
                              <Check className="w-4 h-4" />
                            )}
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                            onClick={() => deleteDocument(doc.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredDocuments.length === 0 && (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-foreground font-medium">No documents found</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Try adjusting your search or filters
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upload Modal */}
        {showUploadModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
            <Card className="w-full max-w-md bg-card border-border m-4">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg text-foreground">Upload Policy Document</CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowUploadModal(false)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Document Name</label>
                  <Input
                    placeholder="e.g., HDFC Personal Loan Policy v2"
                    value={newDocName}
                    onChange={(e) => setNewDocName(e.target.value)}
                    className="bg-input border-border text-foreground"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Bank</label>
                  <select
                    value={newDocBank}
                    onChange={(e) => setNewDocBank(e.target.value)}
                    className="w-full h-10 px-3 rounded-md bg-input border border-border text-foreground"
                  >
                    <option value="">Select bank</option>
                    {banks.map(bank => (
                      <option key={bank} value={bank}>{bank}</option>
                    ))}
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Tags</label>
                  <div className="flex flex-wrap gap-2">
                    {["personal-loan", "home-loan", "bt-policy", "eligibility", "cibil", "income", "roi"].map(tag => (
                      <button
                        key={tag}
                        onClick={() => {
                          setSelectedTags(prev => 
                            prev.includes(tag) 
                              ? prev.filter(t => t !== tag)
                              : [...prev, tag]
                          )
                        }}
                        className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                          selectedTags.includes(tag)
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                        }`}
                      >
                        <Tag className="w-3 h-3 inline mr-1" />
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="flex gap-3 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setShowUploadModal(false)}
                    className="flex-1 border-border text-foreground hover:bg-secondary"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleUpload}
                    disabled={!newDocName || !newDocBank || uploading}
                    className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    {uploading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 mr-2" />
                        Upload
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
