"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  ArrowLeft,
  Check,
  X,
  AlertTriangle,
  Sparkles,
  TrendingUp,
  Percent,
  Calendar,
  IndianRupee,
  FileText,
  Download,
  Share2,
  Shield,
  Target,
  Brain,
  ChevronDown,
  ChevronUp,
  Info,
  Award,
  BarChart3,
  Building2,
  Gauge,
  Zap,
  TrendingDown,
  Activity,
  Eye,
  MessageSquare
} from "lucide-react"
import { LoanFormData } from "./loan-form"

interface AIRecommendationProps {
  formData: LoanFormData
  onBack: () => void
  onNewApplication: () => void
}

interface BankEligibility {
  name: string
  eligible: boolean
  probability: number
  suggestedROI: number
  maxAmount: number
  reason: string
  isRecommended?: boolean
}

interface PolicyReference {
  id: string
  name: string
  bank: string
  version: string
  relevanceScore: number
}

interface AnalysisResult {
  eligibilityScore: number
  recommendation: "approved" | "conditional" | "rejected"
  maxLoanAmount: number
  suggestedROI: number
  suggestedTenure: number
  monthlyEMI: number
  riskLevel: "Low" | "Medium" | "High"
  foirAnalysis: {
    currentFOIR: number
    maxAllowedFOIR: number
    status: "good" | "warning" | "critical"
  }
  aiConfidenceScore: number
  factors: {
    name: string
    score: number
    impact: "positive" | "negative" | "neutral"
    detail: string
  }[]
  suggestions: string[]
  risks: string[]
  rejectionReasons: string[]
  eligibleBanks: BankEligibility[]
  policyReferences: PolicyReference[]
  reasoningSteps: string[]
  underwritingNotes: string[]
  keyObservations: string[]
}

const processingSteps = [
  "Analyzing applicant profile...",
  "Matching lender underwriting rules...",
  "Evaluating banking policies...",
  "Checking credit eligibility...",
  "Generating lender recommendations..."
]

