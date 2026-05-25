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
  Wallet,
  Sparkles
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
  emiBounce: string
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
  
  // Step 4: Salary Credit Details
  salaryCreditType: string
  
  // Step 5: CIBIL / Credit Assessment
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
  { id: 4, title: "Salary Credit", icon: Wallet },
  { id: 5, title: "CIBIL Assessment", icon: Shield },
  { id: 6, title: "AI Recommendation", icon: Sparkles },
]

const companyTypes = [
  "Pvt Ltd Company",
  "Govt Company / Government Employee",
  "LLP",
  "Proprietorship",
  "Partnership",
  "School",
  "Trust",
  "NGO",
  "Contract Basis"
]

const salaryCreditTypes = ["IMPS", "RTGS", "NEFT", "UPI", "Cash"]
const freshLoanTypes = ["Term Loan", "OD"]
const btLoanTypes = ["OD", "Credit Card", "App Loan"]
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
      principalOutstanding: "",
      foreclosureAvailable: false,
      currentEMI: "",
      emiBounce: "0",
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
                
                <div className="space-y-2">
                  <Label htmlFor="location" className="text-foreground">Location</Label>
                  <Input
                    id="location"
                    placeholder="City / Area"
                    value={formData.location}
                    onChange={(e) => updateFormData("location", e.target.value)}
                    className="bg-input border-border text-foreground"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="pincode" className="text-foreground">Pincode</Label>
                  <Input
                    id="pincode"
                    placeholder="Enter pincode"
                    value={formData.pincode}
                    onChange={(e) => updateFormData("pincode", e.target.value)}
                    className="bg-input border-border text-foreground"
                    maxLength={6}
                  />
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expectedLoanType" className="text-foreground">Expected Type of Loan</Label>
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
                  <Label htmlFor="expectedROI" className="text-foreground">Expected Rate of Interest (%)</Label>
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
                  <Label htmlFor="currentEMI" className="text-foreground">Current EMI (if any)</Label>
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
                  <Label htmlFor="principalOutstanding" className="text-foreground">Principal Outstanding</Label>
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
                                <Label className="text-foreground">Current Bank Name</Label>
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
                                <Label className="text-foreground">Loan Amount Outstanding</Label>
                                <Input
                                  type="number"
                                  placeholder="Enter amount"
                                  value={loan.outstandingAmount}
                                  onChange={(e) => updateExistingLoan(loan.id, "outstandingAmount", e.target.value)}
                                  className="bg-input border-border text-foreground"
                                />
                              </div>
                              
                              <div className="space-y-2">
                                <Label className="text-foreground">Current Rate of Interest (%)</Label>
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
                                <Label className="text-foreground">Principal Outstanding</Label>
                                <Input
                                  type="number"
                                  placeholder="Enter principal"
                                  value={loan.principalOutstanding}
                                  onChange={(e) => updateExistingLoan(loan.id, "principalOutstanding", e.target.value)}
                                  className="bg-input border-border text-foreground"
                                />
                              </div>
                              
                              <div className="space-y-2">
                                <Label className="text-foreground">Current EMI</Label>
                                <Input
                                  type="number"
                                  placeholder="Enter EMI"
                                  value={loan.currentEMI}
                                  onChange={(e) => updateExistingLoan(loan.id, "currentEMI", e.target.value)}
                                  className="bg-input border-border text-foreground"
                                />
                              </div>
                              
                              <div className="space-y-2">
                                <Label className="text-foreground">EMI Bounce in this Loan</Label>
                                <Input
                                  type="number"
                                  placeholder="0"
                                  value={loan.emiBounce}
                                  onChange={(e) => updateExistingLoan(loan.id, "emiBounce", e.target.value)}
                                  className="bg-input border-border text-foreground"
                                />
                              </div>
                              
                              <div className="space-y-2 md:col-span-2">
                                <Label className="text-foreground">Foreclosure Available</Label>
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
                Provide employment information
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 md:col-span-2">
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
              
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="companyAge" className="text-foreground">Company Age / Employment Tenure (Years)</Label>
                <Input
                  id="companyAge"
                  type="number"
                  placeholder="Enter years"
                  value={formData.companyAge}
                  onChange={(e) => updateFormData("companyAge", e.target.value)}
                  className="bg-input border-border text-foreground"
                />
              </div>
            </div>
          </div>
        )
      
      // Step 4: Salary Credit Details
      case 4:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-foreground mb-2">Salary Credit Details</h3>
              <p className="text-sm text-muted-foreground mb-4">
                How is salary credited to your account?
              </p>
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
                {salaryCreditTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            
            {/* Visual indicator for selected type */}
            {formData.salaryCreditType && (
              <div className="mt-6 p-4 rounded-xl bg-primary/10 border border-primary/20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <Wallet className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Selected: {formData.salaryCreditType}</p>
                    <p className="text-sm text-muted-foreground">
                      {formData.salaryCreditType === "Cash" 
                        ? "Cash salary may have limited lender options" 
                        : "Digital transfer is preferred by most lenders"}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )
      
      // Step 5: CIBIL / Credit Assessment
      case 5:
        const cibilRisk = getCibilRiskLabel(formData.cibilScore)
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-foreground mb-2">CIBIL / Credit Assessment</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Credit history and risk assessment details
              </p>
            </div>
            
            {/* CIBIL Score Slider */}
            <div className="space-y-4">
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
                  className="w-full h-2 bg-secondary rounded-full appearance-none cursor-pointer accent-primary"
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
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-foreground">Number of Enquiries in Last 3 Months</Label>
                {formData.enquiriesLast3Months > 3 && (
                  <span className="flex items-center gap-1 text-xs text-warning">
                    <AlertTriangle className="w-3 h-3" />
                    High enquiry count
                  </span>
                )}
              </div>
              <Input
                type="number"
                min="0"
                value={formData.enquiriesLast3Months}
                onChange={(e) => updateFormData("enquiriesLast3Months", parseInt(e.target.value) || 0)}
                className="bg-input border-border text-foreground"
              />
            </div>
            
            {/* Risk Toggles */}
            <div className="space-y-4">
              <Label className="text-foreground">Credit Risk Indicators</Label>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  { key: "bounceLatestMonth" as const, label: "Bounce in Latest Month" },
                  { key: "overduesPending" as const, label: "Any Overdue Pending" },
                  { key: "pastDelayedPayments" as const, label: "Past Delayed Payments" },
                  { key: "settlementWriteOff" as const, label: "Settlement / Write-off / Suit Filed" },
                ].map(({ key, label }) => (
                  <div key={key} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 border border-border">
                    <span className="text-sm text-foreground">{label}</span>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => updateFormData(key, true)}
                        className={`px-3 py-1 rounded text-sm transition-all ${
                          formData[key]
                            ? "bg-destructive text-destructive-foreground"
                            : "bg-input border border-border text-foreground hover:border-destructive/50"
                        }`}
                      >
                        Yes
                      </button>
                      <button
                        type="button"
                        onClick={() => updateFormData(key, false)}
                        className={`px-3 py-1 rounded text-sm transition-all ${
                          !formData[key]
                            ? "bg-primary text-primary-foreground"
                            : "bg-input border border-border text-foreground hover:border-primary/50"
                        }`}
                      >
                        No
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Settlement Date - Only shown if Settlement = Yes */}
            {formData.settlementWriteOff && (
              <div className="space-y-2 p-4 rounded-lg bg-destructive/10 border border-destructive/20">
                <Label htmlFor="settlementDate" className="text-foreground">Settlement Date</Label>
                <Input
                  id="settlementDate"
                  type="date"
                  value={formData.settlementDate}
                  onChange={(e) => updateFormData("settlementDate", e.target.value)}
                  className="bg-input border-border text-foreground"
                />
                <p className="text-xs text-muted-foreground">
                  Please provide the date when the settlement occurred
                </p>
              </div>
            )}
          </div>
        )
      
      // Step 6: AI Recommendation (Submit)
      case 6:
        return (
          <div className="space-y-6">
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Ready for AI Analysis</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Our AI will analyze your application and provide personalized loan recommendations 
                based on multiple lender guidelines.
              </p>
            </div>
            
            {/* Summary Card */}
            <Card className="bg-secondary/30 border-border">
              <CardContent className="p-6">
                <h4 className="font-medium text-foreground mb-4">Application Summary</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Case Type</p>
                    <p className="font-medium text-foreground">{formData.caseType || "Not selected"}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Applicant</p>
                    <p className="font-medium text-foreground">{formData.fullName || "Not provided"}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">CIBIL Score</p>
                    <p className={`font-medium ${getCibilRiskLabel(formData.cibilScore).color}`}>
                      {formData.cibilScore}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Company Type</p>
                    <p className="font-medium text-foreground">{formData.companyType || "Not provided"}</p>
                  </div>
                  {formData.caseType === "BT" && (
                    <div>
                      <p className="text-muted-foreground">Loans for Transfer</p>
                      <p className="font-medium text-foreground">{formData.existingLoans.length}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-muted-foreground">Salary Credit</p>
                    <p className="font-medium text-foreground">{formData.salaryCreditType || "Not provided"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-4">
                Click below to submit and get your AI-powered eligibility assessment
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
              const isActive = step.id === currentStep
              const isCompleted = step.id < currentStep
              const Icon = step.icon
              
              return (
                <div key={step.id} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                      isActive 
                        ? "bg-primary text-primary-foreground" 
                        : isCompleted 
                          ? "bg-primary/20 text-primary"
                          : "bg-secondary text-muted-foreground"
                    }`}>
                      {isCompleted ? (
                        <Check className="w-5 h-5" />
                      ) : (
                        <Icon className="w-5 h-5" />
                      )}
                    </div>
                    <span className={`text-xs mt-1 hidden md:block ${
                      isActive ? "text-primary font-medium" : "text-muted-foreground"
                    }`}>
                      {step.title}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-8 md:w-16 h-0.5 mx-2 ${
                      isCompleted ? "bg-primary" : "bg-border"
                    }`} />
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Form Content */}
      <main className="max-w-3xl mx-auto px-4 py-8">
        <Card className="bg-card border-border">
          <CardContent className="p-6 md:p-8">
            {renderStepContent()}
            
            {/* Navigation Buttons */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
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
                  <Sparkles className="w-4 h-4 mr-2" />
                  Get AI Recommendation
                </Button>
              ) : (
                <Button
                  onClick={nextStep}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Next Step
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
