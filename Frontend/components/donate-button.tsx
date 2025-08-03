"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Heart,
  CreditCard,
  Smartphone,
  Users,
  BookOpen,
  Droplets,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DonateButtonProps {
  className?: string;
  size?: "sm" | "lg" | "default";
}

export function DonateButton({ className, size = "lg" }: DonateButtonProps) {
  const [amount, setAmount] = useState("");
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const getImpactMessage = (amount: string) => {
    const value = Number.parseInt(amount) || 0;
    if (value >= 100) {
      return "Your donation can provide menstrual hygiene kits for 10 girls for 3 months!";
    } else if (value >= 50) {
      return "Your donation can provide menstrual hygiene kits for 5 girls for 3 months!";
    } else if (value >= 25) {
      return "Your donation can provide menstrual hygiene kits for 2 girls for 3 months!";
    } else if (value >= 10) {
      return "Your donation can provide menstrual hygiene kits for 1 girl for 3 months!";
    }
    return "Every dollar makes a difference in a girl's life!";
  };

  const handleMpesaDonation = async () => {
    if (!amount || !phone) {
      toast({
        title: "Missing Information",
        description: "Please enter amount and phone number",
        variant: "destructive",
      });
      return;
    }

    // Validate phone number format (should start with 254)
    const formattedPhone = phone.startsWith("254")
      ? phone
      : `254${phone.replace(/^0/, "")}`;

    if (!/^254\d{9}$/.test(formattedPhone)) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid Kenyan phone number",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Generate unique reference
      const reference = `DONATION_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`;

      const response = await fetch("/api/mpesa/initiate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: amount,
          msisdn: formattedPhone,
          reference: reference,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast({
          title: "Payment Initiated 📱",
          description:
            "Please check your phone for the M-Pesa prompt and enter your PIN to complete the donation.",
        });
        // Reset form
        setAmount("");
        setPhone("");
      } else {
        throw new Error(data.message || "Payment initiation failed");
      }
    } catch (error) {
      toast({
        title: "Payment Failed",
        description:
          error instanceof Error
            ? error.message
            : "Failed to initiate payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          size={size}
          className={`bg-[#e51083] hover:bg-[#c50e73] text-white ${
            className || ""
          }`}
        >
          <Heart className="mr-2 h-5 w-5" />
          Donate Now
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl">
            Make a Life-Changing Donation
          </DialogTitle>
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
            <p className="text-sm text-gray-700 dark:text-gray-300">
              {getImpactMessage(amount)}
            </p>
          </div>
        )}

        <Tabs defaultValue="paypal" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="paypal" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              GoFundMe
            </TabsTrigger>
            <TabsTrigger value="mpesa" className="flex items-center gap-2">
              <Image
                src="/mpesa-logo.svg"
                alt="M-Pesa"
                width={50}
                height={15}
                className="inline"
              />
            </TabsTrigger>
          </TabsList>

          <TabsContent value="paypal" className="space-y-4">
            <div className="w-full h-96 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden relative">
              <iframe
                src="http://gofund.me/b7a40351"
                width="100%"
                height="100%"
                frameBorder="0"
                title="GoFundMe Donation Widget"
                className="w-full h-full"
                allowFullScreen
              />
              <Button
                size="sm"
                onClick={() =>
                  window.open("http://gofund.me/b7a40351", "_blank")
                }
                className="absolute top-2 right-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 text-xs px-3 py-1 h-auto shadow-sm"
              >
                Visit Website
              </Button>
            </div>

            {/* Impact Icons */}
            <div className="grid grid-cols-3 gap-4 py-4 border-t border-gray-200 dark:border-gray-700">
              <div className="text-center">
                <Users className="h-6 w-6 text-[#e51083] mx-auto mb-1" />
                <span className="text-xs text-gray-600 dark:text-gray-400">
                  Support Girls
                </span>
              </div>
              <div className="text-center">
                <BookOpen className="h-6 w-6 text-[#e51083] mx-auto mb-1" />
                <span className="text-xs text-gray-600 dark:text-gray-400">
                  Enable Education
                </span>
              </div>
              <div className="text-center">
                <Droplets className="h-6 w-6 text-[#e51083] mx-auto mb-1" />
                <span className="text-xs text-gray-600 dark:text-gray-400">
                  Provide Hygiene
                </span>
              </div>
            </div>
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
                    className="text-xs border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 rounded-md"
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

            {/* Impact Icons */}
            <div className="grid grid-cols-3 gap-4 py-4 border-t border-gray-200 dark:border-gray-700">
              <div className="text-center">
                <Users className="h-6 w-6 text-[#e51083] mx-auto mb-1" />
                <span className="text-xs text-gray-600 dark:text-gray-400">
                  Support Girls
                </span>
              </div>
              <div className="text-center">
                <BookOpen className="h-6 w-6 text-[#e51083] mx-auto mb-1" />
                <span className="text-xs text-gray-600 dark:text-gray-400">
                  Enable Education
                </span>
              </div>
              <div className="text-center">
                <Droplets className="h-6 w-6 text-[#e51083] mx-auto mb-1" />
                <span className="text-xs text-gray-600 dark:text-gray-400">
                  Provide Hygiene
                </span>
              </div>
            </div>

            <Button
              onClick={handleMpesaDonation}
              className="w-full bg-[#e51083] hover:bg-[#c50e73] text-white rounded-md font-medium transition-all duration-200 hover:scale-[0.98] focus:ring-2 focus:ring-[#e51083]/20 shadow-sm"
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : "Donate"}
            </Button>
            <p className="text-sm text-gray-600 text-center">
              Till Number: 123456
            </p>
          </TabsContent>
        </Tabs>

        <div className="text-center pt-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            🔒 Your donation is secure and will be used directly to support
            girls in need
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
