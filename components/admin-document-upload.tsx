"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Upload,
  FileText,
  X,
  Check,
  AlertCircle,
  Eye,
  Trash2,
  Download,
  Folder
} from "lucide-react"

interface AdminDocumentUploadProps {
  onBack: () => void
  applicationId: string
}

interface Document {
  id: string
  name: string
  type: string
  size: number
  status: "pending" | "verified" | "rejected"
  uploadedAt: Date
}

const documentCategories = [
  { id: "identity", name: "Identity Proof", required: true },
  { id: "address", name: "Address Proof", required: true },
  { id: "income", name: "Income Proof", required: true },
  { id: "bank", name: "Bank Statements", required: true },
  { id: "property", name: "Property Documents", required: false },
  { id: "other", name: "Other Documents", required: false },
]

export function AdminDocumentUpload({ onBack, applicationId }: AdminDocumentUploadProps) {
  const [documents, setDocuments] = useState<Record<string, Document[]>>({
    identity: [
      { id: "1", name: "Aadhaar_Card.pdf", type: "application/pdf", size: 245000, status: "verified", uploadedAt: new Date() },
    ],
    address: [
      { id: "2", name: "Utility_Bill.pdf", type: "application/pdf", size: 180000, status: "pending", uploadedAt: new Date() },
    ],
    income: [],
    bank: [],
    property: [],
    other: [],
  })
  
  const [dragOver, setDragOver] = useState<string | null>(null)
  const [uploading, setUploading] = useState<string | null>(null)

  const handleDragOver = useCallback((e: React.DragEvent, categoryId: string) => {
    e.preventDefault()
    setDragOver(categoryId)
  }, [])

  const handleDragLeave = useCallback(() => {
    setDragOver(null)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent, categoryId: string) => {
    e.preventDefault()
    setDragOver(null)
    
    const files = Array.from(e.dataTransfer.files)
    handleFiles(files, categoryId)
  }, [])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, categoryId: string) => {
    const files = Array.from(e.target.files || [])
    handleFiles(files, categoryId)
  }

  const handleFiles = async (files: File[], categoryId: string) => {
    setUploading(categoryId)
    
    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    const newDocs: Document[] = files.map((file, index) => ({
      id: `${Date.now()}-${index}`,
      name: file.name,
      type: file.type,
      size: file.size,
      status: "pending" as const,
      uploadedAt: new Date(),
    }))
    
    setDocuments(prev => ({
      ...prev,
      [categoryId]: [...prev[categoryId], ...newDocs],
    }))
    
    setUploading(null)
  }

  const removeDocument = (categoryId: string, docId: string) => {
    setDocuments(prev => ({
      ...prev,
      [categoryId]: prev[categoryId].filter(doc => doc.id !== docId),
    }))
  }

  const updateDocumentStatus = (categoryId: string, docId: string, status: Document["status"]) => {
    setDocuments(prev => ({
      ...prev,
      [categoryId]: prev[categoryId].map(doc =>
        doc.id === docId ? { ...doc, status } : doc
      ),
    }))
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const getStatusIcon = (status: Document["status"]) => {
    switch (status) {
      case "verified":
        return <Check className="w-4 h-4 text-primary" />
      case "rejected":
        return <AlertCircle className="w-4 h-4 text-destructive" />
      default:
        return <div className="w-4 h-4 rounded-full border-2 border-warning animate-pulse" />
    }
  }

  const getStatusBadge = (status: Document["status"]) => {
    const styles = {
      verified: "bg-primary/20 text-primary",
      rejected: "bg-destructive/20 text-destructive",
      pending: "bg-warning/20 text-warning",
    }
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    )
  }

  const totalDocs = Object.values(documents).flat().length
  const verifiedDocs = Object.values(documents).flat().filter(d => d.status === "verified").length

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <X className="w-4 h-4" />
          Back to Dashboard
        </button>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Document Management</h1>
            <p className="text-muted-foreground mt-1">Application ID: {applicationId}</p>
          </div>
          
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-card border border-border">
              <FileText className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-foreground">
                <span className="font-semibold text-primary">{verifiedDocs}</span>
                <span className="text-muted-foreground"> / {totalDocs} Verified</span>
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {documentCategories.map((category) => (
            <Card key={category.id} className="bg-card border-border">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Folder className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg text-foreground">{category.name}</CardTitle>
                      <CardDescription className="text-muted-foreground">
                        {category.required ? "Required" : "Optional"} • {documents[category.id].length} file(s)
                      </CardDescription>
                    </div>
                  </div>
                  {category.required && documents[category.id].length === 0 && (
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-destructive/20 text-destructive">
                      Missing
                    </span>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {/* Upload Area */}
                <div
                  onDragOver={(e) => handleDragOver(e, category.id)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, category.id)}
                  className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-all ${
                    dragOver === category.id
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <input
                    type="file"
                    multiple
                    onChange={(e) => handleFileSelect(e, category.id)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  />
                  
                  {uploading === category.id ? (
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-10 h-10 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                      <p className="text-sm text-muted-foreground">Uploading...</p>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                      <p className="text-sm text-foreground font-medium">
                        Drag & drop files here
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        or click to browse (PDF, JPG, PNG, DOC)
                      </p>
                    </>
                  )}
                </div>

                {/* Document List */}
                {documents[category.id].length > 0 && (
                  <div className="mt-4 space-y-2">
                    {documents[category.id].map((doc) => (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 border border-border"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          {getStatusIcon(doc.status)}
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">
                              {doc.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {formatFileSize(doc.size)}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {getStatusBadge(doc.status)}
                          
                          <div className="flex items-center gap-1 ml-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-foreground"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-foreground"
                            >
                              <Download className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-destructive"
                              onClick={() => removeDocument(category.id, doc.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Admin Actions */}
                {documents[category.id].some(d => d.status === "pending") && (
                  <div className="mt-4 flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 border-primary text-primary hover:bg-primary/10"
                      onClick={() => {
                        documents[category.id]
                          .filter(d => d.status === "pending")
                          .forEach(d => updateDocumentStatus(category.id, d.id, "verified"))
                      }}
                    >
                      <Check className="w-4 h-4 mr-2" />
                      Verify All
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 border-destructive text-destructive hover:bg-destructive/10"
                      onClick={() => {
                        documents[category.id]
                          .filter(d => d.status === "pending")
                          .forEach(d => updateDocumentStatus(category.id, d.id, "rejected"))
                      }}
                    >
                      <X className="w-4 h-4 mr-2" />
                      Reject All
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Summary Footer */}
        <Card className="mt-6 bg-card border-border">
          <CardContent className="py-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-primary" />
                  <span className="text-sm text-muted-foreground">Verified: {verifiedDocs}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-warning" />
                  <span className="text-sm text-muted-foreground">
                    Pending: {Object.values(documents).flat().filter(d => d.status === "pending").length}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-destructive" />
                  <span className="text-sm text-muted-foreground">
                    Rejected: {Object.values(documents).flat().filter(d => d.status === "rejected").length}
                  </span>
                </div>
              </div>
              
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                Complete Review
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
