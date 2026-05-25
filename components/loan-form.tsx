"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
  Banknote,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Info
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
  monthlyIncome: string
  yearsOfExperience: string
  
  // Company Details
  companyType: string
  companyAge: string
  employmentStability: string
  
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
  settlementDate: string
  
  // Loan Details
  loanAmount: string
  loanTenure: string
  loanPurpose: string
  existingEMI: string
  
  // BT Specific - Multiple Loans
  existingLoans: ExistingLoan[]
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
  monthlyIncome: "",
  yearsOfExperience: "",
  companyType: "",
  companyAge: "",
  employmentStability: "",
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
  settlementDate: "",
  loanAmount: "",
  loanTenure: "",
  loanPurpose: "",
  existingEMI: "",
  existingLoans: [],
}

const steps = [
  { id: 1, title: "Case Type", icon: Building2 },
  { id: 2, title: "Personal", icon: User },
  { id: 3, title: "Employment", icon: Briefcase },
  { id: 4, title: "Salary & Banking", icon: Banknote },
  { id: 5, title: "CIBIL", icon: Shield },
  { id: 6, title: "Loan Details", icon: CreditCard },
  { id: 7, title: "Review", icon: FileText },
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

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-foreground mb-2">Select Case Type</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Choose whether this is a Balance Transfer or a Fresh Loan application
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => updateFormData("caseType", "BT")}
                className={`p-6 rounded-xl border-2 transition-all text-left ${
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
                  <div className="mt-4 flex items-center gap-2 text-primary">
                    <Check className="w-4 h-4" />
                    <span className="text-sm font-medium">Selected</span>
                  </div>
                )}
              </button>
              
              <button
                type="button"
                onClick={() => updateFormData("caseType", "Fresh")}
                className={`p-6 rounded-xl border-2 transition-all text-left ${
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
                  <div className="mt-4 flex items-center gap-2 text-primary">
                    <Check className="w-4 h-4" />
                    <span className="text-sm font-medium">Selected</span>
                  </div>
                )}
              </button>
            </div>
          </div>
        )
      
      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-foreground mb-2">Personal Details</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Please provide your personal information
              </p>
            </div>
            
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
        )
      
      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-foreground mb-2">Employment Details</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Tell us about your current employment
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
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
                  <Label htmlFor="companyAge" className="text-foreground">Age of Company (Years)</Label>
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
                  <Label htmlFor="monthlyIncome" className="text-foreground">Monthly Income (INR)</Label>
                  <Input
                    id="monthlyIncome"
                    type="number"
                    placeholder="50000"
                    value={formData.monthlyIncome}
                    onChange={(e) => updateFormData("monthlyIncome", e.target.value)}
                    className="bg-input border-border text-foreground"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="yearsOfExperience" className="text-foreground">Years of Experience</Label>
                  <Input
                    id="yearsOfExperience"
                    type="number"
                    placeholder="5"
                    value={formData.yearsOfExperience}
                    onChange={(e) => updateFormData("yearsOfExperience", e.target.value)}
                    className="bg-input border-border text-foreground"
                  />
                </div>
              </div>

              {/* Employment Stability Indicator */}
              <div className="p-4 rounded-xl bg-secondary/30 border border-border">
                <div className="flex items-center gap-3 mb-3">
                  <Info className="w-5 h-5 text-primary" />
                  <Label className="text-foreground font-medium">Employment Stability</Label>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {["Low", "Medium", "High"].map((stability) => (
                    <button
                      key={stability}
                      type="button"
                      onClick={() => updateFormData("employmentStability", stability)}
                      className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                        formData.employmentStability === stability
                          ? stability === "High" ? "border-primary bg-primary/10 text-primary" :
                            stability === "Medium" ? "border-warning bg-warning/10 text-warning" :
                            "border-destructive bg-destructive/10 text-destructive"
                          : "border-border bg-card text-foreground hover:border-primary/50"
                      }`}
                    >
                      {stability}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )
      
      case 4:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-foreground mb-2">Salary & Banking Details</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Provide your salary structure and banking information
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="netSalary" className="text-foreground">Net Salary Credited (INR)</Label>
                <Input
                  id="netSalary"
                  type="number"
                  placeholder="45000"
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
                  placeholder="40000"
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
                  placeholder="5000"
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
            <div className="space-y-3 mt-6">
              <Label className="text-foreground font-medium">Additional Information</Label>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => updateFormData("pfDeducted", !formData.pfDeducted)}
                  className={`p-4 rounded-lg border text-left transition-all ${
                    formData.pfDeducted
                      ? "border-primary bg-primary/10"
                      : "border-border bg-card hover:border-primary/50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">PF Deducted</span>
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                      formData.pfDeducted ? "bg-primary" : "bg-secondary"
                    }`}>
                      {formData.pfDeducted && <Check className="w-3 h-3 text-primary-foreground" />}
                    </div>
                  </div>
                </button>
                
                <button
                  type="button"
                  onClick={() => updateFormData("tdsDeducted", !formData.tdsDeducted)}
                  className={`p-4 rounded-lg border text-left transition-all ${
                    formData.tdsDeducted
                      ? "border-primary bg-primary/10"
                      : "border-border bg-card hover:border-primary/50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">TDS Deducted</span>
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                      formData.tdsDeducted ? "bg-primary" : "bg-secondary"
                    }`}>
                      {formData.tdsDeducted && <Check className="w-3 h-3 text-primary-foreground" />}
                    </div>
                  </div>
                </button>
                
                <button
                  type="button"
                  onClick={() => updateFormData("officialMailAvailable", !formData.officialMailAvailable)}
                  className={`p-4 rounded-lg border text-left transition-all ${
                    formData.officialMailAvailable
                      ? "border-primary bg-primary/10"
                      : "border-border bg-card hover:border-primary/50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">Official Mail ID</span>
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                      formData.officialMailAvailable ? "bg-primary" : "bg-secondary"
                    }`}>
                      {formData.officialMailAvailable && <Check className="w-3 h-3 text-primary-foreground" />}
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        )
      
      case 5:
        const risk = getCibilRiskLabel(formData.cibilScore)
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-foreground mb-2">CIBIL Assessment</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Enter your credit bureau information for accurate eligibility assessment
              </p>
            </div>
            
            {/* CIBIL Score Card */}
            <div className="p-6 rounded-xl bg-gradient-to-br from-card to-secondary/30 border border-border">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <Label className="text-foreground font-medium">CIBIL Score</Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    Move the slider to set your credit score
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className={`px-4 py-2 rounded-lg ${risk.bg}`}>
                    <span className={`text-sm font-semibold ${risk.color}`}>{risk.label}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-4xl font-bold text-foreground">{formData.cibilScore}</span>
                    <span className="text-muted-foreground text-lg">/900</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <input
                  type="range"
                  min="300"
                  max="900"
                  value={formData.cibilScore}
                  onChange={(e) => updateFormData("cibilScore", parseInt(e.target.value))}
                  className="w-full h-3 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-2">
                  <span>300</span>
                  <span>500</span>
                  <span>650</span>
                  <span>750</span>
                  <span>900</span>
                </div>
              </div>
            </div>

            {/* Credit Enquiries */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="enquiries" className="text-foreground">Enquiries in Last 3 Months</Label>
                <div className="flex items-center gap-3">
                  <Input
                    id="enquiries"
                    type="number"
                    min="0"
                    value={formData.enquiriesLast3Months}
                    onChange={(e) => updateFormData("enquiriesLast3Months", parseInt(e.target.value) || 0)}
                    className="bg-input border-border text-foreground"
                  />
                  {formData.enquiriesLast3Months > 3 && (
                    <div className="flex items-center gap-1 px-2 py-1 rounded bg-warning/20">
                      <AlertTriangle className="w-4 h-4 text-warning" />
                      <span className="text-xs text-warning">High</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="settlementDate" className="text-foreground">Settlement/Write-off Date</Label>
                <Input
                  id="settlementDate"
                  type="date"
                  value={formData.settlementDate}
                  onChange={(e) => updateFormData("settlementDate", e.target.value)}
                  className="bg-input border-border text-foreground"
                  disabled={!formData.settlementWriteOff}
                />
              </div>
            </div>

            {/* Risk Indicators */}
            <div className="space-y-3">
              <Label className="text-foreground font-medium">Credit History Indicators</Label>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  { key: "bounceLatestMonth", label: "Bounce in Latest Month", warning: true },
                  { key: "overduesPending", label: "Any Overdue Pending", warning: true },
                  { key: "pastDelayedPayments", label: "Past Delayed Payments", warning: true },
                  { key: "settlementWriteOff", label: "Settlement / Write-off", warning: true },
                ].map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => updateFormData(item.key as keyof LoanFormData, !formData[item.key as keyof LoanFormData])}
                    className={`p-4 rounded-lg border text-left transition-all ${
                      formData[item.key as keyof LoanFormData]
                        ? "border-destructive bg-destructive/10"
                        : "border-border bg-card hover:border-primary/50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {formData[item.key as keyof LoanFormData] && item.warning && (
                          <AlertTriangle className="w-4 h-4 text-destructive" />
                        )}
                        <span className="text-sm font-medium text-foreground">{item.label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs ${
                          formData[item.key as keyof LoanFormData] ? "text-destructive" : "text-muted-foreground"
                        }`}>
                          {formData[item.key as keyof LoanFormData] ? "Yes" : "No"}
                        </span>
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                          formData[item.key as keyof LoanFormData] ? "bg-destructive" : "bg-secondary"
                        }`}>
                          {formData[item.key as keyof LoanFormData] && <Check className="w-3 h-3 text-destructive-foreground" />}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )
      
      case 6:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-foreground mb-2">Loan Details</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Specify your loan requirements
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="loanAmount" className="text-foreground">Loan Amount (INR)</Label>
                <Input
                  id="loanAmount"
                  type="number"
                  placeholder="1000000"
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
                  min={1}
                  max={30}
                />
              </div>
              
              <div className="space-y-2">
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
                </select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="existingEMI" className="text-foreground">Total Existing EMI (INR)</Label>
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
            
            {/* Balance Transfer Section */}
            {formData.caseType === "BT" && (
              <div className="mt-6 space-y-4">
                <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-primary font-medium">Balance Transfer - Existing Loans</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Add all your existing loans to transfer
                      </p>
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      onClick={addExistingLoan}
                      className="bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Loan
                    </Button>
                  </div>
                </div>

                {/* Existing Loans List */}
                <div className="space-y-4">
                  {formData.existingLoans.map((loan, index) => (
                    <Card key={loan.id} className="bg-card border-border overflow-hidden">
                      <div
                        className="flex items-center justify-between p-4 cursor-pointer hover:bg-secondary/30 transition-colors"
                        onClick={() => toggleLoanExpand(loan.id)}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-sm font-semibold text-primary">{index + 1}</span>
                          </div>
                          <div>
                            <p className="font-medium text-foreground">
                              {loan.loanType || "New Loan"} - {loan.lender || "Select Lender"}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {loan.outstandingAmount ? `Outstanding: ₹${parseInt(loan.outstandingAmount).toLocaleString()}` : "Click to expand"}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation()
                              removeExistingLoan(loan.id)
                            }}
                            className="text-muted-foreground hover:text-destructive"
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
                        <CardContent className="pt-0 pb-4 border-t border-border">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
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
                              <Label className="text-foreground">Current Lender</Label>
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
                                step="0.1"
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
                              <Label className="text-foreground">Bounce History (Last 12 Months)</Label>
                              <Input
                                type="number"
                                min="0"
                                placeholder="0"
                                value={loan.bounceHistory}
                                onChange={(e) => updateExistingLoan(loan.id, "bounceHistory", e.target.value)}
                                className="bg-input border-border text-foreground"
                              />
                            </div>
                            
                            <button
                              type="button"
                              onClick={() => updateExistingLoan(loan.id, "foreclosureAvailable", !loan.foreclosureAvailable)}
                              className={`p-4 rounded-lg border text-left transition-all ${
                                loan.foreclosureAvailable
                                  ? "border-primary bg-primary/10"
                                  : "border-border bg-card hover:border-primary/50"
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-foreground">Foreclosure Available</span>
                                <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                                  loan.foreclosureAvailable ? "bg-primary" : "bg-secondary"
                                }`}>
                                  {loan.foreclosureAvailable && <Check className="w-3 h-3 text-primary-foreground" />}
                                </div>
                              </div>
                            </button>
                          </div>
                        </CardContent>
                      )}
                    </Card>
                  ))}
                </div>

                {formData.existingLoans.length === 0 && (
                  <div className="text-center py-8 border-2 border-dashed border-border rounded-xl">
                    <RefreshCw className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground">No existing loans added</p>
                    <p className="text-sm text-muted-foreground mt-1">Click &quot;Add Loan&quot; to add loans for balance transfer</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )
      
      case 7:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-foreground mb-2">Review Your Application</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Please verify all information before submission
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-card border border-border">
                <h4 className="font-medium text-foreground mb-3 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-primary" />
                  Case Type
                </h4>
                <p className="text-muted-foreground">
                  {formData.caseType === "BT" ? "Balance Transfer" : "Fresh Loan"}
                </p>
              </div>
              
              <div className="p-4 rounded-xl bg-card border border-border">
                <h4 className="font-medium text-foreground mb-3 flex items-center gap-2">
                  <User className="w-4 h-4 text-primary" />
                  Personal Details
                </h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <span className="text-muted-foreground">Name:</span>
                  <span className="text-foreground">{formData.fullName || "-"}</span>
                  <span className="text-muted-foreground">PAN:</span>
                  <span className="text-foreground">{formData.panNumber || "-"}</span>
                  <span className="text-muted-foreground">Phone:</span>
                  <span className="text-foreground">{formData.phone || "-"}</span>
                  <span className="text-muted-foreground">Email:</span>
                  <span className="text-foreground">{formData.email || "-"}</span>
                </div>
              </div>
              
              <div className="p-4 rounded-xl bg-card border border-border">
                <h4 className="font-medium text-foreground mb-3 flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-primary" />
                  Employment Details
                </h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <span className="text-muted-foreground">Type:</span>
                  <span className="text-foreground">{formData.employmentType || "-"}</span>
                  <span className="text-muted-foreground">Company:</span>
                  <span className="text-foreground">{formData.companyName || "-"}</span>
                  <span className="text-muted-foreground">Company Type:</span>
                  <span className="text-foreground">{formData.companyType || "-"}</span>
                  <span className="text-muted-foreground">Income:</span>
                  <span className="text-foreground">
                    {formData.monthlyIncome ? `₹${parseInt(formData.monthlyIncome).toLocaleString()}` : "-"}
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-card border border-border">
                <h4 className="font-medium text-foreground mb-3 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-primary" />
                  CIBIL Assessment
                </h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <span className="text-muted-foreground">CIBIL Score:</span>
                  <span className={`font-semibold ${getCibilRiskLabel(formData.cibilScore).color}`}>
                    {formData.cibilScore} ({getCibilRiskLabel(formData.cibilScore).label})
                  </span>
                  <span className="text-muted-foreground">Enquiries (3 months):</span>
                  <span className="text-foreground">{formData.enquiriesLast3Months}</span>
                  <span className="text-muted-foreground">Bounce Latest Month:</span>
                  <span className={formData.bounceLatestMonth ? "text-destructive" : "text-foreground"}>
                    {formData.bounceLatestMonth ? "Yes" : "No"}
                  </span>
                  <span className="text-muted-foreground">Overdues Pending:</span>
                  <span className={formData.overduesPending ? "text-destructive" : "text-foreground"}>
                    {formData.overduesPending ? "Yes" : "No"}
                  </span>
                </div>
              </div>
              
              <div className="p-4 rounded-xl bg-card border border-border">
                <h4 className="font-medium text-foreground mb-3 flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-primary" />
                  Loan Details
                </h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <span className="text-muted-foreground">Amount:</span>
                  <span className="text-foreground">
                    {formData.loanAmount ? `₹${parseInt(formData.loanAmount).toLocaleString()}` : "-"}
                  </span>
                  <span className="text-muted-foreground">Tenure:</span>
                  <span className="text-foreground">{formData.loanTenure ? `${formData.loanTenure} Years` : "-"}</span>
                  <span className="text-muted-foreground">Purpose:</span>
                  <span className="text-foreground">{formData.loanPurpose || "-"}</span>
                </div>
              </div>

              {formData.caseType === "BT" && formData.existingLoans.length > 0 && (
                <div className="p-4 rounded-xl bg-card border border-border">
                  <h4 className="font-medium text-foreground mb-3 flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 text-primary" />
                    Existing Loans for BT ({formData.existingLoans.length})
                  </h4>
                  <div className="space-y-2">
                    {formData.existingLoans.map((loan, index) => (
                      <div key={loan.id} className="p-3 rounded-lg bg-secondary/30 text-sm">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-foreground">
                            {index + 1}. {loan.loanType} - {loan.lender}
                          </span>
                          <span className="text-primary font-semibold">
                            ₹{loan.outstandingAmount ? parseInt(loan.outstandingAmount).toLocaleString() : "-"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )
      
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-foreground">Loan Application</CardTitle>
            <CardDescription className="text-muted-foreground">
              Complete all steps to submit your loan application
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Step Progress - Sticky */}
            <div className="sticky top-0 bg-card z-10 pb-6 mb-6 -mx-6 px-6 border-b border-border">
              <div className="flex items-center justify-between overflow-x-auto py-2">
                {steps.map((step, index) => (
                  <div key={step.id} className="flex items-center shrink-0">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                          currentStep >= step.id
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary text-muted-foreground"
                        }`}
                      >
                        {currentStep > step.id ? (
                          <Check className="w-5 h-5" />
                        ) : (
                          <step.icon className="w-5 h-5" />
                        )}
                      </div>
                      <span className={`text-xs mt-2 hidden lg:block ${
                        currentStep >= step.id ? "text-foreground" : "text-muted-foreground"
                      }`}>
                        {step.title}
                      </span>
                    </div>
                    {index < steps.length - 1 && (
                      <div
                        className={`w-8 md:w-12 lg:w-16 h-1 mx-1 md:mx-2 rounded ${
                          currentStep > step.id ? "bg-primary" : "bg-secondary"
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Step Content */}
            <div className="min-h-[400px]">
              {renderStepContent()}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t border-border">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="border-border text-foreground hover:bg-secondary"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>
              
              {currentStep < steps.length ? (
                <Button
                  onClick={nextStep}
                  disabled={currentStep === 1 && !formData.caseType}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Next Step
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Submit Application
                  <Check className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
