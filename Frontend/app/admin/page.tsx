"use client"

import type React from "react";

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
  AlertCircle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { RichTextEditor } from "@/components/rich-text-editor";

// Database Types
interface Project {
  id: number;
  title: string;
  description: string;
  location: string;
  status: string;
  progress: number;
  budget: number;
  raised: number;
  beneficiaries: number;
  start_date: string;
  featured_image?: string;
  created_at: string;
  updated_at: string;
}

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  featured_image?: string;
  published: boolean;
  created_at: string;
  updated_at: string;
}

interface TeamMember {
  id: number;
  name: string;
  role: string;
  bio: string;
  email: string;
  image?: string;
  order_index: number;
}

interface GalleryImage {
  id: number;
  title: string;
  description: string;
  category: string;
  image_url: string;
  alt_text: string;
  order_index: number;
}

interface DatabaseErrorProps {
  message: string;
}

function DatabaseError({ message }: DatabaseErrorProps) {
  return (
    <div className="flex items-center justify-center p-8 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
      <div className="text-center">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-red-700 dark:text-red-400 mb-2">
          Database Error
        </h3>
        <p className="text-red-600 dark:text-red-300 mb-4">{message}</p>
        <p className="text-sm text-red-500 dark:text-red-400">
          Please check your database connection or contact the administrator.
        </p>
      </div>
    </div>
  );
}

// Mock data for features not yet implemented (will be replaced gradually)

const mockStories = [
  {
    id: 1,
    title: "Maria's Journey to Confidence",
    content:
      "How our program helped Maria overcome period poverty and excel in school.",
    beneficiaryName: "Maria Wanjiku",
    beneficiaryAge: "16",
    location: "Kibera, Nairobi",
    featureImage: "/placeholder.svg?height=300&width=400",
  },
];

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
];

const mockCategories = [
  {
    id: 1,
    name: "Education",
    description: "Educational content and resources",
  },
  {
    id: 2,
    name: "Success Stories",
    description: "Inspiring success stories from beneficiaries",
  },
  { id: 3, name: "Research", description: "Research and data-driven content" },
  {
    id: 4,
    name: "Community",
    description: "Community engagement and outreach",
  },
  {
    id: 5,
    name: "Empowerment",
    description: "Women and girls empowerment content",
  },
  {
    id: 6,
    name: "Distribution",
    description: "Product distribution activities",
  },
];

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [editType, setEditType] = useState<string>("");
  const [viewingItem, setViewingItem] = useState<any>(null);
  const [viewType, setViewType] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  // Database-driven state
  const [projects, setProjects] = useState<Project[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);

  // Mock state for features not yet implemented
  const [partnershipApplications, setPartnershipApplications] = useState<any[]>([])
  const [volunteerApplications, setVolunteerApplications] = useState<any[]>([])
  const [categories, setCategories] = useState(mockCategories)
const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [stories, setStories] = useState(mockStories)
  const [sponsors, setSponsors] = useState(mockSponsors)

  // Form states for all content types
  const [newBlog, setNewBlog] = useState({
    title: "",
    content: "",
    category: "",
    excerpt: "",
    author: "",
    featured_image: "",
    images: [] as string[],
    slug: "",
    published: false,
  });

  const [newProject, setNewProject] = useState({
    title: "",
    description: "",
    location: "",
    beneficiaries: "",
    status: "completed",
    featured_image: "",
    linked_blog: "",
    progress: "",
    start_date: "",
    end_date: "",
  });

const [newCampaign, setNewCampaign] = useState({
  title: "",
  description: "",
  location: "",
  beneficiaries: "",
  urgency: "active",
  feature_image: "",
  linked_blog: "",
})

  const [newStory, setNewStory] = useState({
    title: "",
    content: "",
    beneficiaryName: "",
    beneficiaryAge: "",
    location: "",
    featureImage: "",
  });

  const [newTeamMember, setNewTeamMember] = useState({
    name: "",
    role: "",
    bio: "",
    email: "",
    image: "",
    facebook: "",
    instagram: "",
    tiktok: "",
  });

  const [newSponsor, setNewSponsor] = useState({
    name: "",
    logo: "",
    website: "",
  });

  const [newGalleryImage, setNewGalleryImage] = useState<{
    category: string;
    image: string;
  }>({
    category: "",
    image: "",
  });

  const [newCategory, setNewCategory] = useState({
    name: "",
    description: "",
  });

  const { toast } = useToast();
  const router = useRouter();

  // Database fetching functions
