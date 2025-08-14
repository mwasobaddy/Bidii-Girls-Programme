"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://bidiigirlsprogramme.org/api';

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

export default function LoginPage() {
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
        body: JSON.stringify(credentials)
      })

      const data = await response.json()

      if (response.ok) {
        localStorage.setItem("adminToken", data.access_token)
        localStorage.setItem("adminUser", JSON.stringify(data.user))
        
        toast({
          title: "Login Successful",
          description: "Welcome to the admin dashboard!",
        })
        
        router.push("/admin/dashboard")
      } else {
        setError(data.message || 'Login failed. Please check your credentials.')
      }
    } catch (error) {
      console.error("Login error:", error)
      setError('Unable to connect to the authentication server. Please try again later.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <html lang="en">
      <head>
        <title>Bidii Girls Program - Admin Login</title>
        <meta name="description" content="Admin login for Bidii Girls Program" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.png" />
      </head>
      <body className="bg-gray-50 dark:bg-gray-900">
        <div className="min-h-screen flex items-center justify-center px-4">
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
                <DatabaseError message={error} />
              ) : (
                <>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="admin@bidiigirls.org"
                        value={credentials.email}
                        onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
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
                        onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                        required
                        disabled={isLoading}
                      />
                    </div>
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? "Signing in..." : "Sign In"}
                    </Button>
                  </form>

                  <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <h3 className="text-sm font-semibold text-blue-700 dark:text-blue-300 mb-2">Database Demo Credentials</h3>
                    <div className="text-xs text-blue-600 dark:text-blue-400 space-y-1">
                      <p><strong>Email:</strong> admin@bidiigirls.org</p>
                      <p><strong>Password:</strong> admin123</p>
                      <p className="text-blue-500 dark:text-blue-400 mt-2">
                        Note: This authenticates against a real MySQL database with JWT tokens.
                      </p>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </body>
    </html>
  )
}
