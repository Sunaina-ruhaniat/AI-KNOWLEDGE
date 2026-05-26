"use client"

import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useDropzone } from "react-dropzone"
import {
  Upload,
  FileText,
  X,
  Calendar,
  Building2,
  Tag,
  Hash,
  FileType,
  CheckCircle,
  Loader2,
  Database,
  Sparkles,
  Layers,
  Zap,
  AlertCircle,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

const categories = [
  "Bank Policies",
  "Underwriting Rules",
  "FOIR Guidelines",
  "ROI Policies",
  "Credit Risk Rules",
  "Eligibility Matrix",
  "CIBIL Policies",
]

const banks = [
  "HDFC Bank",
  "ICICI Bank",
  "State Bank of India",
  "Axis Bank",
  "Kotak Mahindra Bank",
  "Yes Bank",
  "IndusInd Bank",
  "Punjab National Bank",
  "Bank of Baroda",
  "Tata Capital",
  "Bajaj Finance",
  "L&T Finance",
]

interface UploadedFile {
  file: File
  id: string
}

interface ProcessingStep {
  id: string
  label: string
  status: "pending" | "processing" | "complete" | "error"
  icon: React.ElementType
}

export default function KnowledgeBasePage() {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [formData, setFormData] = useState({
    documentName: "",
    bankName: "",
    category: "",
    effectiveDate: "",
    expiryDate: "",
    version: "1.0",
    tags: "",
    description: "",
  })
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingSteps, setProcessingSteps] = useState<ProcessingStep[]>([
    { id: "upload", label: "Uploading Document", status: "pending", icon: Upload },
    { id: "extract", label: "Text Extraction", status: "pending", icon: FileText },
    { id: "chunk", label: "Chunking Content", status: "pending", icon: Layers },
    { id: "embed", label: "Creating Embeddings", status: "pending", icon: Sparkles },
    { id: "store", label: "Vector Database Storage", status: "pending", icon: Database },
    { id: "index", label: "AI Index Ready", status: "pending", icon: Zap },
  ])
  const [showProcessing, setShowProcessing] = useState(false)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map((file) => ({
      file,
      id: Math.random().toString(36).substr(2, 9),
    }))
    setUploadedFiles((prev) => [...prev, ...newFiles])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
      "text/plain": [".txt"],
    },
  })

  const removeFile = (id: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== id))
  }

  const handleSubmit = async (isDraft: boolean = false) => {
    if (!isDraft) {
      setShowProcessing(true)
      setIsProcessing(true)
      
      // Simulate RAG processing pipeline
      const steps = ["upload", "extract", "chunk", "embed", "store", "index"]
      for (let i = 0; i < steps.length; i++) {
        setProcessingSteps((prev) =>
          prev.map((step, idx) => ({
            ...step,
            status: idx === i ? "processing" : idx < i ? "complete" : "pending",
          }))
        )
        await new Promise((resolve) => setTimeout(resolve, 1200))
      }
      
      setProcessingSteps((prev) =>
        prev.map((step) => ({ ...step, status: "complete" }))
      )
      setIsProcessing(false)
    }
  }

  const resetForm = () => {
    setUploadedFiles([])
    setFormData({
      documentName: "",
      bankName: "",
      category: "",
      effectiveDate: "",
      expiryDate: "",
      version: "1.0",
      tags: "",
      description: "",
    })
    setShowProcessing(false)
    setProcessingSteps((prev) =>
      prev.map((step) => ({ ...step, status: "pending" }))
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Knowledge Base</h1>
        <p className="text-muted-foreground mt-1">
          Upload and manage lender guidelines for AI-powered underwriting
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upload Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Drag & Drop Zone */}
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5 text-primary" />
                Upload Document
              </CardTitle>
              <CardDescription>
                Supported formats: PDF, DOCX, XLSX, TXT
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                  isDragActive
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50 hover:bg-secondary/30"
                }`}
              >
                <input {...getInputProps()} />
                <motion.div
                  animate={{ y: isDragActive ? -5 : 0 }}
                  className="flex flex-col items-center gap-3"
                >
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <Upload className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <p className="text-foreground font-medium">
                      {isDragActive ? "Drop files here" : "Drag & drop files here"}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      or click to browse from your computer
                    </p>
                  </div>
                </motion.div>
              </div>

              {/* Uploaded Files */}
              <AnimatePresence>
                {uploadedFiles.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 space-y-2"
                  >
                    {uploadedFiles.map((item) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30"
                      >
                        <FileText className="w-5 h-5 text-primary" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {item.file.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {(item.file.size / 1024).toFixed(1)} KB
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => removeFile(item.id)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>

          {/* Document Details Form */}
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Document Details</CardTitle>
              <CardDescription>
                Provide metadata for accurate AI indexing
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="documentName">Document Name</Label>
                  <div className="relative">
                    <FileType className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="documentName"
                      placeholder="e.g., HDFC Home Loan Policy"
                      className="pl-10"
                      value={formData.documentName}
                      onChange={(e) =>
                        setFormData({ ...formData, documentName: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bankName">Bank Name</Label>
                  <Select
                    value={formData.bankName}
                    onValueChange={(value) =>
                      setFormData({ ...formData, bankName: value })
                    }
                  >
                    <SelectTrigger className="w-full">
                      <Building2 className="w-4 h-4 mr-2 text-muted-foreground" />
                      <SelectValue placeholder="Select bank" />
                    </SelectTrigger>
                    <SelectContent>
                      {banks.map((bank) => (
                        <SelectItem key={bank} value={bank}>
                          {bank}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) =>
                      setFormData({ ...formData, category: value })
                    }
                  >
                    <SelectTrigger className="w-full">
                      <Tag className="w-4 h-4 mr-2 text-muted-foreground" />
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="version">Version Number</Label>
                  <div className="relative">
                    <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="version"
                      placeholder="1.0"
                      className="pl-10"
                      value={formData.version}
                      onChange={(e) =>
                        setFormData({ ...formData, version: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="effectiveDate">Effective Date</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="effectiveDate"
                      type="date"
                      className="pl-10"
                      value={formData.effectiveDate}
                      onChange={(e) =>
                        setFormData({ ...formData, effectiveDate: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="expiryDate">Expiry Date</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="expiryDate"
                      type="date"
                      className="pl-10"
                      value={formData.expiryDate}
                      onChange={(e) =>
                        setFormData({ ...formData, expiryDate: e.target.value })
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Tags</Label>
                <Input
                  id="tags"
                  placeholder="Enter tags separated by commas (e.g., home loan, salaried, metro)"
                  value={formData.tags}
                  onChange={(e) =>
                    setFormData({ ...formData, tags: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Brief description of the document content..."
                  rows={3}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 pt-4">
                <Button
                  onClick={() => handleSubmit(false)}
                  disabled={isProcessing || uploadedFiles.length === 0}
                  className="bg-primary hover:bg-primary/90"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Upload & Index
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleSubmit(true)}
                  disabled={isProcessing}
                >
                  Save Draft
                </Button>
                <Button variant="outline" disabled={isProcessing}>
                  Replace Existing Version
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* RAG Processing Status Panel */}
        <div className="space-y-6">
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm sticky top-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                RAG Processing Pipeline
              </CardTitle>
              <CardDescription>
                Real-time indexing status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {processingSteps.map((step, index) => {
                  const Icon = step.icon
                  return (
                    <motion.div
                      key={step.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-3"
                    >
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                          step.status === "complete"
                            ? "bg-success/20 text-success"
                            : step.status === "processing"
                            ? "bg-primary/20 text-primary"
                            : step.status === "error"
                            ? "bg-destructive/20 text-destructive"
                            : "bg-secondary text-muted-foreground"
                        }`}
                      >
                        {step.status === "processing" ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : step.status === "complete" ? (
                          <CheckCircle className="w-5 h-5" />
                        ) : step.status === "error" ? (
                          <AlertCircle className="w-5 h-5" />
                        ) : (
                          <Icon className="w-5 h-5" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p
                          className={`text-sm font-medium ${
                            step.status === "complete"
                              ? "text-success"
                              : step.status === "processing"
                              ? "text-primary"
                              : step.status === "error"
                              ? "text-destructive"
                              : "text-muted-foreground"
                          }`}
                        >
                          {step.label}
                        </p>
                        {step.status === "processing" && (
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: "100%" }}
                            transition={{ duration: 1.2 }}
                            className="h-1 bg-primary/30 rounded-full mt-1 overflow-hidden"
                          >
                            <motion.div
                              className="h-full bg-primary rounded-full"
                              initial={{ x: "-100%" }}
                              animate={{ x: "100%" }}
                              transition={{
                                repeat: Infinity,
                                duration: 1,
                                ease: "linear",
                              }}
                            />
                          </motion.div>
                        )}
                      </div>
                      {step.status === "complete" && (
                        <Badge variant="outline" className="text-success border-success/30">
                          Done
                        </Badge>
                      )}
                    </motion.div>
                  )
                })}
              </div>

              {/* Status Summary */}
              {showProcessing && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 p-4 rounded-xl bg-secondary/30"
                >
                  {processingSteps.every((s) => s.status === "complete") ? (
                    <div className="text-center">
                      <CheckCircle className="w-12 h-12 text-success mx-auto mb-2" />
                      <p className="font-medium text-success">
                        Document Successfully Indexed
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Ready for AI-powered retrieval
                      </p>
                      <Button
                        variant="outline"
                        className="mt-4"
                        onClick={resetForm}
                      >
                        Upload Another Document
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Loader2 className="w-12 h-12 text-primary mx-auto mb-2 animate-spin" />
                      <p className="font-medium">Processing Document</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Please wait while we index your document...
                      </p>
                    </div>
                  )}
                </motion.div>
              )}
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Processing Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Documents Today</span>
                <span className="font-medium">24</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Avg. Processing Time</span>
                <span className="font-medium">45s</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Success Rate</span>
                <span className="font-medium text-success">98.2%</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
