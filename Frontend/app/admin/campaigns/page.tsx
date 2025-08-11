"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Eye, Edit, Trash2, MapPin, Clock, Users } from "lucide-react"
import Image from "next/image"
import { DeleteConfirmation } from "@/components/admin/delete-confirmation"
import { ImageUploader } from "@/components/admin/image-uploader"
import { DatabaseError } from "@/components/admin/database-error"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api';

interface Campaign {
  id: number;
  title: string;
  description: string;
  location: string;
  urgency: string;
  beneficiaries: number;
  linked_blog?: number | null;
  feature_image?: string;
  start_date?: string | null;
  end_date?: string | null;
}

interface BlogPost {
  id: number;
  title: string;
}

export default function CampaignsPage() {
  // State
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null)
  const [viewingCampaign, setViewingCampaign] = useState<Campaign | null>(null)
  const [deletingCampaignId, setDeletingCampaignId] = useState<number | null>(null)
  
  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    urgency: "active",
    beneficiaries: "",
    linked_blog: "none",
    feature_image: "",
    start_date: "",
    end_date: "",
  })
  
  const { toast } = useToast()
  
  // Fetch campaigns
  const fetchCampaigns = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`${API_BASE_URL}/campaigns`)
      if (!response.ok) throw new Error("Failed to fetch campaigns")
      const data = await response.json()
      setCampaigns(data)
    } catch (error) {
      console.error("Error fetching campaigns:", error)
      setError("Failed to fetch campaigns from database")
    } finally {
      setLoading(false)
    }
  }
  
  // Fetch blog posts for linking
  const fetchBlogPosts = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/blog`)
      if (!response.ok) throw new Error("Failed to fetch blog posts")
      const data = await response.json()
      setBlogPosts(data)
    } catch (error) {
      console.error("Error fetching blog posts:", error)
      // Not setting error state as this is secondary data
    }
  }
  
  useEffect(() => {
    Promise.all([fetchCampaigns(), fetchBlogPosts()])
  }, [])
  
  // Handle form input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }
  
  // Handle select change
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }
  
  // Handle image upload
  const handleImageSelected = (imageDataUrl: string) => {
    setFormData(prev => ({ ...prev, feature_image: imageDataUrl }))
  }
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      // Validation
      if (!formData.title || !formData.description) {
        toast({
          title: "Missing Required Fields",
          description: "Title and Description are required for a campaign.",
          variant: "destructive",
        })
        return
      }
      
      // Always send all fields, never undefined
      const campaignData = {
        title: formData.title,
        description: formData.description,
        location: formData.location !== "" ? formData.location : null,
        urgency: formData.urgency !== "" ? formData.urgency : "active",
        beneficiaries: formData.beneficiaries !== "" ? Number(formData.beneficiaries) : 0,
        linked_blog: formData.linked_blog !== "" && formData.linked_blog !== "none" ? Number(formData.linked_blog) : null,
        feature_image: formData.feature_image !== "" ? formData.feature_image : null,
        start_date: formData.start_date !== "" ? formData.start_date : null,
        end_date: formData.end_date !== "" ? formData.end_date : null,
      }
      
      // Get JWT token for authentication
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('No authentication token found. Please log in again.');
      }
      
      let response
      
      if (editingCampaign) {
        response = await fetch(`${API_BASE_URL}/campaigns/${editingCampaign.id}`, {
          method: 'PUT',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(campaignData),
        })
      } else {
        response = await fetch(`${API_BASE_URL}/campaigns`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(campaignData),
        })
      }
      
      if (!response.ok) {
        throw new Error('Failed to save campaign')
      }
      
      // Refresh the campaigns list
      fetchCampaigns()
      
      // Reset form and close dialog
      resetForm()
      setIsDialogOpen(false)
      
      toast({
        title: `Campaign ${editingCampaign ? 'Updated' : 'Created'}`,
        description: `The campaign was successfully ${editingCampaign ? 'updated' : 'created'}.`,
      })
      
    } catch (error) {
      console.error("Error saving campaign:", error)
      toast({
        title: "Error",
        description: `Failed to ${editingCampaign ? 'update' : 'create'} campaign. Please try again.`,
        variant: "destructive",
      })
    }
  }
  
  // Handle campaign deletion
  const handleDelete = async () => {
    if (!deletingCampaignId) return
    
    try {
      // Get JWT token for authentication
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('No authentication token found. Please log in again.');
      }
      
      const response = await fetch(`${API_BASE_URL}/campaigns/${deletingCampaignId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete campaign')
      }
      
      // Update local state
      setCampaigns(campaigns.filter((item) => item.id !== deletingCampaignId))
      setDeletingCampaignId(null)
    } catch (error) {
      console.error('Delete error:', error);
      alert(error instanceof Error ? error.message : 'Failed to delete campaign');
      setDeletingCampaignId(null);
    }
  }
  
  // Handle view button click
  const handleView = (campaign: Campaign) => {
    setViewingCampaign(campaign)
    setIsViewDialogOpen(true)
  }
  
  // Handle edit button click
  const handleEdit = (campaign: Campaign) => {
    setEditingCampaign(campaign)
    setFormData({
      title: campaign.title,
      description: campaign.description,
      location: campaign.location || "",
      urgency: campaign.urgency?.toLowerCase() || "active",
      beneficiaries: campaign.beneficiaries?.toString() || "",
      linked_blog: campaign.linked_blog?.toString() || "none",
      feature_image: campaign.feature_image || "",
      start_date: campaign.start_date || "",
      end_date: campaign.end_date || "",
    })
    setIsDialogOpen(true)
  }
  
  // Reset form data
  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      location: "",
      urgency: "active",
      beneficiaries: "",
      linked_blog: "none",
      feature_image: "",
      start_date: "",
      end_date: "",
    })
    setEditingCampaign(null)
  }
  
  // Get linked blog post title
  const getLinkedBlogTitle = (blogId: number | null | undefined) => {
    if (!blogId) return "None"
    const blog = blogPosts.find(blog => blog.id === blogId)
    return blog ? blog.title : "Unknown Blog"
  }
  
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#e51083]"></div>
        <p className="ml-4 text-gray-600 dark:text-gray-400">
          Loading campaigns...
        </p>
      </div>
    )
  }
  
  if (error) {
    return <DatabaseError message={error} />
  }
  
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Manage Campaigns</h1>
        <Dialog 
          open={isDialogOpen} 
          onOpenChange={(open) => {
            setIsDialogOpen(open)
            if (!open) resetForm()
          }}
        >
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                resetForm()
                setIsDialogOpen(true)
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Campaign
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingCampaign ? 'Edit' : 'Add New'} Campaign</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Campaign Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Campaign Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  rows={5}
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="urgency">Urgency</Label>
                  <Select 
                    value={formData.urgency} 
                    onValueChange={(value) => handleSelectChange("urgency", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select urgency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="beneficiaries">Beneficiaries</Label>
                  <Input
                    id="beneficiaries"
                    name="beneficiaries"
                    type="number"
                    min="0"
                    value={formData.beneficiaries}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="linked_blog">Linked Blog Post</Label>
                  <Select 
                    value={formData.linked_blog} 
                    onValueChange={(value) => handleSelectChange("linked_blog", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select blog post" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      {blogPosts.map(blog => (
                        <SelectItem key={blog.id} value={blog.id.toString()}>
                          {blog.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="start_date">Start Date</Label>
                  <Input
                    id="start_date"
                    name="start_date"
                    type="date"
                    value={formData.start_date}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="end_date">End Date</Label>
                  <Input
                    id="end_date"
                    name="end_date"
                    type="date"
                    value={formData.end_date}
                    onChange={handleChange}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Feature Image</Label>
                <ImageUploader 
                  onImageSelected={handleImageSelected}
                  currentImage={formData.feature_image || undefined}
                  label="Upload Campaign Image"
                  aspectRatio="16:9"
                />
              </div>
              
              <Button
                type="submit"
                className="w-full bg-[#e51083] hover:bg-[#c50e73]"
              >
                {editingCampaign ? 'Update' : 'Add'} Campaign
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {campaigns.length > 0 ? (
          campaigns.map((campaign) => (
            <Card key={campaign.id} className="overflow-hidden">
              <CardContent className="p-0">
                {campaign.feature_image && (
                  <div className="relative w-full h-48">
                    <Image
                      src={campaign.feature_image}
                      alt={campaign.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-xs uppercase">
                      {campaign.urgency}
                    </div>
                  </div>
                )}
                <div className="p-6">
                  <h3 className="font-semibold text-lg mb-2">{campaign.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                    {campaign.description}
                  </p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm">
                      <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                      <span>{campaign.location || "Location not specified"}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Users className="h-4 w-4 mr-2 text-gray-500" />
                      <span>{campaign.beneficiaries || 0} beneficiaries</span>
                    </div>
                    {campaign.start_date && (
                      <div className="flex items-center text-sm">
                        <Clock className="h-4 w-4 mr-2 text-gray-500" />
                        <span>Started: {new Date(campaign.start_date).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleView(campaign)}
                      className="w-full bg-transparent"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(campaign)}
                      className="w-full bg-transparent"
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => setDeletingCampaignId(campaign.id)}
                      className="w-full"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center p-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              No campaigns found. Add your first campaign to get started.
            </p>
            <Button 
              onClick={() => {
                resetForm()
                setIsDialogOpen(true)
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Campaign
            </Button>
          </div>
        )}
      </div>
      
      {/* View Dialog */}
      {viewingCampaign && (
        <Dialog
          open={isViewDialogOpen}
          onOpenChange={(open) => {
            setIsViewDialogOpen(open)
            if (!open) setViewingCampaign(null)
          }}
        >
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Campaign Details</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              {viewingCampaign.feature_image && (
                <div className="relative w-full h-64 rounded-lg overflow-hidden">
                  <Image
                    src={viewingCampaign.feature_image}
                    alt={viewingCampaign.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-black bg-opacity-70 text-white px-4 py-1 rounded-full uppercase font-semibold">
                    {viewingCampaign.urgency}
                  </div>
                </div>
              )}
              
              <div>
                <h2 className="text-2xl font-bold">{viewingCampaign.title}</h2>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-semibold">Description</h3>
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                  {viewingCampaign.description}
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold">Details</h3>
                    <div className="mt-2 space-y-2">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                        <span>{viewingCampaign.location || "Location not specified"}</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-2 text-gray-500" />
                        <span>{viewingCampaign.beneficiaries || 0} beneficiaries</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold">Timeline</h3>
                    <div className="mt-2 space-y-2">
                      <div>
                        <strong>Start Date:</strong>{" "}
                        {viewingCampaign.start_date
                          ? new Date(viewingCampaign.start_date).toLocaleDateString()
                          : "Not specified"}
                      </div>
                      <div>
                        <strong>End Date:</strong>{" "}
                        {viewingCampaign.end_date
                          ? new Date(viewingCampaign.end_date).toLocaleDateString()
                          : "Not specified"}
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold">Related Content</h3>
                    <div className="mt-2">
                      <strong>Linked Blog Post:</strong>{" "}
                      {getLinkedBlogTitle(viewingCampaign.linked_blog)}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsViewDialogOpen(false)
                    setViewingCampaign(null)
                  }}
                >
                  Close
                </Button>
                <Button
                  variant="default"
                  onClick={() => {
                    setIsViewDialogOpen(false)
                    handleEdit(viewingCampaign)
                  }}
                >
                  Edit
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
      
      {/* Delete Confirmation Dialog */}
      <DeleteConfirmation
        isOpen={!!deletingCampaignId}
        onClose={() => setDeletingCampaignId(null)}
        onConfirm={handleDelete}
        itemType="campaign"
        itemName={campaigns.find(c => c.id === deletingCampaignId)?.title}
      />
    </div>
  )
}
