"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { 
  Upload,
  FileText,
  Search,
  Trash2,
  Eye,
  ArrowLeft,
  MoreVertical,
  Edit,
  Download
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface AdminGuidelineManagementProps {
  onBack: () => void
}

interface KnowledgeItem {
  id: string
  title: string
  conceptTags: string[]
  size: string
  status: "Active" | "Inactive"
  eligibilityEnabled: boolean
}

const mockKnowledgeItems: KnowledgeItem[] = [
  {
    id: "1",
    title: "HDFC Personal Loan Policy",
    conceptTags: ["personal loan", "eligibility"],
    size: "202 KB",
    status: "Active",
    eligibilityEnabled: true
  },
  {
    id: "2",
    title: "ICICI Balance Transfer Guidelines",
    conceptTags: ["BT", "balance transfer"],
    size: "15 KB",
    status: "Active",
    eligibilityEnabled: true
  },
  {
    id: "3",
    title: "Axis Home Loan Criteria",
    conceptTags: ["home loan"],
    size: "106 KB",
    status: "Active",
    eligibilityEnabled: true
  },
  {
    id: "4",
    title: "SBI FOIR Guidelines",
    conceptTags: ["FOIR", "income assessment", "debt ratio", "eligibility"],
    size: "65 KB",
    status: "Active",
    eligibilityEnabled: true
  },
  {
    id: "5",
    title: "RBI Credit Score Policy",
    conceptTags: ["CIBIL", "credit score"],
    size: "82 KB",
    status: "Active",
    eligibilityEnabled: true
  },
  {
    id: "6",
    title: "Kotak ROI Matrix",
    conceptTags: ["ROI", "interest rate"],
    size: "101 KB",
    status: "Active",
    eligibilityEnabled: true
  },
  {
    id: "7",
    title: "Underwriting Risk Assessment",
    conceptTags: ["risk", "underwriting", "assessment"],
    size: "136 KB",
    status: "Active",
    eligibilityEnabled: true
  },
]

export function AdminGuidelineManagement({ onBack }: AdminGuidelineManagementProps) {
  const [knowledgeItems, setKnowledgeItems] = useState<KnowledgeItem[]>(mockKnowledgeItems)
  const [searchQuery, setSearchQuery] = useState("")
  const [newTitle, setNewTitle] = useState("")
  const [newTags, setNewTags] = useState("")

  const totalDocuments = knowledgeItems.length
  const activeDocuments = knowledgeItems.filter(item => item.status === "Active").length

  const handleUpload = () => {
    if (!newTitle.trim()) return
    
    const newItem: KnowledgeItem = {
      id: `doc-${Date.now()}`,
      title: newTitle,
      conceptTags: newTags.split(",").map(t => t.trim()).filter(Boolean),
      size: `${Math.floor(Math.random() * 200 + 10)} KB`,
      status: "Active",
      eligibilityEnabled: true
    }
    
    setKnowledgeItems(prev => [newItem, ...prev])
    setNewTitle("")
    setNewTags("")
  }

  const toggleEligibility = (id: string) => {
    setKnowledgeItems(prev => prev.map(item => 
      item.id === id 
        ? { ...item, eligibilityEnabled: !item.eligibilityEnabled }
        : item
    ))
  }

  const deleteItem = (id: string) => {
    setKnowledgeItems(prev => prev.filter(item => item.id !== id))
  }

  const filteredItems = knowledgeItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.conceptTags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesSearch
  })

  return (
    <div className="min-h-screen bg-background">
      {/* Main Content */}
      <div className="p-6 lg:p-8">
        <div className="max-w-6xl mx-auto">
          {/* Back Button */}
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <Card className="bg-card border-border">
              <CardContent className="pt-6">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                  TOTAL DOCUMENTS
                </p>
                <p className="text-4xl font-bold text-foreground">{totalDocuments}</p>
              </CardContent>
            </Card>
            
            <Card className="bg-card border-border">
              <CardContent className="pt-6">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                  ACTIVE DOCUMENTS
                </p>
                <p className="text-4xl font-bold text-foreground">{activeDocuments}</p>
              </CardContent>
            </Card>
          </div>

          {/* Upload Document Section */}
          <Card className="bg-card border-border mb-8">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-semibold text-foreground">Upload Document</CardTitle>
              <CardDescription className="text-muted-foreground">
                Add a new knowledge item to the system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4 items-end">
                <div className="flex-1 space-y-2">
                  <label className="text-sm font-medium text-foreground">Title</label>
                  <Input
                    placeholder="Enter knowledge title"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="bg-background border-border text-foreground"
                  />
                </div>
                
                <div className="flex-1 space-y-2">
                  <label className="text-sm font-medium text-foreground">Concept Tags</label>
                  <Input
                    placeholder="Sleep, Nutrition, etc."
                    value={newTags}
                    onChange={(e) => setNewTags(e.target.value)}
                    className="bg-background border-border text-foreground"
                  />
                </div>
                
                <Button
                  onClick={handleUpload}
                  disabled={!newTitle.trim()}
                  className="bg-foreground text-background hover:bg-foreground/90 h-10 px-6"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Knowledge Items Section */}
          <Card className="bg-card border-border">
            <CardHeader className="pb-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <CardTitle className="text-xl font-semibold text-foreground">Knowledge Items</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Manage documents and their eligibility status
                  </CardDescription>
                </div>
                
                <div className="relative w-full md:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 bg-background border-border text-foreground"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Title</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Concept Tags</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Size</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Eligibility</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredItems.map((item) => (
                      <tr key={item.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                        <td className="py-4 px-4">
                          <span className="font-medium text-foreground">{item.title}</span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex flex-wrap gap-1">
                            {item.conceptTags.map(tag => (
                              <span 
                                key={tag} 
                                className="px-2 py-1 rounded-full text-xs font-medium bg-secondary text-secondary-foreground border border-border"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-muted-foreground">{item.size}</span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/20 text-primary">
                            {item.status}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={item.eligibilityEnabled}
                              onCheckedChange={() => toggleEligibility(item.id)}
                              className="data-[state=checked]:bg-primary"
                            />
                            <span className="text-sm text-muted-foreground">
                              {item.eligibilityEnabled ? "Enabled" : "Disabled"}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreVertical className="h-4 w-4 text-muted-foreground" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-popover border-border">
                              <DropdownMenuItem className="cursor-pointer">
                                <Eye className="w-4 h-4 mr-2" />
                                View
                              </DropdownMenuItem>
                              <DropdownMenuItem className="cursor-pointer">
                                <Edit className="w-4 h-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem className="cursor-pointer">
                                <Download className="w-4 h-4 mr-2" />
                                Download
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="cursor-pointer text-destructive focus:text-destructive"
                                onClick={() => deleteItem(item.id)}
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                
                {filteredItems.length === 0 && (
                  <div className="text-center py-12">
                    <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground">No documents found</p>
                    <p className="text-sm text-muted-foreground">Try adjusting your search</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
