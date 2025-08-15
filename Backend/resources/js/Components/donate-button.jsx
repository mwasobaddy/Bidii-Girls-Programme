import { useState } from "react";
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

export function DonateButton({ 
  className = "", 
  size = "default", 
  onClick = () => {} 
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState("");
  const [customAmount, setCustomAmount] = useState("");
  const [selectedCause, setSelectedCause] = useState("general");

  const predefinedAmounts = [
    { amount: "500", label: "KES 500" },
    { amount: "1000", label: "KES 1,000" },
    { amount: "2500", label: "KES 2,500" },
    { amount: "5000", label: "KES 5,000" },
    { amount: "10000", label: "KES 10,000" },
  ];

  const causes = [
    {
      id: "general",
      name: "General Fund",
      description: "Support our overall mission",
      icon: Heart,
    },
    {
      id: "education",
      name: "Education Programs",
      description: "Fund educational initiatives",
      icon: BookOpen,
    },
    {
      id: "technology",
      name: "Technology Access",
      description: "Provide technology resources",
      icon: Smartphone,
    },
    {
      id: "mentorship",
      name: "Mentorship Programs",
      description: "Support mentorship initiatives",
      icon: Users,
    },
    {
      id: "health",
      name: "Health & Wellness",
      description: "Health programs for girls",
      icon: Droplets,
    },
  ];

  const handleAmountSelect = (amount) => {
    setSelectedAmount(amount);
    setCustomAmount("");
  };

  const handleCustomAmountChange = (e) => {
    setCustomAmount(e.target.value);
    setSelectedAmount("");
  };

  const handleDonate = (paymentMethod) => {
    const amount = selectedAmount || customAmount;
    if (!amount) {
      alert("Please select or enter an amount");
      return;
    }

    // Here you would integrate with your payment processor
    alert(`Processing ${paymentMethod} donation of KES ${amount} for ${causes.find(c => c.id === selectedCause)?.name}`);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          size={size} 
          className={`bg-pink-600 hover:bg-pink-700 text-white ${className}`}
          onClick={onClick}
        >
          <Heart className="mr-2 h-4 w-4" />
          Donate Now
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-pink-600" />
            Make a Donation
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Cause Selection */}
          <div>
            <Label className="text-base font-medium">Choose a Cause</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
              {causes.map((cause) => {
                const IconComponent = cause.icon;
                return (
                  <button
                    key={cause.id}
                    onClick={() => setSelectedCause(cause.id)}
                    className={`p-3 rounded-lg border text-left transition-colors ${
                      selectedCause === cause.id
                        ? "border-pink-500 bg-pink-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <IconComponent className="h-4 w-4 text-pink-600" />
                      <span className="font-medium text-sm">{cause.name}</span>
                    </div>
                    <p className="text-xs text-gray-600">{cause.description}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Amount Selection */}
          <div>
            <Label className="text-base font-medium">Choose Amount</Label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
              {predefinedAmounts.map((option) => (
                <Button
                  key={option.amount}
                  type="button"
                  variant={selectedAmount === option.amount ? "default" : "outline"}
                  onClick={() => handleAmountSelect(option.amount)}
                  className="h-12"
                >
                  {option.label}
                </Button>
              ))}
            </div>

            <div className="mt-3">
              <Label htmlFor="custom-amount">Or enter custom amount (KES)</Label>
              <Input
                id="custom-amount"
                type="number"
                placeholder="Enter amount"
                value={customAmount}
                onChange={handleCustomAmountChange}
                className="mt-1"
              />
            </div>
          </div>

          {/* Payment Methods */}
          <div>
            <Label className="text-base font-medium">Payment Method</Label>
            <Tabs defaultValue="mpesa" className="mt-2">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="mpesa">M-Pesa</TabsTrigger>
                <TabsTrigger value="card">Credit/Debit Card</TabsTrigger>
              </TabsList>

              <TabsContent value="mpesa" className="space-y-4">
                <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                  <Smartphone className="h-5 w-5 text-green-600" />
                  <div>
                    <div className="font-medium">M-Pesa Payment</div>
                    <div className="text-sm text-gray-600">
                      Pay securely with your M-Pesa mobile money
                    </div>
                  </div>
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    placeholder="254712345678"
                    className="mt-1"
                  />
                </div>
                <Button 
                  onClick={() => handleDonate("M-Pesa")}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  Pay with M-Pesa
                </Button>
              </TabsContent>

              <TabsContent value="card" className="space-y-4">
                <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                  <CreditCard className="h-5 w-5 text-blue-600" />
                  <div>
                    <div className="font-medium">Card Payment</div>
                    <div className="text-sm text-gray-600">
                      Secure payment with Visa, Mastercard, or American Express
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="card-number">Card Number</Label>
                    <Input
                      id="card-number"
                      placeholder="1234 5678 9012 3456"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="expiry">Expiry</Label>
                    <Input
                      id="expiry"
                      placeholder="MM/YY"
                      className="mt-1"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="cvv">CVV</Label>
                    <Input
                      id="cvv"
                      placeholder="123"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="name">Cardholder Name</Label>
                    <Input
                      id="name"
                      placeholder="John Doe"
                      className="mt-1"
                    />
                  </div>
                </div>
                <Button 
                  onClick={() => handleDonate("Card")}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  Pay with Card
                </Button>
              </TabsContent>
            </Tabs>
          </div>

          {/* Security Notice */}
          <div className="text-xs text-gray-500 text-center p-3 bg-gray-50 rounded">
            🔒 Your payment information is encrypted and secure. We never store your card details.
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