const fetchCampaigns = async () => {
  try {
    const response = await fetch("/api/campaigns");
    if (!response.ok) throw new Error("Failed to fetch campaigns");
    const data = await response.json();
    setCampaigns(data);
  } catch (error) {
    console.error("Error fetching campaigns:", error);
    setError("Failed to load campaigns from database");
  }
};
  const fetchProjects = async () => {
    try {
      const response = await fetch("/api/projects");
      if (!response.ok) throw new Error("Failed to fetch projects");
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error("Error fetching projects:", error);
      setError("Failed to load projects from database");
    }
  };

  const fetchBlogPosts = async () => {
    try {
      const response = await fetch("/api/blog?admin=true");
      if (!response.ok) throw new Error("Failed to fetch blog posts");
      const data = await response.json();
      setBlogPosts(data);
    } catch (error) {
      console.error("Error fetching blog posts:", error);
      setError("Failed to load blog posts from database");
    }
  };

  const fetchStories = async () => {
    try {
      const response = await fetch("/api/blog?admin=true");
      if (!response.ok) throw new Error("Failed to fetch stories");
      const data = await response.json();
      // Filter blog posts that are success stories
      const storiesData = data
        .filter((post: any) => post.category === "Success Stories")
        .map((post: any) => {
          // Try to extract beneficiary info from content
          const lines = post.content.split("\n");
          const beneficiaryLine = lines.find((line: string) =>
            line.includes("**Beneficiary:**")
          );
          const ageLine = lines.find((line: string) =>
            line.includes("**Age:**")
          );
          const locationLine = lines.find((line: string) =>
            line.includes("**Location:**")
          );

          return {
            id: post.id,
            title: post.title,
            content: lines[0] || post.excerpt || "", // First line as main content
            beneficiaryName: beneficiaryLine
              ? beneficiaryLine.replace("**Beneficiary:**", "").trim()
              : "",
            beneficiaryAge: ageLine
              ? ageLine.replace("**Age:**", "").trim()
              : "",
            location: locationLine
              ? locationLine.replace("**Location:**", "").trim()
              : "",
            featureImage: post.featured_image || "",
          };
        });
      setStories(storiesData);
    } catch (error) {
      console.error("Error fetching stories:", error);
      setError("Failed to load stories from database");
    }
  };

  const fetchTeamMembers = async () => {
    try {
      const response = await fetch("/api/team");
      if (!response.ok) throw new Error("Failed to fetch team members");
      const data = await response.json();
      setTeamMembers(data);
    } catch (error) {
      console.error("Error fetching team members:", error);
      setError("Failed to load team members from database");
    }
  };

  const fetchGalleryImages = async () => {
    try {
      const response = await fetch("/api/gallery");
      if (!response.ok) throw new Error("Failed to fetch gallery images");
      const data = await response.json();
      setGalleryImages(data);
    } catch (error) {
      console.error("Error fetching gallery images:", error);
      setError("Failed to load gallery images from database");
    }
  };

  const loadDatabaseData = async () => {
    setLoading(true);
    setError(null);
    try {
      await Promise.all([
        fetchCampaigns(),
        fetchProjects(),
        fetchBlogPosts(),
        fetchStories(),
        fetchTeamMembers(),
        fetchGalleryImages(),
      ]);
    } catch (error) {
      console.error("Error loading database data:", error);
      setError("Failed to connect to database");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const authStatus = localStorage.getItem("adminAuth");
    if (authStatus === "true") {
      setIsAuthenticated(true);
      loadDatabaseData();
      // Load applications from localStorage
      const partners = JSON.parse(
        localStorage.getItem("partnershipApplications") || "[]"
      );
      const volunteers = JSON.parse(
        localStorage.getItem("volunteerApplications") || "[]"
      );
      setPartnershipApplications(partners);
      setVolunteerApplications(volunteers);
    } else {
      router.push("/admin/login");
    }
  }, [router]);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      localStorage.removeItem("adminAuth");
      localStorage.removeItem("adminUser");
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out from the database.",
      });
      router.push("/admin/login");
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        title: "Logout Error",
        description:
          "There was an error logging out, but local session cleared.",
      });
      router.push("/admin/login");
    }
  };

  const handleImageUpload = (setter: Function, field?: string) => {
    // Create a file input element
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.multiple = !field; // Allow multiple files only when adding to images array

    input.onchange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      const files = target.files;

      if (!files || files.length === 0) return;

      // Process each selected file
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          const imageDataUrl = event.target?.result as string;

          // Store in localStorage with a unique key
          const imageKey = `admin_image_${Date.now()}_${Math.random()
            .toString(36)
            .substr(2, 9)}`;
          try {
            localStorage.setItem(imageKey, imageDataUrl);

            if (field) {
              setter((prev: any) => ({ ...prev, [field]: imageDataUrl }));
            } else {
              setter((prev: any) => ({
                ...prev,
                images: [...prev.images, imageDataUrl],
              }));
            }

            toast({
              title: "Image Uploaded",
              description: `Image "${file.name}" has been uploaded and stored locally.`,
            });
          } catch (error) {
            console.error("Error storing image in localStorage:", error);
            toast({
              title: "Upload Error",
              description: "Failed to store image. File may be too large.",
              variant: "destructive",
            });
          }
        };

        reader.onerror = () => {
          toast({
            title: "Upload Error",
            description: "Failed to read the selected file.",
            variant: "destructive",
          });
        };

        reader.readAsDataURL(file);
      });
    };

    // Trigger the file picker
    input.click();
  };

  const handleView = (item: any, type: string) => {
    setViewingItem(item);
    setViewType(type);
    setIsViewDialogOpen(true);
  };

  const handleEdit = (item: any, type: string) => {
    setEditingItem(item);
    setEditType(type);

    // Populate form based on type
    switch (type) {
      case "campaign":
        setNewCampaign({
          title: item.title,
          description: item.description,
          location: item.location,
          beneficiaries: item.beneficiaries?.toString() || "",
          urgency: item.urgency?.toLowerCase() || "",
          feature_image: item.feature_image || "",
          linked_blog: item.linked_blog?.toString() || "",
        })
        break
      case "project":
        setNewProject({
          title: item.title,
          description: item.description,
          location: item.location,
          beneficiaries: item.beneficiaries?.toString() || "",
          status: item.status?.toLowerCase() || "",
          featured_image: item.featured_image || "",
          linked_blog: item.linked_blog?.toString() || "",
          progress: item.progress?.toString() || "",
          start_date: item.start_date || "",
          end_date: item.end_date || "",
        });
        break;
      case "story":
        setNewStory({
          title: item.title,
          content: item.content,
          beneficiaryName: item.beneficiaryName,
          beneficiaryAge: item.beneficiaryAge,
          location: item.location,
          featureImage: item.featureImage,
        });
        break;
      case "blog":
        setNewBlog({
          title: item.title,
          content: item.content,
          category: item.category,
          excerpt: item.excerpt,
          author: item.author,
          featured_image: item.featured_image || "",
          images: item.images || [],
          slug: item.slug || "",
          published: item.published || false,
        });
        break;
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
        });
        break;
      case "sponsor":
        setNewSponsor({
          name: item.name,
          logo: item.logo,
          website: item.website,
        });
        break;
      case "gallery":
        setNewGalleryImage({
          category: item.category,
          image: item.image,
        });
        break;
      case "category":
        setNewCategory({
          name: item.name,
          description: item.description,
        });
        break;
    }
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number, type: string) => {
    if (window.confirm(`Are you sure you want to delete this ${type}?`)) {
      try {
        switch (type) {
          case "partnership":
            const updatedPartners = partnershipApplications.filter(
              (app) => app.id !== id
            );
            setPartnershipApplications(updatedPartners);
            localStorage.setItem(
              "partnershipApplications",
              JSON.stringify(updatedPartners)
            );
            break;
          case "volunteer":
            const updatedVolunteers = volunteerApplications.filter(
              (app) => app.id !== id
            );
            setVolunteerApplications(updatedVolunteers);
            localStorage.setItem(
              "volunteerApplications",
              JSON.stringify(updatedVolunteers)
            );
            break;
          case "category":
            setCategories(categories.filter((cat) => cat.id !== id));
            break;
          case "campaign":
            setCampaigns(campaigns.filter((item) => item.id !== id))
            break
          case "project":
            // Delete from database
            const response = await fetch(`/api/projects?id=${id}`, {
              method: 'DELETE',
            });

            if (!response.ok) {
              throw new Error('Failed to delete project');
            }

            // Update local state
            setProjects(projects.filter((item) => item.id !== id));
            break;
          case "story":
            // Delete story from database (as blog post)
            const storyResponse = await fetch(`/api/blog?id=${id}`, {
              method: "DELETE",
            });

            if (!storyResponse.ok) {
              throw new Error("Failed to delete story");
            }

            // Update local state
            setStories(stories.filter((item) => item.id !== id));
            break;
          case "blog":
            // Delete blog post from database
            const blogResponse = await fetch(`/api/blog?id=${id}`, {
              method: "DELETE",
            });

            if (!blogResponse.ok) {
              throw new Error("Failed to delete blog post");
            }

            // Update local state
            setBlogPosts(blogPosts.filter((item) => item.id !== id));
            break;
          case "team":
            setTeamMembers(teamMembers.filter((item) => item.id !== id));
            break;
          case "sponsor":
            setSponsors(sponsors.filter((item) => item.id !== id));
            break;
          case "gallery":
            setGalleryImages(galleryImages.filter((item) => item.id !== id));
            break;
        }

        toast({
          title: "Item Deleted",
          description: `${type} has been deleted successfully.`,
        });
      } catch (error) {
        console.error("Error deleting item:", error);
        toast({
          title: "Error",
          description: `Failed to delete ${type}. Please try again.`,
          variant: "destructive",
        });
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent, type: string) => {
    e.preventDefault();

    const newId = editingItem?.id || Date.now();

    switch (type) {
      case "Campaign":
        try {
          const campaignData = {
            title: newCampaign.title,
            description: newCampaign.description,
            location: newCampaign.location,
            urgency: newCampaign.urgency,
            beneficiaries: newCampaign.beneficiaries !== "" ? Number(newCampaign.beneficiaries) : 0,
            linked_blog: newCampaign.linked_blog !== "" ? Number(newCampaign.linked_blog) : null,
            feature_image: newCampaign.feature_image !== "" ? newCampaign.feature_image : null,
          };
          let response;
          if (editingItem) {
            response = await fetch('/api/campaigns', {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ id: editingItem.id, ...campaignData }),
            });
          } else {
            response = await fetch('/api/campaigns', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(campaignData),
            });
          }
          if (!response.ok) {
            throw new Error('Failed to save campaign');
          }
          const savedCampaign = await response.json();
          if (editingItem) {
            setCampaigns(campaigns.map((item) => (item.id === editingItem.id ? savedCampaign : item)));
          } else {
            setCampaigns([...campaigns, savedCampaign]);
          }
          setNewCampaign({
            title: "",
            description: "",
            location: "",
            beneficiaries: "",
            urgency: "active",
            feature_image: "",
            linked_blog: "",
          });
        } catch (error) {
          console.error('Error saving campaign:', error);
          toast({
            title: "Error",
            description: "Failed to save campaign. Please try again.",
            variant: "destructive",
          });
          return;
        }
        break

      case "Project":
        try {
          const projectData = {
            title: newProject.title,
            description: newProject.description,
            location: newProject.location,
            status: newProject.status,
            beneficiaries: newProject.beneficiaries ? Number.parseInt(newProject.beneficiaries) : null,
            featured_image: newProject.featured_image,
            progress: Number.parseInt(newProject.progress) || 0,
            start_date: newProject.start_date || null,
          }

          if (editingItem) {
            // Update existing project
            const response = await fetch("/api/projects", {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                id: editingItem.id,
                ...projectData,
              }),
            });

            if (!response.ok) {
              throw new Error("Failed to update project");
            }

            const updatedProject = await response.json();
            setProjects(
              projects.map((item) =>
                item.id === editingItem.id ? updatedProject : item
              )
            );
          } else {
            // Create new project
            const response = await fetch("/api/projects", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(projectData),
            });

            if (!response.ok) {
              throw new Error("Failed to create project");
            }

            const newProjectData = await response.json();
            setProjects([...projects, newProjectData]);
          }

          setNewProject({
            title: "",
            description: "",
            location: "",
            beneficiaries: "",
            status: "completed",
            featured_image: "",
            linked_blog: "",
            progress: "",
            start_date: "",
            end_date: "",
          });
        } catch (error) {
          console.error("Error saving project:", error);
          toast({
            title: "Error",
            description: "Failed to save project. Please try again.",
            variant: "destructive",
          });
          return; // Don't close dialog or show success message
        }
        break;

      case "Story":
        try {
          // Create a comprehensive story content that includes the structured data
          const storyContent = `${newStory.content}

**Beneficiary:** ${newStory.beneficiaryName}
**Age:** ${newStory.beneficiaryAge}
**Location:** ${newStory.location}`;

          const storyData = {
            title: newStory.title,
            content: storyContent,
            category: "Success Stories",
            excerpt: newStory.content.substring(0, 150) + "...",
            author: "Bidii Team",
            slug: newStory.title.toLowerCase().replace(/\s+/g, "-"),
            published: true,
            featured_image: newStory.featureImage,
          };

          if (editingItem) {
            // Update existing story (as blog post)
            const response = await fetch("/api/blog", {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                id: editingItem.id,
                ...storyData,
              }),
            });

            if (!response.ok) {
              throw new Error("Failed to update story");
            }

            const updatedStory = await response.json();
            // Update local stories state
            setStories(
              stories.map((item) =>
                item.id === editingItem.id
                  ? {
                      id: updatedStory.id,
                      title: newStory.title,
                      content: newStory.content,
                      beneficiaryName: newStory.beneficiaryName,
                      beneficiaryAge: newStory.beneficiaryAge,
                      location: newStory.location,
                      featureImage: newStory.featureImage,
                    }
                  : item
              )
            );
          } else {
            // Create new story (as blog post)
            const response = await fetch("/api/blog", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(storyData),
            });

            if (!response.ok) {
              throw new Error("Failed to create story");
            }

            const newStoryData = await response.json();
            // Add to local stories state
            setStories([
              ...stories,
              {
                id: newStoryData.id,
                title: newStory.title,
                content: newStory.content,
                beneficiaryName: newStory.beneficiaryName,
                beneficiaryAge: newStory.beneficiaryAge,
                location: newStory.location,
                featureImage: newStory.featureImage,
              },
            ]);
          }

          setNewStory({
            title: "",
            content: "",
            beneficiaryName: "",
            beneficiaryAge: "",
            location: "",
            featureImage: "",
          });
        } catch (error) {
          console.error("Error saving story:", error);
          toast({
            title: "Error",
            description: "Failed to save story. Please try again.",
            variant: "destructive",
          });
          return; // Don't close dialog or show success message
        }
        break;

      case "Blog":
        try {
          const blogData = {
            title: newBlog.title,
            content: newBlog.content,
            category: newBlog.category,
            excerpt: newBlog.excerpt,
            author: newBlog.author,
            slug:
              newBlog.slug || newBlog.title.toLowerCase().replace(/\s+/g, "-"),
            published: newBlog.published,
            featured_image: newBlog.featured_image,
          };

          if (editingItem) {
            // Update existing blog post
            const response = await fetch("/api/blog", {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                id: editingItem.id,
                ...blogData,
              }),
            });

            if (!response.ok) {
              throw new Error("Failed to update blog post");
            }

            const updatedBlogPost = await response.json();
            setBlogPosts(
              blogPosts.map((item) =>
                item.id === editingItem.id ? updatedBlogPost : item
              )
            );
          } else {
            // Create new blog post
            const response = await fetch("/api/blog", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(blogData),
            });

            if (!response.ok) {
              throw new Error("Failed to create blog post");
            }

            const newBlogPost = await response.json();
            setBlogPosts([...blogPosts, newBlogPost]);
          }

          setNewBlog({
            title: "",
            content: "",
            category: "",
            excerpt: "",
            author: "",
            featured_image: "",
            images: [],
            slug: "",
            published: false,
          });
        } catch (error) {
          console.error("Error saving blog post:", error);
          toast({
            title: "Error",
            description: "Failed to save blog post. Please try again.",
            variant: "destructive",
          });
          return; // Don't close dialog or show success message
        }
        break;

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
          order_index: teamMembers.length + 1,
        };
        if (editingItem) {
          setTeamMembers(
            teamMembers.map((item) =>
              item.id === editingItem.id ? teamData : item
            )
          );
        } else {
          setTeamMembers([...teamMembers, teamData]);
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
        });
        break;

      case "Sponsor":
        const sponsorData = {
          id: newId,
          name: newSponsor.name,
          logo: newSponsor.logo,
          website: newSponsor.website,
        };
        if (editingItem) {
          setSponsors(
            sponsors.map((item) =>
              item.id === editingItem.id ? sponsorData : item
            )
          );
        } else {
          setSponsors([...sponsors, sponsorData]);
        }
        setNewSponsor({
          name: "",
          logo: "",
          website: "",
        });
        break;

      case "Gallery Image":
        const galleryData = {
          id: newId,
          title: `${newGalleryImage.category} Image`,
          category: newGalleryImage.category,
          description: `${newGalleryImage.category} category image`,
          image: newGalleryImage.image,
          image_url: newGalleryImage.image,
          alt_text: `${newGalleryImage.category} Image`,
          order_index: galleryImages.length + 1,
        };
        if (editingItem) {
          setGalleryImages(
            galleryImages.map((item) =>
              item.id === editingItem.id ? galleryData : item
            )
          );
        } else {
          setGalleryImages([...galleryImages, galleryData]);
        }
        setNewGalleryImage({
          category: "",
          image: "",
        });
        break;

      case "Category":
        const categoryData = {
          id: newId,
          name: newCategory.name,
          description: newCategory.description,
        };
        if (editingItem) {
          setCategories(
            categories.map((cat) =>
              cat.id === editingItem.id ? categoryData : cat
            )
          );
        } else {
          setCategories([...categories, categoryData]);
        }
        setNewCategory({ name: "", description: "" });
        break;
    }

    toast({
      title: `${type} ${editingItem ? "Updated" : "Created"}`,
      description: `${type} has been ${
        editingItem ? "updated" : "created"
      } successfully.`,
    });

    setEditingItem(null);
    setEditType("");
    setIsDialogOpen(false);
  };

  const resetForms = () => {
    setNewCampaign({
      title: "",
      description: "",
      location: "",
      beneficiaries: "",
      urgency: "active",
      feature_image: "",
      linked_blog: "",
    })
    setNewProject({
      title: "",
      description: "",
      location: "",
      beneficiaries: "",
      status: "completed",
      featured_image: "",
      linked_blog: "",
      progress: "",
      start_date: "",
      end_date: "",
    });
    setNewStory({
      title: "",
      content: "",
      beneficiaryName: "",
      beneficiaryAge: "",
      location: "",
      featureImage: "",
    });
    setNewBlog({
      title: "",
      content: "",
      category: "",
      excerpt: "",
      author: "",
      featured_image: "",
      images: [],
      slug: "",
      published: false,
    });
    setNewTeamMember({
      name: "",
      role: "",
      bio: "",
      email: "",
      facebook: "",
      instagram: "",
      tiktok: "",
      image: "",
    });
    setNewSponsor({
      name: "",
      logo: "",
      website: "",
    });
    setNewGalleryImage({
      category: "",
      image: "",
    });
    setNewCategory({ name: "", description: "" });
    setEditingItem(null);
    setEditType("");
    setIsDialogOpen(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#e51083]"></div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="pt-16 min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
              <p className="text-gray-600 dark:text-gray-400">
                Loading database content...
              </p>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="flex items-center gap-2 bg-transparent"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#e51083]"></div>
            <p className="ml-4 text-gray-600 dark:text-gray-400">
              Loading database content...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your database-driven content, projects, and team
            </p>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="flex items-center gap-2 bg-transparent"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>

        {error && (
          <div className="mb-8">
            <DatabaseError message={error} />
          </div>
        )}

        {/* Stats Overview - Database-driven */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-6 mb-8">
          <Card className="hover:scale-105 transition-transform duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Mock Campaigns
                  </p>
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
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Database Projects
                  </p>
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
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Mock Stories
                  </p>
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
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Database Blogs
                  </p>
                  <p className="text-2xl font-bold">{blogPosts.length}</p>
                </div>
                <BookOpen className="h-8 w-8 text-[#e51083]" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:scale-105 transition-transform duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Partnership Apps
                  </p>
                  <p className="text-2xl font-bold">
                    {partnershipApplications.length}
                  </p>
                </div>
                <Building className="h-8 w-8 text-[#e51083]" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:scale-105 transition-transform duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Volunteer Apps
                  </p>
                  <p className="text-2xl font-bold">
                    {volunteerApplications.length}
                  </p>
                </div>
                <Users className="h-8 w-8 text-[#e51083]" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="projects" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-9">
            <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
            <TabsTrigger value="projects">DB Projects</TabsTrigger>
            <TabsTrigger value="stories">Stories</TabsTrigger>
            <TabsTrigger value="blogs">DB Blogs</TabsTrigger>
            <TabsTrigger value="team">DB Team</TabsTrigger>
            <TabsTrigger value="sponsors">Sponsors</TabsTrigger>
            <TabsTrigger value="gallery">DB Gallery</TabsTrigger>
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
                  setIsDialogOpen(open);
                  if (!open) {
                    resetForms();
                    setEditType("");
                  }
                }}
              >
                <DialogTrigger asChild>
                  <Button
                    onClick={() => {
                      resetForms();
                      setEditType("");
                      setIsDialogOpen(true);
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
                          onChange={(e) =>
                            setNewCampaign((prev) => ({
                              ...prev,
                              title: e.target.value,
                            }))
                          }
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="campaign-location">Location</Label>
                        <Input
                          id="campaign-location"
                          value={newCampaign.location}
                          onChange={(e) =>
                            setNewCampaign((prev) => ({
                              ...prev,
                              location: e.target.value,
                            }))
                          }
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="campaign-beneficiaries">
                          Beneficiaries
                        </Label>
                        <Input
                          id="campaign-beneficiaries"
                          type="number"
                          value={newCampaign.beneficiaries}
                          onChange={(e) =>
                            setNewCampaign((prev) => ({
                              ...prev,
                              beneficiaries: e.target.value,
                            }))
                          }
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="campaign-urgency">Urgency Level</Label>
                        <Select
                          value={newCampaign.urgency}
                          onValueChange={(value) =>
                            setNewCampaign((prev) => ({
                              ...prev,
                              urgency: value,
                            }))
                          }
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
                      <Label htmlFor="campaign-linked-blog">
                        Link to Blog Post
                      </Label>
                      <Select
                        value={newCampaign.linkedBlog}
                        onValueChange={(value) => setNewCampaign((prev) => ({ ...prev, linkedBlog: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a blog post" />
                        </SelectTrigger>
                        <SelectContent>
                          {blogPosts.map((blog) => (
                            <SelectItem
                              key={blog.id}
                              value={blog.id.toString()}
                            >
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
                        onChange={(e) =>
                          setNewCampaign((prev) => ({
                            ...prev,
                            description: e.target.value,
                          }))
                        }
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Featured Image</Label>
                      <p className="text-xs text-gray-500">
                        Recommended: 1200x800px (3:2 aspect ratio)
                      </p>
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
                        {newCampaign.feature_image && (
                          <Image
                            src={newCampaign.feature_image || "/placeholder.svg"}
                            alt="Featured"
                            width={100}
                            height={60}
                            className="rounded border"
                          />
                        )}
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-[#e51083] hover:bg-[#c50e73]"
                    >
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
                      src={campaign.feature_image || "/placeholder.svg"}
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
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                      {campaign.description}
                    </p>
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
                        className="flex-1 h-9 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 bg-transparent rounded-md font-medium transition-all duration-200 hover:scale-[0.98]"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(campaign, "campaign")}
                        className="flex-1 h-9 border border-blue-200 dark:border-blue-700 text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-800/20 bg-transparent rounded-md font-medium transition-all duration-200 hover:scale-[0.98]"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(campaign.id, "campaign")}
                        className="flex-1 h-9 bg-red-500 hover:bg-red-600 text-white rounded-md font-medium transition-all duration-200 hover:scale-[0.98] focus:ring-2 focus:ring-red-500/20"
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
                  setIsDialogOpen(open);
                  if (!open) {
                    resetForms();
                    setEditType("");
                  }
                }}
              >
                <DialogTrigger asChild>
                  <Button
                    onClick={() => {
                      resetForms();
                      setEditType("");
                      setIsDialogOpen(true);
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
                  <form
                    onSubmit={(e) => handleSubmit(e, "Project")}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="project-title">Project Title</Label>
                        <Input
                          id="project-title"
                          value={newProject.title}
                          onChange={(e) =>
                            setNewProject((prev) => ({
                              ...prev,
                              title: e.target.value,
                            }))
                          }
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="project-location">Location</Label>
                        <Input
                          id="project-location"
                          value={newProject.location}
                          onChange={(e) =>
                            setNewProject((prev) => ({
                              ...prev,
                              location: e.target.value,
                            }))
                          }
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="project-beneficiaries">
                          Beneficiaries
                        </Label>
                        <Input
                          id="project-beneficiaries"
                          type="number"
                          value={newProject.beneficiaries}
                          onChange={(e) =>
                            setNewProject((prev) => ({
                              ...prev,
                              beneficiaries: e.target.value,
                            }))
                          }
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="project-status">Status</Label>
                        <Select
                          value={newProject.status}
                          onValueChange={(value) =>
                            setNewProject((prev) => ({
                              ...prev,
                              status: value,
                            }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="in-progress">
                              In Progress
                            </SelectItem>
                            <SelectItem value="planned">Planned</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="project-start-date">Start Date</Label>
                      <Input
                        id="project-start-date"
                        type="date"
                        value={newProject.start_date}
                        onChange={(e) =>
                          setNewProject((prev) => ({
                            ...prev,
                            start_date: e.target.value,
                          }))
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="project-linked-blog">
                        Link to Blog Post
                      </Label>
                      <Select
                        value={newProject.linked_blog}
                        onValueChange={(value) => setNewProject((prev) => ({ ...prev, linked_blog: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a blog post" />
                        </SelectTrigger>
                        <SelectContent>
                          {blogPosts.map((blog) => (
                            <SelectItem
                              key={blog.id}
                              value={blog.id.toString()}
                            >
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
                        onChange={(e) =>
                          setNewProject((prev) => ({
                            ...prev,
                            description: e.target.value,
                          }))
                        }
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Featured Image</Label>
                      <p className="text-xs text-gray-500">
                        Recommended: 1200x800px (3:2 aspect ratio)
                      </p>
                      <div className="flex items-center space-x-4">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() =>
                            handleImageUpload(setNewProject, "featureImage")
                          }
                          className="bg-transparent"
                        >
                          <Upload className="mr-2 h-4 w-4" />
                          Upload Featured Image
                        </Button>
                        {newProject.featured_image && (
                          <Image
                            src={newProject.featured_image || "/placeholder.svg"}
                            alt="Featured"
                            width={100}
                            height={60}
                            className="rounded border"
                          />
                        )}
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-[#e51083] hover:bg-[#c50e73]"
                    >
                      Add Project
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.length > 0 ? (
                projects.map((project) => (
                  <Card key={project.id} className="overflow-hidden">
                    <div className="relative">
                      <Image
                        src={project.featured_image || "/placeholder.svg"}
                        alt={project.title}
                        width={400}
                        height={200}
                        className="w-full h-48 object-cover"
                      />
                      <Badge className="absolute top-2 right-2 bg-green-500">
                        {project.status}
                      </Badge>
                      <Badge className="absolute top-2 left-2 bg-blue-500">
                        {project.progress}%
                      </Badge>
                    </div>
                    <CardHeader>
                      <CardTitle className="text-lg">{project.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                        {project.description}
                      </p>
                      <div className="space-y-2 text-sm text-gray-500 mb-4">
                        <span className="flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          {project.beneficiaries} beneficiaries
                        </span>
                        <span className="flex items-center">
                          <Target className="h-4 w-4 mr-1" />
                          Location: {project.location}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleView(project, "project")}
                          className="flex-1 h-9 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 bg-transparent rounded-md font-medium transition-all duration-200 hover:scale-[0.98]"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(project, "project")}
                          className="flex-1 h-9 border border-blue-200 dark:border-blue-700 text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-800/20 bg-transparent rounded-md font-medium transition-all duration-200 hover:scale-[0.98]"
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(project.id, "project")}
                          className="flex-1 h-9 bg-red-500 hover:bg-red-600 text-white rounded-md font-medium transition-all duration-200 hover:scale-[0.98] focus:ring-2 focus:ring-red-500/20"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                      <div className="mt-2 text-xs text-gray-400">
                        Database ID: {project.id} • Created:{" "}
                        {new Date(project.created_at).toLocaleDateString()}
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="col-span-full text-center py-20">
                  <CheckCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">
                    No Projects Found
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    No projects are currently available in the database. Create
                    your first project to get started.
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Stories Tab */}
          <TabsContent value="stories" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Manage Success Stories</h2>
              <Dialog
                open={isDialogOpen && editType === ""}
                onOpenChange={(open) => {
                  setIsDialogOpen(open);
                  if (!open) {
                    resetForms();
                    setEditType("");
                  }
                }}
              >
                <DialogTrigger asChild>
                  <Button
                    onClick={() => {
                      resetForms();
                      setEditType("");
                      setIsDialogOpen(true);
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
                  <form
                    onSubmit={(e) => handleSubmit(e, "Story")}
                    className="space-y-4"
                  >
                    <div className="space-y-2">
                      <Label htmlFor="story-title">Story Title</Label>
                      <Input
                        id="story-title"
                        value={newStory.title}
                        onChange={(e) =>
                          setNewStory((prev) => ({
                            ...prev,
                            title: e.target.value,
                          }))
                        }
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="story-beneficiary-name">
                          Beneficiary Name
                        </Label>
                        <Input
                          id="story-beneficiary-name"
                          value={newStory.beneficiaryName}
                          onChange={(e) =>
                            setNewStory((prev) => ({
                              ...prev,
                              beneficiaryName: e.target.value,
                            }))
                          }
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="story-beneficiary-age">Age</Label>
                        <Input
                          id="story-beneficiary-age"
                          value={newStory.beneficiaryAge}
                          onChange={(e) =>
                            setNewStory((prev) => ({
                              ...prev,
                              beneficiaryAge: e.target.value,
                            }))
                          }
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="story-location">Location</Label>
                        <Input
                          id="story-location"
                          value={newStory.location}
                          onChange={(e) =>
                            setNewStory((prev) => ({
                              ...prev,
                              location: e.target.value,
                            }))
                          }
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="story-content">Story Content</Label>
                      <RichTextEditor
                        value={newStory.content}
                        onChange={(content) =>
                          setNewStory((prev) => ({
                            ...prev,
                            content: content,
                          }))
                        }
                        placeholder="Tell the beneficiary's story. Use formatting to make it engaging and impactful..."
                        minHeight="250px"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Featured Image</Label>
                      <p className="text-xs text-gray-500">
                        Recommended: 1200x800px (3:2 aspect ratio)
                      </p>
                      <div className="flex items-center space-x-4">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() =>
                            handleImageUpload(setNewStory, "featureImage")
                          }
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

                    <Button
                      type="submit"
                      className="w-full bg-[#e51083] hover:bg-[#c50e73]"
                    >
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
                        <strong>Beneficiary:</strong> {story.beneficiaryName},{" "}
                        {story.beneficiaryAge} years old
                      </p>
                      <p>
                        <strong>Location:</strong> {story.location}
                      </p>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
                      {story.content}
                    </p>
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
                  setIsDialogOpen(open);
                  if (!open) {
                    resetForms();
                    setEditType("");
                  }
                }}
              >
                <DialogTrigger asChild>
                  <Button
                    onClick={() => {
                      resetForms();
                      setEditType("");
                      setIsDialogOpen(true);
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
                  <form
                    onSubmit={(e) => handleSubmit(e, "Blog")}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="blog-title">Blog Title</Label>
                        <Input
                          id="blog-title"
                          value={newBlog.title}
                          onChange={(e) =>
                            setNewBlog((prev) => ({
                              ...prev,
                              title: e.target.value,
                            }))
                          }
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="blog-author">Author</Label>
                        <Input
                          id="blog-author"
                          value={newBlog.author}
                          onChange={(e) =>
                            setNewBlog((prev) => ({
                              ...prev,
                              author: e.target.value,
                            }))
                          }
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="blog-category">Category</Label>
                      <Select
                        value={newBlog.category}
                        onValueChange={(value) =>
                          setNewBlog((prev) => ({ ...prev, category: value }))
                        }
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
                        onChange={(e) =>
                          setNewBlog((prev) => ({
                            ...prev,
                            excerpt: e.target.value,
                          }))
                        }
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="blog-content">Content</Label>
                      <RichTextEditor
                        value={newBlog.content}
                        onChange={(content) =>
                          setNewBlog((prev) => ({
                            ...prev,
                            content: content,
                          }))
                        }
                        placeholder="Write your blog content here. Use the toolbar to format text, add lists, change colors, and more..."
                        minHeight="300px"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Featured Image</Label>
                      <p className="text-xs text-gray-500">
                        Recommended: 1200x800px (3:2 aspect ratio)
                      </p>
                      <div className="flex items-center space-x-4">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() =>
                            handleImageUpload(setNewBlog, "featured_image")
                          }
                          className="bg-transparent"
                        >
                          <Upload className="mr-2 h-4 w-4" />
                          Upload Featured Image
                        </Button>
                        {newBlog.featured_image && (
                          <Image
                            src={newBlog.featured_image || "/placeholder.svg"}
                            alt="Featured"
                            width={100}
                            height={60}
                            className="rounded border"
                          />
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Blog Images</Label>
                      <p className="text-xs text-gray-500">
                        Recommended: 1200x800px (3:2 aspect ratio) • First image
                        becomes cover if no featured image selected
                      </p>
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
                        <span className="text-sm text-gray-500">
                          {newBlog.images.length} images added
                        </span>
                      </div>
                      {newBlog.images.length > 0 && (
                        <div className="space-y-2">
                          <p className="text-xs text-gray-600">
                            Click on an image to set as cover (remaining images
                            will appear as carousel)
                          </p>
                          <div className="grid grid-cols-4 gap-2">
                            {newBlog.images.map((img, index) => (
                              <div key={index} className="relative group">
                                <Image
                                  src={img || "/placeholder.svg"}
                                  alt={`Blog image ${index + 1}`}
                                  width={80}
                                  height={60}
                                  className={`rounded border cursor-pointer hover:opacity-80 transition-opacity ${
                                    newBlog.featured_image === img
                                      ? "ring-2 ring-[#e51083]"
                                      : ""
                                  }`}
                                  onClick={() =>
                                    setNewBlog((prev) => ({
                                      ...prev,
                                      featured_image: img,
                                    }))
                                  }
                                />
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded flex items-center justify-center">
                                  <Button
                                    type="button"
                                    size="sm"
                                    variant="secondary"
                                    onClick={() =>
                                      setNewBlog((prev) => ({
                                        ...prev,
                                        featured_image: img,
                                      }))
                                    }
                                    className="text-xs h-auto py-1 px-2"
                                  >
                                    Set Cover
                                  </Button>
                                </div>
                                {newBlog.featured_image === img && (
                                  <div className="absolute -top-2 -right-2 bg-[#e51083] text-white text-xs px-2 py-1 rounded-full">
                                    Cover
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-[#e51083] hover:bg-[#c50e73]"
                    >
                      Add Blog Post
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogPosts.length > 0 ? (
                blogPosts.map((blog) => (
                  <Card key={blog.id} className="overflow-hidden">
                    <div className="relative">
                      <Image
                        src={blog.featured_image || "/placeholder.svg"}
                        alt={blog.title}
                        width={400}
                        height={200}
                        className="w-full h-48 object-cover"
                      />
                      <Badge className="absolute top-2 left-2 bg-[#e51083]">
                        {blog.category}
                      </Badge>
                      <Badge className="absolute top-2 right-2 bg-green-500">
                        {blog.published ? "Published" : "Draft"}
                      </Badge>
                    </div>
                    <CardHeader>
                      <CardTitle className="text-lg line-clamp-2">
                        {blog.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        <p>
                          <strong>Author:</strong> {blog.author}
                        </p>
                        <p>
                          <strong>Created:</strong>{" "}
                          {new Date(blog.created_at).toLocaleDateString()}
                        </p>
                        <p>
                          <strong>Slug:</strong> {blog.slug}
                        </p>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
                        {blog.excerpt}
                      </p>
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
                      <div className="mt-2 text-xs text-gray-400">
                        Database ID: {blog.id} • Updated:{" "}
                        {new Date(blog.updated_at).toLocaleDateString()}
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="col-span-full text-center py-20">
                  <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">
                    No Blog Posts Found
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    No blog posts are currently available in the database.
                    Create your first blog post to get started.
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Team Tab */}
          <TabsContent value="team" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Manage Team Members</h2>
              <Dialog
                open={isDialogOpen && editType === ""}
                onOpenChange={(open) => {
                  setIsDialogOpen(open);
                  if (!open) {
                    resetForms();
                    setEditType("");
                  }
                }}
              >
                <DialogTrigger asChild>
                  <Button
                    onClick={() => {
                      resetForms();
                      setEditType("");
                      setIsDialogOpen(true);
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
                  <form
                    onSubmit={(e) => handleSubmit(e, "Team Member")}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="member-name">Full Name</Label>
                        <Input
                          id="member-name"
                          value={newTeamMember.name}
                          onChange={(e) =>
                            setNewTeamMember((prev) => ({
                              ...prev,
                              name: e.target.value,
                            }))
                          }
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="member-role">Role</Label>
                        <Input
                          id="member-role"
                          value={newTeamMember.role}
                          onChange={(e) =>
                            setNewTeamMember((prev) => ({
                              ...prev,
                              role: e.target.value,
                            }))
                          }
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
                        onChange={(e) =>
                          setNewTeamMember((prev) => ({
                            ...prev,
                            email: e.target.value,
                          }))
                        }
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="member-facebook">
                          Facebook URL (Optional)
                        </Label>
                        <Input
                          id="member-facebook"
                          value={newTeamMember.facebook}
                          onChange={(e) =>
                            setNewTeamMember((prev) => ({
                              ...prev,
                              facebook: e.target.value,
                            }))
                          }
                          placeholder="https://facebook.com/username"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="member-instagram">
                          Instagram URL (Optional)
                        </Label>
                        <Input
                          id="member-instagram"
                          value={newTeamMember.instagram}
                          onChange={(e) =>
                            setNewTeamMember((prev) => ({
                              ...prev,
                              instagram: e.target.value,
                            }))
                          }
                          placeholder="https://instagram.com/username"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="member-tiktok">
                          TikTok URL (Optional)
                        </Label>
                        <Input
                          id="member-tiktok"
                          value={newTeamMember.tiktok}
                          onChange={(e) =>
                            setNewTeamMember((prev) => ({
                              ...prev,
                              tiktok: e.target.value,
                            }))
                          }
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
                        onChange={(e) =>
                          setNewTeamMember((prev) => ({
                            ...prev,
                            bio: e.target.value,
                          }))
                        }
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Profile Image</Label>
                      <p className="text-xs text-gray-500">
                        Recommended: 400x400px (1:1 aspect ratio, square)
                      </p>
                      <div className="flex items-center space-x-4">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() =>
                            handleImageUpload(setNewTeamMember, "image")
                          }
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

                    <Button
                      type="submit"
                      className="w-full bg-[#e51083] hover:bg-[#c50e73]"
                    >
                      Add Team Member
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {teamMembers.length > 0 ? (
                teamMembers.map((member) => (
                  <Card key={member.id} className="overflow-hidden">
                    <div className="relative">
                      <Image
                        src={member.image || "/placeholder.svg"}
                        alt={member.name}
                        width={400}
                        height={200}
                        className="w-full h-48 object-cover"
                      />
                      <Badge className="absolute top-2 right-2 bg-blue-500">
                        ID: {member.id}
                      </Badge>
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
                        <p>
                          <strong>Order:</strong> {member.order_index}
                        </p>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
                        {member.bio}
                      </p>
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
                      <div className="mt-2 text-xs text-gray-400">
                        Database Team Member • Order Position:{" "}
                        {member.order_index}
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="col-span-full text-center py-20">
                  <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">
                    No Team Members Found
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    No team members are currently available in the database. Add
                    your first team member to get started.
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Sponsors Tab */}
          <TabsContent value="sponsors" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Manage Sponsors</h2>
              <Dialog
                open={isDialogOpen && editType === ""}
                onOpenChange={(open) => {
                  setIsDialogOpen(open);
                  if (!open) {
                    resetForms();
                    setEditType("");
                  }
                }}
              >
                <DialogTrigger asChild>
                  <Button
                    onClick={() => {
                      resetForms();
                      setEditType("");
                      setIsDialogOpen(true);
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
                  <form
                    onSubmit={(e) => handleSubmit(e, "Sponsor")}
                    className="space-y-4"
                  >
                    <div className="space-y-2">
                      <Label htmlFor="sponsor-name">Sponsor Name</Label>
                      <Input
                        id="sponsor-name"
                        value={newSponsor.name}
                        onChange={(e) =>
                          setNewSponsor((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="sponsor-website">Website URL</Label>
                      <Input
                        id="sponsor-website"
                        type="url"
                        value={newSponsor.website}
                        onChange={(e) =>
                          setNewSponsor((prev) => ({
                            ...prev,
                            website: e.target.value,
                          }))
                        }
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Logo</Label>
                      <p className="text-xs text-gray-500">
                        Recommended: 300x150px (2:1 aspect ratio, horizontal)
                      </p>
                      <div className="flex items-center space-x-4">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() =>
                            handleImageUpload(setNewSponsor, "logo")
                          }
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

                    <Button
                      type="submit"
                      className="w-full bg-[#e51083] hover:bg-[#c50e73]"
                    >
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
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 break-all">
                        {sponsor.website}
                      </p>
                      <div className="flex flex-col gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleView(sponsor, "sponsor")}
                          className="w-full bg-transparent"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(sponsor, "sponsor")}
                          className="w-full bg-transparent"
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(sponsor.id, "sponsor")}
                          className="w-full"
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
                  setIsDialogOpen(open);
                  if (!open) {
                    resetForms();
                    setEditType("");
                  }
                }}
              >
                <DialogTrigger asChild>
                  <Button
                    onClick={() => {
                      resetForms();
                      setEditType("");
                      setIsDialogOpen(true);
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
                  <form
                    onSubmit={(e) => handleSubmit(e, "Gallery Image")}
                    className="space-y-4"
                  >
                    <div className="space-y-2">
                      <Label htmlFor="gallery-category">Category</Label>
                      <Select
                        value={newGalleryImage.category}
                        onValueChange={(value) =>
                          setNewGalleryImage((prev) => ({
                            ...prev,
                            category: value,
                          }))
                        }
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Education">Education</SelectItem>
                          <SelectItem value="Distribution">
                            Distribution
                          </SelectItem>
                          <SelectItem value="Empowerment">
                            Empowerment
                          </SelectItem>
                          <SelectItem value="Infrastructure">
                            Infrastructure
                          </SelectItem>
                          <SelectItem value="Community">Community</SelectItem>
                          <SelectItem value="Success">Success</SelectItem>
                          <SelectItem value="Team">Team</SelectItem>
                          <SelectItem value="Training">Training</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Image</Label>
                      <p className="text-xs text-gray-500">
                        Recommended: 1200x800px (3:2 aspect ratio)
                      </p>
                      <div className="flex items-center space-x-4">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() =>
                            handleImageUpload(setNewGalleryImage, "image")
                          }
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

                    <Button
                      type="submit"
                      className="w-full bg-[#e51083] hover:bg-[#c50e73] text-white rounded-md font-medium transition-all duration-200 hover:scale-[0.98] focus:ring-2 focus:ring-[#e51083]/20 shadow-sm"
                      disabled={
                        !newGalleryImage.category || !newGalleryImage.image
                      }
                    >
                      Add Image
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {galleryImages.length > 0 ? (
                galleryImages.map((item) => (
                  <Card key={item.id} className="overflow-hidden group">
                    <div className="relative">
                      <Image
                        src={item.image_url || "/placeholder.svg"}
                        alt={item.alt_text || item.title}
                        width={300}
                        height={200}
                        className="w-full h-48 object-cover"
                      />
                      <Badge className="absolute top-2 left-2 bg-black/70 text-white">
                        {item.category}
                      </Badge>
                      <Badge className="absolute top-2 right-2 bg-blue-500">
                        #{item.order_index}
                      </Badge>
                    </div>
                    <CardContent className="p-4">
                      <div className="flex justify-center">
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(item.id, "gallery")}
                          className="px-4"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                      <div className="mt-2 text-xs text-gray-400 text-center">
                        Database ID: {item.id}
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="col-span-full text-center py-20">
                  <ImageIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">
                    No Gallery Images Found
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    No gallery images are currently available in the database.
                    Upload your first image to get started.
                  </p>
                </div>
              )}
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
                      <p className="text-gray-500 text-center py-4">
                        No partnership applications yet
                      </p>
                    ) : (
                      partnershipApplications.map((app) => (
                        <div
                          key={app.id}
                          className="border rounded-lg p-4 hover:shadow-md transition-all duration-300"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-semibold">{app.fullName}</h3>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handleDelete(app.id, "partnership")
                              }
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
                              <strong>Organization:</strong>{" "}
                              {app.organizationName}
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
                              <strong>Submitted:</strong>{" "}
                              {new Date(app.submittedAt).toLocaleDateString()}
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
                      <p className="text-gray-500 text-center py-4">
                        No volunteer applications yet
                      </p>
                    ) : (
                      volunteerApplications.map((app) => (
                        <div
                          key={app.id}
                          className="border rounded-lg p-4 hover:shadow-md transition-all duration-300"
                        >
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
                              <strong>Submitted:</strong>{" "}
                              {new Date(app.submittedAt).toLocaleDateString()}
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
                  setIsDialogOpen(open);
                  if (!open) {
                    resetForms();
                    setEditType("");
                  }
                }}
              >
                <DialogTrigger asChild>
                  <Button
                    onClick={() => {
                      resetForms();
                      setEditType("");
                      setIsDialogOpen(true);
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
                  <form
                    onSubmit={(e) => handleSubmit(e, "Category")}
                    className="space-y-4"
                  >
                    <div className="space-y-2">
                      <Label htmlFor="category-name">Category Name</Label>
                      <Input
                        id="category-name"
                        value={newCategory.name}
                        onChange={(e) =>
                          setNewCategory((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category-description">Description</Label>
                      <Textarea
                        id="category-description"
                        value={newCategory.description}
                        onChange={(e) =>
                          setNewCategory((prev) => ({
                            ...prev,
                            description: e.target.value,
                          }))
                        }
                        required
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full bg-[#e51083] hover:bg-[#c50e73]"
                    >
                      Add Category
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="border rounded-lg p-4 hover:shadow-md transition-all duration-300"
                >
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
                  <p className="text-sm text-gray-600">
                    {category.description}
                  </p>
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
              setEditingItem(null);
              setEditType("");
              setIsDialogOpen(false);
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
                      ? "campaign"
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
                          onChange={(e) =>
                            setNewCampaign((prev) => ({
                              ...prev,
                              title: e.target.value,
                            }))
                          }
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Location</Label>
                        <Input
                          value={newCampaign.location}
                          onChange={(e) =>
                            setNewCampaign((prev) => ({
                              ...prev,
                              location: e.target.value,
                            }))
                          }
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
                          onChange={(e) =>
                            setNewCampaign((prev) => ({
                              ...prev,
                              beneficiaries: e.target.value,
                            }))
                          }
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Urgency Level</Label>
                        <Select
                          value={newCampaign.urgency}
                          onValueChange={(value) =>
                            setNewCampaign((prev) => ({
                              ...prev,
                              urgency: value,
                            }))
                          }
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
                      <Label>Link to Blog Post</Label>
                      <Select
                        value={newCampaign.linked_blog}
                        onValueChange={(value) =>
                          setNewCampaign((prev) => ({
                            ...prev,
                            linked_blog: value,
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a blog post" />
                        </SelectTrigger>
                        <SelectContent>
                          {blogPosts.map((blog) => (
                            <SelectItem
                              key={blog.id}
                              value={blog.id.toString()}
                            >
                              {blog.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Textarea
                        rows={4}
                        value={newCampaign.description}
                        onChange={(e) =>
                          setNewCampaign((prev) => ({
                            ...prev,
                            description: e.target.value,
                          }))
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Featured Image</Label>
                      <div className="flex items-center space-x-4">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() =>
                            handleImageUpload(setNewCampaign, "feature_image")
                          }
                          className="bg-transparent"
                        >
                          <Upload className="mr-2 h-4 w-4" />
                          Upload Featured Image
                        </Button>
                        {newCampaign.featureImage && (
                          <Image
                            src={newCampaign.feature_image || "/placeholder.svg"}
                            alt="Featured"
                            width={100}
                            height={60}
                            className="rounded border"
                          />
                        )}
                      </div>
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
                          onChange={(e) =>
                            setNewProject((prev) => ({
                              ...prev,
                              title: e.target.value,
                            }))
                          }
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Location</Label>
                        <Input
                          value={newProject.location}
                          onChange={(e) =>
                            setNewProject((prev) => ({
                              ...prev,
                              location: e.target.value,
                            }))
                          }
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
                          onChange={(e) =>
                            setNewProject((prev) => ({
                              ...prev,
                              beneficiaries: e.target.value,
                            }))
                          }
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Status</Label>
                        <Select
                          value={newProject.status}
                          onValueChange={(value) =>
                            setNewProject((prev) => ({
                              ...prev,
                              status: value,
                            }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="in-progress">
                              In Progress
                            </SelectItem>
                            <SelectItem value="planned">Planned</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Start Date</Label>
                      <Input
                        type="date"
                        value={newProject.start_date}
                        onChange={(e) =>
                          setNewProject((prev) => ({
                            ...prev,
                            start_date: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Link to Blog Post</Label>
                      <Select
                        value={newProject.linked_blog}
                        onValueChange={(value) =>
                          setNewProject((prev) => ({
                            ...prev,
                            linked_blog: value,
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a blog post" />
                        </SelectTrigger>
                        <SelectContent>
                          {blogPosts.map((blog) => (
                            <SelectItem
                              key={blog.id}
                              value={blog.id.toString()}
                            >
                              {blog.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Textarea
                        rows={4}
                        value={newProject.description}
                        onChange={(e) =>
                          setNewProject((prev) => ({
                            ...prev,
                            description: e.target.value,
                          }))
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Featured Image</Label>
                      <div className="flex items-center space-x-4">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() =>
                            handleImageUpload(setNewProject, "featured_image")
                          }
                          className="bg-transparent"
                        >
                          <Upload className="mr-2 h-4 w-4" />
                          Upload Featured Image
                        </Button>
                        {newProject.featureImage && (
                          <Image
                            src={newProject.featured_image || "/placeholder.svg"}
                            alt="Featured"
                            width={100}
                            height={60}
                            className="rounded border"
                          />
                        )}
                      </div>
                    </div>
                  </>
                )}

                {editType === "story" && (
                  <>
                    <div className="space-y-2">
                      <Label>Story Title</Label>
                      <Input
                        value={newStory.title}
                        onChange={(e) =>
                          setNewStory((prev) => ({
                            ...prev,
                            title: e.target.value,
                          }))
                        }
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>Beneficiary Name</Label>
                        <Input
                          value={newStory.beneficiaryName}
                          onChange={(e) =>
                            setNewStory((prev) => ({
                              ...prev,
                              beneficiaryName: e.target.value,
                            }))
                          }
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Age</Label>
                        <Input
                          value={newStory.beneficiaryAge}
                          onChange={(e) =>
                            setNewStory((prev) => ({
                              ...prev,
                              beneficiaryAge: e.target.value,
                            }))
                          }
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Location</Label>
                        <Input
                          value={newStory.location}
                          onChange={(e) =>
                            setNewStory((prev) => ({
                              ...prev,
                              location: e.target.value,
                            }))
                          }
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Story Content</Label>
                      <RichTextEditor
                        value={newStory.content}
                        onChange={(content) =>
                          setNewStory((prev) => ({
                            ...prev,
                            content: content,
                          }))
                        }
                        placeholder="Tell the beneficiary's story. Use formatting to make it engaging and impactful..."
                        minHeight="250px"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Featured Image</Label>
                      <div className="flex items-center space-x-4">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() =>
                            handleImageUpload(setNewStory, "featureImage")
                          }
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
                  </>
                )}

                {editType === "blog" && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Blog Title</Label>
                        <Input
                          value={newBlog.title}
                          onChange={(e) =>
                            setNewBlog((prev) => ({
                              ...prev,
                              title: e.target.value,
                            }))
                          }
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Author</Label>
                        <Input
                          value={newBlog.author}
                          onChange={(e) =>
                            setNewBlog((prev) => ({
                              ...prev,
                              author: e.target.value,
                            }))
                          }
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Category</Label>
                      <Select
                        value={newBlog.category}
                        onValueChange={(value) =>
                          setNewBlog((prev) => ({ ...prev, category: value }))
                        }
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
                      <Label>Excerpt</Label>
                      <Textarea
                        rows={3}
                        value={newBlog.excerpt}
                        onChange={(e) =>
                          setNewBlog((prev) => ({
                            ...prev,
                            excerpt: e.target.value,
                          }))
                        }
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Content</Label>
                      <RichTextEditor
                        value={newBlog.content}
                        onChange={(content) =>
                          setNewBlog((prev) => ({
                            ...prev,
                            content: content,
                          }))
                        }
                        placeholder="Write your blog content here. Use the toolbar to format text, add lists, change colors, and more..."
                        minHeight="300px"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Featured Image</Label>
                      <div className="flex items-center space-x-4">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() =>
                            handleImageUpload(setNewBlog, "featured_image")
                          }
                          className="bg-transparent"
                        >
                          <Upload className="mr-2 h-4 w-4" />
                          Upload Featured Image
                        </Button>
                        {newBlog.featured_image && (
                          <Image
                            src={newBlog.featured_image || "/placeholder.svg"}
                            alt="Featured"
                            width={100}
                            height={60}
                            className="rounded border"
                          />
                        )}
                      </div>
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
                        <span className="text-sm text-gray-500">
                          {newBlog.images.length} images added
                        </span>
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
                  </>
                )}

                {editType === "team" && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Full Name</Label>
                        <Input
                          value={newTeamMember.name}
                          onChange={(e) =>
                            setNewTeamMember((prev) => ({
                              ...prev,
                              name: e.target.value,
                            }))
                          }
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Role</Label>
                        <Input
                          value={newTeamMember.role}
                          onChange={(e) =>
                            setNewTeamMember((prev) => ({
                              ...prev,
                              role: e.target.value,
                            }))
                          }
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Email Address</Label>
                      <Input
                        type="email"
                        value={newTeamMember.email}
                        onChange={(e) =>
                          setNewTeamMember((prev) => ({
                            ...prev,
                            email: e.target.value,
                          }))
                        }
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>Facebook URL (Optional)</Label>
                        <Input
                          value={newTeamMember.facebook}
                          onChange={(e) =>
                            setNewTeamMember((prev) => ({
                              ...prev,
                              facebook: e.target.value,
                            }))
                          }
                          placeholder="https://facebook.com/username"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Instagram URL (Optional)</Label>
                        <Input
                          value={newTeamMember.instagram}
                          onChange={(e) =>
                            setNewTeamMember((prev) => ({
                              ...prev,
                              instagram: e.target.value,
                            }))
                          }
                          placeholder="https://instagram.com/username"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>TikTok URL (Optional)</Label>
                        <Input
                          value={newTeamMember.tiktok}
                          onChange={(e) =>
                            setNewTeamMember((prev) => ({
                              ...prev,
                              tiktok: e.target.value,
                            }))
                          }
                          placeholder="https://tiktok.com/@username"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Bio</Label>
                      <Textarea
                        rows={4}
                        value={newTeamMember.bio}
                        onChange={(e) =>
                          setNewTeamMember((prev) => ({
                            ...prev,
                            bio: e.target.value,
                          }))
                        }
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Profile Image</Label>
                      <p className="text-xs text-gray-500">
                        Recommended: 400x400px (1:1 aspect ratio, square)
                      </p>
                      <div className="flex items-center space-x-4">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() =>
                            handleImageUpload(setNewTeamMember, "image")
                          }
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
                  </>
                )}

                {editType === "sponsor" && (
                  <>
                    <div className="space-y-2">
                      <Label>Sponsor Name</Label>
                      <Input
                        value={newSponsor.name}
                        onChange={(e) =>
                          setNewSponsor((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Website URL</Label>
                      <Input
                        type="url"
                        value={newSponsor.website}
                        onChange={(e) =>
                          setNewSponsor((prev) => ({
                            ...prev,
                            website: e.target.value,
                          }))
                        }
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Logo</Label>
                      <p className="text-xs text-gray-500">
                        Recommended: 300x150px (2:1 aspect ratio, horizontal)
                      </p>
                      <div className="flex items-center space-x-4">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() =>
                            handleImageUpload(setNewSponsor, "logo")
                          }
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
                  </>
                )}

                {editType === "gallery" && (
                  <>
                    <div className="space-y-2">
                      <Label>Category</Label>
                      <Select
                        value={newGalleryImage.category}
                        onValueChange={(value) =>
                          setNewGalleryImage((prev) => ({
                            ...prev,
                            category: value,
                          }))
                        }
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
                      <Label>Image</Label>
                      <p className="text-xs text-gray-500">
                        Recommended: 1200x800px (3:2 aspect ratio)
                      </p>
                      <div className="flex items-center space-x-4">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() =>
                            handleImageUpload(setNewGalleryImage, "image")
                          }
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
                  </>
                )}

                {editType === "category" && (
                  <>
                    <div className="space-y-2">
                      <Label>Category Name</Label>
                      <Input
                        value={newCategory.name}
                        onChange={(e) =>
                          setNewCategory((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Textarea
                        value={newCategory.description}
                        onChange={(e) =>
                          setNewCategory((prev) => ({
                            ...prev,
                            description: e.target.value,
                          }))
                        }
                        required
                      />
                    </div>
                  </>
                )}

                <Button
                  type="submit"
                  className="w-full bg-[#e51083] hover:bg-[#c50e73]"
                >
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
              setViewingItem(null);
              setViewType("");
              setIsViewDialogOpen(false);
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
                          <strong>Beneficiaries:</strong>{" "}
                          {viewingItem.beneficiaries} girls
                        </div>
                      </div>
                      <div>
                        <strong>Description:</strong>
                      </div>
                      <p className="text-sm text-gray-600">
                        {viewingItem.description}
                      </p>
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
                          <strong>Beneficiaries:</strong>{" "}
                          {viewingItem.beneficiaries} girls
                        </div>
                      </div>
                      <div>
                        <strong>Description:</strong>
                      </div>
                      <p className="text-sm text-gray-600">
                        {viewingItem.description}
                      </p>
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
                          <strong>Beneficiary:</strong>{" "}
                          {viewingItem.beneficiaryName}
                        </div>
                        <div>
                          <strong>Age:</strong> {viewingItem.beneficiaryAge}{" "}
                          years old
                        </div>
                        <div>
                          <strong>Location:</strong> {viewingItem.location}
                        </div>
                      </div>
                      <div>
                        <strong>Story:</strong>
                      </div>
                      <p className="text-sm text-gray-600">
                        {viewingItem.content}
                      </p>
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
                      <p className="text-sm text-gray-600">
                        {viewingItem.excerpt}
                      </p>
                      <div>
                        <strong>Content:</strong>
                      </div>
                      <p className="text-sm text-gray-600">
                        {viewingItem.content}
                      </p>
                      {viewingItem.images && viewingItem.images.length > 0 && (
                        <div>
                          <strong>Images ({viewingItem.images.length}):</strong>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {viewingItem.images.map(
                              (img: string, index: number) => (
                                <Image
                                  key={index}
                                  src={img || "/placeholder.svg"}
                                  alt={`Blog image ${index + 1}`}
                                  width={100}
                                  height={60}
                                  className="rounded border"
                                />
                              )
                            )}
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
                          <strong>Description:</strong>{" "}
                          {viewingItem.description}
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
                          <strong>Description:</strong>{" "}
                          {viewingItem.description}
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
  );
}
