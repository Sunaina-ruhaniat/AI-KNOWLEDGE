"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Upload,
  FileText,
  X,
  Check,
  Search,
  Trash2,
  Eye,
  ArrowLeft,
  Plus
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
  status: "active" | "inactive"
  fileSize: string
}

const banks = ["HDFC", "ICICI", "Axis", "SBI", "Kotak", "Yes Bank", "PNB", "IDFC First", "RBI"]

const mockDocuments: PolicyDocument[] = [
  {
    id: "1",
    name: "HDFC Personal Loan Policy v2",
    bank: "HDFC",
    version: "2.0",
    uploadedBy: "Admin",
    uploadDate: "2025-01-15",
    status: "active",
    fileSize: "2.4 MB"
  },
  {
    id: "2",
    name: "ICICI BT Guideline Jan 2025",
    bank: "ICICI",
    version: "1.5",
    uploadedBy: "Admin",
    uploadDate: "2025-01-10",
    status: "active",
    fileSize: "1.8 MB"
  },
  {
    id: "3",
    name: "Axis Home Loan Criteria",
    bank: "Axis",
    version: "3.1",
    uploadedBy: "Admin",
    uploadDate: "2025-01-08",
    status: "active",
    fileSize: "980 KB"
  },
  {
    id: "4",
    name: "SBI Income Assessment Policy",
    bank: "SBI",
    version: "1.0",
    uploadedBy: "Admin",
    uploadDate: "2025-01-05",
    status: "inactive",
    fileSize: "450 KB"
  },
  {
    id: "5",
    name: "RBI FOIR Guidelines 2024",
    bank: "RBI",
    version: "1.0",
    uploadedBy: "Admin",
    uploadDate: "2024-11-01",
    status: "active",
    fileSize: "1.2 MB"
  },
]

export function AdminGuidelineManagement({ onBack }: AdminGuidelineManagementProps) {
  const [documents, setDocuments] = useState<PolicyDocument[]>(mockDocuments)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterBank, setFilterBank] = useState<string>("")
  const [filterStatus, setFilterStatus] = useState<string>("")
  const [showUploadForm, setShowUploadForm] = useState(false)
  const [newDocName, setNewDocName] = useState("")
  const [newDocBank, setNewDocBank] = useState("")

  const toggleDocumentStatus = (id: string) => {
    setDocuments(prev => prev.map(doc => {
      if (doc.id === id) {
        return { ...doc, status: doc.status === "active" ? "inactive" : "active" }
      }
      return doc
    }))
  }

  const deleteDocument = (id: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== id))
  }

  const handleUpload = () => {
    if (!newDocName || !newDocBank) return
    
    const newDoc: PolicyDocument = {
      id: `doc-${Date.now()}`,
      name: newDocName,
      bank: newDocBank,
      version: "1.0",
      uploadedBy: "Admin",
      uploadDate: new Date().toISOString().split("T")[0],
      status: "active",
      fileSize: `${(Math.random() * 2 + 0.5).toFixed(1)} MB`
    }
    
    setDocuments(prev => [newDoc, ...prev])
    setShowUploadForm(false)
    setNewDocName("")
    setNewDocBank("")
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
      "RBI": "bg-primary/20 text-primary",
    }
    return colors[bank] || "bg-secondary text-muted-foreground"
  }

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doc.bank.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesBank = !filterBank || doc.bank === filterBank
    const matchesStatus = !filterStatus || doc.status === filterStatus
    return matchesSearch && matchesBank && matchesStatus
  })

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
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
            <h1 className="text-2xl font-bold text-foreground">AI Guidelines</h1>
            <p className="text-muted-foreground mt-1">
              Manage bank policy documents for AI analysis
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

        {/* Upload Form Modal */}
        {showUploadForm && (
          <Card className="mb-6 bg-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Upload New Policy Document</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-2 border-dashed border-border rounded-xl p-6 text-center">
                  <Upload className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
                  <p className="text-sm text-muted-foreground">
                    Drop PDF or DOCX file here, or click to browse
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Document Name</label>
                    <Input
                      placeholder="e.g., HDFC Home Loan Policy"
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
                      <option value="">Select Bank</option>
                      {banks.map(bank => (
                        <option key={bank} value={bank}>{bank}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="flex gap-3 justify-end">
                  <Button
                    variant="outline"
                    onClick={() => setShowUploadForm(false)}
                    className="border-border text-foreground"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleUpload}
                    disabled={!newDocName || !newDocBank}
                    className="bg-primary text-primary-foreground"
                  >
                    Upload
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search documents..."
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
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="h-10 px-3 rounded-md bg-input border border-border text-foreground min-w-[120px]"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        {/* Documents List */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">
              Policy Documents ({filteredDocuments.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filteredDocuments.map((doc) => (
                <div 
                  key={doc.id}
                  className="flex items-center justify-between p-4 rounded-xl bg-secondary/30 border border-border"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-medium text-foreground">{doc.name}</h4>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getBankColor(doc.bank)}`}>
                          {doc.bank}
                        </span>
                        <span className="text-xs text-muted-foreground">v{doc.version}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {doc.fileSize} • Uploaded {doc.uploadDate}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleDocumentStatus(doc.id)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                        doc.status === "active"
                          ? "bg-primary/20 text-primary"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {doc.status === "active" ? (
                        <span className="flex items-center gap-1">
                          <Check className="w-3 h-3" /> Active
                        </span>
                      ) : (
                        <span className="flex items-center gap-1">
                          <X className="w-3 h-3" /> Inactive
                        </span>
                      )}
                    </button>
                    
                    <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                      <Eye className="w-4 h-4" />
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
              ))}
              
              {filteredDocuments.length === 0 && (
                <div className="text-center py-12">
                  <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">No documents found</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
