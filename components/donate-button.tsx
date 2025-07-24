"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Heart, CreditCard, Smartphone, Users, BookOpen, Droplets } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function DonateButton() {
  const [amount, setAmount] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const getImpactMessage = (amount: string) => {
    const value = Number.parseInt(amount) || 0
    if (value >= 100) {
      return "Your donation can provide menstrual hygiene kits for 10 girls for 3 months!"
    } else if (value >= 50) {
      return "Your donation can provide menstrual hygiene kits for 5 girls for 3 months!"
    } else if (value >= 25) {
      return "Your donation can provide menstrual hygiene kits for 2 girls for 3 months!"
    } else if (value >= 10) {
      return "Your donation can provide menstrual hygiene kits for 1 girl for 3 months!"
    }
    return "Every dollar makes a difference in a girl's life!"
  }

  const handlePayPalDonation = async () => {
    if (!amount || !email) {
      toast({
        title: "Missing Information",
        description: "Please enter amount and email address",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    // Simulate PayPal payment processing
    setTimeout(() => {
      setIsLoading(false)
      toast({
        title: "Thank You for Your Generosity! 💖",
        description: "Your donation has been processed. Check your email for confirmation.",
      })
      // Reset form
      setAmount("")
      setEmail("")
    }, 2000)
  }

  const handleMpesaDonation = async () => {
    if (!amount || !phone || !email) {
      toast({
        title: "Missing Information",
        description: "Please enter amount, phone number, and email address",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    // Simulate M-Pesa payment processing
    setTimeout(() => {
      setIsLoading(false)
      toast({
        title: "M-Pesa Payment Initiated 📱",
        description: "Please check your phone for the M-Pesa prompt. Till Number: 123456",
      })
      // Reset form
      setAmount("")
      setPhone("")
      setEmail("")
    }, 2000)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="lg" className="bg-[#e51083] hover:bg-[#c50e73] text-white">
          <Heart className="mr-2 h-5 w-5" />
          Donate Now
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl">Make a Life-Changing Donation</DialogTitle>
          <p className="text-center text-gray-600 dark:text-gray-400">
            Your generosity directly impacts girls' lives and futures
          </p>
        </DialogHeader>

        {/* Impact Preview */}
        {amount && (
          <div className="bg-[#e51083]/10 border border-[#e51083]/20 rounded-lg p-4 mb-4">
            <div className="flex items-center space-x-2 mb-2">
              <Heart className="h-5 w-5 text-[#e51083]" />
              <span className="font-semibold text-[#e51083]">Your Impact</span>
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-300">{getImpactMessage(amount)}</p>
          </div>
        )}

        <Tabs defaultValue="paypal" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="paypal" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              PayPal
            </TabsTrigger>
            <TabsTrigger value="mpesa" className="flex items-center gap-2">
              <Smartphone className="h-4 w-4" />
              M-Pesa
            </TabsTrigger>
          </TabsList>

          <TabsContent value="paypal" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Donation Amount (USD)</Label>
              <div className="grid grid-cols-4 gap-2 mb-2">
                {["10", "25", "50", "100"].map((preset) => (
                  <Button
                    key={preset}
                    variant="outline"
                    size="sm"
                    onClick={() => setAmount(preset)}
                    className="text-xs"
                  >
                    ${preset}
                  </Button>
                ))}
              </div>
              <Input
                id="amount"
                type="number"
                placeholder="Enter custom amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Impact Icons */}
            <div className="grid grid-cols-3 gap-4 py-4 border-t border-gray-200 dark:border-gray-700">
              <div className="text-center">
                <Users className="h-6 w-6 text-[#e51083] mx-auto mb-1" />
                <span className="text-xs text-gray-600 dark:text-gray-400">Support Girls</span>
              </div>
              <div className="text-center">
                <BookOpen className="h-6 w-6 text-[#e51083] mx-auto mb-1" />
                <span className="text-xs text-gray-600 dark:text-gray-400">Enable Education</span>
              </div>
              <div className="text-center">
                <Droplets className="h-6 w-6 text-[#e51083] mx-auto mb-1" />
                <span className="text-xs text-gray-600 dark:text-gray-400">Provide Hygiene</span>
              </div>
            </div>

            <Button
              onClick={handlePayPalDonation}
              className="w-full bg-[#e51083] hover:bg-[#c50e73]"
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : "Donate with PayPal"}
            </Button>
          </TabsContent>

          <TabsContent value="mpesa" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="amount-mpesa">Donation Amount (KES)</Label>
              <div className="grid grid-cols-4 gap-2 mb-2">
                {["500", "1000", "2500", "5000"].map((preset) => (
                  <Button
                    key={preset}
                    variant="outline"
                    size="sm"
                    onClick={() => setAmount(preset)}
                    className="text-xs"
                  >
                    KES {preset}
                  </Button>
                ))}
              </div>
              <Input
                id="amount-mpesa"
                type="number"
                placeholder="Enter custom amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="254700000000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email-mpesa">Email Address</Label>
              <Input
                id="email-mpesa"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Impact Icons */}
            <div className="grid grid-cols-3 gap-4 py-4 border-t border-gray-200 dark:border-gray-700">
              <div className="text-center">
                <Users className="h-6 w-6 text-[#e51083] mx-auto mb-1" />
                <span className="text-xs text-gray-600 dark:text-gray-400">Support Girls</span>
              </div>
              <div className="text-center">
                <BookOpen className="h-6 w-6 text-[#e51083] mx-auto mb-1" />
                <span className="text-xs text-gray-600 dark:text-gray-400">Enable Education</span>
              </div>
              <div className="text-center">
                <Droplets className="h-6 w-6 text-[#e51083] mx-auto mb-1" />
                <span className="text-xs text-gray-600 dark:text-gray-400">Provide Hygiene</span>
              </div>
            </div>

            <Button
              onClick={handleMpesaDonation}
              className="w-full bg-[#e51083] hover:bg-[#c50e73]"
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : "Pay with M-Pesa"}
            </Button>
            <p className="text-sm text-gray-600 text-center">Till Number: 123456</p>
          </TabsContent>
        </Tabs>

        <div className="text-center pt-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            🔒 Your donation is secure and will be used directly to support girls in need
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
