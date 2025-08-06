"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Plus, Eye, Edit, Trash2, Mail, Facebook, Instagram } from "lucide-react"
import Image from "next/image"
import { DeleteConfirmation } from "@/components/admin/delete-confirmation"
import { ImageUploader } from "@/components/admin/image-uploader"
import { DatabaseError } from "@/components/admin/database-error"

interface TeamMember {
  id: number;
  name: string;
  role: string;
  bio: string;
  email: string;
  image?: string;
  order_index: number;
  facebook?: string;
  instagram?: string;
  tiktok?: string;
}

export default function TeamMembersPage() {
  // State
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null)
  const [viewingMember, setViewingMember] = useState<TeamMember | null>(null)
  const [deletingMemberId, setDeletingMemberId] = useState<number | null>(null)
  
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    bio: "",
    email: "",
    image: "",
    facebook: "",
    instagram: "",
    tiktok: "",
  })
  
  const { toast } = useToast()
  
  // Fetch team members
  const fetchTeamMembers = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/team")
      if (!response.ok) throw new Error("Failed to fetch team members")
      const data = await response.json()
      setTeamMembers(data)
    } catch (error) {
      console.error("Error fetching team members:", error)
      setError("Failed to fetch team members from database")
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    fetchTeamMembers()
  }, [])
  
  // Handle form input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }
  
  // Handle image upload
  const handleImageSelected = (imageDataUrl: string) => {
    setFormData(prev => ({ ...prev, image: imageDataUrl }))
  }
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      // Validation
      if (!formData.name || !formData.role) {
        toast({
          title: "Missing Required Fields",
          description: "Name and Role are required for a team member.",
          variant: "destructive",
        });
        return;
      }
      
      const teamData = {
        name: formData.name,
        role: formData.role,
        bio: formData.bio,
        email: formData.email,
        image: formData.image,
        facebook: formData.facebook || null,
        instagram: formData.instagram || null,
        tiktok: formData.tiktok || null,
        order_index: editingMember?.order_index || teamMembers.length + 1,
        active: true,
      };
      
      let response;
      
      if (editingMember) {
        response = await fetch('/api/team', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingMember.id, ...teamData }),
        });
      } else {
        response = await fetch('/api/team', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(teamData),
        });
      }
      
      if (!response.ok) {
        throw new Error('Failed to save team member');
      }
      
      // Refresh the team members list
      fetchTeamMembers()
      
      // Reset form and close dialog
      resetForm()
      setIsDialogOpen(false)
      
      toast({
        title: `Team Member ${editingMember ? 'Updated' : 'Created'}`,
        description: `The team member was successfully ${editingMember ? 'updated' : 'created'}.`,
      })
      
    } catch (error) {
      console.error("Error saving team member:", error)
      toast({
        title: "Error",
        description: `Failed to ${editingMember ? 'update' : 'create'} team member. Please try again.`,
        variant: "destructive",
      })
    }
  }
  
  // Handle team member deletion
  const handleDelete = async () => {
    if (!deletingMemberId) return
    
    const response = await fetch(`/api/team?id=${deletingMemberId}`, {
      method: 'DELETE',
    })
    
    if (!response.ok) {
      throw new Error('Failed to delete team member')
    }
    
    // Update local state
    setTeamMembers(teamMembers.filter((item) => item.id !== deletingMemberId))
    setDeletingMemberId(null)
  }
  
  // Handle view button click
  const handleView = (member: TeamMember) => {
    setViewingMember(member)
    setIsViewDialogOpen(true)
  }
  
  // Handle edit button click
  const handleEdit = (member: TeamMember) => {
    setEditingMember(member)
    setFormData({
      name: member.name,
      role: member.role,
      bio: member.bio || "",
      email: member.email || "",
      image: member.image || "",
      facebook: member.facebook || "",
      instagram: member.instagram || "",
      tiktok: member.tiktok || "",
    })
    setIsDialogOpen(true)
  }
  
  // Reset form data
  const resetForm = () => {
    setFormData({
      name: "",
      role: "",
      bio: "",
      email: "",
      image: "",
      facebook: "",
      instagram: "",
      tiktok: "",
    })
    setEditingMember(null)
  }
  
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#e51083]"></div>
        <p className="ml-4 text-gray-600 dark:text-gray-400">
          Loading team members...
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
        <h1 className="text-3xl font-bold">Manage Team</h1>
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
              Add Team Member
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingMember ? 'Edit' : 'Add New'} Team Member</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="role">Role/Position</Label>
                <Input
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  name="bio"
                  rows={4}
                  value={formData.bio}
                  onChange={handleChange}
                />
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="facebook">Facebook Profile</Label>
                  <Input
                    id="facebook"
                    name="facebook"
                    value={formData.facebook}
                    onChange={handleChange}
                    placeholder="https://facebook.com/username"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="instagram">Instagram Profile</Label>
                  <Input
                    id="instagram"
                    name="instagram"
                    value={formData.instagram}
                    onChange={handleChange}
                    placeholder="https://instagram.com/username"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="tiktok">TikTok Profile</Label>
                  <Input
                    id="tiktok"
                    name="tiktok"
                    value={formData.tiktok}
                    onChange={handleChange}
                    placeholder="https://tiktok.com/@username"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Profile Image</Label>
                <ImageUploader 
                  onImageSelected={handleImageSelected}
                  currentImage={formData.image || undefined}
                  label="Upload Profile Image"
                  aspectRatio="1:1"
                />
              </div>
              
              <Button
                type="submit"
                className="w-full bg-[#e51083] hover:bg-[#c50e73]"
              >
                {editingMember ? 'Update' : 'Add'} Team Member
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teamMembers.length > 0 ? (
          teamMembers.map((member) => (
            <Card key={member.id} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="relative w-32 h-32 rounded-full overflow-hidden mx-auto mb-4">
                    <Image
                      src={member.image || "/placeholder-user.jpg"}
                      alt={member.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <h3 className="font-semibold text-lg">{member.name}</h3>
                  <p className="text-sm text-[#e51083] mb-2">{member.role}</p>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                    {member.bio || "No bio available"}
                  </p>
                  
                  {/* Social links */}
                  <div className="flex justify-center space-x-4 mb-4">
                    {member.email && (
                      <a 
                        href={`mailto:${member.email}`} 
                        className="text-gray-500 hover:text-[#e51083]"
                        aria-label="Email"
                      >
                        <Mail className="h-5 w-5" />
                      </a>
                    )}
                    {member.facebook && (
                      <a 
                        href={member.facebook} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-gray-500 hover:text-[#1877F2]"
                        aria-label="Facebook"
                      >
                        <Facebook className="h-5 w-5" />
                      </a>
                    )}
                    {member.instagram && (
                      <a 
                        href={member.instagram} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-gray-500 hover:text-[#C13584]"
                        aria-label="Instagram"
                      >
                        <Instagram className="h-5 w-5" />
                      </a>
                    )}
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleView(member)}
                      className="w-full bg-transparent"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(member)}
                      className="w-full bg-transparent"
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => setDeletingMemberId(member.id)}
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
              No team members found. Add your first team member to get started.
            </p>
            <Button 
              onClick={() => {
                resetForm()
                setIsDialogOpen(true)
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Team Member
            </Button>
          </div>
        )}
      </div>
      
      {/* View Dialog */}
      {viewingMember && (
        <Dialog
          open={isViewDialogOpen}
          onOpenChange={(open) => {
            setIsViewDialogOpen(open)
            if (!open) setViewingMember(null)
          }}
        >
          <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Team Member Details</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <div className="text-center">
                <div className="relative w-40 h-40 rounded-full overflow-hidden mx-auto mb-4">
                  <Image
                    src={viewingMember.image || "/placeholder-user.jpg"}
                    alt={viewingMember.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <h2 className="text-xl font-bold">{viewingMember.name}</h2>
                <p className="text-[#e51083]">{viewingMember.role}</p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold">Biography</h3>
                  <p className="text-gray-700 dark:text-gray-300 mt-1 whitespace-pre-wrap">
                    {viewingMember.bio || "No bio available."}
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold">Contact Information</h3>
                  <div className="mt-1">
                    <p className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      <span>{viewingMember.email || "No email provided."}</span>
                    </p>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold">Social Media</h3>
                  <div className="mt-1 space-y-2">
                    {viewingMember.facebook && (
                      <p className="flex items-center gap-2">
                        <Facebook className="h-4 w-4" />
                        <a 
                          href={viewingMember.facebook} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          Facebook Profile
                        </a>
                      </p>
                    )}
                    {viewingMember.instagram && (
                      <p className="flex items-center gap-2">
                        <Instagram className="h-4 w-4" />
                        <a 
                          href={viewingMember.instagram} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          Instagram Profile
                        </a>
                      </p>
                    )}
                    {!viewingMember.facebook && !viewingMember.instagram && (
                      <p className="text-gray-500">No social media profiles provided.</p>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsViewDialogOpen(false)
                    setViewingMember(null)
                  }}
                >
                  Close
                </Button>
                <Button
                  variant="default"
                  onClick={() => {
                    setIsViewDialogOpen(false)
                    handleEdit(viewingMember)
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
        isOpen={!!deletingMemberId}
        onClose={() => setDeletingMemberId(null)}
        onConfirm={handleDelete}
        itemType="team member"
        itemName={teamMembers.find(m => m.id === deletingMemberId)?.name}
      />
    </div>
  )
}
