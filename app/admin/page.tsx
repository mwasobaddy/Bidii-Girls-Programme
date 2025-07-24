"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  Plus,
  Edit,
  Trash2,
  Upload,
  BookOpen,
  LogOut,
  Target,
  CheckCircle,
  Heart,
  Eye,
  Users,
  Building,
  Tag,
  ImageIcon,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"

// Mock data for existing content
const mockBlogs = [
  {
    id: 1,
    title: "Breaking the Silence: Why Period Education Matters",
    category: "Education",
    excerpt: "Exploring the importance of comprehensive menstrual health education...",
    content: "Period education is crucial for empowering girls...",
    author: "Sarah Wanjiku",
    date: "March 15, 2024",
    images: ["/placeholder.svg?height=400&width=600", "/placeholder.svg?height=400&width=600"],
  },
  {
    id: 2,
    title: "Success Story: How Maria Overcame Period Poverty",
    category: "Success Stories",
    excerpt: "Meet Maria, a 16-year-old from Kibera...",
    content: "Maria's story is one of resilience...",
    author: "Grace Muthoni",
    date: "March 10, 2024",
    images: ["/placeholder.svg?height=400&width=600"],
  },
]

const mockCampaigns = [
  {
    id: 1,
    title: "Emergency Period Kits for Kibera",
    description: "Providing immediate relief with emergency menstrual hygiene kits for 200 girls in Kibera slum.",
    location: "Kibera, Nairobi",
    urgency: "Urgent",
    beneficiaries: 200,
    linkedBlog: 1,
    featureImage: "/placeholder.svg?height=300&width=400",
  },
  {
    id: 2,
    title: "School Toilet Renovation Project",
    description: "Building private, clean toilet facilities in 5 schools to ensure girls have dignified spaces.",
    location: "Mathare, Nairobi",
    urgency: "Active",
    beneficiaries: 500,
    linkedBlog: 2,
    featureImage: "/placeholder.svg?height=300&width=400",
  },
]

const mockProjects = [
  {
    id: 1,
    title: "Menstrual Hygiene Education Program",
    description:
      "Comprehensive education program teaching girls about menstrual health, hygiene practices, and body positivity in 10 schools across Kibera slum.",
    location: "Kibera, Nairobi",
    status: "Completed",
    beneficiaries: 250,
    linkedBlog: 1,
    featureImage: "/placeholder.svg?height=300&width=400",
  },
]

const mockStories = [
  {
    id: 1,
    title: "Maria's Journey to Confidence",
    content: "How our program helped Maria overcome period poverty and excel in school.",
    beneficiaryName: "Maria Wanjiku",
    beneficiaryAge: "16",
    location: "Kibera, Nairobi",
    featureImage: "/placeholder.svg?height=300&width=400",
  },
]

const mockTeamMembers = [
  {
    id: 1,
    name: "Sarah Wanjiku",
    role: "Founder & Executive Director",
    bio: "Sarah founded Bidii Girls Program in 2021 after witnessing firsthand the challenges girls face due to period poverty.",
    email: "sarah@bidiigirls.org",
    facebook: "https://facebook.com/sarah.wanjiku",
    instagram: "https://instagram.com/sarah_wanjiku",
    tiktok: "",
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: 2,
    name: "Grace Muthoni",
    role: "Program Manager",
    bio: "Grace oversees our educational programs and community outreach initiatives.",
    email: "grace@bidiigirls.org",
    facebook: "",
    instagram: "https://instagram.com/grace_muthoni",
    tiktok: "https://tiktok.com/@grace_muthoni",
    image: "/placeholder.svg?height=200&width=200",
  },
]

const mockSponsors = [
  {
    id: 1,
    name: "UNICEF",
    logo: "/placeholder.svg?height=80&width=120",
    website: "https://unicef.org",
  },
  {
    id: 2,
    name: "World Vision",
    logo: "/placeholder.svg?height=80&width=120",
    website: "https://worldvision.org",
  },
]

const mockGalleryImages = [
  {
    id: 1,
    title: "Menstrual Health Workshop",
    category: "Education",
    description: "Girls learning about menstrual health and hygiene practices",
    image: "/placeholder.svg?height=400&width=600",
  },
  {
    id: 2,
    title: "Sanitary Pad Distribution",
    category: "Distribution",
    description: "Monthly distribution of hygiene products to girls in need",
    image: "/placeholder.svg?height=400&width=600",
  },
]

