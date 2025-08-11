"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Users, 
  ClipboardList, 
  Newspaper, 
  Image as ImageIcon, 
  MessageSquare, 
  Tag, 
  BookOpen, 
  Activity 
} from "lucide-react"
import Link from "next/link"
import { DatabaseError } from "@/components/admin/database-error"
import { getDashboardStats, getRecentActivity } from "@/lib/services"

interface DashboardCounts {
  sponsors: number;
  projects: number;
  campaigns: number;
  stories: number;
  blog: number;
  gallery: number;
  team: number;
  categories: number;
}

interface RecentActivity {
  id: number;
  type: string;
  action: string;
  itemName: string;
  timestamp: string;
}

export default function AdminDashboard() {
  const [counts, setCounts] = useState<DashboardCounts>({
    sponsors: 0,
    projects: 0,
    campaigns: 0,
    stories: 0,
    blog: 0,
    gallery: 0,
    team: 0,
    categories: 0
  })
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true)
      setError(null)
      
      try {
        // Fetch real dashboard statistics from the backend
        const [statsResponse, activityResponse] = await Promise.all([
          getDashboardStats(),
          getRecentActivity()
        ]);
        
        if (statsResponse.success) {
          setCounts(statsResponse.data);
        } else {
          throw new Error(statsResponse.message || 'Failed to fetch dashboard stats');
        }
        
        if (activityResponse.success) {
          // Transform the backend data to match our frontend interface
          const transformedActivity: RecentActivity[] = [];
          let idCounter = 1;
          
          // Add recent blogs
          activityResponse.data.recent_blogs?.forEach((blog: any) => {
            transformedActivity.push({
              id: idCounter++,
              type: 'blog post',
              action: 'created',
              itemName: blog.title,
              timestamp: blog.created_at
            });
          });
          
          // Add recent projects
          activityResponse.data.recent_projects?.forEach((project: any) => {
            transformedActivity.push({
              id: idCounter++,
              type: 'project',
              action: 'created',
              itemName: project.title,
              timestamp: project.created_at
            });
          });
          
          // Add recent campaigns
          activityResponse.data.recent_campaigns?.forEach((campaign: any) => {
            transformedActivity.push({
              id: idCounter++,
              type: 'campaign',
              action: 'created',
              itemName: campaign.title,
              timestamp: campaign.created_at
            });
          });
          
          // Sort by most recent first and limit to 10 items
          transformedActivity.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
          setRecentActivity(transformedActivity.slice(0, 10));
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
        setError("Failed to load dashboard data")
      } finally {
        setLoading(false)
      }
    }
    
    fetchDashboardData()
  }, [])
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }
  
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#e51083]"></div>
        <p className="ml-4 text-gray-600 dark:text-gray-400">
          Loading dashboard...
        </p>
      </div>
    )
  }
  
  if (error) {
    return <DatabaseError message={error} />
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-gray-500 mt-2">Overview of your website's content and recent activity</p>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatsCard 
          title="Sponsors" 
          value={counts.sponsors.toString()} 
          icon={<Users className="h-5 w-5 text-blue-600" />}
          link="/admin/sponsors"
        />
        <StatsCard 
          title="Projects" 
          value={counts.projects.toString()} 
          icon={<ClipboardList className="h-5 w-5 text-green-600" />}
          link="/admin/projects"
        />
        <StatsCard 
          title="Campaigns" 
          value={counts.campaigns.toString()} 
          icon={<Activity className="h-5 w-5 text-orange-600" />}
          link="/admin/campaigns"
        />
        <StatsCard 
          title="Stories" 
          value={counts.stories.toString()} 
          icon={<BookOpen className="h-5 w-5 text-purple-600" />}
          link="/admin/stories"
        />
        <StatsCard 
          title="Blog Posts" 
          value={counts.blog.toString()} 
          icon={<Newspaper className="h-5 w-5 text-yellow-600" />}
          link="/admin/blog"
        />
        <StatsCard 
          title="Gallery Images" 
          value={counts.gallery.toString()} 
          icon={<ImageIcon className="h-5 w-5 text-pink-600" />}
          link="/admin/gallery"
        />
        <StatsCard 
          title="Team Members" 
          value={counts.team.toString()} 
          icon={<Users className="h-5 w-5 text-indigo-600" />}
          link="/admin/team"
        />
        <StatsCard 
          title="Categories" 
          value={counts.categories.toString()} 
          icon={<Tag className="h-5 w-5 text-red-600" />}
          link="/admin/categories"
        />
      </div>
      
      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <QuickActionButton 
          title="Add Sponsor" 
          icon={<Users className="h-5 w-5" />} 
          href="/admin/sponsors"
        />
        <QuickActionButton 
          title="New Project" 
          icon={<ClipboardList className="h-5 w-5" />} 
          href="/admin/projects"
        />
        <QuickActionButton 
          title="Write Blog Post" 
          icon={<Newspaper className="h-5 w-5" />} 
          href="/admin/blog"
        />
        <QuickActionButton 
          title="Upload Gallery Image" 
          icon={<ImageIcon className="h-5 w-5" />} 
          href="/admin/gallery"
        />
      </div>
      
      {/* Recent Activity */}
      {/* <Card>
        <CardHeader>
          <CardTitle className="text-xl">Recent Activity</CardTitle>
          <CardDescription>Latest actions performed in the admin panel</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map(activity => (
              <div key={activity.id} className="flex items-start space-x-4 border-b border-gray-100 dark:border-gray-800 pb-4 last:border-0 last:pb-0">
                {getActivityIcon(activity.type)}
                <div className="flex-1">
                  <p className="font-medium">
                    {activity.action.charAt(0).toUpperCase() + activity.action.slice(1)} {activity.type}
                  </p>
                  <p className="text-sm text-gray-500">{activity.itemName}</p>
                </div>
                <div className="text-sm text-gray-500">
                  {formatDate(activity.timestamp)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card> */}
    </div>
  )
}

