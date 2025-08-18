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
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const { toast } = useToast();
  const { url } = usePage();

  // Check if current page is the login page
  const isLoginPage = url === '/admin/login';

  useEffect(() => {
    if (isLoginPage) {
      setLoading(false);
      return;
    }
    const token = localStorage.getItem("adminToken");
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
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminUser");
      toast({
        title: "Logout Error",
        description: "There was an error logging out, but local session cleared.",
      });
      router.visit("/admin/login");
    }
  };

  const navigationItems = [
    { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Sponsors", href: "/admin/sponsors", icon: Users2 },
    { name: "Projects", href: "/admin/projects", icon: Target },
    { name: "Campaigns", href: "/admin/campaigns", icon: TrendingUp },
    { name: "Blog", href: "/admin/blog", icon: FileText },
    { name: "Gallery", href: "/admin/gallery", icon: Camera },
    { name: "Team", href: "/admin/team", icon: Users },
    { name: "Logout", href: "#logout", icon: LogOut, isLogout: true },
  ];

  if (isLoginPage) {
    return <>{children}</>;
  }
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#e51083]"></div>
      </div>
    );
  }
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#e51083]"></div>
      </div>
    );
  }

  // Sidebar width and content based on expanded state
  const sidebarWidth = sidebarExpanded ? "w-64" : "w-20";

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col">
      {/* Homepage Header */}
      <Header />
      <div className="flex">
        {/* Sidebar: icons only by default, expands on click */}
        <div
          className={`${sidebarWidth} bg-gray-100 dark:bg-gray-800 min-h-screen pt-16 left-0 top-0 border-r border-gray-200 dark:border-gray-700 transition-all duration-200 h-screen sticky`}
          onClick={() => setSidebarExpanded(true)}
          onMouseLeave={() => setSidebarExpanded(false)}
          style={{ zIndex: 20 }}
        >
          <div className={`p-6 border-b border-gray-200 dark:border-gray-700 ${sidebarExpanded ? "block" : "hidden"}`}>
            <h1 className="text-gray-900 dark:text-white text-xl font-semibold mb-4">Admin Dashboard</h1>
          </div>
          {/* Navigation Menu - exactly matching the image */}
          <nav className={`py-6 flex flex-col items-center ${sidebarExpanded ? "items-stretch" : "items-center"}`}>
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.isLogout ? false : url === item.href;
              const activeClass = isActive
                ? 'bg-pink-500 text-white border-r-2 border-pink-500'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-[#e51083] dark:hover:text-white';
              if (item.isLogout) {
                return (
                  <button
                    key={item.name}
                    onClick={handleLogout}
                    className={`flex items-center ${sidebarExpanded ? "gap-3 px-6 py-3 text-left" : "justify-center py-4"} w-full transition-colors text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-[#e51083] dark:hover:text-white`}
                  >
                    <Icon className="h-6 w-6" />
                    {sidebarExpanded && <span className="font-medium">{item.name}</span>}
                  </button>
                );
              }
              return (
                <button
                  key={item.name}
                  onClick={() => router.visit(item.href)}
                  className={`flex items-center ${sidebarExpanded ? "gap-3 px-6 py-3 text-left" : "justify-center py-4"} w-full transition-colors ${activeClass}`}
                >
                  <Icon className="h-6 w-6" />
                  {sidebarExpanded && <span className="font-medium">{item.name}</span>}
                </button>
              );
            })}
          </nav>
        </div>
        {/* Main Content Area */}
        <div className="flex-1 pt-16 min-h-screen bg-white dark:bg-gray-900">
          <main className="p-6">
            {children}
          </main>
          {/* <Footer /> */}
        </div>
      </div>
    </div>
  );
}
