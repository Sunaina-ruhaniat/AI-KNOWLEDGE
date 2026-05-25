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
  TrendingDown,
  Percent,
  Calendar,
  IndianRupee,
  FileText,
  Building2,
  RefreshCw,
  Download,
  Share2,
  Shield,
  Target,
  BookOpen,
  Brain,
  ChevronDown,
  ChevronUp,
  Info,
  Award,
  BarChart3
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
}

export function AIRecommendation({ formData, onBack, onNewApplication }: AIRecommendationProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(true)
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [showPolicyDetails, setShowPolicyDetails] = useState(false)
  const [showReasoningDetails, setShowReasoningDetails] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + Math.random() * 12
      })
    }, 200)

    const timeout = setTimeout(() => {
      setIsAnalyzing(false)
      setResult(generateMockResult())
    }, 3500)

    return () => {
      clearInterval(interval)
      clearTimeout(timeout)
    }
  }, [])

  const generateMockResult = (): AnalysisResult => {
    const income = parseInt(formData.netSalary || formData.monthlyIncome) || 50000
    const loanAmount = parseInt(formData.loanAmount) || 2500000
    const tenure = parseInt(formData.loanTenure) || 20
    const existingEMI = parseInt(formData.existingEMI) || 0
    const cibilScore = formData.cibilScore || 750
    
    const maxEMI = income * 0.5 - existingEMI
    const baseROI = formData.caseType === "BT" ? 8.5 : 9.25
    const maxLoan = Math.min(loanAmount * 1.2, maxEMI * 12 * tenure * 0.6)
    const emi = (loanAmount * baseROI/100/12 * Math.pow(1 + baseROI/100/12, tenure * 12)) / (Math.pow(1 + baseROI/100/12, tenure * 12) - 1)
    
    const currentFOIR = ((existingEMI + emi) / income) * 100
    
    let score = 70
    score += cibilScore >= 750 ? 15 : cibilScore >= 700 ? 10 : cibilScore >= 650 ? 5 : -5
    score += income > 100000 ? 10 : income > 50000 ? 5 : 0
    score += existingEMI === 0 ? 8 : existingEMI < income * 0.3 ? 3 : -8
    score += formData.employmentType === "Salaried" ? 5 : 0
    score += parseInt(formData.yearsOfExperience) > 5 ? 4 : 0
    score += formData.pfDeducted ? 3 : 0
    score += formData.tdsDeducted ? 2 : 0
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
        name: "SBI",
        eligible: score >= 55,
        probability: Math.min(88, score - 2),
        suggestedROI: baseROI + 0.15,
        maxAmount: maxLoan * 0.95,
        reason: score >= 55 ? "Government bank with flexible criteria" : "Documentation requirements not met"
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
        name: "Kotak Mahindra",
        eligible: score >= 70,
        probability: Math.min(82, score - 8),
        suggestedROI: baseROI - 0.1,
        maxAmount: maxLoan * 1.05,
        reason: score >= 70 ? "Excellent match for Kotak digital lending" : "Employment type not preferred"
      },
    ]

    const policyReferences: PolicyReference[] = [
      { id: "1", name: "HDFC Personal Loan Policy v2", bank: "HDFC", version: "2.0", relevanceScore: 95 },
      { id: "2", name: "ICICI BT Guideline Jan 2025", bank: "ICICI", version: "1.5", relevanceScore: 88 },
      { id: "3", name: "SBI Income Assessment Criteria", bank: "SBI", version: "3.0", relevanceScore: 82 },
      { id: "4", name: "RBI FOIR Guidelines 2024", bank: "RBI", version: "1.0", relevanceScore: 78 },
    ]

    const reasoningSteps = [
      `Analyzed applicant CIBIL score of ${cibilScore} against bank minimum requirements (650-750 range)`,
      `Calculated FOIR at ${currentFOIR.toFixed(1)}% against maximum allowed 50-60%`,
      `Verified employment stability: ${formData.employmentType} with ${formData.yearsOfExperience || 0} years experience`,
      `Assessed company profile: ${formData.companyType || "N/A"} with ${formData.companyAge || 0} years in operation`,
      `Cross-referenced with ${policyReferences.length} active bank policy documents`,
      `Applied risk weightage for ${formData.caseType === "BT" ? "Balance Transfer" : "Fresh"} loan type`,
      `Generated bank-wise eligibility based on individual lender criteria`,
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
          detail: `Net salary of ₹${income.toLocaleString()} with ${formData.salaryCreditType || "N/A"} credit type`
        },
        {
          name: "FOIR Assessment",
          score: currentFOIR <= 40 ? 90 : currentFOIR <= 50 ? 70 : currentFOIR <= 60 ? 50 : 30,
          impact: currentFOIR <= 40 ? "positive" : currentFOIR <= 50 ? "neutral" : "negative",
          detail: `Current FOIR of ${currentFOIR.toFixed(1)}% against max allowed 50%`
        },
        {
          name: "Employment Profile",
          score: formData.employmentType === "Salaried" && formData.pfDeducted ? 90 : 
                 formData.employmentType === "Salaried" ? 80 : 65,
          impact: formData.employmentType === "Salaried" ? "positive" : "neutral",
          detail: `${formData.employmentType || "N/A"} at ${formData.companyName || "N/A"} (${formData.companyType || "N/A"})`
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
          ? `Balance transfer can save approximately ₹${Math.round((parseFloat(formData.existingLoans?.[0]?.currentROI || "10") - baseROI) * loanAmount / 100).toLocaleString()} over loan tenure`
          : "Consider adding a co-applicant to increase loan eligibility by up to 40%",
        formData.pfDeducted 
          ? "PF deduction strengthens your profile for government bank products"
          : "Getting PF documentation can improve approval chances",
        "Opt for home loan insurance to get 0.1% reduction in interest rate",
        tenure > 15 ? "Shorter tenure of 15 years can reduce total interest by 30%" : "Current tenure is optimal for your income profile",
        currentFOIR > 45 ? "Consider closing smaller loans to improve FOIR ratio" : "Maintain 6 months EMI as emergency fund before disbursement"
      ],
      risks: [
        ...existingEMI > income * 0.3 
          ? ["High debt-to-income ratio may affect repayment capacity"] 
          : [],
        ...formData.enquiriesLast3Months > 3 
          ? ["Multiple recent enquiries may indicate credit-seeking behavior"] 
          : [],
        "Market interest rate fluctuations may affect floating rate loans",
        ...formData.employmentStability === "Low" 
          ? ["Employment stability concerns may require additional documentation"] 
          : [],
      ],
      rejectionReasons,
      eligibleBanks: banks,
      policyReferences,
      reasoningSteps
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
                <p className="text-sm text-muted-foreground">
                  {progress < 20 && "Loading bank policy documents..."}
                  {progress >= 20 && progress < 40 && "Analyzing CIBIL and credit history..."}
                  {progress >= 40 && progress < 60 && "Calculating FOIR and debt ratios..."}
                  {progress >= 60 && progress < 80 && "Cross-referencing with bank guidelines..."}
                  {progress >= 80 && "Generating personalized recommendations..."}
                </p>
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

        {/* Hero Section */}
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

        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
          <Card className="bg-card border-border">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <IndianRupee className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Max Loan</p>
                  <p className="text-lg font-semibold text-foreground">
                    ₹{(result.maxLoanAmount / 100000).toFixed(1)}L
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
                  <p className="text-xs text-muted-foreground">ROI Range</p>
                  <p className="text-lg font-semibold text-foreground">
                    {(result.suggestedROI - 0.5).toFixed(1)}-{(result.suggestedROI + 0.5).toFixed(1)}%
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
                    {result.suggestedTenure} Yrs
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-card border-border">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Monthly EMI</p>
                  <p className="text-lg font-semibold text-foreground">
                    ₹{result.monthlyEMI.toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  result.foirAnalysis.status === "good" ? "bg-primary/10" :
                  result.foirAnalysis.status === "warning" ? "bg-warning/10" : "bg-destructive/10"
                }`}>
                  <BarChart3 className={`w-5 h-5 ${
                    result.foirAnalysis.status === "good" ? "text-primary" :
                    result.foirAnalysis.status === "warning" ? "text-warning" : "text-destructive"
                  }`} />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">FOIR</p>
                  <p className={`text-lg font-semibold ${
                    result.foirAnalysis.status === "good" ? "text-primary" :
                    result.foirAnalysis.status === "warning" ? "text-warning" : "text-destructive"
                  }`}>
                    {result.foirAnalysis.currentFOIR}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Eligible Banks</p>
                  <p className="text-lg font-semibold text-foreground">
                    {result.eligibleBanks.filter(b => b.eligible).length}/{result.eligibleBanks.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Rejection Reasons (if applicable) */}
        {result.rejectionReasons.length > 0 && (
          <Card className="mb-6 bg-destructive/10 border-destructive/20">
            <CardHeader>
              <CardTitle className="text-lg text-destructive flex items-center gap-2">
                <X className="w-5 h-5" />
                Rejection Reasons
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {result.rejectionReasons.map((reason, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-destructive/20 flex items-center justify-center shrink-0 mt-0.5">
                      <X className="w-3 h-3 text-destructive" />
                    </div>
                    <span className="text-sm text-foreground">{reason}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Recommended Bank */}
        {recommendedBank && (
          <Card className="mb-6 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-primary/20">
            <CardContent className="py-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-primary flex items-center justify-center">
                    <Award className="w-7 h-7 text-primary-foreground" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-foreground text-lg">Recommended: {recommendedBank.name}</h3>
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-primary text-primary-foreground">
                        Best Match
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {recommendedBank.probability}% approval probability at {recommendedBank.suggestedROI}% ROI
                    </p>
                  </div>
                </div>
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                  Apply with {recommendedBank.name}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Bank Eligibility */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-lg text-foreground flex items-center gap-2">
                <Building2 className="w-5 h-5 text-primary" />
                Bank-wise Eligibility
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Approval probability across different lenders
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {result.eligibleBanks.map((bank, index) => (
                <div 
                  key={index} 
                  className={`p-4 rounded-xl border transition-all ${
                    bank.eligible 
                      ? bank.isRecommended 
                        ? "bg-primary/5 border-primary/30" 
                        : "bg-card border-border"
                      : "bg-secondary/30 border-border opacity-60"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-foreground">{bank.name}</span>
                      {bank.isRecommended && bank.eligible && (
                        <span className="px-2 py-0.5 rounded-full text-xs bg-primary/20 text-primary">
                          Recommended
                        </span>
                      )}
                    </div>
                    <span className={`text-sm font-semibold ${
                      bank.eligible ? "text-primary" : "text-muted-foreground"
                    }`}>
                      {bank.eligible ? `${bank.probability}%` : "Not Eligible"}
                    </span>
                  </div>
                  {bank.eligible && (
                    <>
                      <div className="h-2 bg-secondary rounded-full overflow-hidden mb-2">
                        <div 
                          className="h-full bg-primary rounded-full transition-all"
                          style={{ width: `${bank.probability}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>ROI: {bank.suggestedROI}%</span>
                        <span>Max: ₹{(bank.maxAmount / 100000).toFixed(1)}L</span>
                      </div>
                    </>
                  )}
                  <p className="text-xs text-muted-foreground mt-2">{bank.reason}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Analysis Factors */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-lg text-foreground flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                AI Analysis Factors
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Key factors influencing the eligibility decision
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {result.factors.map((factor, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {factor.impact === "positive" && <TrendingUp className="w-4 h-4 text-primary" />}
                      {factor.impact === "negative" && <TrendingDown className="w-4 h-4 text-destructive" />}
                      {factor.impact === "neutral" && <span className="w-4 h-4 rounded-full bg-muted-foreground/30" />}
                      <span className="text-sm font-medium text-foreground">{factor.name}</span>
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
                      className={`h-full rounded-full transition-all ${
                        factor.score >= 80 ? "bg-primary" : 
                        factor.score >= 60 ? "bg-warning" : "bg-destructive"
                      }`}
                      style={{ width: `${factor.score}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">{factor.detail}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* RAG Transparency Section */}
        <Card className="mt-6 bg-card border-border">
          <CardHeader 
            className="cursor-pointer"
            onClick={() => setShowPolicyDetails(!showPolicyDetails)}
          >
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg text-foreground flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-primary" />
                  Guidelines Used in Analysis
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Policy documents referenced by AI for this recommendation
                </CardDescription>
              </div>
              {showPolicyDetails ? (
                <ChevronUp className="w-5 h-5 text-muted-foreground" />
              ) : (
                <ChevronDown className="w-5 h-5 text-muted-foreground" />
              )}
            </div>
          </CardHeader>
          {showPolicyDetails && (
            <CardContent>
              <div className="space-y-3">
                {result.policyReferences.map((policy) => (
                  <div 
                    key={policy.id}
                    className="flex items-center justify-between p-4 rounded-xl bg-secondary/30 border border-border"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <FileText className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{policy.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {policy.bank} • v{policy.version}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-primary">{policy.relevanceScore}%</p>
                      <p className="text-xs text-muted-foreground">Relevance</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          )}
        </Card>

        {/* AI Reasoning Steps */}
        <Card className="mt-6 bg-card border-border">
          <CardHeader 
            className="cursor-pointer"
            onClick={() => setShowReasoningDetails(!showReasoningDetails)}
          >
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg text-foreground flex items-center gap-2">
                  <Brain className="w-5 h-5 text-primary" />
                  AI Reasoning Process
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Step-by-step explanation of the analysis
                </CardDescription>
              </div>
              {showReasoningDetails ? (
                <ChevronUp className="w-5 h-5 text-muted-foreground" />
              ) : (
                <ChevronDown className="w-5 h-5 text-muted-foreground" />
              )}
            </div>
          </CardHeader>
          {showReasoningDetails && (
            <CardContent>
              <div className="space-y-3">
                {result.reasoningSteps.map((step, index) => (
                  <div 
                    key={index}
                    className="flex items-start gap-3 p-3 rounded-lg bg-secondary/30"
                  >
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                      <span className="text-xs font-semibold text-primary">{index + 1}</span>
                    </div>
                    <p className="text-sm text-foreground">{step}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          )}
        </Card>

        {/* Suggestions & Risks */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-lg text-foreground flex items-center gap-2">
                {formData.caseType === "BT" ? (
                  <RefreshCw className="w-5 h-5 text-primary" />
                ) : (
                  <Target className="w-5 h-5 text-primary" />
                )}
                {formData.caseType === "BT" ? "Balance Transfer Benefits" : "Smart Suggestions"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {result.suggestions.map((suggestion, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-primary" />
                    </div>
                    <span className="text-sm text-muted-foreground">{suggestion}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-lg text-foreground flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-warning" />
                Risk Factors
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {result.risks.map((risk, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-warning/20 flex items-center justify-center shrink-0 mt-0.5">
                      <AlertTriangle className="w-3 h-3 text-warning" />
                    </div>
                    <span className="text-sm text-muted-foreground">{risk}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <Card className="mt-6 bg-card border-border">
          <CardContent className="py-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Button variant="outline" className="border-border text-foreground hover:bg-secondary">
                  <Download className="w-4 h-4 mr-2" />
                  Download Report
                </Button>
                <Button variant="outline" className="border-border text-foreground hover:bg-secondary">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={onNewApplication}
                  className="border-border text-foreground hover:bg-secondary"
                >
                  New Application
                </Button>
                {result.recommendation !== "rejected" && (
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                    Proceed to Documentation
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
