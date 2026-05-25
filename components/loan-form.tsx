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
  Shield,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Sparkles,
  Send,
  TrendingUp,
  Target,
  Building
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
  principalOutstanding: string
  foreclosureAvailable: boolean
  currentEMI: string
  emiBounce: boolean
  isExpanded: boolean
}

export interface LoanFormData {
  // Step 1: Personal Details
  fullName: string
  age: string
  location: string
  pincode: string
  caseType: "BT" | "Fresh" | ""
  
  // Step 2: Loan Details (Fresh)
  expectedLoanType: string
  expectedROI: string
  currentEMI: string
  principalOutstanding: string
  
  // Step 2: Loan Details (BT) - Multiple Loans
  existingLoans: ExistingLoan[]
  
  // Step 3: Employment / Company Details
  companyType: string
  companyAge: string
  salaryCreditType: string
  
  // Step 4: CIBIL / Credit Profile
  cibilScore: number
  enquiriesLast3Months: number
  bounceLatestMonth: boolean
  overduesPending: boolean
  pastDelayedPayments: boolean
  settlementWriteOff: boolean
  settlementDate: string
}

const initialFormData: LoanFormData = {
  fullName: "",
  age: "",
  location: "",
  pincode: "",
  caseType: "",
  expectedLoanType: "",
  expectedROI: "",
  currentEMI: "",
  principalOutstanding: "",
  existingLoans: [],
  companyType: "",
  companyAge: "",
  salaryCreditType: "",
  cibilScore: 750,
  enquiriesLast3Months: 0,
  bounceLatestMonth: false,
  overduesPending: false,
  pastDelayedPayments: false,
  settlementWriteOff: false,
  settlementDate: ""
}

const steps = [
  { id: 1, title: "Personal Details", icon: User },
  { id: 2, title: "Loan Details", icon: CreditCard },
  { id: 3, title: "Employment", icon: Briefcase },
  { id: 4, title: "Credit Profile", icon: Shield },
  { id: 5, title: "Eligibility Engine", icon: Target },
  { id: 6, title: "Submit", icon: Send },
]

const companyTypes = [
  "Pvt Ltd",
  "Govt Company",
  "LLP",
  "Proprietorship",
  "Partnership",
  "School",
  "Trust",
  "NGO",
  "Contract Basis"
]

const salaryCreditTypes = ["IMPS", "RTGS", "NEFT", "UPI", "Cash"]
const freshLoanTypes = ["Term Loan", "OD (Overdraft)"]
const btLoanTypes = ["OD", "Credit Card", "App Loan"]
const lenders = ["HDFC Bank", "ICICI Bank", "SBI", "Axis Bank", "Kotak Mahindra", "Bajaj Finance", "IDFC First", "Yes Bank", "PNB", "Tata Capital", "Other"]

