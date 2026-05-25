"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  Building2, 
  RefreshCw,
  User,
  Briefcase,
  CreditCard,
  FileText,
  Shield,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Upload,
  File,
  X
} from "lucide-react"

interface LoanFormProps {
  onSubmit: (data: LoanFormData) => void
  onBack: () => void
}

interface ExistingLoan {
  id: string
  loanType: string
  lender: string
  outstandingAmount: string
  currentROI: string
  loanStartDate: string
  foreclosureAvailable: boolean
  currentEMI: string
  bounceHistory: string
  isExpanded: boolean
}

interface UploadedDocument {
  id: string
  name: string
  type: string
  size: string
  uploadedAt: Date
}

export interface LoanFormData {
  // Case Type
  caseType: "BT" | "Fresh" | ""
  
  // Personal Details
  fullName: string
  dateOfBirth: string
  panNumber: string
  aadhaarNumber: string
  email: string
  phone: string
  address: string
  
  // Employment Details
  employmentType: string
  companyName: string
  designation: string
  yearsOfExperience: string
  employmentDuration: string
  
  // Company Details
  companyType: string
  companyAge: string
  
  // Salary & Banking Details
  netSalary: string
  fixedSalary: string
  incentiveAmount: string
  incentiveFrequency: string
  salaryCreditType: string
  pfDeducted: boolean
  tdsDeducted: boolean
  officialMailAvailable: boolean
  
  // CIBIL Assessment
  cibilScore: number
  enquiriesLast3Months: number
  bounceLatestMonth: boolean
  overduesPending: boolean
  pastDelayedPayments: boolean
  settlementWriteOff: boolean
  
  // Loan Details
  loanAmount: string
  loanTenure: string
  loanPurpose: string
  existingEMI: string
  monthlyIncome: string
  
  // BT Specific - Multiple Loans
  existingLoans: ExistingLoan[]
  
  // Documents
  documents: {
    pan: UploadedDocument | null
    aadhaar: UploadedDocument | null
    salarySlips: UploadedDocument[]
    bankStatements: UploadedDocument[]
    cibilReport: UploadedDocument | null
  }
}

const initialFormData: LoanFormData = {
  caseType: "",
  fullName: "",
  dateOfBirth: "",
  panNumber: "",
  aadhaarNumber: "",
  email: "",
  phone: "",
  address: "",
  employmentType: "",
  companyName: "",
  designation: "",
  yearsOfExperience: "",
  employmentDuration: "",
  companyType: "",
  companyAge: "",
  netSalary: "",
  fixedSalary: "",
  incentiveAmount: "",
  incentiveFrequency: "",
  salaryCreditType: "",
  pfDeducted: false,
  tdsDeducted: false,
  officialMailAvailable: false,
  cibilScore: 750,
  enquiriesLast3Months: 0,
  bounceLatestMonth: false,
  overduesPending: false,
  pastDelayedPayments: false,
  settlementWriteOff: false,
  loanAmount: "",
  loanTenure: "",
  loanPurpose: "",
  existingEMI: "",
  monthlyIncome: "",
  existingLoans: [],
  documents: {
    pan: null,
    aadhaar: null,
    salarySlips: [],
    bankStatements: [],
    cibilReport: null
  }
}

const steps = [
  { id: 1, title: "Basic Details", icon: User },
  { id: 2, title: "Loan Details", icon: CreditCard },
  { id: 3, title: "Employment", icon: Briefcase },
  { id: 4, title: "CIBIL & Risk", icon: Shield },
  { id: 5, title: "Documents", icon: FileText },
]

const companyTypes = [
  "Pvt Ltd",
  "Govt",
  "LLP",
  "Partnership",
  "NGO",
  "School",
  "Contract Basis"
]

const incentiveFrequencies = ["Monthly", "Quarterly", "Yearly"]
const salaryCreditTypes = ["IMPS", "RTGS", "NEFT", "UPI", "Cash"]
const loanTypes = ["Personal Loan", "Home Loan", "Car Loan", "Business Loan", "Education Loan", "Gold Loan", "Credit Card"]
const lenders = ["HDFC Bank", "ICICI Bank", "SBI", "Axis Bank", "Kotak Mahindra", "Bajaj Finance", "IDFC First", "Yes Bank", "PNB", "Other"]

