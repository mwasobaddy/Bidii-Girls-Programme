"use client"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { 
  LogOut, 
  Home, 
  Target, 
  CheckCircle, 
  Users, 
  BookOpen, 
  Heart, 
  Building,
  Image as ImageIcon,
  List,
  Database
} from "lucide-react"
import { Button } from "@/components/ui/button"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const router = useRouter();
  const pathname = usePathname();

  // Check if current page is the login page
  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    console.log('AdminLayout useEffect running, pathname:', pathname, 'isLoginPage:', isLoginPage);
    
    // Skip authentication check for login page
    if (isLoginPage) {
      console.log('Login page detected, skipping auth check');
      setLoading(false);
      return;
    }

    const token = localStorage.getItem("adminToken");
    console.log('Checking localStorage adminToken:', token);
    if (token) {
      setIsAuthenticated(true);
      setLoading(false);
    } else {
      router.push("/admin/login");
    }
  }, [router, isLoginPage]);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminUser");
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      });
      router.push("/admin/login");
    } catch (error) {
      console.error("Logout error:", error);
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminUser");
      toast({
        title: "Logout Error",
        description: "There was an error logging out, but local session cleared.",
      });
      router.push("/admin/login");
    }
  };

  // If it's the login page, just render the children without authentication checks
  if (isLoginPage) {
    return <>{children}</>;
  }

  if (!isAuthenticated || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#e51083]"></div>
      </div>
    );
  }

  return (
    <div className="pt-16 min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white dark:bg-gray-800 p-4 shadow-md">
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">Admin Dashboard</h2>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="flex items-center gap-2 w-full bg-transparent"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
        
        <nav className="space-y-2">
            {/* <Button 
                variant="ghost" 
                className="w-full justify-start" 
                onClick={() => router.push('/admin')}
            >
                <Home className="h-4 w-4 mr-2" />
                Dashboard
            </Button> */}
            <Button 
                variant="ghost" 
                className="w-full justify-start" 
                onClick={() => router.push('/admin/dashboard')}
            >
                <Database className="h-4 w-4 mr-2" />
                Dashboard
            </Button>
            <Button 
                variant="ghost" 
                className="w-full justify-start" 
                onClick={() => router.push('/admin/sponsors')}
            >
                <Building className="h-4 w-4 mr-2" />
                Sponsors
            </Button>
            <Button 
                variant="ghost" 
                className="w-full justify-start" 
                onClick={() => router.push('/admin/projects')}
            >
                <CheckCircle className="h-4 w-4 mr-2" />
                Projects
            </Button>
            <Button 
                variant="ghost" 
                className="w-full justify-start" 
                onClick={() => router.push('/admin/campaigns')}
            >
                <Target className="h-4 w-4 mr-2" />
                Campaigns
            </Button>
            <Button 
                variant="ghost" 
                className="w-full justify-start" 
                onClick={() => router.push('/admin/blog')}
            >
                <List className="h-4 w-4 mr-2" />
                Blog
            </Button>
            <Button 
                variant="ghost" 
                className="w-full justify-start" 
                onClick={() => router.push('/admin/gallery')}
            >
                <ImageIcon className="h-4 w-4 mr-2" />
                Gallery
            </Button>
            <Button 
                variant="ghost" 
                className="w-full justify-start" 
                onClick={() => router.push('/admin/team')}
            >
                <Users className="h-4 w-4 mr-2" />
                Team
            </Button>
            <Button 
                variant="ghost" 
                className="w-full justify-start" 
                onClick={() => router.push('/admin/applications')}
            >
                <List className="h-4 w-4 mr-2" />
                Applications
            </Button>
        </nav>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 p-6">
        {children}
      </div>
    </div>
  );
}