export function AIRecommendation({ formData, onBack, onNewApplication }: AIRecommendationProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(true)
  const [progress, setProgress] = useState(0)
  const [currentProcessingStep, setCurrentProcessingStep] = useState(0)
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [showPolicyDetails, setShowPolicyDetails] = useState(false)
  const [showReasoningDetails, setShowReasoningDetails] = useState(false)
  const [showAIAssistant, setShowAIAssistant] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + Math.random() * 8
      })
    }, 200)

    const stepInterval = setInterval(() => {
      setCurrentProcessingStep(prev => (prev + 1) % processingSteps.length)
    }, 700)

    const timeout = setTimeout(() => {
      setIsAnalyzing(false)
      setResult(generateMockResult())
    }, 4000)

    return () => {
      clearInterval(interval)
      clearInterval(stepInterval)
      clearTimeout(timeout)
    }
  }, [])

  const generateMockResult = (): AnalysisResult => {
    const income = parseInt(formData.netSalary) || 50000
    const existingEMI = parseInt(formData.currentEMI) || 0
    const cibilScore = formData.cibilScore || 750
    
    const maxEMI = income * 0.5 - existingEMI
    const baseROI = formData.caseType === "BT" ? 8.5 : 9.25
    const tenure = 20
    const maxLoan = maxEMI * 12 * tenure * 0.6
    const emi = (maxLoan * baseROI/100/12 * Math.pow(1 + baseROI/100/12, tenure * 12)) / (Math.pow(1 + baseROI/100/12, tenure * 12) - 1)
    
    const currentFOIR = ((existingEMI + emi) / income) * 100
    
    let score = 70
    score += cibilScore >= 750 ? 15 : cibilScore >= 700 ? 10 : cibilScore >= 650 ? 5 : -5
    score += income > 100000 ? 10 : income > 50000 ? 5 : 0
    score += existingEMI === 0 ? 8 : existingEMI < income * 0.3 ? 3 : -8
    score += formData.pfDeducted ? 3 : 0
    score += formData.tdsDeducted ? 2 : 0
    score += formData.officialMailAvailable ? 2 : 0
    score -= formData.bounceLatestMonth ? 15 : 0
    score -= formData.overduesPending ? 12 : 0
    score -= formData.settlementWriteOff ? 20 : 0
    score -= formData.enquiriesLast3Months > 3 ? 8 : formData.enquiriesLast3Months > 1 ? 3 : 0
    
    score = Math.min(98, Math.max(25, score))

    const riskLevel = score >= 75 ? "Low" : score >= 55 ? "Medium" : "High"
    const recommendation = score >= 70 ? "approved" : score >= 50 ? "conditional" : "rejected"

    const banks: BankEligibility[] = [
      {
        name: "HDFC Bank",
        eligible: score >= 65,
        probability: Math.min(95, score + 5),
        suggestedROI: baseROI - 0.25,
        maxAmount: maxLoan * 1.1,
        reason: score >= 65 ? "Strong income profile matches HDFC criteria" : "CIBIL score below minimum threshold",
        isRecommended: score >= 75
      },
      {
        name: "ICICI Bank",
        eligible: score >= 60,
        probability: Math.min(90, score),
        suggestedROI: baseROI,
        maxAmount: maxLoan,
        reason: score >= 60 ? "Employment profile suitable for ICICI products" : "Income stability concerns"
      },
      {
        name: "Axis Bank",
        eligible: score >= 62,
        probability: Math.min(85, score - 5),
        suggestedROI: baseROI + 0.1,
        maxAmount: maxLoan * 0.9,
        reason: score >= 62 ? "Profile matches Axis premium segment" : "FOIR exceeds bank limits"
      },
      {
        name: "Tata Capital",
        eligible: score >= 55,
        probability: Math.min(80, score - 8),
        suggestedROI: baseROI + 0.25,
        maxAmount: maxLoan * 0.85,
        reason: score >= 55 ? "Good fit for Tata Capital personal loans" : "Additional documentation required"
      },
    ]

    const policyReferences: PolicyReference[] = [
      { id: "1", name: "HDFC Personal Loan Policy v2", bank: "HDFC", version: "2.0", relevanceScore: 95 },
      { id: "2", name: "ICICI BT Guideline Jan 2025", bank: "ICICI", version: "1.5", relevanceScore: 88 },
      { id: "3", name: "Axis Income Assessment Criteria", bank: "Axis", version: "3.0", relevanceScore: 82 },
      { id: "4", name: "RBI FOIR Guidelines 2024", bank: "RBI", version: "1.0", relevanceScore: 78 },
    ]

    const reasoningSteps = [
      `Analyzed applicant CIBIL score of ${cibilScore} against bank minimum requirements (650-750 range)`,
      `Calculated FOIR at ${currentFOIR.toFixed(1)}% against maximum allowed 50-60%`,
      `Verified employment stability: ${formData.companyType || "N/A"} with ${formData.companyAge || 0} years tenure`,
      `Assessed salary credit type: ${formData.salaryCreditType || "N/A"} - ${formData.salaryCreditType === "Cash" ? "Limited options" : "Preferred by lenders"}`,
      `Cross-referenced with ${policyReferences.length} active bank policy documents`,
      `Applied risk weightage for ${formData.caseType === "BT" ? "Balance Transfer" : "Fresh"} loan type`,
      `Generated bank-wise eligibility based on individual lender criteria`,
    ]

    const underwritingNotes = [
      `Net monthly income of INR ${income.toLocaleString()} supports loan eligibility`,
      formData.pfDeducted ? "PF deduction confirms formal employment - positive indicator" : "No PF deduction - may limit some lender options",
      formData.tdsDeducted ? "TDS deduction validates income authenticity" : "No TDS - additional income proof may be required",
      formData.officialMailAvailable ? "Official email available for verification" : "No official email - manual verification needed",
      `Credit enquiry count of ${formData.enquiriesLast3Months} is ${formData.enquiriesLast3Months <= 2 ? "within acceptable limits" : "higher than preferred"}`,
    ]

    const keyObservations = [
      `Applicant ${formData.fullName || "N/A"}, Age ${formData.age || "N/A"} from ${formData.location || "N/A"}`,
      `Employment: ${formData.companyType || "N/A"} for ${formData.companyAge || 0} years`,
      `Monthly Income: INR ${income.toLocaleString()} (${formData.salaryCreditType || "N/A"})`,
      `CIBIL Score: ${cibilScore} - ${cibilScore >= 750 ? "Excellent" : cibilScore >= 700 ? "Good" : cibilScore >= 650 ? "Fair" : "Below threshold"}`,
      `Debt Service: FOIR ${currentFOIR.toFixed(1)}% - ${currentFOIR <= 40 ? "Healthy" : currentFOIR <= 50 ? "Acceptable" : "High"}`,
    ]

    const rejectionReasons = score < 50 ? [
      formData.cibilScore < 650 ? "CIBIL score below minimum threshold of 650" : null,
      formData.bounceLatestMonth ? "Recent bounce in EMI payment detected" : null,
      formData.settlementWriteOff ? "Settlement/Write-off history impacts eligibility" : null,
      currentFOIR > 60 ? `FOIR of ${currentFOIR.toFixed(1)}% exceeds maximum limit` : null,
      formData.overduesPending ? "Pending overdues need to be cleared" : null,
    ].filter(Boolean) as string[] : []

    return {
      eligibilityScore: Math.round(score),
      recommendation,
      maxLoanAmount: Math.round(maxLoan),
      suggestedROI: baseROI,
      suggestedTenure: tenure,
      monthlyEMI: Math.round(emi),
      riskLevel,
      foirAnalysis: {
        currentFOIR: Math.round(currentFOIR * 10) / 10,
        maxAllowedFOIR: 50,
        status: currentFOIR <= 40 ? "good" : currentFOIR <= 50 ? "warning" : "critical"
      },
      aiConfidenceScore: Math.min(98, 75 + Math.random() * 20),
      factors: [
        {
          name: "CIBIL Score Analysis",
          score: cibilScore >= 750 ? 95 : cibilScore >= 700 ? 80 : cibilScore >= 650 ? 65 : 45,
          impact: cibilScore >= 700 ? "positive" : cibilScore >= 650 ? "neutral" : "negative",
          detail: `CIBIL score of ${cibilScore} is ${cibilScore >= 750 ? "excellent" : cibilScore >= 700 ? "good" : cibilScore >= 650 ? "fair" : "below threshold"}`
        },
        {
          name: "Income Stability",
          score: income > 100000 ? 92 : income > 75000 ? 82 : income > 50000 ? 70 : 55,
          impact: income > 75000 ? "positive" : income > 50000 ? "neutral" : "negative",
          detail: `Net salary of INR ${income.toLocaleString()} with ${formData.salaryCreditType || "N/A"} credit type`
        },
        {
          name: "FOIR Assessment",
          score: currentFOIR <= 40 ? 90 : currentFOIR <= 50 ? 70 : currentFOIR <= 60 ? 50 : 30,
          impact: currentFOIR <= 40 ? "positive" : currentFOIR <= 50 ? "neutral" : "negative",
          detail: `Current FOIR of ${currentFOIR.toFixed(1)}% against max allowed 50%`
        },
        {
          name: "Employment Profile",
          score: formData.pfDeducted && formData.tdsDeducted ? 90 : formData.pfDeducted || formData.tdsDeducted ? 75 : 60,
          impact: formData.pfDeducted ? "positive" : "neutral",
          detail: `${formData.companyType || "N/A"} with ${formData.companyAge || 0} years tenure`
        },
        {
          name: "Credit History",
          score: formData.bounceLatestMonth || formData.overduesPending ? 35 : 
                 formData.pastDelayedPayments ? 60 : 88,
          impact: formData.bounceLatestMonth || formData.overduesPending ? "negative" : 
                  formData.pastDelayedPayments ? "neutral" : "positive",
          detail: formData.bounceLatestMonth ? "Recent bounce detected" : 
                  formData.overduesPending ? "Pending overdues" : "Clean repayment history"
        },
        {
          name: "Enquiry Analysis",
          score: formData.enquiriesLast3Months === 0 ? 95 : 
                 formData.enquiriesLast3Months <= 2 ? 80 : 
                 formData.enquiriesLast3Months <= 4 ? 60 : 40,
          impact: formData.enquiriesLast3Months <= 2 ? "positive" : 
                  formData.enquiriesLast3Months <= 4 ? "neutral" : "negative",
          detail: `${formData.enquiriesLast3Months} enquiries in last 3 months`
        },
      ],
      suggestions: [
        formData.caseType === "BT" 
          ? `Balance transfer can potentially save on interest with lower ROI from recommended lenders`
          : "Consider adding a co-applicant to increase loan eligibility by up to 40%",
        formData.pfDeducted 
          ? "PF deduction strengthens your profile for government bank products"
          : "Getting PF documentation can improve approval chances",
        "Opt for loan insurance to get 0.1% reduction in interest rate",
        "Maintain 6 months EMI as emergency fund before disbursement",
        currentFOIR > 45 ? "Consider closing smaller loans to improve FOIR ratio" : "Current debt levels are manageable"
      ],
      risks: [
        ...existingEMI > income * 0.3 
          ? ["High debt-to-income ratio may affect repayment capacity"] 
          : [],
        ...formData.enquiriesLast3Months > 3 
          ? ["Multiple recent enquiries may indicate credit-seeking behavior"] 
          : [],
        "Market interest rate fluctuations may affect floating rate loans",
        ...formData.existingHomeLoan 
          ? ["Existing home loan impacts total debt capacity"] 
          : [],
      ],
      rejectionReasons,
      eligibleBanks: banks,
      policyReferences,
      reasoningSteps,
      underwritingNotes,
      keyObservations
    }
  }

  const getRecommendationStyle = (rec: string) => {
    switch (rec) {
      case "approved":
        return {
          bg: "bg-primary/20",
          border: "border-primary",
          text: "text-primary",
          icon: Check,
          label: "Pre-Approved"
        }
      case "conditional":
        return {
          bg: "bg-warning/20",
          border: "border-warning",
          text: "text-warning",
          icon: AlertTriangle,
          label: "Conditional Approval"
        }
      default:
        return {
          bg: "bg-destructive/20",
          border: "border-destructive",
          text: "text-destructive",
          icon: X,
          label: "Not Eligible"
        }
    }
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "Low": return "text-primary bg-primary/20"
      case "Medium": return "text-warning bg-warning/20"
      case "High": return "text-destructive bg-destructive/20"
      default: return "text-muted-foreground bg-muted"
    }
  }

  if (isAnalyzing) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-lg bg-card border-border">
          <CardContent className="pt-8 pb-8">
            <div className="text-center space-y-6">
              <div className="relative w-24 h-24 mx-auto">
                <div className="absolute inset-0 rounded-full border-4 border-secondary" />
                <div 
                  className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin"
                  style={{ animationDuration: "1.5s" }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Brain className="w-8 h-8 text-primary" />
                </div>
              </div>
              
              <div>
                <h2 className="text-xl font-semibold text-foreground mb-2">
                  AI Analysis in Progress
                </h2>
                <p className="text-muted-foreground">
                  Processing your application with RAG-powered analysis...
                </p>
              </div>

              <div className="space-y-2">
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary transition-all duration-300 ease-out"
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  />
                </div>
                <p className="text-sm text-primary font-medium h-6">
                  {processingSteps[currentProcessingStep]}
                </p>
              </div>

              {/* Processing Steps List */}
              <div className="space-y-2 text-left">
                {processingSteps.map((step, idx) => (
                  <div key={idx} className={`flex items-center gap-2 text-sm ${
                    idx <= currentProcessingStep ? "text-foreground" : "text-muted-foreground"
                  }`}>
                    {idx < currentProcessingStep ? (
                      <Check className="w-4 h-4 text-primary" />
                    ) : idx === currentProcessingStep ? (
                      <div className="w-4 h-4 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-border" />
                    )}
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!result) return null

  const style = getRecommendationStyle(result.recommendation)
  const StatusIcon = style.icon
  const recommendedBank = result.eligibleBanks.find(b => b.isRecommended && b.eligible)

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Form
        </button>

        {/* Hero Section - Eligibility Score */}
        <Card className={`mb-6 ${style.bg} border ${style.border}`}>
          <CardContent className="py-8">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                <div className={`w-20 h-20 rounded-2xl ${style.bg} border-2 ${style.border} flex items-center justify-center`}>
                  <StatusIcon className={`w-10 h-10 ${style.text}`} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">AI Recommendation</p>
                  <h1 className={`text-3xl font-bold ${style.text}`}>{style.label}</h1>
                  <div className="flex items-center gap-3 mt-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRiskColor(result.riskLevel)}`}>
                      {result.riskLevel} Risk
                    </span>
                    <span className="text-sm text-muted-foreground">
                      AI Confidence: {result.aiConfidenceScore.toFixed(0)}%
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="text-center lg:text-right">
                <p className="text-sm text-muted-foreground mb-1">Eligibility Score</p>
                <div className="flex items-baseline gap-1 justify-center lg:justify-end">
                  <span className={`text-5xl font-bold ${style.text}`}>{result.eligibilityScore}</span>
                  <span className="text-2xl text-muted-foreground">/100</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          <Card className="bg-card border-border">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <IndianRupee className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Max Eligible Amount</p>
                  <p className="text-lg font-semibold text-foreground">
                    INR {(result.maxLoanAmount / 100000).toFixed(1)}L
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-card border-border">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Percent className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Estimated ROI</p>
                  <p className="text-lg font-semibold text-foreground">
                    {(result.suggestedROI - 0.5).toFixed(1)} - {(result.suggestedROI + 0.5).toFixed(1)}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-card border-border">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Target className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Approval Probability</p>
                  <p className="text-lg font-semibold text-foreground">
                    {Math.round(result.eligibilityScore * 0.95)}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-card border-border">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Shield className={`w-5 h-5 ${getRiskColor(result.riskLevel).split(" ")[0]}`} />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Risk Level</p>
                  <p className={`text-lg font-semibold ${getRiskColor(result.riskLevel).split(" ")[0]}`}>
                    {result.riskLevel}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-card border-border">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Tenure</p>
                  <p className="text-lg font-semibold text-foreground">
                    {result.suggestedTenure} Years
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-card border-border">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Activity className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Est. EMI</p>
                  <p className="text-lg font-semibold text-foreground">
                    INR {result.monthlyEMI.toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Lender Recommendations */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recommended Lenders */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-primary" />
                  Recommended Lenders
                </CardTitle>
                <CardDescription>
                  Bank-wise eligibility based on underwriting rules
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {result.eligibleBanks.map((bank) => (
                    <div
                      key={bank.name}
                      className={`p-4 rounded-xl border transition-all ${
                        bank.isRecommended && bank.eligible
                          ? "bg-primary/10 border-primary"
                          : bank.eligible
                          ? "bg-secondary/30 border-border"
                          : "bg-muted/50 border-border opacity-60"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            bank.eligible ? "bg-primary/20" : "bg-muted"
                          }`}>
                            <Building2 className={`w-5 h-5 ${bank.eligible ? "text-primary" : "text-muted-foreground"}`} />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium text-foreground">{bank.name}</h4>
                              {bank.isRecommended && bank.eligible && (
                                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-primary text-primary-foreground">
                                  Best Match
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">{bank.reason}</p>
                          </div>
                        </div>
                        {bank.eligible ? (
                          <Check className="w-5 h-5 text-primary" />
                        ) : (
                          <X className="w-5 h-5 text-destructive" />
                        )}
                      </div>
                      
                      {bank.eligible && (
                        <div className="grid grid-cols-3 gap-4 mt-3 pt-3 border-t border-border">
                          <div>
                            <p className="text-xs text-muted-foreground">Probability</p>
                            <p className="font-semibold text-foreground">{bank.probability}%</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">ROI</p>
                            <p className="font-semibold text-foreground">{bank.suggestedROI.toFixed(2)}%</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Max Amount</p>
                            <p className="font-semibold text-foreground">INR {(bank.maxAmount / 100000).toFixed(1)}L</p>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* AI Risk Analysis */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-primary" />
                  AI Risk Analysis
                </CardTitle>
                <CardDescription>
                  Factor-wise scoring and impact assessment
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {result.factors.map((factor) => (
                    <div key={factor.name} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-foreground">{factor.name}</span>
                          {factor.impact === "positive" && (
                            <TrendingUp className="w-4 h-4 text-primary" />
                          )}
                          {factor.impact === "negative" && (
                            <TrendingDown className="w-4 h-4 text-destructive" />
                          )}
                        </div>
                        <span className={`text-sm font-semibold ${
                          factor.score >= 80 ? "text-primary" :
                          factor.score >= 60 ? "text-warning" : "text-destructive"
                        }`}>
                          {factor.score}%
                        </span>
                      </div>
                      <div className="h-2 bg-secondary rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all ${
                            factor.score >= 80 ? "bg-primary" :
                            factor.score >= 60 ? "bg-warning" : "bg-destructive"
                          }`}
                          style={{ width: `${factor.score}%` }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">{factor.detail}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Underwriting Notes */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  Underwriting Notes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {result.underwritingNotes.map((note, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <Info className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                      {note}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Summary & Observations */}
          <div className="space-y-6">
            {/* FOIR Analysis */}
            <Card className="bg-card border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Gauge className="w-5 h-5 text-primary" />
                  FOIR Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <span className={`text-4xl font-bold ${
                      result.foirAnalysis.status === "good" ? "text-primary" :
                      result.foirAnalysis.status === "warning" ? "text-warning" : "text-destructive"
                    }`}>
                      {result.foirAnalysis.currentFOIR}%
                    </span>
                    <p className="text-sm text-muted-foreground mt-1">
                      Current FOIR (Max: {result.foirAnalysis.maxAllowedFOIR}%)
                    </p>
                  </div>
                  <div className="h-3 bg-secondary rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        result.foirAnalysis.status === "good" ? "bg-primary" :
                        result.foirAnalysis.status === "warning" ? "bg-warning" : "bg-destructive"
                      }`}
                      style={{ width: `${Math.min(result.foirAnalysis.currentFOIR, 100)}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>0%</span>
                    <span>40% (Good)</span>
                    <span>50% (Max)</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Key Observations */}
            <Card className="bg-card border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Eye className="w-5 h-5 text-primary" />
                  Key Observations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {result.keyObservations.map((obs, idx) => (
                    <li key={idx} className="text-sm text-muted-foreground">
                      {obs}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Recommendation Summary */}
            <Card className="bg-card border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Zap className="w-5 h-5 text-primary" />
                  Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {result.suggestions.slice(0, 4).map((suggestion, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                      {suggestion}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Risk Warnings */}
            {result.risks.length > 0 && (
              <Card className="bg-destructive/5 border-destructive/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2 text-destructive">
                    <AlertTriangle className="w-5 h-5" />
                    Risk Factors
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {result.risks.map((risk, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <AlertTriangle className="w-4 h-4 text-destructive mt-0.5 shrink-0" />
                        {risk}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Policy References */}
            <Card className="bg-card border-border">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileText className="w-5 h-5 text-primary" />
                    Policy References
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowPolicyDetails(!showPolicyDetails)}
                    className="text-muted-foreground"
                  >
                    {showPolicyDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </Button>
                </div>
              </CardHeader>
              {showPolicyDetails && (
                <CardContent>
                  <div className="space-y-2">
                    {result.policyReferences.map((policy) => (
                      <div key={policy.id} className="flex items-center justify-between p-2 rounded-lg bg-secondary/50">
                        <div>
                          <p className="text-sm font-medium text-foreground">{policy.name}</p>
                          <p className="text-xs text-muted-foreground">{policy.bank} • v{policy.version}</p>
                        </div>
                        <span className="text-xs text-primary">{policy.relevanceScore}% match</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              )}
            </Card>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <Button
            variant="outline"
            className="flex-1 border-border text-foreground hover:bg-secondary"
          >
            <Download className="w-4 h-4 mr-2" />
            Download Report
          </Button>
          <Button
            variant="outline"
            className="flex-1 border-border text-foreground hover:bg-secondary"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share Analysis
          </Button>
          <Button
            onClick={onNewApplication}
            className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            New Application
          </Button>
        </div>

        {/* AI Assistant Floating Button */}
        <button
          onClick={() => setShowAIAssistant(!showAIAssistant)}
          className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center hover:bg-primary/90 transition-all"
        >
          <MessageSquare className="w-6 h-6" />
        </button>

        {/* AI Assistant Panel */}
        {showAIAssistant && (
          <div className="fixed bottom-24 right-6 w-80 bg-card border border-border rounded-xl shadow-xl overflow-hidden">
            <div className="p-4 bg-primary text-primary-foreground">
              <div className="flex items-center gap-2">
                <Brain className="w-5 h-5" />
                <span className="font-medium">AI Assistant</span>
              </div>
            </div>
            <div className="p-4 h-64 overflow-y-auto space-y-3">
              <div className="bg-secondary/50 rounded-lg p-3">
                <p className="text-sm text-foreground">
                  Based on your profile, I recommend focusing on HDFC Bank as they offer the best ROI for your income bracket.
                </p>
              </div>
              <div className="bg-secondary/50 rounded-lg p-3">
                <p className="text-sm text-foreground">
                  Your CIBIL score of {formData.cibilScore} is {formData.cibilScore >= 750 ? "excellent" : "good"}, which qualifies you for premium loan products.
                </p>
              </div>
              <div className="bg-secondary/50 rounded-lg p-3">
                <p className="text-sm text-foreground">
                  Want me to explain any specific aspect of this analysis?
                </p>
              </div>
            </div>
            <div className="p-3 border-t border-border">
              <input
                type="text"
                placeholder="Ask a question..."
                className="w-full px-3 py-2 rounded-lg bg-input border border-border text-foreground text-sm"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
