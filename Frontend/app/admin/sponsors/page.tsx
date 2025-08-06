"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Plus, Eye, Edit, Trash2 } from "lucide-react"
import Image from "next/image"
import { DeleteConfirmation } from "@/components/admin/delete-confirmation"
import { ImageUploader } from "@/components/admin/image-uploader"
import { DatabaseError } from "@/components/admin/database-error"

interface Sponsor {
  id: number;
  name: string;
  logo: string | null;
  website: string | null;
  created_at: Date;
}

export default function SponsorsPage() {
  // State
  const [sponsors, setSponsors] = useState<Sponsor[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [editingSponsor, setEditingSponsor] = useState<Sponsor | null>(null)
  const [viewingSponsor, setViewingSponsor] = useState<Sponsor | null>(null)
  const [deletingSponsorId, setDeletingSponsorId] = useState<number | null>(null)
  
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    logo: "",
    website: "",
  })
  
  const { toast } = useToast()
  
  // Fetch sponsors
  const fetchSponsors = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/sponsors")
      if (!response.ok) throw new Error("Failed to fetch sponsors")
      const data = await response.json()
      setSponsors(data)
    } catch (error) {
      console.error("Error fetching sponsors:", error)
      setError("Failed to fetch sponsors")
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    fetchSponsors()
  }, [])
  
  // Handle form input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }
  
  // Handle image upload
  const handleImageSelected = (imageDataUrl: string) => {
    setFormData(prev => ({ ...prev, logo: imageDataUrl }))
  }
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const sponsorData = {
        name: formData.name,
        logo: formData.logo || null,
        website: formData.website || null,
      }
      
      let response;
      
      if (editingSponsor) {
        // Update existing sponsor
        response = await fetch(`/api/sponsors?id=${editingSponsor.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(sponsorData),
        })
      } else {
        // Create new sponsor
        response = await fetch('/api/sponsors', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(sponsorData),
        })
      }
      
      if (!response.ok) {
        throw new Error(`Failed to ${editingSponsor ? 'update' : 'create'} sponsor`)
      }
      
      // Refresh the sponsors list
      fetchSponsors()
      
      // Reset form and close dialog
      resetForm()
      setIsDialogOpen(false)
      
      toast({
        title: `Sponsor ${editingSponsor ? 'Updated' : 'Created'}`,
        description: `The sponsor was successfully ${editingSponsor ? 'updated' : 'created'}.`,
      })
      
    } catch (error) {
      console.error("Error saving sponsor:", error)
      toast({
        title: "Error",
        description: `Failed to ${editingSponsor ? 'update' : 'create'} sponsor. Please try again.`,
        variant: "destructive",
      })
    }
  }
  
  // Handle sponsor deletion
  const handleDelete = async () => {
    if (!deletingSponsorId) return
    
    const response = await fetch(`/api/sponsors?id=${deletingSponsorId}`, {
      method: 'DELETE',
    })
    
    if (!response.ok) {
      throw new Error('Failed to delete sponsor')
    }
    
    // Update local state
    setSponsors(sponsors.filter((item) => item.id !== deletingSponsorId))
    setDeletingSponsorId(null)
  }
  
  // Handle view button click
  const handleView = (sponsor: Sponsor) => {
    setViewingSponsor(sponsor)
    setIsViewDialogOpen(true)
  }
  
  // Handle edit button click
  const handleEdit = (sponsor: Sponsor) => {
    setEditingSponsor(sponsor)
    setFormData({
      name: sponsor.name,
      logo: sponsor.logo || "",
      website: sponsor.website || "",
    })
    setIsDialogOpen(true)
  }
  
  // Reset form data
  const resetForm = () => {
    setFormData({
      name: "",
      logo: "",
      website: "",
    })
    setEditingSponsor(null)
  }
  
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#e51083]"></div>
        <p className="ml-4 text-gray-600 dark:text-gray-400">
          Loading sponsors...
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
        <h1 className="text-3xl font-bold">Manage Sponsors</h1>
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
              Add Sponsor
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingSponsor ? 'Edit' : 'Add New'} Sponsor</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Sponsor Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="website">Website URL</Label>
                <Input
                  id="website"
                  name="website"
                  type="url"
                  value={formData.website}
                  onChange={handleChange}
                  placeholder="https://example.com"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Logo</Label>
                <ImageUploader 
                  onImageSelected={handleImageSelected}
                  currentImage={formData.logo || undefined}
                  label="Upload Logo"
                  aspectRatio="2:1"
                />
              </div>
              
              <Button
                type="submit"
                className="w-full bg-[#e51083] hover:bg-[#c50e73]"
              >
                {editingSponsor ? 'Update' : 'Add'} Sponsor
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {sponsors.length > 0 ? (
          sponsors.map((sponsor) => (
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
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 break-all">
                    {sponsor.website}
                  </p>
                  <div className="flex flex-col gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleView(sponsor)}
                      className="w-full bg-transparent"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(sponsor)}
                      className="w-full bg-transparent"
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => setDeletingSponsorId(sponsor.id)}
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
              No sponsors found. Add your first sponsor to get started.
            </p>
            <Button 
              onClick={() => {
                resetForm()
                setIsDialogOpen(true)
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Sponsor
            </Button>
          </div>
        )}
      </div>
      
      {/* View Dialog */}
      {viewingSponsor && (
        <Dialog
          open={isViewDialogOpen}
          onOpenChange={(open) => {
            setIsViewDialogOpen(open)
            if (!open) setViewingSponsor(null)
          }}
        >
          <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Sponsor Details</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-semibold">Sponsor Information</h3>
                <div className="text-sm">
                  <div>
                    <strong>Name:</strong> {viewingSponsor.name}
                  </div>
                  <div>
                    <strong>Website:</strong> {viewingSponsor.website || "N/A"}
                  </div>
                  <div>
                    <strong>Added:</strong> {new Date(viewingSponsor.created_at).toLocaleDateString()}
                  </div>
                </div>
                {viewingSponsor.logo && (
                  <div>
                    <strong>Logo:</strong>
                    <Image
                      src={viewingSponsor.logo || "/placeholder.svg"}
                      alt={viewingSponsor.name}
                      width={200}
                      height={120}
                      className="mt-2 rounded border object-contain"
                    />
                  </div>
                )}
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsViewDialogOpen(false)
                    setViewingSponsor(null)
                  }}
                >
                  Close
                </Button>
                <Button
                  variant="default"
                  onClick={() => {
                    setIsViewDialogOpen(false)
                    handleEdit(viewingSponsor)
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
        isOpen={!!deletingSponsorId}
        onClose={() => setDeletingSponsorId(null)}
        onConfirm={handleDelete}
        itemType="sponsor"
        itemName={sponsors.find(s => s.id === deletingSponsorId)?.name}
      />
    </div>
  )
}
