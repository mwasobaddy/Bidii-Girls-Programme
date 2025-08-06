"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { 
  Target, 
  CheckCircle, 
  Users, 
  BookOpen, 
  Heart, 
  Building,
  Image as ImageIcon
} from "lucide-react"
import { DatabaseError } from "@/components/admin/database-error"

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    campaigns: 0,
    projects: 0,
    stories: 0,
    blogPosts: 0,
    teamMembers: 0,
    sponsors: 0,
    galleryImages: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch all the counts in parallel
      const [campaignsRes, projectsRes, blogRes, teamRes, sponsorsRes, galleryRes] = await Promise.all([
        fetch("/api/campaigns?count=true"),
        fetch("/api/projects?count=true"),
        fetch("/api/blog?count=true"),
        fetch("/api/team?count=true"),
        fetch("/api/sponsors?count=true"),
        fetch("/api/gallery?count=true")
      ]);
      
      if (!campaignsRes.ok || !projectsRes.ok || !blogRes.ok || !teamRes.ok || !sponsorsRes.ok || !galleryRes.ok) {
        throw new Error("Failed to fetch data from one or more endpoints");
      }
      
      const campaignsData = await campaignsRes.json();
      const projectsData = await projectsRes.json();
      const blogData = await blogRes.json();
      const teamData = await teamRes.json();
      const sponsorsData = await sponsorsRes.json();
      const galleryData = await galleryRes.json();
      
      // Get all blog posts to count stories
      const blogsResponse = await fetch("/api/blog?admin=true");
      if (!blogsResponse.ok) throw new Error("Failed to fetch blog posts");
      const blogPosts = await blogsResponse.json();
      
      // Calculate stories count (blogs with Success Stories category)
      const storiesCount = blogPosts.filter((post: any) => post.category === "Success Stories").length;
      
      setStats({
        campaigns: campaignsData.count || 0,
        projects: projectsData.count || 0,
        stories: storiesCount || 0,
        blogPosts: blogData.count || 0,
        teamMembers: teamData.count || 0,
        sponsors: sponsorsData.count || 0,
        galleryImages: galleryData.count || 0
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
      setError("Failed to connect to database");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#e51083]"></div>
        <p className="ml-4 text-gray-600 dark:text-gray-400">
          Loading statistics...
        </p>
      </div>
    );
  }

  if (error) {
    return <DatabaseError message={error} />;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard Overview</h1>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="hover:scale-105 transition-transform duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <Target className="h-8 w-8 text-[#e51083]" />
              <div className="text-right">
                <p className="text-sm text-gray-500">Campaigns</p>
                <h3 className="text-3xl font-bold">{stats.campaigns}</h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:scale-105 transition-transform duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <CheckCircle className="h-8 w-8 text-[#e51083]" />
              <div className="text-right">
                <p className="text-sm text-gray-500">Projects</p>
                <h3 className="text-3xl font-bold">{stats.projects}</h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:scale-105 transition-transform duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <Heart className="h-8 w-8 text-[#e51083]" />
              <div className="text-right">
                <p className="text-sm text-gray-500">Success Stories</p>
                <h3 className="text-3xl font-bold">{stats.stories}</h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:scale-105 transition-transform duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <BookOpen className="h-8 w-8 text-[#e51083]" />
              <div className="text-right">
                <p className="text-sm text-gray-500">Blog Posts</p>
                <h3 className="text-3xl font-bold">{stats.blogPosts}</h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:scale-105 transition-transform duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <Building className="h-8 w-8 text-[#e51083]" />
              <div className="text-right">
                <p className="text-sm text-gray-500">Sponsors</p>
                <h3 className="text-3xl font-bold">{stats.sponsors}</h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:scale-105 transition-transform duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <Users className="h-8 w-8 text-[#e51083]" />
              <div className="text-right">
                <p className="text-sm text-gray-500">Team Members</p>
                <h3 className="text-3xl font-bold">{stats.teamMembers}</h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:scale-105 transition-transform duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <ImageIcon className="h-8 w-8 text-[#e51083]" />
              <div className="text-right">
                <p className="text-sm text-gray-500">Gallery Images</p>
                <h3 className="text-3xl font-bold">{stats.galleryImages}</h3>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Admin Quick Guide</h2>
        <p className="mb-4">
          Welcome to the Bidii Foundation Admin Dashboard. Use the sidebar to navigate between different content sections.
        </p>
        <ul className="list-disc list-inside space-y-2">
          <li>Manage <strong>Campaigns</strong> for ongoing activities</li>
          <li>Track <strong>Projects</strong> with progress and budget details</li>
          <li>Share <strong>Success Stories</strong> of beneficiaries</li>
          <li>Create and publish <strong>Blog Posts</strong></li>
          <li>Update <strong>Team</strong> member information</li>
          <li>Manage <strong>Sponsors</strong> and their logos</li>
          <li>Add photos to the <strong>Gallery</strong></li>
        </ul>
      </div>
    </div>
  );
}
