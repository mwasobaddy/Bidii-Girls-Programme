import { useState, useEffect } from "react";
import { router, usePage } from '@inertiajs/react';
import { useToast } from "@/hooks/use-toast";
import { 
  LogOut, 
  LayoutDashboard,
  Users2,
  Target,
  TrendingUp,
  FileText,
  Camera,
  Users,
  ClipboardList
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Header } from "@/Components/Header";
import { Footer } from "@/components/Footer";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

export default function AdminLayout({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { url } = usePage();

  // Check if current page is the login page
  const isLoginPage = url === '/admin/login';

  useEffect(() => {
    console.log('AdminLayout useEffect running, url:', url, 'isLoginPage:', isLoginPage);
    
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
      router.visit("/admin/login");
    }
  }, [url, isLoginPage]);

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
      router.visit("/admin/login");
    } catch (error) {
      console.error("Logout error:", error);
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminUser");
      toast({
        title: "Logout Error",
        description: "There was an error logging out, but local session cleared.",
      });
      router.visit("/admin/login");
    }
  };

  // Navigation items matching the exact image design
  const navigationItems = [
    { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Sponsors", href: "/admin/sponsors", icon: Users2 },
    { name: "Projects", href: "/admin/projects", icon: Target },
    { name: "Campaigns", href: "/admin/campaigns", icon: TrendingUp },
    { name: "Blog", href: "/admin/blog", icon: FileText },
    { name: "Gallery", href: "/admin/gallery", icon: Camera },
    { name: "Team", href: "/admin/team", icon: Users },
    { name: "Applications", href: "/admin/applications", icon: ClipboardList },
  ];

  // If it's the login page, just render the children without authentication checks
  if (isLoginPage) {
    return <>{children}</>;
  }

  // Show loading spinner only for authenticated pages, not login page
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#e51083]"></div>
      </div>
    );
  }

  // If not authenticated and not on login page, redirect will happen in useEffect
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#e51083]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* Homepage Header */}
      <Header />
      
      <div className="flex">
        {/* Dark Sidebar - matching the exact image design */}
        <div className="w-64 bg-gray-800 min-h-screen pt-16 left-0 top-0 border-r border-gray-700">
          {/* Admin Title Section */}
          <div className="p-6 border-b border-gray-700">
            <h1 className="text-white text-xl font-semibold mb-4">Admin Dashboard</h1>
            <Button
              onClick={handleLogout}
              variant="ghost"
              size="sm"
              className="flex items-center gap-2 w-full justify-start text-gray-300 hover:bg-gray-700 hover:text-white"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
          
          {/* Navigation Menu - exactly matching the image */}
          <nav className="py-6">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = url === item.href;
              
              return (
                <button
                  key={item.name}
                  onClick={() => router.visit(item.href)}
                  className={`w-full flex items-center gap-3 px-6 py-3 text-left transition-colors ${
                    isActive 
                      ? 'bg-gray-700 text-white border-r-2 border-pink-500' 
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.name}</span>
                </button>
              );
            })}
          </nav>
        </div>
        
        {/* Main Content Area */}
        <div className="flex-1 pt-16 min-h-screen bg-gray-900">
          <main className="p-6">
            {children}
          </main>
          
          {/* Homepage Footer */}
          <Footer />
        </div>
      </div>
    </div>
  );
}