export function LoanForm({ onSubmit, onBack }: LoanFormProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<LoanFormData>(initialFormData)
  const [isCalculatingEligibility, setIsCalculatingEligibility] = useState(false)
  const [eligibilityResult, setEligibilityResult] = useState<{
    riskLevel: string
    riskScore: number
    maxEligibleAmount: number
    estimatedROI: { min: number; max: number }
    recommendedLenders: { name: string; matchScore: number; maxAmount: number; roi: string }[]
  } | null>(null)

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
      principalOutstanding: "",
      foreclosureAvailable: false,
      currentEMI: "",
      emiBounce: false,
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

  // Calculate eligibility when entering Step 5
  const calculateEligibility = () => {
    setIsCalculatingEligibility(true)
    
    // Simulate AI calculation
    setTimeout(() => {
      // Mock eligibility calculation based on form data
      const cibilFactor = formData.cibilScore >= 750 ? 1 : formData.cibilScore >= 700 ? 0.85 : formData.cibilScore >= 650 ? 0.7 : 0.5
      const negativeFactors = [
        formData.bounceLatestMonth,
        formData.overduesPending,
        formData.pastDelayedPayments,
        formData.settlementWriteOff
      ].filter(Boolean).length
      
      const riskScore = Math.max(20, Math.min(95, Math.round(cibilFactor * 100 - negativeFactors * 15)))
      const riskLevel = riskScore >= 75 ? "Low" : riskScore >= 50 ? "Medium" : "High"
      
      const maxEligibleAmount = Math.round(riskScore * 50000)
      const baseROI = riskScore >= 75 ? 8.5 : riskScore >= 50 ? 10.5 : 13
      
      setEligibilityResult({
        riskLevel,
        riskScore,
        maxEligibleAmount,
        estimatedROI: { min: baseROI, max: baseROI + 2 },
        recommendedLenders: [
          { name: "HDFC Bank", matchScore: 92, maxAmount: maxEligibleAmount, roi: `${baseROI}% - ${baseROI + 1}%` },
          { name: "ICICI Bank", matchScore: 88, maxAmount: Math.round(maxEligibleAmount * 0.95), roi: `${baseROI + 0.25}% - ${baseROI + 1.25}%` },
          { name: "Axis Bank", matchScore: 85, maxAmount: Math.round(maxEligibleAmount * 0.9), roi: `${baseROI + 0.5}% - ${baseROI + 1.5}%` },
          { name: "Tata Capital", matchScore: 82, maxAmount: Math.round(maxEligibleAmount * 0.85), roi: `${baseROI + 0.75}% - ${baseROI + 1.75}%` },
        ]
      })
      setIsCalculatingEligibility(false)
    }, 2000)
  }

  const renderStepContent = () => {
    switch (currentStep) {
      // Step 1: Personal Details
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
                      <h4 className="font-semibold text-foreground">Fresh Case</h4>
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
                      <h4 className="font-semibold text-foreground">BT (Balance Transfer)</h4>
                      <p className="text-sm text-muted-foreground">Transfer existing loan</p>
                    </div>
                  </div>
                  {formData.caseType === "BT" && (
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
              <h3 className="text-lg font-medium text-foreground mb-2">Personal Details</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Please provide basic applicant information
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-foreground">Name</Label>
                  <Input
                    id="fullName"
                    placeholder="Enter full name"
                    value={formData.fullName}
                    onChange={(e) => updateFormData("fullName", e.target.value)}
                    className="bg-input border-border text-foreground"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="age" className="text-foreground">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    placeholder="Enter age"
                    value={formData.age}
                    onChange={(e) => updateFormData("age", e.target.value)}
                    className="bg-input border-border text-foreground"
                  />
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="location" className="text-foreground">Location / Pincode</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      id="location"
                      placeholder="City / Area"
                      value={formData.location}
                      onChange={(e) => updateFormData("location", e.target.value)}
                      className="bg-input border-border text-foreground"
                    />
                    <Input
                      id="pincode"
                      placeholder="Pincode"
                      value={formData.pincode}
                      onChange={(e) => updateFormData("pincode", e.target.value)}
                      className="bg-input border-border text-foreground"
                      maxLength={6}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      
      // Step 2: Loan Details
      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-foreground mb-2">Loan Details</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {formData.caseType === "BT" 
                  ? "Add details of existing loans for balance transfer" 
                  : "Specify the loan requirements"}
              </p>
            </div>
            
            {/* Fresh Case Fields */}
            {formData.caseType === "Fresh" && (
              <Card className="bg-secondary/30 border-border">
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expectedLoanType" className="text-foreground">Expected Loan Type</Label>
                      <select
                        id="expectedLoanType"
                        value={formData.expectedLoanType}
                        onChange={(e) => updateFormData("expectedLoanType", e.target.value)}
                        className="w-full h-10 px-3 rounded-md bg-input border border-border text-foreground"
                      >
                        <option value="">Select loan type</option>
                        {freshLoanTypes.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="expectedROI" className="text-foreground">Expected Interest Rate (%)</Label>
                      <Input
                        id="expectedROI"
                        type="number"
                        step="0.01"
                        placeholder="8.5"
                        value={formData.expectedROI}
                        onChange={(e) => updateFormData("expectedROI", e.target.value)}
                        className="bg-input border-border text-foreground"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="currentEMI" className="text-foreground">Current EMI (INR)</Label>
                      <Input
                        id="currentEMI"
                        type="number"
                        placeholder="0"
                        value={formData.currentEMI}
                        onChange={(e) => updateFormData("currentEMI", e.target.value)}
                        className="bg-input border-border text-foreground"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="principalOutstanding" className="text-foreground">Principal Outstanding (INR)</Label>
                      <Input
                        id="principalOutstanding"
                        type="number"
                        placeholder="0"
                        value={formData.principalOutstanding}
                        onChange={(e) => updateFormData("principalOutstanding", e.target.value)}
                        className="bg-input border-border text-foreground"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* BT Section - Multiple Loans */}
            {formData.caseType === "BT" && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="font-medium text-foreground">Existing Loans</h4>
                    <p className="text-sm text-muted-foreground">Add all loans you want to transfer</p>
                  </div>
                  <Button
                    type="button"
                    onClick={addExistingLoan}
                    variant="outline"
                    className="border-primary text-primary hover:bg-primary/10"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add More Loans
                  </Button>
                </div>

                {formData.existingLoans.length === 0 ? (
                  <div className="text-center py-8 border-2 border-dashed border-border rounded-xl">
                    <RefreshCw className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground">No loans added yet</p>
                    <p className="text-sm text-muted-foreground">Click &quot;Add More Loans&quot; to add existing loans</p>
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
                            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                              <span className="text-sm font-semibold text-primary">{index + 1}</span>
                            </div>
                            <div>
                              <p className="font-medium text-foreground">
                                {loan.loanType || "Loan"} {loan.lender ? `- ${loan.lender}` : ""}
                              </p>
                              {loan.outstandingAmount && (
                                <p className="text-sm text-muted-foreground">
                                  Outstanding: INR {parseInt(loan.outstandingAmount).toLocaleString()}
                                </p>
                              )}
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
                              className="text-destructive hover:bg-destructive/10"
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
                                <Label className="text-foreground">Existing Loan Type</Label>
                                <select
                                  value={loan.loanType}
                                  onChange={(e) => updateExistingLoan(loan.id, "loanType", e.target.value)}
                                  className="w-full h-10 px-3 rounded-md bg-input border border-border text-foreground"
                                >
                                  <option value="">Select type</option>
                                  {btLoanTypes.map(type => (
                                    <option key={type} value={type}>{type}</option>
                                  ))}
                                </select>
                              </div>
                              
                              <div className="space-y-2">
                                <Label className="text-foreground">Outstanding Amount (INR)</Label>
                                <Input
                                  type="number"
                                  placeholder="Enter amount"
                                  value={loan.outstandingAmount}
                                  onChange={(e) => updateExistingLoan(loan.id, "outstandingAmount", e.target.value)}
                                  className="bg-input border-border text-foreground"
                                />
                              </div>
                              
                              <div className="space-y-2">
                                <Label className="text-foreground">Bank Name</Label>
                                <select
                                  value={loan.lender}
                                  onChange={(e) => updateExistingLoan(loan.id, "lender", e.target.value)}
                                  className="w-full h-10 px-3 rounded-md bg-input border border-border text-foreground"
                                >
                                  <option value="">Select bank</option>
                                  {lenders.map(lender => (
                                    <option key={lender} value={lender}>{lender}</option>
                                  ))}
                                </select>
                              </div>
                              
                              <div className="space-y-2">
                                <Label className="text-foreground">Interest Rate (%)</Label>
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
                                <Label className="text-foreground">Loan Start Date</Label>
                                <Input
                                  type="date"
                                  value={loan.loanStartDate}
                                  onChange={(e) => updateExistingLoan(loan.id, "loanStartDate", e.target.value)}
                                  className="bg-input border-border text-foreground"
                                />
                              </div>
                              
                              <div className="space-y-2">
                                <Label className="text-foreground">Principal Outstanding (INR)</Label>
                                <Input
                                  type="number"
                                  placeholder="Enter principal"
                                  value={loan.principalOutstanding}
                                  onChange={(e) => updateExistingLoan(loan.id, "principalOutstanding", e.target.value)}
                                  className="bg-input border-border text-foreground"
                                />
                              </div>
                              
                              <div className="space-y-2">
                                <Label className="text-foreground">Foreclosure Available?</Label>
                                <div className="flex gap-4 mt-1">
                                  <button
                                    type="button"
                                    onClick={() => updateExistingLoan(loan.id, "foreclosureAvailable", true)}
                                    className={`px-4 py-2 rounded-lg border transition-all ${
                                      loan.foreclosureAvailable
                                        ? "bg-primary text-primary-foreground border-primary"
                                        : "bg-input border-border text-foreground hover:border-primary/50"
                                    }`}
                                  >
                                    Yes
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => updateExistingLoan(loan.id, "foreclosureAvailable", false)}
                                    className={`px-4 py-2 rounded-lg border transition-all ${
                                      !loan.foreclosureAvailable
                                        ? "bg-primary text-primary-foreground border-primary"
                                        : "bg-input border-border text-foreground hover:border-primary/50"
                                    }`}
                                  >
                                    No
                                  </button>
                                </div>
                              </div>
                              
                              <div className="space-y-2">
                                <Label className="text-foreground">Current EMI (INR)</Label>
                                <Input
                                  type="number"
                                  placeholder="Enter EMI"
                                  value={loan.currentEMI}
                                  onChange={(e) => updateExistingLoan(loan.id, "currentEMI", e.target.value)}
                                  className="bg-input border-border text-foreground"
                                />
                              </div>
                              
                              <div className="space-y-2 md:col-span-2">
                                <Label className="text-foreground">EMI Bounce</Label>
                                <div className="flex gap-4 mt-1">
                                  <button
                                    type="button"
                                    onClick={() => updateExistingLoan(loan.id, "emiBounce", true)}
                                    className={`px-4 py-2 rounded-lg border transition-all ${
                                      loan.emiBounce
                                        ? "bg-destructive text-destructive-foreground border-destructive"
                                        : "bg-input border-border text-foreground hover:border-destructive/50"
                                    }`}
                                  >
                                    Yes
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => updateExistingLoan(loan.id, "emiBounce", false)}
                                    className={`px-4 py-2 rounded-lg border transition-all ${
                                      !loan.emiBounce
                                        ? "bg-primary text-primary-foreground border-primary"
                                        : "bg-input border-border text-foreground hover:border-primary/50"
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

            {/* Show message if no case type selected */}
            {!formData.caseType && (
              <div className="text-center py-8 border-2 border-dashed border-border rounded-xl">
                <AlertTriangle className="w-10 h-10 text-warning mx-auto mb-3" />
                <p className="text-muted-foreground">Please select a case type in Step 1</p>
                <p className="text-sm text-muted-foreground">Go back to select Fresh Case or BT</p>
              </div>
            )}
          </div>
        )
      
      // Step 3: Employment / Company Details
      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-foreground mb-2">Employment / Company Details</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Provide employment and salary information
              </p>
            </div>
            
            <Card className="bg-secondary/30 border-border">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="companyType" className="text-foreground">Company Type</Label>
                    <select
                      id="companyType"
                      value={formData.companyType}
                      onChange={(e) => updateFormData("companyType", e.target.value)}
                      className="w-full h-10 px-3 rounded-md bg-input border border-border text-foreground"
                    >
                      <option value="">Select company type</option>
                      {companyTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="companyAge" className="text-foreground">Company Age / Tenure (Years)</Label>
                    <Input
                      id="companyAge"
                      type="number"
                      placeholder="Enter years"
                      value={formData.companyAge}
                      onChange={(e) => updateFormData("companyAge", e.target.value)}
                      className="bg-input border-border text-foreground"
                    />
                  </div>
                  
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="salaryCreditType" className="text-foreground">Salary Credit Type</Label>
                    <select
                      id="salaryCreditType"
                      value={formData.salaryCreditType}
                      onChange={(e) => updateFormData("salaryCreditType", e.target.value)}
                      className="w-full h-10 px-3 rounded-md bg-input border border-border text-foreground"
                    >
                      <option value="">Select credit type</option>
                      {salaryCreditTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                    <p className="text-xs text-muted-foreground mt-1">
                      How is your salary credited to your bank account?
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Company Type Indicator */}
            {formData.companyType && (
              <div className="p-4 rounded-xl bg-primary/10 border border-primary/20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <Building className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{formData.companyType}</p>
                    <p className="text-sm text-muted-foreground">
                      {formData.companyType === "Govt Company" 
                        ? "Government employees typically have better loan terms" 
                        : formData.companyType === "Pvt Ltd"
                        ? "Private limited companies are preferred by most lenders"
                        : "Employment type noted for eligibility assessment"}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )
      
      // Step 4: Credit Profile (CIBIL)
      case 4:
        const cibilRisk = getCibilRiskLabel(formData.cibilScore)
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-foreground mb-2">Credit Profile (CIBIL)</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Credit history and assessment details
              </p>
            </div>
            
            {/* CIBIL Score Section */}
            <Card className="bg-secondary/30 border-border">
              <CardContent className="p-6">
                {/* CIBIL Score Slider */}
                <div className="space-y-4 mb-6">
                  <div className="flex items-center justify-between">
                    <Label className="text-foreground">CIBIL Score</Label>
                    <div className="flex items-center gap-2">
                      <span className={`text-2xl font-bold ${cibilRisk.color}`}>{formData.cibilScore}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${cibilRisk.bg} ${cibilRisk.color}`}>
                        {cibilRisk.label}
                      </span>
                    </div>
                  </div>
                  <div className="relative">
                    <input
                      type="range"
                      min="300"
                      max="900"
                      value={formData.cibilScore}
                      onChange={(e) => updateFormData("cibilScore", parseInt(e.target.value))}
                      className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>300</span>
                      <span>500</span>
                      <span>650</span>
                      <span>750</span>
                      <span>900</span>
                    </div>
                  </div>
                </div>
                
                {/* Enquiries */}
                <div className="space-y-2 mb-6">
                  <Label htmlFor="enquiries" className="text-foreground">Enquiries in Last 3 Months</Label>
                  <Input
                    id="enquiries"
                    type="number"
                    min="0"
                    placeholder="0"
                    value={formData.enquiriesLast3Months}
                    onChange={(e) => updateFormData("enquiriesLast3Months", parseInt(e.target.value) || 0)}
                    className="bg-input border-border text-foreground"
                  />
                  {formData.enquiriesLast3Months > 3 && (
                    <p className="text-xs text-warning">High number of enquiries may impact eligibility</p>
                  )}
                </div>
                
                {/* Credit Issues Grid */}
                <div className="space-y-4">
                  <h4 className="font-medium text-foreground">Credit History Checks</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Bounce in Latest Month */}
                    <div className="p-4 rounded-lg bg-card border border-border">
                      <Label className="text-foreground block mb-3">Bounce in Latest Month</Label>
                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={() => updateFormData("bounceLatestMonth", true)}
                          className={`flex-1 px-4 py-2 rounded-lg border transition-all ${
                            formData.bounceLatestMonth
                              ? "bg-destructive text-destructive-foreground border-destructive"
                              : "bg-input border-border text-foreground hover:border-destructive/50"
                          }`}
                        >
                          Yes
                        </button>
                        <button
                          type="button"
                          onClick={() => updateFormData("bounceLatestMonth", false)}
                          className={`flex-1 px-4 py-2 rounded-lg border transition-all ${
                            !formData.bounceLatestMonth
                              ? "bg-primary text-primary-foreground border-primary"
                              : "bg-input border-border text-foreground hover:border-primary/50"
                          }`}
                        >
                          No
                        </button>
                      </div>
                    </div>
                    
                    {/* Overdue Pending */}
                    <div className="p-4 rounded-lg bg-card border border-border">
                      <Label className="text-foreground block mb-3">Overdue Pending</Label>
                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={() => updateFormData("overduesPending", true)}
                          className={`flex-1 px-4 py-2 rounded-lg border transition-all ${
                            formData.overduesPending
                              ? "bg-destructive text-destructive-foreground border-destructive"
                              : "bg-input border-border text-foreground hover:border-destructive/50"
                          }`}
                        >
                          Yes
                        </button>
                        <button
                          type="button"
                          onClick={() => updateFormData("overduesPending", false)}
                          className={`flex-1 px-4 py-2 rounded-lg border transition-all ${
                            !formData.overduesPending
                              ? "bg-primary text-primary-foreground border-primary"
                              : "bg-input border-border text-foreground hover:border-primary/50"
                          }`}
                        >
                          No
                        </button>
                      </div>
                    </div>
                    
                    {/* Past Delayed Payments */}
                    <div className="p-4 rounded-lg bg-card border border-border">
                      <Label className="text-foreground block mb-3">Past Delayed Payments</Label>
                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={() => updateFormData("pastDelayedPayments", true)}
                          className={`flex-1 px-4 py-2 rounded-lg border transition-all ${
                            formData.pastDelayedPayments
                              ? "bg-warning text-warning-foreground border-warning"
                              : "bg-input border-border text-foreground hover:border-warning/50"
                          }`}
                        >
                          Yes
                        </button>
                        <button
                          type="button"
                          onClick={() => updateFormData("pastDelayedPayments", false)}
                          className={`flex-1 px-4 py-2 rounded-lg border transition-all ${
                            !formData.pastDelayedPayments
                              ? "bg-primary text-primary-foreground border-primary"
                              : "bg-input border-border text-foreground hover:border-primary/50"
                          }`}
                        >
                          No
                        </button>
                      </div>
                    </div>
                    
                    {/* Settlement/Write-off */}
                    <div className="p-4 rounded-lg bg-card border border-border">
                      <Label className="text-foreground block mb-3">Settlement / Write-off</Label>
                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={() => updateFormData("settlementWriteOff", true)}
                          className={`flex-1 px-4 py-2 rounded-lg border transition-all ${
                            formData.settlementWriteOff
                              ? "bg-destructive text-destructive-foreground border-destructive"
                              : "bg-input border-border text-foreground hover:border-destructive/50"
                          }`}
                        >
                          Yes
                        </button>
                        <button
                          type="button"
                          onClick={() => updateFormData("settlementWriteOff", false)}
                          className={`flex-1 px-4 py-2 rounded-lg border transition-all ${
                            !formData.settlementWriteOff
                              ? "bg-primary text-primary-foreground border-primary"
                              : "bg-input border-border text-foreground hover:border-primary/50"
                          }`}
                        >
                          No
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Settlement Date (conditional) */}
                  {formData.settlementWriteOff && (
                    <div className="space-y-2 mt-4">
                      <Label htmlFor="settlementDate" className="text-foreground">Settlement Date</Label>
                      <Input
                        id="settlementDate"
                        type="date"
                        value={formData.settlementDate}
                        onChange={(e) => updateFormData("settlementDate", e.target.value)}
                        className="bg-input border-border text-foreground"
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            {/* Risk Indicators */}
            {(formData.bounceLatestMonth || formData.overduesPending || formData.settlementWriteOff || formData.cibilScore < 650) && (
              <div className="flex flex-wrap gap-2">
                {formData.bounceLatestMonth && (
                  <span className="px-3 py-1.5 rounded-full text-xs font-medium bg-destructive/20 text-destructive flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    Recent Bounce
                  </span>
                )}
                {formData.overduesPending && (
                  <span className="px-3 py-1.5 rounded-full text-xs font-medium bg-destructive/20 text-destructive flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    Overdues Pending
                  </span>
                )}
                {formData.settlementWriteOff && (
                  <span className="px-3 py-1.5 rounded-full text-xs font-medium bg-destructive/20 text-destructive flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    Settlement/Write-off History
                  </span>
                )}
                {formData.cibilScore < 650 && (
                  <span className="px-3 py-1.5 rounded-full text-xs font-medium bg-warning/20 text-warning flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    Low CIBIL Score
                  </span>
                )}
              </div>
            )}
          </div>
        )
      
      // Step 5: Eligibility Engine
      case 5:
        // Trigger calculation on first render of this step
        if (!eligibilityResult && !isCalculatingEligibility) {
          calculateEligibility()
        }
        
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-foreground mb-2">Eligibility Engine</h3>
              <p className="text-sm text-muted-foreground mb-4">
                AI-powered risk assessment and lender recommendations
              </p>
            </div>
            
            {isCalculatingEligibility ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4 animate-pulse">
                  <Sparkles className="w-8 h-8 text-primary" />
                </div>
                <h4 className="text-lg font-semibold text-foreground mb-2">Calculating Eligibility</h4>
                <p className="text-muted-foreground mb-6">Analyzing your profile for best matches...</p>
                <div className="max-w-xs mx-auto space-y-2">
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <div className="w-4 h-4 rounded-full bg-primary animate-pulse" />
                    <span>Analyzing credit profile...</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <div className="w-4 h-4 rounded-full bg-primary/60 animate-pulse" style={{ animationDelay: "0.2s" }} />
                    <span>Calculating risk score...</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <div className="w-4 h-4 rounded-full bg-primary/40 animate-pulse" style={{ animationDelay: "0.4s" }} />
                    <span>Matching with lenders...</span>
                  </div>
                </div>
              </div>
            ) : eligibilityResult ? (
              <div className="space-y-6">
                {/* Risk Assessment */}
                <Card className="bg-secondary/30 border-border">
                  <CardContent className="p-6">
                    <h4 className="font-medium text-foreground mb-4 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-primary" />
                      Risk Assessment
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center p-4 rounded-xl bg-card border border-border">
                        <p className="text-sm text-muted-foreground mb-1">Risk Level</p>
                        <p className={`text-2xl font-bold ${
                          eligibilityResult.riskLevel === "Low" ? "text-primary" :
                          eligibilityResult.riskLevel === "Medium" ? "text-warning" : "text-destructive"
                        }`}>
                          {eligibilityResult.riskLevel}
                        </p>
                      </div>
                      <div className="text-center p-4 rounded-xl bg-card border border-border">
                        <p className="text-sm text-muted-foreground mb-1">Risk Score</p>
                        <p className="text-2xl font-bold text-foreground">{eligibilityResult.riskScore}/100</p>
                      </div>
                      <div className="text-center p-4 rounded-xl bg-card border border-border">
                        <p className="text-sm text-muted-foreground mb-1">Estimated ROI</p>
                        <p className="text-2xl font-bold text-foreground">
                          {eligibilityResult.estimatedROI.min}% - {eligibilityResult.estimatedROI.max}%
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Loan Eligibility */}
                <Card className="bg-secondary/30 border-border">
                  <CardContent className="p-6">
                    <h4 className="font-medium text-foreground mb-4 flex items-center gap-2">
                      <Target className="w-5 h-5 text-primary" />
                      Loan Eligibility
                    </h4>
                    <div className="text-center p-6 rounded-xl bg-primary/10 border border-primary/20">
                      <p className="text-sm text-muted-foreground mb-2">Maximum Eligible Amount</p>
                      <p className="text-4xl font-bold text-primary">
                        INR {eligibilityResult.maxEligibleAmount.toLocaleString()}
                      </p>
                      <p className="text-sm text-muted-foreground mt-2">
                        Based on your credit profile and employment details
                      </p>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Lender Recommendations */}
                <Card className="bg-secondary/30 border-border">
                  <CardContent className="p-6">
                    <h4 className="font-medium text-foreground mb-4 flex items-center gap-2">
                      <Building className="w-5 h-5 text-primary" />
                      Lender Recommendation
                    </h4>
                    <div className="space-y-3">
                      {eligibilityResult.recommendedLenders.map((lender, index) => (
                        <div 
                          key={lender.name}
                          className={`p-4 rounded-xl border ${
                            index === 0 ? "bg-primary/10 border-primary/30" : "bg-card border-border"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                index === 0 ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground"
                              }`}>
                                <Building2 className="w-5 h-5" />
                              </div>
                              <div>
                                <p className="font-medium text-foreground flex items-center gap-2">
                                  {lender.name}
                                  {index === 0 && (
                                    <span className="text-xs px-2 py-0.5 rounded-full bg-primary text-primary-foreground">
                                      Best Match
                                    </span>
                                  )}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  Up to INR {lender.maxAmount.toLocaleString()} @ {lender.roi}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-semibold text-primary">{lender.matchScore}%</p>
                              <p className="text-xs text-muted-foreground">Match</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                {/* Recalculate Button */}
                <div className="flex justify-center">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setEligibilityResult(null)
                      calculateEligibility()
                    }}
                    className="border-primary text-primary hover:bg-primary/10"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Recalculate Eligibility
                  </Button>
                </div>
              </div>
            ) : null}
          </div>
        )
      
      // Step 6: Submit Application
      case 6:
        return (
          <div className="space-y-6">
            <div className="text-center py-4">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                <Send className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Submit Application</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Review your application summary and submit for processing
              </p>
            </div>
            
            {/* Application Summary */}
            <Card className="bg-secondary/30 border-border">
              <CardContent className="p-6">
                <h4 className="font-medium text-foreground mb-4">Application Summary</h4>
                
                <div className="space-y-4">
                  {/* Personal Details */}
                  <div className="flex items-start justify-between p-3 rounded-lg bg-card border border-border">
                    <div className="flex items-center gap-3">
                      <User className="w-5 h-5 text-primary" />
                      <div>
                        <p className="font-medium text-foreground">Personal Details</p>
                        <p className="text-sm text-muted-foreground">
                          {formData.fullName || "Not provided"} | Age: {formData.age || "-"} | {formData.location || "-"}
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => setCurrentStep(1)} className="text-primary">
                      Edit
                    </Button>
                  </div>
                  
                  {/* Loan Details */}
                  <div className="flex items-start justify-between p-3 rounded-lg bg-card border border-border">
                    <div className="flex items-center gap-3">
                      <CreditCard className="w-5 h-5 text-primary" />
                      <div>
                        <p className="font-medium text-foreground">Loan Details ({formData.caseType || "Not selected"})</p>
                        <p className="text-sm text-muted-foreground">
                          {formData.caseType === "Fresh" 
                            ? `${formData.expectedLoanType || "Type not selected"} | Expected ROI: ${formData.expectedROI || "-"}%`
                            : `${formData.existingLoans.length} loans for transfer`
                          }
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => setCurrentStep(2)} className="text-primary">
                      Edit
                    </Button>
                  </div>
                  
                  {/* Employment */}
                  <div className="flex items-start justify-between p-3 rounded-lg bg-card border border-border">
                    <div className="flex items-center gap-3">
                      <Briefcase className="w-5 h-5 text-primary" />
                      <div>
                        <p className="font-medium text-foreground">Employment Details</p>
                        <p className="text-sm text-muted-foreground">
                          {formData.companyType || "Not provided"} | Tenure: {formData.companyAge || "-"} years | Salary: {formData.salaryCreditType || "-"}
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => setCurrentStep(3)} className="text-primary">
                      Edit
                    </Button>
                  </div>
                  
                  {/* Credit Profile */}
                  <div className="flex items-start justify-between p-3 rounded-lg bg-card border border-border">
                    <div className="flex items-center gap-3">
                      <Shield className="w-5 h-5 text-primary" />
                      <div>
                        <p className="font-medium text-foreground">Credit Profile</p>
                        <p className="text-sm text-muted-foreground">
                          CIBIL: {formData.cibilScore} ({getCibilRiskLabel(formData.cibilScore).label}) | Enquiries: {formData.enquiriesLast3Months}
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => setCurrentStep(4)} className="text-primary">
                      Edit
                    </Button>
                  </div>
                  
                  {/* Eligibility */}
                  {eligibilityResult && (
                    <div className="flex items-start justify-between p-3 rounded-lg bg-card border border-border">
                      <div className="flex items-center gap-3">
                        <Target className="w-5 h-5 text-primary" />
                        <div>
                          <p className="font-medium text-foreground">Eligibility Assessment</p>
                          <p className="text-sm text-muted-foreground">
                            Risk: {eligibilityResult.riskLevel} | Max Amount: INR {eligibilityResult.maxEligibleAmount.toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => setCurrentStep(5)} className="text-primary">
                        View
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            {/* Submit Button */}
            <div className="flex flex-col gap-4 pt-4">
              <Button
                onClick={handleSubmit}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-12 text-lg"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Submit Application
              </Button>
              <p className="text-xs text-center text-muted-foreground">
                By submitting, you agree to our terms and conditions. Your application will be processed for AI-powered lender matching.
              </p>
            </div>
          </div>
        )
      
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={onBack}
              className="text-foreground hover:bg-secondary"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Step {currentStep} of {steps.length}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Progress Steps */}
      <div className="bg-card border-b border-border">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon
              const isActive = currentStep === step.id
              const isCompleted = currentStep > step.id
              
              return (
                <div key={step.id} className="flex items-center">
                  <button
                    onClick={() => setCurrentStep(step.id)}
                    className="flex flex-col items-center gap-2"
                  >
                    <div className={`
                      w-10 h-10 rounded-full flex items-center justify-center transition-all
                      ${isActive ? "bg-primary text-primary-foreground" : ""}
                      ${isCompleted ? "bg-primary/20 text-primary" : ""}
                      ${!isActive && !isCompleted ? "bg-secondary text-muted-foreground" : ""}
                    `}>
                      {isCompleted ? (
                        <Check className="w-5 h-5" />
                      ) : (
                        <Icon className="w-5 h-5" />
                      )}
                    </div>
                    <span className={`text-xs font-medium hidden md:block ${
                      isActive ? "text-primary" : "text-muted-foreground"
                    }`}>
                      {step.title}
                    </span>
                  </button>
                  
                  {index < steps.length - 1 && (
                    <div className={`w-8 md:w-16 h-0.5 mx-1 md:mx-2 ${
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
      <main className="max-w-5xl mx-auto px-4 py-8">
        <Card className="bg-card border-border">
          <CardContent className="p-6 md:p-8">
            {renderStepContent()}
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        {currentStep < 6 && (
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
            
            <Button
              onClick={nextStep}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Next Step
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}
      </main>
    </div>
  )
}
