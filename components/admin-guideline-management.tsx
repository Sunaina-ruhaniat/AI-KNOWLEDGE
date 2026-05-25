"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { 
  Upload,
  FileText,
  X,
  Check,
  Search,
  Trash2,
  Eye,
  ArrowLeft,
  Plus,
  Database,
  RefreshCw,
  Clock,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  History,
  Zap,
  Activity,
  Settings,
  Brain,
  Layers,
  CheckCircle2,
  XCircle,
  Archive
} from "lucide-react"

interface AdminGuidelineManagementProps {
  onBack: () => void
}

interface PolicyDocument {
  id: string
  name: string
  bank: string
  category: string
  version: string
  uploadedBy: string
  uploadDate: string
  effectiveDate: string
  expiryDate: string
  status: "active" | "draft" | "archived" | "processing" | "failed"
  indexedStatus: "indexed" | "pending" | "failed"
  fileSize: string
  tags: string[]
  description: string
}

const banks = ["HDFC Bank", "ICICI Bank", "Axis Bank", "SBI", "Kotak Mahindra", "Yes Bank", "PNB", "IDFC First", "Tata Capital", "Bajaj Finance", "RBI"]

const categories = [
  "Bank Policies",
  "Underwriting Rules",
  "ROI Guidelines",
  "FOIR Rules",
  "Eligibility Matrix",
  "Credit Risk Policies",
  "CIBIL Guidelines"
]

const mockDocuments: PolicyDocument[] = [
  {
    id: "1",
    name: "HDFC Personal Loan Policy v2",
    bank: "HDFC Bank",
    category: "Bank Policies",
    version: "2.0",
    uploadedBy: "Admin",
    uploadDate: "2025-01-15",
    effectiveDate: "2025-01-15",
    expiryDate: "2026-01-15",
    status: "active",
    indexedStatus: "indexed",
    fileSize: "2.4 MB",
    tags: ["personal loan", "eligibility", "income criteria"],
    description: "Complete personal loan policy guidelines for HDFC Bank"
  },
  {
    id: "2",
    name: "ICICI BT Guideline Jan 2025",
    bank: "ICICI Bank",
    category: "Underwriting Rules",
    version: "1.5",
    uploadedBy: "Admin",
    uploadDate: "2025-01-10",
    effectiveDate: "2025-01-01",
    expiryDate: "2025-12-31",
    status: "active",
    indexedStatus: "indexed",
    fileSize: "1.8 MB",
    tags: ["balance transfer", "BT", "ROI"],
    description: "Balance transfer guidelines and eligibility criteria"
  },
  {
    id: "3",
    name: "Axis Home Loan Criteria",
    bank: "Axis Bank",
    category: "Eligibility Matrix",
    version: "3.1",
    uploadedBy: "Admin",
    uploadDate: "2025-01-08",
    effectiveDate: "2025-01-08",
    expiryDate: "2025-07-08",
    status: "active",
    indexedStatus: "indexed",
    fileSize: "980 KB",
    tags: ["home loan", "property", "eligibility"],
    description: "Home loan eligibility and property assessment criteria"
  },
  {
    id: "4",
    name: "SBI Income Assessment Policy",
    bank: "SBI",
    category: "FOIR Rules",
    version: "1.0",
    uploadedBy: "Admin",
    uploadDate: "2025-01-05",
    effectiveDate: "2025-01-05",
    expiryDate: "2025-06-30",
    status: "draft",
    indexedStatus: "pending",
    fileSize: "450 KB",
    tags: ["income", "FOIR", "salary"],
    description: "Income assessment and FOIR calculation guidelines"
  },
  {
    id: "5",
    name: "RBI FOIR Guidelines 2024",
    bank: "RBI",
    category: "FOIR Rules",
    version: "1.0",
    uploadedBy: "Admin",
    uploadDate: "2024-11-01",
    effectiveDate: "2024-11-01",
    expiryDate: "2025-10-31",
    status: "active",
    indexedStatus: "indexed",
    fileSize: "1.2 MB",
    tags: ["RBI", "FOIR", "regulation"],
    description: "RBI mandated FOIR guidelines for all lending institutions"
  },
  {
    id: "6",
    name: "CIBIL Score Interpretation",
    bank: "RBI",
    category: "CIBIL Guidelines",
    version: "2.0",
    uploadedBy: "Admin",
    uploadDate: "2024-10-15",
    effectiveDate: "2024-10-15",
    expiryDate: "2025-10-15",
    status: "archived",
    indexedStatus: "indexed",
    fileSize: "750 KB",
    tags: ["CIBIL", "credit score", "assessment"],
    description: "CIBIL score ranges and interpretation guidelines"
  },
]