const mockCategories = [
  { id: 1, name: "Education", description: "Educational content and resources" },
  { id: 2, name: "Success Stories", description: "Inspiring success stories from beneficiaries" },
  { id: 3, name: "Research", description: "Research and data-driven content" },
  { id: 4, name: "Community", description: "Community engagement and outreach" },
  { id: 5, name: "Empowerment", description: "Women and girls empowerment content" },
  { id: 6, name: "Distribution", description: "Product distribution activities" },
]

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [editingItem, setEditingItem] = useState<any>(null)
  const [editType, setEditType] = useState<string>("")
  const [viewingItem, setViewingItem] = useState<any>(null)
  const [viewType, setViewType] = useState<string>("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)

  // State for all content types
  const [partnershipApplications, setPartnershipApplications] = useState<any[]>([])
  const [volunteerApplications, setVolunteerApplications] = useState<any[]>([])
  const [categories, setCategories] = useState(mockCategories)
  const [campaigns, setCampaigns] = useState(mockCampaigns)
  const [projects, setProjects] = useState(mockProjects)
  const [stories, setStories] = useState(mockStories)
  const [blogs, setBlogs] = useState(mockBlogs)
  const [teamMembers, setTeamMembers] = useState(mockTeamMembers)
  const [sponsors, setSponsors] = useState(mockSponsors)
  const [galleryImages, setGalleryImages] = useState(mockGalleryImages)

  // Form states for all content types
  const [newBlog, setNewBlog] = useState({
    title: "",
    content: "",
    category: "",
    excerpt: "",
    author: "",
    images: [] as string[],
  })

  const [newProject, setNewProject] = useState({
    title: "",
    description: "",
    location: "",
    beneficiaries: "",
    status: "completed",
    featureImage: "",
    linkedBlog: "",
  })

  const [newCampaign, setNewCampaign] = useState({
    title: "",
    description: "",
    location: "",
    beneficiaries: "",
    urgency: "active",
    featureImage: "",
    linkedBlog: "",
  })

  const [newStory, setNewStory] = useState({
    title: "",
    content: "",
    beneficiaryName: "",
    beneficiaryAge: "",
    location: "",
    featureImage: "",
  })

  const [newTeamMember, setNewTeamMember] = useState({
    name: "",
    role: "",
    bio: "",
    email: "",
    facebook: "",
    instagram: "",
    tiktok: "",
    image: "",
  })

  const [newSponsor, setNewSponsor] = useState({
    name: "",
    logo: "",
    website: "",
  })

  const [newGalleryImage, setNewGalleryImage] = useState({
    title: "",
    category: "",
    description: "",
    image: "",
  })

  const [newCategory, setNewCategory] = useState({
    name: "",
    description: "",
  })

  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    const authStatus = localStorage.getItem("adminAuth")
    if (authStatus === "true") {
      setIsAuthenticated(true)
      // Load applications from localStorage
      const partners = JSON.parse(localStorage.getItem("partnershipApplications") || "[]")
      const volunteers = JSON.parse(localStorage.getItem("volunteerApplications") || "[]")
      setPartnershipApplications(partners)
      setVolunteerApplications(volunteers)
    } else {
      router.push("/admin/login")
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("adminAuth")
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    })
    router.push("/admin/login")
  }

  const handleImageUpload = (setter: Function, field?: string) => {
    const mockImageUrl = "/placeholder.svg?height=400&width=600"
    if (field) {
      setter((prev: any) => ({ ...prev, [field]: mockImageUrl }))
    } else {
      setter((prev: any) => ({ ...prev, images: [...prev.images, mockImageUrl] }))
    }
    toast({
      title: "Image Uploaded",
      description: "Image has been uploaded successfully.",
    })
  }

  const handleView = (item: any, type: string) => {
    setViewingItem(item)
    setViewType(type)
    setIsViewDialogOpen(true)
  }

  const handleEdit = (item: any, type: string) => {
    setEditingItem(item)
    setEditType(type)

    // Populate form based on type
    switch (type) {
      case "campaign":
        setNewCampaign({
          title: item.title,
          description: item.description,
          location: item.location,
          beneficiaries: item.beneficiaries.toString(),
          urgency: item.urgency.toLowerCase(),
          featureImage: item.featureImage,
          linkedBlog: item.linkedBlog?.toString() || "",
        })
        break
      case "project":
        setNewProject({
          title: item.title,
          description: item.description,
          location: item.location,
          beneficiaries: item.beneficiaries.toString(),
          status: item.status.toLowerCase(),
          featureImage: item.featureImage,
          linkedBlog: item.linkedBlog?.toString() || "",
        })
        break
      case "story":
        setNewStory({
          title: item.title,
          content: item.content,
          beneficiaryName: item.beneficiaryName,
          beneficiaryAge: item.beneficiaryAge,
          location: item.location,
          featureImage: item.featureImage,
        })
        break
      case "blog":
        setNewBlog({
          title: item.title,
          content: item.content,
          category: item.category,
          excerpt: item.excerpt,
          author: item.author,
          images: item.images || [],
        })
        break
      case "team":
        setNewTeamMember({
          name: item.name,
          role: item.role,
          bio: item.bio,
          email: item.email,
          facebook: item.facebook || "",
          instagram: item.instagram || "",
          tiktok: item.tiktok || "",
          image: item.image,
        })
        break
      case "sponsor":
        setNewSponsor({
          name: item.name,
          logo: item.logo,
          website: item.website,
        })
        break
      case "gallery":
        setNewGalleryImage({
          title: item.title,
          category: item.category,
          description: item.description,
          image: item.image,
        })
        break
      case "category":
        setNewCategory({
          name: item.name,
          description: item.description,
        })
        break
    }
    setIsDialogOpen(true)
  }

  const handleDelete = (id: number, type: string) => {
    if (window.confirm(`Are you sure you want to delete this ${type}?`)) {
      switch (type) {
        case "partnership":
          const updatedPartners = partnershipApplications.filter((app) => app.id !== id)
          setPartnershipApplications(updatedPartners)
          localStorage.setItem("partnershipApplications", JSON.stringify(updatedPartners))
          break
        case "volunteer":
          const updatedVolunteers = volunteerApplications.filter((app) => app.id !== id)
          setVolunteerApplications(updatedVolunteers)
          localStorage.setItem("volunteerApplications", JSON.stringify(updatedVolunteers))
          break
        case "category":
          setCategories(categories.filter((cat) => cat.id !== id))
          break
        case "campaign":
          setCampaigns(campaigns.filter((item) => item.id !== id))
          break
        case "project":
          setProjects(projects.filter((item) => item.id !== id))
          break
        case "story":
          setStories(stories.filter((item) => item.id !== id))
          break
        case "blog":
          setBlogs(blogs.filter((item) => item.id !== id))
          break
        case "team":
          setTeamMembers(teamMembers.filter((item) => item.id !== id))
          break
        case "sponsor":
          setSponsors(sponsors.filter((item) => item.id !== id))
          break
        case "gallery":
          setGalleryImages(galleryImages.filter((item) => item.id !== id))
          break
      }

      toast({
        title: "Item Deleted",
        description: `${type} has been deleted successfully.`,
      })
    }
  }

  const handleSubmit = (e: React.FormEvent, type: string) => {
    e.preventDefault()

    const newId = editingItem?.id || Date.now()

    switch (type) {
      case "Campaign":
        const campaignData = {
          id: newId,
          title: newCampaign.title,
          description: newCampaign.description,
          location: newCampaign.location,
          urgency: newCampaign.urgency,
          beneficiaries: Number.parseInt(newCampaign.beneficiaries),
          linkedBlog: newCampaign.linkedBlog ? Number.parseInt(newCampaign.linkedBlog) : null,
          featureImage: newCampaign.featureImage,
        }
        if (editingItem) {
          setCampaigns(campaigns.map((item) => (item.id === editingItem.id ? campaignData : item)))
        } else {
          setCampaigns([...campaigns, campaignData])
        }
        setNewCampaign({
          title: "",
          description: "",
          location: "",
          beneficiaries: "",
          urgency: "active",
          featureImage: "",
          linkedBlog: "",
        })
        break

      case "Project":
        const projectData = {
          id: newId,
          title: newProject.title,
          description: newProject.description,
          location: newProject.location,
          status: newProject.status,
          beneficiaries: Number.parseInt(newProject.beneficiaries),
          linkedBlog: newProject.linkedBlog ? Number.parseInt(newProject.linkedBlog) : null,
          featureImage: newProject.featureImage,
        }
        if (editingItem) {
          setProjects(projects.map((item) => (item.id === editingItem.id ? projectData : item)))
        } else {
          setProjects([...projects, projectData])
        }
        setNewProject({
          title: "",
          description: "",
          location: "",
          beneficiaries: "",
          status: "completed",
          featureImage: "",
          linkedBlog: "",
        })
        break

      case "Story":
        const storyData = {
          id: newId,
          title: newStory.title,
          content: newStory.content,
          beneficiaryName: newStory.beneficiaryName,
          beneficiaryAge: newStory.beneficiaryAge,
          location: newStory.location,
          featureImage: newStory.featureImage,
        }
        if (editingItem) {
          setStories(stories.map((item) => (item.id === editingItem.id ? storyData : item)))
        } else {
          setStories([...stories, storyData])
        }
        setNewStory({
          title: "",
          content: "",
          beneficiaryName: "",
          beneficiaryAge: "",
          location: "",
          featureImage: "",
        })
        break

      case "Blog":
        const blogData = {
          id: newId,
          title: newBlog.title,
          content: newBlog.content,
          category: newBlog.category,
          excerpt: newBlog.excerpt,
          author: newBlog.author,
          date: new Date().toLocaleDateString(),
          images: newBlog.images,
        }
        if (editingItem) {
          setBlogs(blogs.map((item) => (item.id === editingItem.id ? blogData : item)))
        } else {
          setBlogs([...blogs, blogData])
        }
        setNewBlog({
          title: "",
          content: "",
          category: "",
          excerpt: "",
          author: "",
          images: [],
        })
        break

      case "Team Member":
        const teamData = {
          id: newId,
          name: newTeamMember.name,
          role: newTeamMember.role,
          bio: newTeamMember.bio,
          email: newTeamMember.email,
          facebook: newTeamMember.facebook,
          instagram: newTeamMember.instagram,
          tiktok: newTeamMember.tiktok,
          image: newTeamMember.image,
        }
        if (editingItem) {
          setTeamMembers(teamMembers.map((item) => (item.id === editingItem.id ? teamData : item)))
        } else {
          setTeamMembers([...teamMembers, teamData])
        }
        setNewTeamMember({
          name: "",
          role: "",
          bio: "",
          email: "",
          facebook: "",
          instagram: "",
          tiktok: "",
          image: "",
        })
        break

      case "Sponsor":
        const sponsorData = {
          id: newId,
          name: newSponsor.name,
          logo: newSponsor.logo,
          website: newSponsor.website,
        }
        if (editingItem) {
          setSponsors(sponsors.map((item) => (item.id === editingItem.id ? sponsorData : item)))
        } else {
          setSponsors([...sponsors, sponsorData])
        }
        setNewSponsor({
          name: "",
          logo: "",
          website: "",
        })
        break

      case "Gallery Image":
        const galleryData = {
          id: newId,
          title: newGalleryImage.title,
          category: newGalleryImage.category,
          description: newGalleryImage.description,
          image: newGalleryImage.image,
        }
        if (editingItem) {
          setGalleryImages(galleryImages.map((item) => (item.id === editingItem.id ? galleryData : item)))
        } else {
          setGalleryImages([...galleryImages, galleryData])
        }
        setNewGalleryImage({
          title: "",
          category: "",
          description: "",
          image: "",
        })
        break

      case "Category":
        const categoryData = {
          id: newId,
          name: newCategory.name,
          description: newCategory.description,
        }
        if (editingItem) {
          setCategories(categories.map((cat) => (cat.id === editingItem.id ? categoryData : cat)))
        } else {
          setCategories([...categories, categoryData])
        }
        setNewCategory({ name: "", description: "" })
        break
    }

    toast({
      title: `${type} ${editingItem ? "Updated" : "Created"}`,
      description: `${type} has been ${editingItem ? "updated" : "created"} successfully.`,
    })

    setEditingItem(null)
    setEditType("")
    setIsDialogOpen(false)
  }

  const resetForms = () => {
    setNewCampaign({
      title: "",
      description: "",
      location: "",
      beneficiaries: "",
      urgency: "active",
      featureImage: "",
      linkedBlog: "",
    })
    setNewProject({
      title: "",
      description: "",
      location: "",
      beneficiaries: "",
      status: "completed",
      featureImage: "",
      linkedBlog: "",
    })
    setNewStory({
      title: "",
      content: "",
      beneficiaryName: "",
      beneficiaryAge: "",
      location: "",
      featureImage: "",
    })
    setNewBlog({
      title: "",
      content: "",
      category: "",
      excerpt: "",
      author: "",
      images: [],
    })
    setNewTeamMember({
      name: "",
      role: "",
      bio: "",
      email: "",
      facebook: "",
      instagram: "",
      tiktok: "",
      image: "",
    })
    setNewSponsor({
      name: "",
      logo: "",
      website: "",
    })
    setNewGalleryImage({
      title: "",
      category: "",
      description: "",
      image: "",
    })
    setNewCategory({ name: "", description: "" })
    setEditingItem(null)
    setEditType("")
    setIsDialogOpen(false)
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#e51083]"></div>
      </div>
    )
  }

  return (
    <div className="pt-16 min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage your content, projects, campaigns, and team</p>
          </div>
          <Button onClick={handleLogout} variant="outline" className="flex items-center gap-2 bg-transparent">
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-6 mb-8">
          <Card className="hover:scale-105 transition-transform duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Active Campaigns</p>
                  <p className="text-2xl font-bold">{campaigns.length}</p>
                </div>
                <Target className="h-8 w-8 text-[#e51083]" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:scale-105 transition-transform duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Completed Projects</p>
                  <p className="text-2xl font-bold">{projects.length}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-[#e51083]" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:scale-105 transition-transform duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Success Stories</p>
                  <p className="text-2xl font-bold">{stories.length}</p>
                </div>
                <Heart className="h-8 w-8 text-[#e51083]" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:scale-105 transition-transform duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Blog Posts</p>
                  <p className="text-2xl font-bold">{blogs.length}</p>
                </div>
                <BookOpen className="h-8 w-8 text-[#e51083]" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:scale-105 transition-transform duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Partnership Apps</p>
                  <p className="text-2xl font-bold">{partnershipApplications.length}</p>
                </div>
                <Building className="h-8 w-8 text-[#e51083]" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:scale-105 transition-transform duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Volunteer Apps</p>
                  <p className="text-2xl font-bold">{volunteerApplications.length}</p>
                </div>
                <Users className="h-8 w-8 text-[#e51083]" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="campaigns" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-9">
            <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="stories">Stories</TabsTrigger>
            <TabsTrigger value="blogs">Blogs</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
            <TabsTrigger value="sponsors">Sponsors</TabsTrigger>
            <TabsTrigger value="gallery">Gallery</TabsTrigger>
            <TabsTrigger value="applications">Applications</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
          </TabsList>

          {/* Campaigns Tab */}
          <TabsContent value="campaigns" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Manage Campaigns</h2>
              <Dialog
                open={isDialogOpen && editType === ""}
                onOpenChange={(open) => {
                  setIsDialogOpen(open)
                  if (!open) {
                    resetForms()
                    setEditType("")
                  }
                }}
              >
                <DialogTrigger asChild>
                  <Button
                    onClick={() => {
                      resetForms()
                      setEditType("")
                      setIsDialogOpen(true)
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Campaign
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Add New Campaign</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={(e) => handleSubmit(e, "Campaign")} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="campaign-title">Campaign Title</Label>
                        <Input
                          id="campaign-title"
                          value={newCampaign.title}
                          onChange={(e) => setNewCampaign((prev) => ({ ...prev, title: e.target.value }))}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="campaign-location">Location</Label>
                        <Input
                          id="campaign-location"
                          value={newCampaign.location}
                          onChange={(e) => setNewCampaign((prev) => ({ ...prev, location: e.target.value }))}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="campaign-beneficiaries">Beneficiaries</Label>
                        <Input
                          id="campaign-beneficiaries"
                          type="number"
                          value={newCampaign.beneficiaries}
                          onChange={(e) => setNewCampaign((prev) => ({ ...prev, beneficiaries: e.target.value }))}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="campaign-urgency">Urgency Level</Label>
                        <Select
                          value={newCampaign.urgency}
                          onValueChange={(value) => setNewCampaign((prev) => ({ ...prev, urgency: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="urgent">Urgent</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="ongoing">Ongoing</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="campaign-linked-blog">Link to Blog Post</Label>
                      <Select
                        value={newCampaign.linkedBlog}
                        onValueChange={(value) => setNewCampaign((prev) => ({ ...prev, linkedBlog: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a blog post" />
                        </SelectTrigger>
                        <SelectContent>
                          {blogs.map((blog) => (
                            <SelectItem key={blog.id} value={blog.id.toString()}>
                              {blog.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="campaign-description">Description</Label>
                      <Textarea
                        id="campaign-description"
                        rows={4}
                        value={newCampaign.description}
                        onChange={(e) => setNewCampaign((prev) => ({ ...prev, description: e.target.value }))}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Featured Image</Label>
                      <div className="flex items-center space-x-4">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => handleImageUpload(setNewCampaign, "featureImage")}
                          className="bg-transparent"
                        >
                          <Upload className="mr-2 h-4 w-4" />
                          Upload Featured Image
                        </Button>
                        {newCampaign.featureImage && (
                          <Image
                            src={newCampaign.featureImage || "/placeholder.svg"}
                            alt="Featured"
                            width={100}
                            height={60}
                            className="rounded border"
                          />
                        )}
                      </div>
                    </div>

                    <Button type="submit" className="w-full bg-[#e51083] hover:bg-[#c50e73]">
                      Add Campaign
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {campaigns.map((campaign) => (
                <Card key={campaign.id} className="overflow-hidden">
                  <div className="relative">
                    <Image
                      src={campaign.featureImage || "/placeholder.svg"}
                      alt={campaign.title}
                      width={400}
                      height={200}
                      className="w-full h-48 object-cover"
                    />
                    <Badge
                      className={`absolute top-2 right-2 ${
                        campaign.urgency === "urgent"
                          ? "bg-red-500"
                          : campaign.urgency === "active"
                            ? "bg-green-500"
                            : campaign.urgency === "completed"
                              ? "bg-gray-500"
                              : "bg-blue-500"
                      }`}
                    >
                      {campaign.urgency}
                    </Badge>
                  </div>
                  <CardHeader>
                    <CardTitle className="text-lg">{campaign.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">{campaign.description}</p>
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <span className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        {campaign.beneficiaries} girls
                      </span>
                      <span>{campaign.location}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleView(campaign, "campaign")}
                        className="flex-1 bg-transparent"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(campaign, "campaign")}
                        className="flex-1 bg-transparent"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(campaign.id, "campaign")}
                        className="flex-1"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Projects Tab */}
          <TabsContent value="projects" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Manage Projects</h2>
              <Dialog
                open={isDialogOpen && editType === ""}
                onOpenChange={(open) => {
                  setIsDialogOpen(open)
                  if (!open) {
                    resetForms()
                    setEditType("")
                  }
                }}
              >
                <DialogTrigger asChild>
                  <Button
                    onClick={() => {
                      resetForms()
                      setEditType("")
                      setIsDialogOpen(true)
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Project
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Add New Project</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={(e) => handleSubmit(e, "Project")} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="project-title">Project Title</Label>
                        <Input
                          id="project-title"
                          value={newProject.title}
                          onChange={(e) => setNewProject((prev) => ({ ...prev, title: e.target.value }))}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="project-location">Location</Label>
                        <Input
                          id="project-location"
                          value={newProject.location}
                          onChange={(e) => setNewProject((prev) => ({ ...prev, location: e.target.value }))}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="project-beneficiaries">Beneficiaries</Label>
                        <Input
                          id="project-beneficiaries"
                          type="number"
                          value={newProject.beneficiaries}
                          onChange={(e) => setNewProject((prev) => ({ ...prev, beneficiaries: e.target.value }))}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="project-status">Status</Label>
                        <Select
                          value={newProject.status}
                          onValueChange={(value) => setNewProject((prev) => ({ ...prev, status: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="in-progress">In Progress</SelectItem>
                            <SelectItem value="planned">Planned</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="project-linked-blog">Link to Blog Post</Label>
                      <Select
                        value={newProject.linkedBlog}
                        onValueChange={(value) => setNewProject((prev) => ({ ...prev, linkedBlog: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a blog post" />
                        </SelectTrigger>
                        <SelectContent>
                          {blogs.map((blog) => (
                            <SelectItem key={blog.id} value={blog.id.toString()}>
                              {blog.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="project-description">Description</Label>
                      <Textarea
                        id="project-description"
                        rows={4}
                        value={newProject.description}
                        onChange={(e) => setNewProject((prev) => ({ ...prev, description: e.target.value }))}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Featured Image</Label>
                      <div className="flex items-center space-x-4">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => handleImageUpload(setNewProject, "featureImage")}
                          className="bg-transparent"
                        >
                          <Upload className="mr-2 h-4 w-4" />
                          Upload Featured Image
                        </Button>
                        {newProject.featureImage && (
                          <Image
                            src={newProject.featureImage || "/placeholder.svg"}
                            alt="Featured"
                            width={100}
                            height={60}
                            className="rounded border"
                          />
                        )}
                      </div>
                    </div>

                    <Button type="submit" className="w-full bg-[#e51083] hover:bg-[#c50e73]">
                      Add Project
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <Card key={project.id} className="overflow-hidden">
                  <div className="relative">
                    <Image
                      src={project.featureImage || "/placeholder.svg"}
                      alt={project.title}
                      width={400}
                      height={200}
                      className="w-full h-48 object-cover"
                    />
                    <Badge className="absolute top-2 right-2 bg-green-500">{project.status}</Badge>
                  </div>
                  <CardHeader>
                    <CardTitle className="text-lg">{project.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">{project.description}</p>
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <span className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        {project.beneficiaries} girls
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleView(project, "project")}
                        className="flex-1 bg-transparent"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(project, "project")}
                        className="flex-1 bg-transparent"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(project.id, "project")}
                        className="flex-1"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Stories Tab */}
          <TabsContent value="stories" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Manage Success Stories</h2>
              <Dialog
                open={isDialogOpen && editType === ""}
                onOpenChange={(open) => {
                  setIsDialogOpen(open)
                  if (!open) {
                    resetForms()
                    setEditType("")
                  }
                }}
              >
                <DialogTrigger asChild>
                  <Button
                    onClick={() => {
                      resetForms()
                      setEditType("")
                      setIsDialogOpen(true)
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Story
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Add New Success Story</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={(e) => handleSubmit(e, "Story")} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="story-title">Story Title</Label>
                      <Input
                        id="story-title"
                        value={newStory.title}
                        onChange={(e) => setNewStory((prev) => ({ ...prev, title: e.target.value }))}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="story-beneficiary-name">Beneficiary Name</Label>
                        <Input
                          id="story-beneficiary-name"
                          value={newStory.beneficiaryName}
                          onChange={(e) => setNewStory((prev) => ({ ...prev, beneficiaryName: e.target.value }))}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="story-beneficiary-age">Age</Label>
                        <Input
                          id="story-beneficiary-age"
                          value={newStory.beneficiaryAge}
                          onChange={(e) => setNewStory((prev) => ({ ...prev, beneficiaryAge: e.target.value }))}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="story-location">Location</Label>
                        <Input
                          id="story-location"
                          value={newStory.location}
                          onChange={(e) => setNewStory((prev) => ({ ...prev, location: e.target.value }))}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="story-content">Story Content</Label>
                      <Textarea
                        id="story-content"
                        rows={6}
                        value={newStory.content}
                        onChange={(e) => setNewStory((prev) => ({ ...prev, content: e.target.value }))}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Featured Image</Label>
                      <div className="flex items-center space-x-4">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => handleImageUpload(setNewStory, "featureImage")}
                          className="bg-transparent"
                        >
                          <Upload className="mr-2 h-4 w-4" />
                          Upload Featured Image
                        </Button>
                        {newStory.featureImage && (
                          <Image
                            src={newStory.featureImage || "/placeholder.svg"}
                            alt="Featured"
                            width={100}
                            height={60}
                            className="rounded border"
                          />
                        )}
                      </div>
                    </div>

                    <Button type="submit" className="w-full bg-[#e51083] hover:bg-[#c50e73]">
                      Add Story
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {stories.map((story) => (
                <Card key={story.id} className="overflow-hidden">
                  <div className="relative">
                    <Image
                      src={story.featureImage || "/placeholder.svg"}
                      alt={story.title}
                      width={400}
                      height={200}
                      className="w-full h-48 object-cover"
                    />
                  </div>
                  <CardHeader>
                    <CardTitle className="text-lg">{story.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      <p>
                        <strong>Beneficiary:</strong> {story.beneficiaryName}, {story.beneficiaryAge} years old
                      </p>
                      <p>
                        <strong>Location:</strong> {story.location}
                      </p>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">{story.content}</p>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleView(story, "story")}
                        className="flex-1 bg-transparent"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(story, "story")}
                        className="flex-1 bg-transparent"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(story.id, "story")}
                        className="flex-1"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Blogs Tab */}
          <TabsContent value="blogs" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Manage Blog Posts</h2>
              <Dialog
                open={isDialogOpen && editType === ""}
                onOpenChange={(open) => {
                  setIsDialogOpen(open)
                  if (!open) {
                    resetForms()
                    setEditType("")
                  }
                }}
              >
                <DialogTrigger asChild>
                  <Button
                    onClick={() => {
                      resetForms()
                      setEditType("")
                      setIsDialogOpen(true)
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Blog Post
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Add New Blog Post</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={(e) => handleSubmit(e, "Blog")} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="blog-title">Blog Title</Label>
                        <Input
                          id="blog-title"
                          value={newBlog.title}
                          onChange={(e) => setNewBlog((prev) => ({ ...prev, title: e.target.value }))}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="blog-author">Author</Label>
                        <Input
                          id="blog-author"
                          value={newBlog.author}
                          onChange={(e) => setNewBlog((prev) => ({ ...prev, author: e.target.value }))}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="blog-category">Category</Label>
                      <Select
                        value={newBlog.category}
                        onValueChange={(value) => setNewBlog((prev) => ({ ...prev, category: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.name}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="blog-excerpt">Excerpt</Label>
                      <Textarea
                        id="blog-excerpt"
                        rows={3}
                        value={newBlog.excerpt}
                        onChange={(e) => setNewBlog((prev) => ({ ...prev, excerpt: e.target.value }))}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="blog-content">Content</Label>
                      <Textarea
                        id="blog-content"
                        rows={8}
                        value={newBlog.content}
                        onChange={(e) => setNewBlog((prev) => ({ ...prev, content: e.target.value }))}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Blog Images</Label>
                      <div className="flex items-center space-x-4">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => handleImageUpload(setNewBlog)}
                          className="bg-transparent"
                        >
                          <Upload className="mr-2 h-4 w-4" />
                          Add Image
                        </Button>
                        <span className="text-sm text-gray-500">{newBlog.images.length} images added</span>
                      </div>
                      {newBlog.images.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {newBlog.images.map((img, index) => (
                            <Image
                              key={index}
                              src={img || "/placeholder.svg"}
                              alt={`Blog image ${index + 1}`}
                              width={60}
                              height={40}
                              className="rounded border"
                            />
                          ))}
                        </div>
                      )}
                    </div>

                    <Button type="submit" className="w-full bg-[#e51083] hover:bg-[#c50e73]">
                      Add Blog Post
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogs.map((blog) => (
                <Card key={blog.id} className="overflow-hidden">
                  <div className="relative">
                    <Image
                      src={blog.images?.[0] || "/placeholder.svg"}
                      alt={blog.title}
                      width={400}
                      height={200}
                      className="w-full h-48 object-cover"
                    />
                    <Badge className="absolute top-2 left-2 bg-[#e51083]">{blog.category}</Badge>
                    {blog.images && blog.images.length > 1 && (
                      <Badge className="absolute top-2 right-2 bg-black/70 text-white">
                        <ImageIcon className="h-3 w-3 mr-1" />
                        {blog.images.length}
                      </Badge>
                    )}
                  </div>
                  <CardHeader>
                    <CardTitle className="text-lg line-clamp-2">{blog.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      <p>
                        <strong>Author:</strong> {blog.author}
                      </p>
                      <p>
                        <strong>Date:</strong> {blog.date}
                      </p>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">{blog.excerpt}</p>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleView(blog, "blog")}
                        className="flex-1 bg-transparent"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(blog, "blog")}
                        className="flex-1 bg-transparent"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(blog.id, "blog")}
                        className="flex-1"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Team Tab */}
          <TabsContent value="team" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Manage Team Members</h2>
              <Dialog
                open={isDialogOpen && editType === ""}
                onOpenChange={(open) => {
                  setIsDialogOpen(open)
                  if (!open) {
                    resetForms()
                    setEditType("")
                  }
                }}
              >
                <DialogTrigger asChild>
                  <Button
                    onClick={() => {
                      resetForms()
                      setEditType("")
                      setIsDialogOpen(true)
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Team Member
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Add New Team Member</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={(e) => handleSubmit(e, "Team Member")} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="member-name">Full Name</Label>
                        <Input
                          id="member-name"
                          value={newTeamMember.name}
                          onChange={(e) => setNewTeamMember((prev) => ({ ...prev, name: e.target.value }))}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="member-role">Role</Label>
                        <Input
                          id="member-role"
                          value={newTeamMember.role}
                          onChange={(e) => setNewTeamMember((prev) => ({ ...prev, role: e.target.value }))}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="member-email">Email Address</Label>
                      <Input
                        id="member-email"
                        type="email"
                        value={newTeamMember.email}
                        onChange={(e) => setNewTeamMember((prev) => ({ ...prev, email: e.target.value }))}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="member-facebook">Facebook URL (Optional)</Label>
                        <Input
                          id="member-facebook"
                          value={newTeamMember.facebook}
                          onChange={(e) => setNewTeamMember((prev) => ({ ...prev, facebook: e.target.value }))}
                          placeholder="https://facebook.com/username"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="member-instagram">Instagram URL (Optional)</Label>
                        <Input
                          id="member-instagram"
                          value={newTeamMember.instagram}
                          onChange={(e) => setNewTeamMember((prev) => ({ ...prev, instagram: e.target.value }))}
                          placeholder="https://instagram.com/username"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="member-tiktok">TikTok URL (Optional)</Label>
                        <Input
                          id="member-tiktok"
                          value={newTeamMember.tiktok}
                          onChange={(e) => setNewTeamMember((prev) => ({ ...prev, tiktok: e.target.value }))}
                          placeholder="https://tiktok.com/@username"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="member-bio">Bio</Label>
                      <Textarea
                        id="member-bio"
                        rows={4}
                        value={newTeamMember.bio}
                        onChange={(e) => setNewTeamMember((prev) => ({ ...prev, bio: e.target.value }))}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Profile Image</Label>
                      <div className="flex items-center space-x-4">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => handleImageUpload(setNewTeamMember, "image")}
                          className="bg-transparent"
                        >
                          <Upload className="mr-2 h-4 w-4" />
                          Upload Image
                        </Button>
                        {newTeamMember.image && (
                          <Image
                            src={newTeamMember.image || "/placeholder.svg"}
                            alt="Profile"
                            width={60}
                            height={60}
                            className="rounded-full border"
                          />
                        )}
                      </div>
                    </div>

                    <Button type="submit" className="w-full bg-[#e51083] hover:bg-[#c50e73]">
                      Add Team Member
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {teamMembers.map((member) => (
                <Card key={member.id} className="overflow-hidden">
                  <div className="relative">
                    <Image
                      src={member.image || "/placeholder.svg"}
                      alt={member.name}
                      width={400}
                      height={200}
                      className="w-full h-48 object-cover"
                    />
                  </div>
                  <CardHeader>
                    <CardTitle className="text-lg">{member.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      <p>
                        <strong>Role:</strong> {member.role}
                      </p>
                      <p>
                        <strong>Email:</strong> {member.email}
                      </p>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">{member.bio}</p>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleView(member, "team")}
                        className="flex-1 bg-transparent"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(member, "team")}
                        className="flex-1 bg-transparent"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(member.id, "team")}
                        className="flex-1"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Sponsors Tab */}
          <TabsContent value="sponsors" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Manage Sponsors</h2>
              <Dialog
                open={isDialogOpen && editType === ""}
                onOpenChange={(open) => {
                  setIsDialogOpen(open)
                  if (!open) {
                    resetForms()
                    setEditType("")
                  }
                }}
              >
                <DialogTrigger asChild>
                  <Button
                    onClick={() => {
                      resetForms()
                      setEditType("")
                      setIsDialogOpen(true)
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Sponsor
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Add New Sponsor</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={(e) => handleSubmit(e, "Sponsor")} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="sponsor-name">Sponsor Name</Label>
                      <Input
                        id="sponsor-name"
                        value={newSponsor.name}
                        onChange={(e) => setNewSponsor((prev) => ({ ...prev, name: e.target.value }))}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="sponsor-website">Website URL</Label>
                      <Input
                        id="sponsor-website"
                        type="url"
                        value={newSponsor.website}
                        onChange={(e) => setNewSponsor((prev) => ({ ...prev, website: e.target.value }))}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Logo</Label>
                      <div className="flex items-center space-x-4">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => handleImageUpload(setNewSponsor, "logo")}
                          className="bg-transparent"
                        >
                          <Upload className="mr-2 h-4 w-4" />
                          Upload Logo
                        </Button>
                        {newSponsor.logo && (
                          <Image
                            src={newSponsor.logo || "/placeholder.svg"}
                            alt="Logo"
                            width={80}
                            height={60}
                            className="rounded border"
                          />
                        )}
                      </div>
                    </div>

                    <Button type="submit" className="w-full bg-[#e51083] hover:bg-[#c50e73]">
                      Add Sponsor
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {sponsors.map((sponsor) => (
                <Card key={sponsor.id} className="overflow-hidden">
                  <CardContent className="p-6">
                    <div className="text-center">
                      <Image
                        src={sponsor.logo || "/placeholder.svg"}
                        alt={sponsor.name}
                        width={120}
                        height={80}
                        className="mx-auto mb-4 object-contain"
                      />
                      <h3 className="font-semibold mb-2">{sponsor.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{sponsor.website}</p>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleView(sponsor, "sponsor")}
                          className="flex-1 bg-transparent"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(sponsor, "sponsor")}
                          className="flex-1 bg-transparent"
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(sponsor.id, "sponsor")}
                          className="flex-1"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Gallery Tab */}
          <TabsContent value="gallery" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Manage Gallery</h2>
              <Dialog
                open={isDialogOpen && editType === ""}
                onOpenChange={(open) => {
                  setIsDialogOpen(open)
                  if (!open) {
                    resetForms()
                    setEditType("")
                  }
                }}
              >
                <DialogTrigger asChild>
                  <Button
                    onClick={() => {
                      resetForms()
                      setEditType("")
                      setIsDialogOpen(true)
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Image
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Add New Gallery Image</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={(e) => handleSubmit(e, "Gallery Image")} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="gallery-title">Image Title</Label>
                      <Input
                        id="gallery-title"
                        value={newGalleryImage.title}
                        onChange={(e) => setNewGalleryImage((prev) => ({ ...prev, title: e.target.value }))}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="gallery-category">Category</Label>
                      <Select
                        value={newGalleryImage.category}
                        onValueChange={(value) => setNewGalleryImage((prev) => ({ ...prev, category: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Education">Education</SelectItem>
                          <SelectItem value="Distribution">Distribution</SelectItem>
                          <SelectItem value="Empowerment">Empowerment</SelectItem>
                          <SelectItem value="Infrastructure">Infrastructure</SelectItem>
                          <SelectItem value="Community">Community</SelectItem>
                          <SelectItem value="Success">Success</SelectItem>
                          <SelectItem value="Team">Team</SelectItem>
                          <SelectItem value="Training">Training</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="gallery-description">Description</Label>
                      <Textarea
                        id="gallery-description"
                        value={newGalleryImage.description}
                        onChange={(e) => setNewGalleryImage((prev) => ({ ...prev, description: e.target.value }))}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Image</Label>
                      <div className="flex items-center space-x-4">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => handleImageUpload(setNewGalleryImage, "image")}
                          className="bg-transparent"
                        >
                          <Upload className="mr-2 h-4 w-4" />
                          Upload Image
                        </Button>
                        {newGalleryImage.image && (
                          <Image
                            src={newGalleryImage.image || "/placeholder.svg"}
                            alt="Preview"
                            width={100}
                            height={60}
                            className="rounded border"
                          />
                        )}
                      </div>
                    </div>

                    <Button type="submit" className="w-full bg-[#e51083] hover:bg-[#c50e73]">
                      Add Image
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {galleryImages.map((item) => (
                <Card key={item.id} className="overflow-hidden group">
                  <div className="relative">
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.title}
                      width={300}
                      height={200}
                      className="w-full h-48 object-cover"
                    />
                    <Badge className="absolute top-2 left-2 bg-black/70 text-white">{item.category}</Badge>
                  </div>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 mb-4">{item.description}</p>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleView(item, "gallery")}
                        className="flex-1 bg-transparent"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(item, "gallery")}
                        className="flex-1 bg-transparent"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(item.id, "gallery")}
                        className="flex-1"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Applications Tab */}
          <TabsContent value="applications" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Partnership Applications */}
              <Card className="animate-fade-in-up">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="h-5 w-5" />
                    Partnership Applications ({partnershipApplications.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {partnershipApplications.length === 0 ? (
                      <p className="text-gray-500 text-center py-4">No partnership applications yet</p>
                    ) : (
                      partnershipApplications.map((app) => (
                        <div key={app.id} className="border rounded-lg p-4 hover:shadow-md transition-all duration-300">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-semibold">{app.fullName}</h3>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(app.id, "partnership")}
                              className="hover:scale-105 transition-transform bg-transparent"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="space-y-1 text-sm text-gray-600">
                            <p>
                              <strong>Role:</strong> {app.role}
                            </p>
                            <p>
                              <strong>Organization:</strong> {app.organizationName}
                            </p>
                            <p>
                              <strong>Email:</strong> {app.email}
                            </p>
                            {app.phoneNumber && (
                              <p>
                                <strong>Phone:</strong> {app.phoneNumber}
                              </p>
                            )}
                            <p>
                              <strong>Submitted:</strong> {new Date(app.submittedAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Volunteer Applications */}
              <Card className="animate-fade-in-up animation-delay-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5" />
                    Volunteer Applications ({volunteerApplications.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {volunteerApplications.length === 0 ? (
                      <p className="text-gray-500 text-center py-4">No volunteer applications yet</p>
                    ) : (
                      volunteerApplications.map((app) => (
                        <div key={app.id} className="border rounded-lg p-4 hover:shadow-md transition-all duration-300">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-semibold">{app.fullName}</h3>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(app.id, "volunteer")}
                              className="hover:scale-105 transition-transform bg-transparent"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="space-y-1 text-sm text-gray-600">
                            <p>
                              <strong>Email:</strong> {app.email}
                            </p>
                            {app.phoneNumber && (
                              <p>
                                <strong>Phone:</strong> {app.phoneNumber}
                              </p>
                            )}
                            <p>
                              <strong>Submitted:</strong> {new Date(app.submittedAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Categories Tab */}
          <TabsContent value="categories" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Manage Categories</h2>
              <Dialog
                open={isDialogOpen && editType === ""}
                onOpenChange={(open) => {
                  setIsDialogOpen(open)
                  if (!open) {
                    resetForms()
                    setEditType("")
                  }
                }}
              >
                <DialogTrigger asChild>
                  <Button
                    onClick={() => {
                      resetForms()
                      setEditType("")
                      setIsDialogOpen(true)
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Category
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Category</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={(e) => handleSubmit(e, "Category")} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="category-name">Category Name</Label>
                      <Input
                        id="category-name"
                        value={newCategory.name}
                        onChange={(e) => setNewCategory((prev) => ({ ...prev, name: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category-description">Description</Label>
                      <Textarea
                        id="category-description"
                        value={newCategory.description}
                        onChange={(e) => setNewCategory((prev) => ({ ...prev, description: e.target.value }))}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full bg-[#e51083] hover:bg-[#c50e73]">
                      Add Category
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((category) => (
                <div key={category.id} className="border rounded-lg p-4 hover:shadow-md transition-all duration-300">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <Tag className="h-4 w-4 text-[#e51083]" />
                      <h3 className="font-semibold">{category.name}</h3>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleView(category, "category")}
                        className="hover:scale-105 transition-transform bg-transparent"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(category, "category")}
                        className="hover:scale-105 transition-transform bg-transparent"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(category.id, "category")}
                        className="hover:scale-105 transition-transform bg-transparent"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">{category.description}</p>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Edit Dialog */}
        {editingItem && (
          <Dialog
            open={!!editingItem && editType !== ""}
            onOpenChange={() => {
              setEditingItem(null)
              setEditType("")
              setIsDialogOpen(false)
            }}
          >
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Edit {editType}</DialogTitle>
              </DialogHeader>
              <form
                onSubmit={(e) =>
                  handleSubmit(
                    e,
                    editType === "campaign"
                      ? "Campaign"
                      : editType === "project"
                        ? "Project"
                        : editType === "story"
                          ? "Story"
                          : editType === "blog"
                            ? "Blog"
                            : editType === "team"
                              ? "Team Member"
                              : editType === "sponsor"
                                ? "Sponsor"
                                : editType === "gallery"
                                  ? "Gallery Image"
                                  : "Category",
                  )
                }
                className="space-y-4"
              >
                {editType === "campaign" && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Campaign Title</Label>
                        <Input
                          value={newCampaign.title}
                          onChange={(e) => setNewCampaign((prev) => ({ ...prev, title: e.target.value }))}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Location</Label>
                        <Input
                          value={newCampaign.location}
                          onChange={(e) => setNewCampaign((prev) => ({ ...prev, location: e.target.value }))}
                          required
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Beneficiaries</Label>
                        <Input
                          type="number"
                          value={newCampaign.beneficiaries}
                          onChange={(e) => setNewCampaign((prev) => ({ ...prev, beneficiaries: e.target.value }))}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Urgency Level</Label>
                        <Select
                          value={newCampaign.urgency}
                          onValueChange={(value) => setNewCampaign((prev) => ({ ...prev, urgency: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="urgent">Urgent</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="ongoing">Ongoing</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Textarea
                        rows={4}
                        value={newCampaign.description}
                        onChange={(e) => setNewCampaign((prev) => ({ ...prev, description: e.target.value }))}
                        required
                      />
                    </div>
                  </>
                )}

                {editType === "project" && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Project Title</Label>
                        <Input
                          value={newProject.title}
                          onChange={(e) => setNewProject((prev) => ({ ...prev, title: e.target.value }))}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Location</Label>
                        <Input
                          value={newProject.location}
                          onChange={(e) => setNewProject((prev) => ({ ...prev, location: e.target.value }))}
                          required
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Beneficiaries</Label>
                        <Input
                          type="number"
                          value={newProject.beneficiaries}
                          onChange={(e) => setNewProject((prev) => ({ ...prev, beneficiaries: e.target.value }))}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Status</Label>
                        <Select
                          value={newProject.status}
                          onChange={(value) => setNewProject((prev) => ({ ...prev, status: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="in-progress">In Progress</SelectItem>
                            <SelectItem value="planned">Planned</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Textarea
                        rows={4}
                        value={newProject.description}
                        onChange={(e) => setNewProject((prev) => ({ ...prev, description: e.target.value }))}
                        required
                      />
                    </div>
                  </>
                )}

                {editType === "category" && (
                  <>
                    <div className="space-y-2">
                      <Label>Category Name</Label>
                      <Input
                        value={newCategory.name}
                        onChange={(e) => setNewCategory((prev) => ({ ...prev, name: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Textarea
                        value={newCategory.description}
                        onChange={(e) => setNewCategory((prev) => ({ ...prev, description: e.target.value }))}
                        required
                      />
                    </div>
                  </>
                )}

                <Button type="submit" className="w-full bg-[#e51083] hover:bg-[#c50e73]">
                  Update {editType}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        )}

        {/* View Dialog */}
        {viewingItem && (
          <Dialog
            open={isViewDialogOpen}
            onOpenChange={() => {
              setViewingItem(null)
              setViewType("")
              setIsViewDialogOpen(false)
            }}
          >
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>View {viewType}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                {viewType === "campaign" && (
                  <>
                    <div className="space-y-2">
                      <h3 className="font-semibold">Campaign Details</h3>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <strong>Title:</strong> {viewingItem.title}
                        </div>
                        <div>
                          <strong>Location:</strong> {viewingItem.location}
                        </div>
                        <div>
                          <strong>Urgency:</strong> {viewingItem.urgency}
                        </div>
                        <div>
                          <strong>Beneficiaries:</strong> {viewingItem.beneficiaries} girls
                        </div>
                      </div>
                      <div>
                        <strong>Description:</strong>
                      </div>
                      <p className="text-sm text-gray-600">{viewingItem.description}</p>
                      {viewingItem.featureImage && (
                        <div>
                          <strong>Featured Image:</strong>
                          <Image
                            src={viewingItem.featureImage || "/placeholder.svg"}
                            alt={viewingItem.title}
                            width={400}
                            height={200}
                            className="mt-2 rounded border"
                          />
                        </div>
                      )}
                    </div>
                  </>
                )}

                {viewType === "project" && (
                  <>
                    <div className="space-y-2">
                      <h3 className="font-semibold">Project Details</h3>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <strong>Title:</strong> {viewingItem.title}
                        </div>
                        <div>
                          <strong>Location:</strong> {viewingItem.location}
                        </div>
                        <div>
                          <strong>Status:</strong> {viewingItem.status}
                        </div>
                        <div>
                          <strong>Beneficiaries:</strong> {viewingItem.beneficiaries} girls
                        </div>
                      </div>
                      <div>
                        <strong>Description:</strong>
                      </div>
                      <p className="text-sm text-gray-600">{viewingItem.description}</p>
                      {viewingItem.featureImage && (
                        <div>
                          <strong>Featured Image:</strong>
                          <Image
                            src={viewingItem.featureImage || "/placeholder.svg"}
                            alt={viewingItem.title}
                            width={400}
                            height={200}
                            className="mt-2 rounded border"
                          />
                        </div>
                      )}
                    </div>
                  </>
                )}

                {viewType === "story" && (
                  <>
                    <div className="space-y-2">
                      <h3 className="font-semibold">Success Story Details</h3>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <strong>Title:</strong> {viewingItem.title}
                        </div>
                        <div>
                          <strong>Beneficiary:</strong> {viewingItem.beneficiaryName}
                        </div>
                        <div>
                          <strong>Age:</strong> {viewingItem.beneficiaryAge} years old
                        </div>
                        <div>
                          <strong>Location:</strong> {viewingItem.location}
                        </div>
                      </div>
                      <div>
                        <strong>Story:</strong>
                      </div>
                      <p className="text-sm text-gray-600">{viewingItem.content}</p>
                      {viewingItem.featureImage && (
                        <div>
                          <strong>Featured Image:</strong>
                          <Image
                            src={viewingItem.featureImage || "/placeholder.svg"}
                            alt={viewingItem.title}
                            width={400}
                            height={200}
                            className="mt-2 rounded border"
                          />
                        </div>
                      )}
                    </div>
                  </>
                )}

                {viewType === "blog" && (
                  <>
                    <div className="space-y-2">
                      <h3 className="font-semibold">Blog Post Details</h3>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <strong>Title:</strong> {viewingItem.title}
                        </div>
                        <div>
                          <strong>Author:</strong> {viewingItem.author}
                        </div>
                        <div>
                          <strong>Category:</strong> {viewingItem.category}
                        </div>
                        <div>
                          <strong>Date:</strong> {viewingItem.date}
                        </div>
                      </div>
                      <div>
                        <strong>Excerpt:</strong>
                      </div>
                      <p className="text-sm text-gray-600">{viewingItem.excerpt}</p>
                      <div>
                        <strong>Content:</strong>
                      </div>
                      <p className="text-sm text-gray-600">{viewingItem.content}</p>
                      {viewingItem.images && viewingItem.images.length > 0 && (
                        <div>
                          <strong>Images ({viewingItem.images.length}):</strong>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {viewingItem.images.map((img: string, index: number) => (
                              <Image
                                key={index}
                                src={img || "/placeholder.svg"}
                                alt={`Blog image ${index + 1}`}
                                width={100}
                                height={60}
                                className="rounded border"
                              />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                )}

                {viewType === "team" && (
                  <>
                    <div className="space-y-2">
                      <h3 className="font-semibold">Team Member Details</h3>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <strong>Name:</strong> {viewingItem.name}
                        </div>
                        <div>
                          <strong>Role:</strong> {viewingItem.role}
                        </div>
                        <div>
                          <strong>Email:</strong> {viewingItem.email}
                        </div>
                      </div>
                      <div>
                        <strong>Bio:</strong>
                      </div>
                      <p className="text-sm text-gray-600">{viewingItem.bio}</p>
                      <div>
                        <strong>Social Media:</strong>
                      </div>
                      <div className="text-sm">
                        {viewingItem.facebook && (
                          <div>
                            <strong>Facebook:</strong> {viewingItem.facebook}
                          </div>
                        )}
                        {viewingItem.instagram && (
                          <div>
                            <strong>Instagram:</strong> {viewingItem.instagram}
                          </div>
                        )}
                        {viewingItem.tiktok && (
                          <div>
                            <strong>TikTok:</strong> {viewingItem.tiktok}
                          </div>
                        )}
                      </div>
                      {viewingItem.image && (
                        <div>
                          <strong>Profile Image:</strong>
                          <Image
                            src={viewingItem.image || "/placeholder.svg"}
                            alt={viewingItem.name}
                            width={200}
                            height={200}
                            className="mt-2 rounded border"
                          />
                        </div>
                      )}
                    </div>
                  </>
                )}

                {viewType === "sponsor" && (
                  <>
                    <div className="space-y-2">
                      <h3 className="font-semibold">Sponsor Details</h3>
                      <div className="text-sm">
                        <div>
                          <strong>Name:</strong> {viewingItem.name}
                        </div>
                        <div>
                          <strong>Website:</strong> {viewingItem.website}
                        </div>
                      </div>
                      {viewingItem.logo && (
                        <div>
                          <strong>Logo:</strong>
                          <Image
                            src={viewingItem.logo || "/placeholder.svg"}
                            alt={viewingItem.name}
                            width={200}
                            height={120}
                            className="mt-2 rounded border object-contain"
                          />
                        </div>
                      )}
                    </div>
                  </>
                )}

                {viewType === "gallery" && (
                  <>
                    <div className="space-y-2">
                      <h3 className="font-semibold">Gallery Image Details</h3>
                      <div className="text-sm">
                        <div>
                          <strong>Title:</strong> {viewingItem.title}
                        </div>
                        <div>
                          <strong>Category:</strong> {viewingItem.category}
                        </div>
                        <div>
                          <strong>Description:</strong> {viewingItem.description}
                        </div>
                      </div>
                      {viewingItem.image && (
                        <div>
                          <strong>Image:</strong>
                          <Image
                            src={viewingItem.image || "/placeholder.svg"}
                            alt={viewingItem.title}
                            width={400}
                            height={300}
                            className="mt-2 rounded border"
                          />
                        </div>
                      )}
                    </div>
                  </>
                )}

                {viewType === "category" && (
                  <>
                    <div className="space-y-2">
                      <h3 className="font-semibold">Category Details</h3>
                      <div className="text-sm">
                        <div>
                          <strong>Name:</strong> {viewingItem.name}
                        </div>
                        <div>
                          <strong>Description:</strong> {viewingItem.description}
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  )
}