export function LoanForm({ onSubmit, onBack }: LoanFormProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<LoanFormData>(initialFormData)

  const updateFormData = <K extends keyof LoanFormData>(field: K, value: LoanFormData[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(prev => prev + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const handleSubmit = () => {
    onSubmit(formData)
  }

  const addExistingLoan = () => {
    const newLoan: ExistingLoan = {
      id: `loan-${Date.now()}`,
      loanType: "",
      lender: "",
      outstandingAmount: "",
      currentROI: "",
      loanStartDate: "",
      foreclosureAvailable: false,
      currentEMI: "",
      bounceHistory: "0",
      isExpanded: true
    }
    updateFormData("existingLoans", [...formData.existingLoans, newLoan])
  }

  const updateExistingLoan = (id: string, field: keyof ExistingLoan, value: string | boolean) => {
    const updatedLoans = formData.existingLoans.map(loan =>
      loan.id === id ? { ...loan, [field]: value } : loan
    )
    updateFormData("existingLoans", updatedLoans)
  }

  const removeExistingLoan = (id: string) => {
    updateFormData("existingLoans", formData.existingLoans.filter(loan => loan.id !== id))
  }

  const toggleLoanExpand = (id: string) => {
    const updatedLoans = formData.existingLoans.map(loan =>
      loan.id === id ? { ...loan, isExpanded: !loan.isExpanded } : loan
    )
    updateFormData("existingLoans", updatedLoans)
  }

  const getCibilRiskLabel = (score: number) => {
    if (score >= 750) return { label: "Excellent", color: "text-primary", bg: "bg-primary/20" }
    if (score >= 700) return { label: "Good", color: "text-primary", bg: "bg-primary/20" }
    if (score >= 650) return { label: "Fair", color: "text-warning", bg: "bg-warning/20" }
    if (score >= 550) return { label: "Poor", color: "text-warning", bg: "bg-warning/20" }
    return { label: "Very Poor", color: "text-destructive", bg: "bg-destructive/20" }
  }

  const simulateUpload = (docType: string, fileName: string): UploadedDocument => {
    return {
      id: `doc-${Date.now()}`,
      name: fileName,
      type: docType,
      size: `${(Math.random() * 2 + 0.5).toFixed(1)} MB`,
      uploadedAt: new Date()
    }
  }

  const handleFileUpload = (docKey: keyof LoanFormData["documents"], isMultiple: boolean = false) => {
    // Simulate file upload
    const mockFileName = `${docKey}_${Date.now()}.pdf`
    const newDoc = simulateUpload(docKey, mockFileName)
    
    if (isMultiple) {
      const currentDocs = formData.documents[docKey] as UploadedDocument[]
      updateFormData("documents", {
        ...formData.documents,
        [docKey]: [...currentDocs, newDoc]
      })
    } else {
      updateFormData("documents", {
        ...formData.documents,
        [docKey]: newDoc
      })
    }
  }

  const removeDocument = (docKey: keyof LoanFormData["documents"], docId?: string) => {
    if (docId) {
      const currentDocs = formData.documents[docKey] as UploadedDocument[]
      updateFormData("documents", {
        ...formData.documents,
        [docKey]: currentDocs.filter(d => d.id !== docId)
      })
    } else {
      updateFormData("documents", {
        ...formData.documents,
        [docKey]: null
      })
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      // Step 1: Basic Details + Case Type
      case 1:
        return (
          <div className="space-y-8">
            {/* Case Type Selection */}
            <div>
              <h3 className="text-lg font-medium text-foreground mb-2">Select Case Type</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Choose whether this is a Balance Transfer or a Fresh Loan application
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => updateFormData("caseType", "BT")}
                  className={`p-5 rounded-xl border-2 transition-all text-left ${
                    formData.caseType === "BT"
                      ? "border-primary bg-primary/10"
                      : "border-border bg-card hover:border-primary/50"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      formData.caseType === "BT" ? "bg-primary" : "bg-secondary"
                    }`}>
                      <RefreshCw className={`w-6 h-6 ${
                        formData.caseType === "BT" ? "text-primary-foreground" : "text-foreground"
                      }`} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">Balance Transfer (BT)</h4>
                      <p className="text-sm text-muted-foreground">Transfer existing loan to better rates</p>
                    </div>
                  </div>
                  {formData.caseType === "BT" && (
                    <div className="mt-3 flex items-center gap-2 text-primary">
                      <Check className="w-4 h-4" />
                      <span className="text-sm font-medium">Selected</span>
                    </div>
                  )}
                </button>
                
                <button
                  type="button"
                  onClick={() => updateFormData("caseType", "Fresh")}
                  className={`p-5 rounded-xl border-2 transition-all text-left ${
                    formData.caseType === "Fresh"
                      ? "border-primary bg-primary/10"
                      : "border-border bg-card hover:border-primary/50"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      formData.caseType === "Fresh" ? "bg-primary" : "bg-secondary"
                    }`}>
                      <Building2 className={`w-6 h-6 ${
                        formData.caseType === "Fresh" ? "text-primary-foreground" : "text-foreground"
                      }`} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">Fresh Loan</h4>
                      <p className="text-sm text-muted-foreground">Apply for a new loan</p>
                    </div>
                  </div>
                  {formData.caseType === "Fresh" && (
                    <div className="mt-3 flex items-center gap-2 text-primary">
                      <Check className="w-4 h-4" />
                      <span className="text-sm font-medium">Selected</span>
                    </div>
                  )}
                </button>
              </div>
            </div>

            {/* Personal Details */}
            <div>
              <h3 className="text-lg font-medium text-foreground mb-2">Applicant Details</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Please provide your personal information
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-foreground">Full Name</Label>
                  <Input
                    id="fullName"
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={(e) => updateFormData("fullName", e.target.value)}
                    className="bg-input border-border text-foreground"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth" className="text-foreground">Date of Birth</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => updateFormData("dateOfBirth", e.target.value)}
                    className="bg-input border-border text-foreground"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="panNumber" className="text-foreground">PAN Number</Label>
                  <Input
                    id="panNumber"
                    placeholder="ABCDE1234F"
                    value={formData.panNumber}
                    onChange={(e) => updateFormData("panNumber", e.target.value.toUpperCase())}
                    className="bg-input border-border text-foreground uppercase"
                    maxLength={10}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="aadhaarNumber" className="text-foreground">Aadhaar Number</Label>
                  <Input
                    id="aadhaarNumber"
                    placeholder="1234 5678 9012"
                    value={formData.aadhaarNumber}
                    onChange={(e) => updateFormData("aadhaarNumber", e.target.value)}
                    className="bg-input border-border text-foreground"
                    maxLength={14}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-foreground">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@email.com"
                    value={formData.email}
                    onChange={(e) => updateFormData("email", e.target.value)}
                    className="bg-input border-border text-foreground"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-foreground">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => updateFormData("phone", e.target.value)}
                    className="bg-input border-border text-foreground"
                  />
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address" className="text-foreground">Current Address</Label>
                  <Input
                    id="address"
                    placeholder="Enter your full address"
                    value={formData.address}
                    onChange={(e) => updateFormData("address", e.target.value)}
                    className="bg-input border-border text-foreground"
                  />
                </div>
              </div>
            </div>
          </div>
        )
      
      // Step 2: Loan Details (with BT section if BT selected)
      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-foreground mb-2">Loan Details</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Specify the loan amount and purpose
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="loanAmount" className="text-foreground">Loan Amount (INR)</Label>
                <Input
                  id="loanAmount"
                  type="number"
                  placeholder="2500000"
                  value={formData.loanAmount}
                  onChange={(e) => updateFormData("loanAmount", e.target.value)}
                  className="bg-input border-border text-foreground"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="loanTenure" className="text-foreground">Loan Tenure (Years)</Label>
                <Input
                  id="loanTenure"
                  type="number"
                  placeholder="20"
                  value={formData.loanTenure}
                  onChange={(e) => updateFormData("loanTenure", e.target.value)}
                  className="bg-input border-border text-foreground"
                />
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="loanPurpose" className="text-foreground">Loan Purpose</Label>
                <select
                  id="loanPurpose"
                  value={formData.loanPurpose}
                  onChange={(e) => updateFormData("loanPurpose", e.target.value)}
                  className="w-full h-10 px-3 rounded-md bg-input border border-border text-foreground"
                >
                  <option value="">Select purpose</option>
                  <option value="Home Purchase">Home Purchase</option>
                  <option value="Home Construction">Home Construction</option>
                  <option value="Home Renovation">Home Renovation</option>
                  <option value="Plot Purchase">Plot Purchase</option>
                  <option value="Balance Transfer">Balance Transfer</option>
                  <option value="Top-up Loan">Top-up Loan</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="existingEMI" className="text-foreground">Current Monthly EMI (if any)</Label>
                <Input
                  id="existingEMI"
                  type="number"
                  placeholder="0"
                  value={formData.existingEMI}
                  onChange={(e) => updateFormData("existingEMI", e.target.value)}
                  className="bg-input border-border text-foreground"
                />
              </div>
            </div>

            {/* BT Section - Multiple Loans */}
            {formData.caseType === "BT" && (
              <div className="mt-8 pt-6 border-t border-border">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="text-lg font-medium text-foreground">Existing Loans for Transfer</h4>
                    <p className="text-sm text-muted-foreground">Add details of loans you want to transfer</p>
                  </div>
                  <Button
                    type="button"
                    onClick={addExistingLoan}
                    variant="outline"
                    className="border-primary text-primary hover:bg-primary/10"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Loan
                  </Button>
                </div>

                {formData.existingLoans.length === 0 ? (
                  <div className="text-center py-8 border-2 border-dashed border-border rounded-xl">
                    <RefreshCw className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground">No loans added yet</p>
                    <p className="text-sm text-muted-foreground">Click &quot;Add Loan&quot; to add existing loans for transfer</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {formData.existingLoans.map((loan, index) => (
                      <Card key={loan.id} className="bg-secondary/30 border-border">
                        <div 
                          className="p-4 flex items-center justify-between cursor-pointer"
                          onClick={() => toggleLoanExpand(loan.id)}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                              <span className="text-sm font-semibold text-primary">{index + 1}</span>
                            </div>
                            <div>
                              <p className="font-medium text-foreground">
                                {loan.loanType || "New Loan Entry"}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {loan.lender || "Select lender"} 
                                {loan.outstandingAmount && ` • ₹${parseInt(loan.outstandingAmount).toLocaleString()}`}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                removeExistingLoan(loan.id)
                              }}
                              className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                            {loan.isExpanded ? (
                              <ChevronUp className="w-5 h-5 text-muted-foreground" />
                            ) : (
                              <ChevronDown className="w-5 h-5 text-muted-foreground" />
                            )}
                          </div>
                        </div>
                        
                        {loan.isExpanded && (
                          <CardContent className="pt-0 pb-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-border">
                              <div className="space-y-2">
                                <Label className="text-foreground">Loan Type</Label>
                                <select
                                  value={loan.loanType}
                                  onChange={(e) => updateExistingLoan(loan.id, "loanType", e.target.value)}
                                  className="w-full h-10 px-3 rounded-md bg-input border border-border text-foreground"
                                >
                                  <option value="">Select loan type</option>
                                  {loanTypes.map((type) => (
                                    <option key={type} value={type}>{type}</option>
                                  ))}
                                </select>
                              </div>
                              
                              <div className="space-y-2">
                                <Label className="text-foreground">Bank / Lender</Label>
                                <select
                                  value={loan.lender}
                                  onChange={(e) => updateExistingLoan(loan.id, "lender", e.target.value)}
                                  className="w-full h-10 px-3 rounded-md bg-input border border-border text-foreground"
                                >
                                  <option value="">Select lender</option>
                                  {lenders.map((lender) => (
                                    <option key={lender} value={lender}>{lender}</option>
                                  ))}
                                </select>
                              </div>
                              
                              <div className="space-y-2">
                                <Label className="text-foreground">Outstanding Amount (INR)</Label>
                                <Input
                                  type="number"
                                  placeholder="500000"
                                  value={loan.outstandingAmount}
                                  onChange={(e) => updateExistingLoan(loan.id, "outstandingAmount", e.target.value)}
                                  className="bg-input border-border text-foreground"
                                />
                              </div>
                              
                              <div className="space-y-2">
                                <Label className="text-foreground">Current ROI (%)</Label>
                                <Input
                                  type="number"
                                  step="0.01"
                                  placeholder="9.5"
                                  value={loan.currentROI}
                                  onChange={(e) => updateExistingLoan(loan.id, "currentROI", e.target.value)}
                                  className="bg-input border-border text-foreground"
                                />
                              </div>
                              
                              <div className="space-y-2">
                                <Label className="text-foreground">Current EMI (INR)</Label>
                                <Input
                                  type="number"
                                  placeholder="15000"
                                  value={loan.currentEMI}
                                  onChange={(e) => updateExistingLoan(loan.id, "currentEMI", e.target.value)}
                                  className="bg-input border-border text-foreground"
                                />
                              </div>
                              
                              <div className="space-y-2">
                                <Label className="text-foreground">Loan Start Date</Label>
                                <Input
                                  type="date"
                                  value={loan.loanStartDate}
                                  onChange={(e) => updateExistingLoan(loan.id, "loanStartDate", e.target.value)}
                                  className="bg-input border-border text-foreground"
                                />
                              </div>
                              
                              <div className="space-y-2">
                                <Label className="text-foreground">Bounce History (Last 12 months)</Label>
                                <Input
                                  type="number"
                                  placeholder="0"
                                  value={loan.bounceHistory}
                                  onChange={(e) => updateExistingLoan(loan.id, "bounceHistory", e.target.value)}
                                  className="bg-input border-border text-foreground"
                                />
                              </div>
                              
                              <div className="space-y-2">
                                <Label className="text-foreground">Foreclosure Available</Label>
                                <div className="flex gap-3 pt-1">
                                  <button
                                    type="button"
                                    onClick={() => updateExistingLoan(loan.id, "foreclosureAvailable", true)}
                                    className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                                      loan.foreclosureAvailable
                                        ? "border-primary bg-primary/10 text-primary"
                                        : "border-border bg-card text-foreground hover:border-primary/50"
                                    }`}
                                  >
                                    Yes
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => updateExistingLoan(loan.id, "foreclosureAvailable", false)}
                                    className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                                      !loan.foreclosureAvailable
                                        ? "border-primary bg-primary/10 text-primary"
                                        : "border-border bg-card text-foreground hover:border-primary/50"
                                    }`}
                                  >
                                    No
                                  </button>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        )}
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )
      
      // Step 3: Employment & Salary Details
      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-foreground mb-2">Employment & Salary Details</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Tell us about your employment and income
              </p>
            </div>
            
            {/* Employment Type */}
            <div className="space-y-3">
              <Label className="text-foreground">Employment Type</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {["Salaried", "Self-Employed", "Business", "Professional"].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => updateFormData("employmentType", type)}
                    className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                      formData.employmentType === type
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-card text-foreground hover:border-primary/50"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="companyName" className="text-foreground">Company Name</Label>
                <Input
                  id="companyName"
                  placeholder="Enter company name"
                  value={formData.companyName}
                  onChange={(e) => updateFormData("companyName", e.target.value)}
                  className="bg-input border-border text-foreground"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="companyType" className="text-foreground">Company Type</Label>
                <select
                  id="companyType"
                  value={formData.companyType}
                  onChange={(e) => updateFormData("companyType", e.target.value)}
                  className="w-full h-10 px-3 rounded-md bg-input border border-border text-foreground"
                >
                  <option value="">Select company type</option>
                  {companyTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="designation" className="text-foreground">Designation</Label>
                <Input
                  id="designation"
                  placeholder="Enter your designation"
                  value={formData.designation}
                  onChange={(e) => updateFormData("designation", e.target.value)}
                  className="bg-input border-border text-foreground"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="companyAge" className="text-foreground">Company Age (Years)</Label>
                <Input
                  id="companyAge"
                  type="number"
                  placeholder="5"
                  value={formData.companyAge}
                  onChange={(e) => updateFormData("companyAge", e.target.value)}
                  className="bg-input border-border text-foreground"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="yearsOfExperience" className="text-foreground">Total Experience (Years)</Label>
                <Input
                  id="yearsOfExperience"
                  type="number"
                  placeholder="5"
                  value={formData.yearsOfExperience}
                  onChange={(e) => updateFormData("yearsOfExperience", e.target.value)}
                  className="bg-input border-border text-foreground"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="employmentDuration" className="text-foreground">Current Employment Duration (Months)</Label>
                <Input
                  id="employmentDuration"
                  type="number"
                  placeholder="24"
                  value={formData.employmentDuration}
                  onChange={(e) => updateFormData("employmentDuration", e.target.value)}
                  className="bg-input border-border text-foreground"
                />
              </div>
            </div>

            {/* Salary Details */}
            <div className="mt-6 pt-6 border-t border-border">
              <h4 className="text-base font-medium text-foreground mb-4">Salary Structure</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="netSalary" className="text-foreground">Net Salary Credited (INR)</Label>
                  <Input
                    id="netSalary"
                    type="number"
                    placeholder="75000"
                    value={formData.netSalary}
                    onChange={(e) => updateFormData("netSalary", e.target.value)}
                    className="bg-input border-border text-foreground"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="fixedSalary" className="text-foreground">Fixed Salary Component (INR)</Label>
                  <Input
                    id="fixedSalary"
                    type="number"
                    placeholder="60000"
                    value={formData.fixedSalary}
                    onChange={(e) => updateFormData("fixedSalary", e.target.value)}
                    className="bg-input border-border text-foreground"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="incentiveAmount" className="text-foreground">Incentive Amount (INR)</Label>
                  <Input
                    id="incentiveAmount"
                    type="number"
                    placeholder="15000"
                    value={formData.incentiveAmount}
                    onChange={(e) => updateFormData("incentiveAmount", e.target.value)}
                    className="bg-input border-border text-foreground"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="incentiveFrequency" className="text-foreground">Incentive Frequency</Label>
                  <select
                    id="incentiveFrequency"
                    value={formData.incentiveFrequency}
                    onChange={(e) => updateFormData("incentiveFrequency", e.target.value)}
                    className="w-full h-10 px-3 rounded-md bg-input border border-border text-foreground"
                  >
                    <option value="">Select frequency</option>
                    {incentiveFrequencies.map((freq) => (
                      <option key={freq} value={freq}>{freq}</option>
                    ))}
                  </select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="salaryCreditType" className="text-foreground">Salary Credit Type</Label>
                  <select
                    id="salaryCreditType"
                    value={formData.salaryCreditType}
                    onChange={(e) => updateFormData("salaryCreditType", e.target.value)}
                    className="w-full h-10 px-3 rounded-md bg-input border border-border text-foreground"
                  >
                    <option value="">Select credit type</option>
                    {salaryCreditTypes.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Toggle Options */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="p-4 rounded-xl bg-secondary/30 border border-border">
                  <div className="flex items-center justify-between">
                    <Label className="text-foreground">PF Deducted</Label>
                    <button
                      type="button"
                      onClick={() => updateFormData("pfDeducted", !formData.pfDeducted)}
                      className={`w-12 h-6 rounded-full transition-all ${
                        formData.pfDeducted ? "bg-primary" : "bg-muted"
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                        formData.pfDeducted ? "translate-x-6" : "translate-x-0.5"
                      }`} />
                    </button>
                  </div>
                </div>
                
                <div className="p-4 rounded-xl bg-secondary/30 border border-border">
                  <div className="flex items-center justify-between">
                    <Label className="text-foreground">TDS Deducted</Label>
                    <button
                      type="button"
                      onClick={() => updateFormData("tdsDeducted", !formData.tdsDeducted)}
                      className={`w-12 h-6 rounded-full transition-all ${
                        formData.tdsDeducted ? "bg-primary" : "bg-muted"
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                        formData.tdsDeducted ? "translate-x-6" : "translate-x-0.5"
                      }`} />
                    </button>
                  </div>
                </div>
                
                <div className="p-4 rounded-xl bg-secondary/30 border border-border">
                  <div className="flex items-center justify-between">
                    <Label className="text-foreground">Official Email</Label>
                    <button
                      type="button"
                      onClick={() => updateFormData("officialMailAvailable", !formData.officialMailAvailable)}
                      className={`w-12 h-6 rounded-full transition-all ${
                        formData.officialMailAvailable ? "bg-primary" : "bg-muted"
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                        formData.officialMailAvailable ? "translate-x-6" : "translate-x-0.5"
                      }`} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      
      // Step 4: CIBIL & Risk Details
      case 4:
        const riskLabel = getCibilRiskLabel(formData.cibilScore)
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-foreground mb-2">CIBIL & Risk Assessment</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Provide credit history and risk indicators
              </p>
            </div>
            
            {/* CIBIL Score */}
            <Card className="bg-secondary/30 border-border">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <Label className="text-foreground font-medium">CIBIL Score</Label>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${riskLabel.bg} ${riskLabel.color}`}>
                    {riskLabel.label}
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">300</span>
                    <span className="text-3xl font-bold text-foreground">{formData.cibilScore}</span>
                    <span className="text-sm text-muted-foreground">900</span>
                  </div>
                  
                  <input
                    type="range"
                    min="300"
                    max="900"
                    value={formData.cibilScore}
                    onChange={(e) => updateFormData("cibilScore", parseInt(e.target.value))}
                    className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                  
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Very Poor</span>
                    <span>Poor</span>
                    <span>Fair</span>
                    <span>Good</span>
                    <span>Excellent</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Enquiries */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="enquiries" className="text-foreground">Enquiries in Last 3 Months</Label>
                <Input
                  id="enquiries"
                  type="number"
                  min="0"
                  value={formData.enquiriesLast3Months}
                  onChange={(e) => updateFormData("enquiriesLast3Months", parseInt(e.target.value) || 0)}
                  className="bg-input border-border text-foreground"
                />
                {formData.enquiriesLast3Months > 3 && (
                  <div className="flex items-center gap-2 text-warning text-sm">
                    <AlertTriangle className="w-4 h-4" />
                    <span>High enquiry count may impact eligibility</span>
                  </div>
                )}
              </div>
            </div>

            {/* Risk Indicators */}
            <div>
              <Label className="text-foreground font-medium mb-4 block">Risk Indicators</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { key: "bounceLatestMonth", label: "Bounce in Latest Month", warning: true },
                  { key: "overduesPending", label: "Overdues Pending", warning: true },
                  { key: "pastDelayedPayments", label: "Past Delayed Payments", warning: false },
                  { key: "settlementWriteOff", label: "Settlement / Write-off", warning: true },
                ].map((item) => (
                  <Card 
                    key={item.key} 
                    className={`border ${
                      formData[item.key as keyof LoanFormData] 
                        ? item.warning ? "border-destructive bg-destructive/10" : "border-warning bg-warning/10"
                        : "border-border bg-card"
                    }`}
                  >
                    <CardContent className="py-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {formData[item.key as keyof LoanFormData] && item.warning && (
                            <AlertTriangle className="w-5 h-5 text-destructive" />
                          )}
                          <Label className="text-foreground">{item.label}</Label>
                        </div>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => updateFormData(item.key as keyof LoanFormData, true as never)}
                            className={`px-3 py-1.5 rounded-lg border text-sm font-medium transition-all ${
                              formData[item.key as keyof LoanFormData]
                                ? "border-destructive bg-destructive/20 text-destructive"
                                : "border-border bg-card text-foreground hover:border-primary/50"
                            }`}
                          >
                            Yes
                          </button>
                          <button
                            type="button"
                            onClick={() => updateFormData(item.key as keyof LoanFormData, false as never)}
                            className={`px-3 py-1.5 rounded-lg border text-sm font-medium transition-all ${
                              !formData[item.key as keyof LoanFormData]
                                ? "border-primary bg-primary/10 text-primary"
                                : "border-border bg-card text-foreground hover:border-primary/50"
                            }`}
                          >
                            No
                          </button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )
      
      // Step 5: Document Upload
      case 5:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-foreground mb-2">Document Upload</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Upload required documents for verification
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* PAN Card */}
              <Card className="bg-card border-border">
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between mb-3">
                    <Label className="text-foreground font-medium">PAN Card</Label>
                    {formData.documents.pan && (
                      <span className="text-xs text-primary">Uploaded</span>
                    )}
                  </div>
                  
                  {formData.documents.pan ? (
                    <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 border border-border">
                      <div className="flex items-center gap-3">
                        <File className="w-5 h-5 text-primary" />
                        <div>
                          <p className="text-sm text-foreground">{formData.documents.pan.name}</p>
                          <p className="text-xs text-muted-foreground">{formData.documents.pan.size}</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeDocument("pan")}
                        className="text-destructive hover:bg-destructive/10 p-1 rounded"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleFileUpload("pan")}
                      className="w-full p-6 border-2 border-dashed border-border rounded-lg hover:border-primary/50 transition-colors"
                    >
                      <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">Click to upload PAN Card</p>
                    </button>
                  )}
                </CardContent>
              </Card>

              {/* Aadhaar Card */}
              <Card className="bg-card border-border">
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between mb-3">
                    <Label className="text-foreground font-medium">Aadhaar Card</Label>
                    {formData.documents.aadhaar && (
                      <span className="text-xs text-primary">Uploaded</span>
                    )}
                  </div>
                  
                  {formData.documents.aadhaar ? (
                    <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 border border-border">
                      <div className="flex items-center gap-3">
                        <File className="w-5 h-5 text-primary" />
                        <div>
                          <p className="text-sm text-foreground">{formData.documents.aadhaar.name}</p>
                          <p className="text-xs text-muted-foreground">{formData.documents.aadhaar.size}</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeDocument("aadhaar")}
                        className="text-destructive hover:bg-destructive/10 p-1 rounded"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleFileUpload("aadhaar")}
                      className="w-full p-6 border-2 border-dashed border-border rounded-lg hover:border-primary/50 transition-colors"
                    >
                      <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">Click to upload Aadhaar Card</p>
                    </button>
                  )}
                </CardContent>
              </Card>

              {/* Salary Slips */}
              <Card className="bg-card border-border">
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between mb-3">
                    <Label className="text-foreground font-medium">Salary Slips (Last 3 months)</Label>
                    <span className="text-xs text-muted-foreground">{formData.documents.salarySlips.length} files</span>
                  </div>
                  
                  <div className="space-y-2 mb-3">
                    {formData.documents.salarySlips.map((doc) => (
                      <div key={doc.id} className="flex items-center justify-between p-2 rounded-lg bg-secondary/30 border border-border">
                        <div className="flex items-center gap-2">
                          <File className="w-4 h-4 text-primary" />
                          <span className="text-sm text-foreground truncate max-w-[150px]">{doc.name}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeDocument("salarySlips", doc.id)}
                          className="text-destructive hover:bg-destructive/10 p-1 rounded"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                  
                  <button
                    type="button"
                    onClick={() => handleFileUpload("salarySlips", true)}
                    className="w-full p-4 border-2 border-dashed border-border rounded-lg hover:border-primary/50 transition-colors"
                  >
                    <Plus className="w-5 h-5 text-muted-foreground mx-auto mb-1" />
                    <p className="text-sm text-muted-foreground">Add salary slip</p>
                  </button>
                </CardContent>
              </Card>

              {/* Bank Statements */}
              <Card className="bg-card border-border">
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between mb-3">
                    <Label className="text-foreground font-medium">Bank Statements (Last 6 months)</Label>
                    <span className="text-xs text-muted-foreground">{formData.documents.bankStatements.length} files</span>
                  </div>
                  
                  <div className="space-y-2 mb-3">
                    {formData.documents.bankStatements.map((doc) => (
                      <div key={doc.id} className="flex items-center justify-between p-2 rounded-lg bg-secondary/30 border border-border">
                        <div className="flex items-center gap-2">
                          <File className="w-4 h-4 text-primary" />
                          <span className="text-sm text-foreground truncate max-w-[150px]">{doc.name}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeDocument("bankStatements", doc.id)}
                          className="text-destructive hover:bg-destructive/10 p-1 rounded"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                  
                  <button
                    type="button"
                    onClick={() => handleFileUpload("bankStatements", true)}
                    className="w-full p-4 border-2 border-dashed border-border rounded-lg hover:border-primary/50 transition-colors"
                  >
                    <Plus className="w-5 h-5 text-muted-foreground mx-auto mb-1" />
                    <p className="text-sm text-muted-foreground">Add bank statement</p>
                  </button>
                </CardContent>
              </Card>

              {/* CIBIL Report */}
              <Card className="bg-card border-border md:col-span-2">
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between mb-3">
                    <Label className="text-foreground font-medium">CIBIL Report</Label>
                    {formData.documents.cibilReport && (
                      <span className="text-xs text-primary">Uploaded</span>
                    )}
                  </div>
                  
                  {formData.documents.cibilReport ? (
                    <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 border border-border">
                      <div className="flex items-center gap-3">
                        <File className="w-5 h-5 text-primary" />
                        <div>
                          <p className="text-sm text-foreground">{formData.documents.cibilReport.name}</p>
                          <p className="text-xs text-muted-foreground">{formData.documents.cibilReport.size}</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeDocument("cibilReport")}
                        className="text-destructive hover:bg-destructive/10 p-1 rounded"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleFileUpload("cibilReport")}
                      className="w-full p-6 border-2 border-dashed border-border rounded-lg hover:border-primary/50 transition-colors"
                    >
                      <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">Click to upload CIBIL Report</p>
                    </button>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )
      
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Sticky Header with Progress */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">Back</span>
            </button>
            <h1 className="text-lg font-semibold text-foreground">
              {formData.caseType === "BT" ? "Balance Transfer" : formData.caseType === "Fresh" ? "Fresh Loan" : "Loan"} Application
            </h1>
            <div className="w-16" />
          </div>
          
          {/* Step Progress */}
          <div className="flex items-center gap-2">
            {steps.map((step, index) => {
              const Icon = step.icon
              const isActive = currentStep === step.id
              const isCompleted = currentStep > step.id
              
              return (
                <div key={step.id} className="flex items-center flex-1">
                  <button
                    onClick={() => setCurrentStep(step.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all w-full ${
                      isActive 
                        ? "bg-primary/10 text-primary" 
                        : isCompleted 
                          ? "bg-primary/5 text-primary"
                          : "text-muted-foreground hover:bg-secondary"
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      isActive || isCompleted ? "bg-primary" : "bg-muted"
                    }`}>
                      {isCompleted ? (
                        <Check className={`w-4 h-4 ${isActive || isCompleted ? "text-primary-foreground" : "text-muted-foreground"}`} />
                      ) : (
                        <Icon className={`w-4 h-4 ${isActive || isCompleted ? "text-primary-foreground" : "text-muted-foreground"}`} />
                      )}
                    </div>
                    <span className="text-sm font-medium hidden lg:block">{step.title}</span>
                  </button>
                  {index < steps.length - 1 && (
                    <div className={`h-0.5 w-4 mx-1 ${
                      currentStep > step.id ? "bg-primary" : "bg-border"
                    }`} />
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            {renderStepContent()}
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
            className="border-border text-foreground hover:bg-secondary"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>
          
          {currentStep === steps.length ? (
            <Button
              onClick={handleSubmit}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Get AI Recommendation
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={nextStep}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
