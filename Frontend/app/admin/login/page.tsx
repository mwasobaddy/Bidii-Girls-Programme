"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Heart, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api';

interface LoginResponse {
  success: boolean;
  user?: {
    id: number;
    email: string;
    role: string;
  };
  error?: string;
}

interface DatabaseErrorProps {
  message: string;
}

function DatabaseError({ message }: DatabaseErrorProps) {
  return (
    <div className="flex items-center justify-center p-8 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
      <div className="text-center">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-red-700 dark:text-red-400 mb-2">Authentication Error</h3>
        <p className="text-red-600 dark:text-red-300 mb-4">{message}</p>
        <p className="text-sm text-red-500 dark:text-red-400">
          Please check your credentials or contact the administrator.
        </p>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  const [credentials, setCredentials] = useState({ email: "", password: "" })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();
      console.log('Login response:', data);

      if (response.ok && data.access_token) {
        // Store JWT token and user info
        localStorage.setItem('adminToken', data.access_token);
        localStorage.setItem('adminUser', JSON.stringify(data.user));

        toast({
          title: "Login Successful",
          description: `Welcome back, ${data.user.email}!`,
        });
        router.push("/admin/dashboard");
      } else {
        setError(data.message || data.error || "Authentication failed");
        toast({
          title: "Login Failed",
          description: data.message || data.error || "Invalid credentials",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Login error:', error)
      setError("Failed to connect to authentication server")
      toast({
        title: "Connection Error",
        description: "Unable to reach the authentication server. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Heart className="h-8 w-8 text-[#e51083]" />
            <span className="text-xl font-bold">Bidii Girls Admin</span>
          </div>
          <CardTitle className="text-2xl">Admin Login</CardTitle>
          <p className="text-gray-600 dark:text-gray-400">Access the admin dashboard via database authentication</p>
        </CardHeader>
        <CardContent>
          {error ? (
            <div className="mb-6">
              <DatabaseError message={error} />
            </div>
          ) : null}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@bidiigirls.org"
                value={credentials.email}
                onChange={(e) => setCredentials((prev) => ({ ...prev, email: e.target.value }))}
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={credentials.password}
                onChange={(e) => setCredentials((prev) => ({ ...prev, password: e.target.value }))}
                required
                disabled={isLoading}
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-[#e51083] hover:bg-[#c50e73]" 
              disabled={isLoading}
            >
              {isLoading ? "Authenticating via Database..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Database Demo Credentials:</p>
            <p className="text-sm">
              <strong>Email:</strong> admin@bidiigirls.org
            </p>
            <p className="text-sm">
              <strong>Password:</strong> admin123
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
              Authentication is handled via MySQL database with secure password hashing.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