const ragProcessingSteps = [
  { step: 1, label: "Uploading Document", icon: Upload },
  { step: 2, label: "Extracting Text", icon: FileText },
  { step: 3, label: "Chunking Content", icon: Layers },
  { step: 4, label: "Creating Embeddings", icon: Brain },
  { step: 5, label: "Storing in Vector Database", icon: Database },
  { step: 6, label: "AI Index Ready", icon: CheckCircle2 },
]

export function AdminGuidelineManagement({ onBack }: AdminGuidelineManagementProps) {
  const [documents, setDocuments] = useState<PolicyDocument[]>(mockDocuments)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterBank, setFilterBank] = useState<string>("")
  const [filterCategory, setFilterCategory] = useState<string>("")
  const [filterStatus, setFilterStatus] = useState<string>("")
  const [showUploadForm, setShowUploadForm] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<number | null>(null)
  const [currentUploadStep, setCurrentUploadStep] = useState(0)
  const [showVersionHistory, setShowVersionHistory] = useState<string | null>(null)
  
  // Upload form state
  const [newDocName, setNewDocName] = useState("")
  const [newDocBank, setNewDocBank] = useState("")
  const [newDocCategory, setNewDocCategory] = useState("")
  const [newDocEffectiveDate, setNewDocEffectiveDate] = useState("")
  const [newDocExpiryDate, setNewDocExpiryDate] = useState("")
  const [newDocVersion, setNewDocVersion] = useState("1.0")
  const [newDocTags, setNewDocTags] = useState("")
  const [newDocDescription, setNewDocDescription] = useState("")

  const simulateUpload = () => {
    if (!newDocName || !newDocBank || !newDocCategory) return
    
    setUploadProgress(0)
    setCurrentUploadStep(0)
    
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev === null) return null
        if (prev >= 100) {
          clearInterval(interval)
          
          const newDoc: PolicyDocument = {
            id: `doc-${Date.now()}`,
            name: newDocName,
            bank: newDocBank,
            category: newDocCategory,
            version: newDocVersion,
            uploadedBy: "Admin",
            uploadDate: new Date().toISOString().split("T")[0],
            effectiveDate: newDocEffectiveDate || new Date().toISOString().split("T")[0],
            expiryDate: newDocExpiryDate || "",
            status: "processing",
            indexedStatus: "pending",
            fileSize: `${(Math.random() * 2 + 0.5).toFixed(1)} MB`,
            tags: newDocTags.split(",").map(t => t.trim()).filter(Boolean),
            description: newDocDescription
          }
          
          setDocuments(prev => [newDoc, ...prev])
          
          // Simulate processing completion
          setTimeout(() => {
            setDocuments(prev => prev.map(doc => 
              doc.id === newDoc.id 
                ? { ...doc, status: "active" as const, indexedStatus: "indexed" as const }
                : doc
            ))
          }, 2000)
          
          // Reset form
          setShowUploadForm(false)
          setUploadProgress(null)
          setCurrentUploadStep(0)
          setNewDocName("")
          setNewDocBank("")
          setNewDocCategory("")
          setNewDocEffectiveDate("")
          setNewDocExpiryDate("")
          setNewDocVersion("1.0")
          setNewDocTags("")
          setNewDocDescription("")
          
          return 100
        }
        
        const newProgress = prev + Math.random() * 15
        setCurrentUploadStep(Math.floor((newProgress / 100) * ragProcessingSteps.length))
        return Math.min(newProgress, 100)
      })
    }, 500)
  }

  const toggleDocumentStatus = (id: string) => {
    setDocuments(prev => prev.map(doc => {
      if (doc.id === id) {
        const newStatus = doc.status === "active" ? "archived" : "active"
        return { ...doc, status: newStatus as PolicyDocument["status"] }
      }
      return doc
    }))
  }

  const deleteDocument = (id: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== id))
  }

  const reindexDocument = (id: string) => {
    setDocuments(prev => prev.map(doc => {
      if (doc.id === id) {
        return { ...doc, indexedStatus: "pending" as const }
      }
      return doc
    }))
    
    setTimeout(() => {
      setDocuments(prev => prev.map(doc => {
        if (doc.id === id) {
          return { ...doc, indexedStatus: "indexed" as const }
        }
        return doc
      }))
    }, 2000)
  }

  const getBankColor = (bank: string) => {
    const colors: Record<string, string> = {
      "HDFC Bank": "bg-blue-500/20 text-blue-400",
      "ICICI Bank": "bg-orange-500/20 text-orange-400",
      "Axis Bank": "bg-pink-500/20 text-pink-400",
      "SBI": "bg-indigo-500/20 text-indigo-400",
      "Kotak Mahindra": "bg-red-500/20 text-red-400",
      "Yes Bank": "bg-cyan-500/20 text-cyan-400",
      "PNB": "bg-purple-500/20 text-purple-400",
      "IDFC First": "bg-teal-500/20 text-teal-400",
      "Tata Capital": "bg-yellow-500/20 text-yellow-400",
      "Bajaj Finance": "bg-green-500/20 text-green-400",
      "RBI": "bg-primary/20 text-primary",
    }
    return colors[bank] || "bg-secondary text-muted-foreground"
  }

  const getStatusBadge = (status: PolicyDocument["status"]) => {
    const styles = {
      active: { bg: "bg-primary/20", text: "text-primary", icon: CheckCircle2 },
      draft: { bg: "bg-warning/20", text: "text-warning", icon: Clock },
      archived: { bg: "bg-muted", text: "text-muted-foreground", icon: Archive },
      processing: { bg: "bg-blue-500/20", text: "text-blue-400", icon: RefreshCw },
      failed: { bg: "bg-destructive/20", text: "text-destructive", icon: XCircle },
    }
    const style = styles[status]
    const Icon = style.icon
    
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${style.bg} ${style.text}`}>
        <Icon className={`w-3 h-3 ${status === "processing" ? "animate-spin" : ""}`} />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    )
  }

  const getIndexedBadge = (status: PolicyDocument["indexedStatus"]) => {
    const styles = {
      indexed: { bg: "bg-primary/20", text: "text-primary" },
      pending: { bg: "bg-warning/20", text: "text-warning" },
      failed: { bg: "bg-destructive/20", text: "text-destructive" },
    }
    const style = styles[status]
    
    return (
      <span className={`px-2 py-0.5 rounded text-xs font-medium ${style.bg} ${style.text}`}>
        {status === "indexed" ? "Indexed" : status === "pending" ? "Indexing..." : "Failed"}
      </span>
    )
  }

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doc.bank.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doc.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesBank = !filterBank || doc.bank === filterBank
    const matchesCategory = !filterCategory || doc.category === filterCategory
    const matchesStatus = !filterStatus || doc.status === filterStatus
    return matchesSearch && matchesBank && matchesCategory && matchesStatus
  })

  // Stats
  const totalDocs = documents.length
  const activeDocs = documents.filter(d => d.status === "active").length
  const indexedDocs = documents.filter(d => d.indexedStatus === "indexed").length
  const processingDocs = documents.filter(d => d.status === "processing" || d.indexedStatus === "pending").length

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
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">AI Knowledge Base Management</h1>
            <p className="text-muted-foreground mt-1">
              Manage lender guideline documents for AI underwriting recommendations
            </p>
          </div>
          
          <Button
            onClick={() => setShowUploadForm(true)}
            className="mt-4 md:mt-0 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="w-4 h-4 mr-2" />
            Upload Document
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-card border-border">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{totalDocs}</p>
                  <p className="text-xs text-muted-foreground">Total Documents</p>
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
                  <p className="text-2xl font-bold text-foreground">{activeDocs}</p>
                  <p className="text-xs text-muted-foreground">Active Guidelines</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-card border-border">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Database className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{indexedDocs}</p>
                  <p className="text-xs text-muted-foreground">Indexed Documents</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-card border-border">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                  <Activity className="w-5 h-5 text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{processingDocs}</p>
                  <p className="text-xs text-muted-foreground">Processing Queue</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Upload Form Modal */}
        {showUploadForm && (
          <Card className="mb-6 bg-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Upload className="w-5 h-5 text-primary" />
                Upload New Policy Document
              </CardTitle>
              <CardDescription>
                Upload bank policy documents for AI RAG processing
              </CardDescription>
            </CardHeader>
            <CardContent>
              {uploadProgress !== null ? (
                <div className="space-y-6">
                  {/* RAG Processing Status UI */}
                  <div className="text-center">
                    <div className="relative w-20 h-20 mx-auto mb-4">
                      <div className="absolute inset-0 rounded-full border-4 border-secondary" />
                      <div 
                        className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin"
                        style={{ animationDuration: "1.5s" }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Brain className="w-8 h-8 text-primary" />
                      </div>
                    </div>
                    <h3 className="font-medium text-foreground mb-2">Processing Document</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {ragProcessingSteps[Math.min(currentUploadStep, ragProcessingSteps.length - 1)].label}
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{Math.round(uploadProgress)}%</span>
                      <span>Step {Math.min(currentUploadStep + 1, ragProcessingSteps.length)} of {ragProcessingSteps.length}</span>
                    </div>
                  </div>
                  
                  {/* Processing Steps */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {ragProcessingSteps.map((step, idx) => {
                      const Icon = step.icon
                      const isComplete = idx < currentUploadStep
                      const isCurrent = idx === currentUploadStep
                      
                      return (
                        <div 
                          key={step.step}
                          className={`flex items-center gap-2 p-3 rounded-lg border ${
                            isComplete ? "bg-primary/10 border-primary" :
                            isCurrent ? "bg-warning/10 border-warning" :
                            "bg-secondary/50 border-border"
                          }`}
                        >
                          {isComplete ? (
                            <CheckCircle2 className="w-4 h-4 text-primary" />
                          ) : isCurrent ? (
                            <div className="w-4 h-4 rounded-full border-2 border-warning border-t-transparent animate-spin" />
                          ) : (
                            <Icon className="w-4 h-4 text-muted-foreground" />
                          )}
                          <span className={`text-xs font-medium ${
                            isComplete ? "text-primary" :
                            isCurrent ? "text-warning" :
                            "text-muted-foreground"
                          }`}>
                            {step.label}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Drag & Drop Area */}
                  <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                    <Upload className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                    <p className="text-foreground font-medium mb-1">
                      Drag & drop files here, or click to browse
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Supported formats: PDF, DOCX, XLSX, TXT
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Document Name *</label>
                      <Input
                        placeholder="e.g., HDFC Home Loan Policy"
                        value={newDocName}
                        onChange={(e) => setNewDocName(e.target.value)}
                        className="bg-input border-border text-foreground"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Bank Name *</label>
                      <select
                        value={newDocBank}
                        onChange={(e) => setNewDocBank(e.target.value)}
                        className="w-full h-10 px-3 rounded-md bg-input border border-border text-foreground"
                      >
                        <option value="">Select Bank</option>
                        {banks.map(bank => (
                          <option key={bank} value={bank}>{bank}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Document Category *</label>
                      <select
                        value={newDocCategory}
                        onChange={(e) => setNewDocCategory(e.target.value)}
                        className="w-full h-10 px-3 rounded-md bg-input border border-border text-foreground"
                      >
                        <option value="">Select Category</option>
                        {categories.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Version Number</label>
                      <Input
                        placeholder="1.0"
                        value={newDocVersion}
                        onChange={(e) => setNewDocVersion(e.target.value)}
                        className="bg-input border-border text-foreground"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Effective Date</label>
                      <Input
                        type="date"
                        value={newDocEffectiveDate}
                        onChange={(e) => setNewDocEffectiveDate(e.target.value)}
                        className="bg-input border-border text-foreground"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Expiry Date</label>
                      <Input
                        type="date"
                        value={newDocExpiryDate}
                        onChange={(e) => setNewDocExpiryDate(e.target.value)}
                        className="bg-input border-border text-foreground"
                      />
                    </div>
                    
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm font-medium text-foreground">Tags (comma separated)</label>
                      <Input
                        placeholder="e.g., personal loan, eligibility, income"
                        value={newDocTags}
                        onChange={(e) => setNewDocTags(e.target.value)}
                        className="bg-input border-border text-foreground"
                      />
                    </div>
                    
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm font-medium text-foreground">Description</label>
                      <textarea
                        placeholder="Brief description of the document"
                        value={newDocDescription}
                        onChange={(e) => setNewDocDescription(e.target.value)}
                        className="w-full h-20 px-3 py-2 rounded-md bg-input border border-border text-foreground resize-none"
                      />
                    </div>
                  </div>
                  
                  <div className="flex gap-3 justify-end pt-4 border-t border-border">
                    <Button
                      variant="outline"
                      onClick={() => setShowUploadForm(false)}
                      className="border-border text-foreground"
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="outline"
                      className="border-border text-foreground"
                    >
                      Save Draft
                    </Button>
                    <Button
                      onClick={simulateUpload}
                      disabled={!newDocName || !newDocBank || !newDocCategory}
                      className="bg-primary text-primary-foreground"
                    >
                      <Zap className="w-4 h-4 mr-2" />
                      Upload & Index
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search documents, banks, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-input border-border text-foreground"
            />
          </div>
          
          <select
            value={filterBank}
            onChange={(e) => setFilterBank(e.target.value)}
            className="h-10 px-3 rounded-md bg-input border border-border text-foreground min-w-[140px]"
          >
            <option value="">All Banks</option>
            {banks.map(bank => (
              <option key={bank} value={bank}>{bank}</option>
            ))}
          </select>
          
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="h-10 px-3 rounded-md bg-input border border-border text-foreground min-w-[160px]"
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="h-10 px-3 rounded-md bg-input border border-border text-foreground min-w-[120px]"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
            <option value="processing">Processing</option>
          </select>
        </div>

        {/* Documents Table */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">
              Knowledge Base Documents ({filteredDocuments.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filteredDocuments.map((doc) => (
                <div key={doc.id}>
                  <div 
                    className="flex items-center justify-between p-4 rounded-xl bg-secondary/30 border border-border hover:border-primary/30 transition-colors"
                  >
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <FileText className="w-5 h-5 text-primary" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-medium text-foreground truncate">{doc.name}</h4>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getBankColor(doc.bank)}`}>
                            {doc.bank}
                          </span>
                          <span className="text-xs text-muted-foreground">v{doc.version}</span>
                        </div>
                        <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                          <span>{doc.category}</span>
                          <span>•</span>
                          <span>{doc.fileSize}</span>
                          <span>•</span>
                          <span>Uploaded {doc.uploadDate}</span>
                        </div>
                        {doc.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {doc.tags.map(tag => (
                              <span key={tag} className="px-2 py-0.5 rounded text-xs bg-secondary text-muted-foreground">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 ml-4">
                      <div className="flex flex-col items-end gap-1">
                        {getStatusBadge(doc.status)}
                        {getIndexedBadge(doc.indexedStatus)}
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-muted-foreground hover:text-foreground"
                          onClick={() => setShowVersionHistory(showVersionHistory === doc.id ? null : doc.id)}
                        >
                          <History className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-muted-foreground hover:text-foreground"
                          onClick={() => reindexDocument(doc.id)}
                        >
                          <RefreshCw className={`w-4 h-4 ${doc.indexedStatus === "pending" ? "animate-spin" : ""}`} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleDocumentStatus(doc.id)}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          {doc.status === "active" ? <Archive className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => deleteDocument(doc.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Version History Panel */}
                  {showVersionHistory === doc.id && (
                    <div className="ml-14 mt-2 p-4 rounded-lg bg-card border border-border">
                      <h5 className="font-medium text-foreground mb-3 flex items-center gap-2">
                        <History className="w-4 h-4 text-primary" />
                        Version History
                      </h5>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-2 rounded bg-primary/10 border border-primary/20">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-foreground">v{doc.version}</span>
                            <span className="px-2 py-0.5 rounded text-xs bg-primary text-primary-foreground">Current</span>
                          </div>
                          <span className="text-xs text-muted-foreground">{doc.uploadDate}</span>
                        </div>
                        <div className="flex items-center justify-between p-2 rounded bg-secondary/50">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">v1.0</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">2024-10-15</span>
                            <Button variant="ghost" size="sm" className="text-xs text-primary h-6">
                              Rollback
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              
              {filteredDocuments.length === 0 && (
                <div className="text-center py-12">
                  <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">No documents found</p>
                  <p className="text-sm text-muted-foreground">Try adjusting your search or filters</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Vector Database Monitoring */}
        <Card className="mt-6 bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Database className="w-5 h-5 text-primary" />
              Vector Database Monitoring
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className="p-4 rounded-lg bg-secondary/50 text-center">
                <p className="text-2xl font-bold text-foreground">12,847</p>
                <p className="text-xs text-muted-foreground">Total Embeddings</p>
              </div>
              <div className="p-4 rounded-lg bg-secondary/50 text-center">
                <p className="text-2xl font-bold text-foreground">3,521</p>
                <p className="text-xs text-muted-foreground">Indexed Chunks</p>
              </div>
              <div className="p-4 rounded-lg bg-secondary/50 text-center">
                <p className="text-2xl font-bold text-primary">Healthy</p>
                <p className="text-xs text-muted-foreground">DB Health</p>
              </div>
              <div className="p-4 rounded-lg bg-secondary/50 text-center">
                <p className="text-2xl font-bold text-foreground">2m ago</p>
                <p className="text-xs text-muted-foreground">Last Sync</p>
              </div>
              <div className="p-4 rounded-lg bg-secondary/50 text-center">
                <p className="text-2xl font-bold text-primary">94.2%</p>
                <p className="text-xs text-muted-foreground">Retrieval Accuracy</p>
              </div>
              <div className="p-4 rounded-lg bg-secondary/50 text-center">
                <p className="text-2xl font-bold text-foreground">0</p>
                <p className="text-xs text-muted-foreground">Failed Embeddings</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