function StatsCard({ title, value, icon, link }: { title: string; value: string; icon: React.ReactNode; link: string }) {
  return (
    <Link href={link}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
        <CardContent className="pt-6 h-full">
          <div className="flex items-center justify-between h-full">
            <div className="flex flex-col justify-between h-full">
              <p className="text-sm font-medium text-gray-500">{title}</p>
              <p className="text-2xl font-bold">{value}</p>
            </div>
            <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
              {icon}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

function QuickActionButton({ title, icon, href }: { title: string; icon: React.ReactNode; href: string }) {
  return (
    <Link href={href} className="block">
      <Button variant="outline" className="w-full justify-start h-12">
        <div className="mr-3">{icon}</div>
        {title}
      </Button>
    </Link>
  )
}

function getActivityIcon(type: string) {
  switch(type.toLowerCase()) {
    case 'sponsor':
      return <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full"><Users className="h-4 w-4 text-blue-600 dark:text-blue-400" /></div>
    case 'project':
      return <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-full"><ClipboardList className="h-4 w-4 text-green-600 dark:text-green-400" /></div>
    case 'campaign':
      return <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-full"><Activity className="h-4 w-4 text-orange-600 dark:text-orange-400" /></div>
    case 'story':
      return <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-full"><BookOpen className="h-4 w-4 text-purple-600 dark:text-purple-400" /></div>
    case 'blog post':
      return <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-full"><Newspaper className="h-4 w-4 text-yellow-600 dark:text-yellow-400" /></div>
    case 'gallery image':
      return <div className="p-2 bg-pink-100 dark:bg-pink-900/30 rounded-full"><ImageIcon className="h-4 w-4 text-pink-600 dark:text-pink-400" /></div>
    case 'team member':
      return <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-full"><Users className="h-4 w-4 text-indigo-600 dark:text-indigo-400" /></div>
    case 'category':
      return <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-full"><Tag className="h-4 w-4 text-red-600 dark:text-red-400" /></div>
    default:
      return <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full"><MessageSquare className="h-4 w-4 text-gray-600 dark:text-gray-400" /></div>
  }
}
