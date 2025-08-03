"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  ArrowUp,
  ArrowDown,
  Users,
  Heart,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Lightbulb,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { DonateButton } from "@/components/donate-button";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/hooks/use-language";

const sponsors = [
  {
    name: "UNICEF",
    logo: "/placeholder.svg?height=80&width=120",
    website: "https://unicef.org",
  },
  {
    name: "World Vision",
    logo: "/placeholder.svg?height=80&width=120",
    website: "https://worldvision.org",
  },
  {
    name: "Save the Children",
    logo: "/placeholder.svg?height=80&width=120",
    website: "https://savethechildren.org",
  },
  {
    name: "Plan International",
    logo: "/placeholder.svg?height=80&width=120",
    website: "https://plan-international.org",
  },
  {
    name: "ActionAid",
    logo: "/placeholder.svg?height=80&width=120",
    website: "https://actionaid.org",
  },
  {
    name: "Oxfam",
    logo: "/placeholder.svg?height=80&width=120",
    website: "https://oxfam.org",
  },
];

const featuredCampaigns = [
  {
    id: 1,
    title: "Emergency Period Kits for Kibera",
    description:
      "Providing immediate relief with emergency menstrual hygiene kits for 200 girls in Kibera slum.",
    image: "/placeholder.svg?height=300&width=400",
    urgency: "Urgent",
    beneficiaries: 200,
    linkedBlog: 1,
  },
  {
    id: 2,
    title: "School Toilet Renovation Project",
    description:
      "Building private, clean toilet facilities in 5 schools to ensure girls have dignified spaces.",
    image: "/placeholder.svg?height=300&width=400",
    urgency: "Active",
    beneficiaries: 500,
    linkedBlog: 2,
  },
  {
    id: 3,
    title: "Girls Leadership Training Program",
    description:
      "Empowering 100 teenage girls with leadership skills and confidence-building workshops.",
    image: "/placeholder.svg?height=300&width=400",
    urgency: "Ongoing",
    beneficiaries: 100,
    linkedBlog: 3,
  },
];

const featuredPosts = [
  {
    id: 1,
    title: "Breaking the Silence: Why Period Education Matters",
    excerpt:
      "Exploring the importance of comprehensive menstrual health education...",
    image: "/placeholder.svg?height=200&width=300",
    category: "Education",
    date: "March 15, 2024",
  },
  {
    id: 2,
    title: "Success Story: How Maria Overcame Period Poverty",
    excerpt:
      "Meet Maria, a 16-year-old from Kibera who transformed her life...",
    image: "/placeholder.svg?height=200&width=300",
    category: "Success Stories",
    date: "March 10, 2024",
  },
  {
    id: 3,
    title: "The Economic Impact of Period Poverty in Kenya",
    excerpt: "Understanding how period poverty affects girls' education...",
    image: "/placeholder.svg?height=200&width=300",
    category: "Research",
    date: "March 5, 2024",
  },
  {
    id: 4,
    title: "Community Champions Making a Difference",
    excerpt:
      "Highlighting local leaders who are helping us reach more girls...",
    image: "/placeholder.svg?height=200&width=300",
    category: "Community",
    date: "February 28, 2024",
  },
];

export default function HomePage() {
  const [currentSponsor, setCurrentSponsor] = useState(0);
  const [currentBlog, setCurrentBlog] = useState(0);
  const [partnerForm, setPartnerForm] = useState({
    fullName: "",
    role: "",
    organizationName: "",
    email: "",
    phoneNumber: "",
    type: "",
  });
  const [volunteerForm, setVolunteerForm] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    type: "volunteer",
  });
  const { toast } = useToast();
  const { t } = useLanguage();

  const nextSponsor = () => {
    setCurrentSponsor((prev) => (prev + 1) % sponsors.length);
  };

  const prevSponsor = () => {
    setCurrentSponsor((prev) => (prev - 1 + sponsors.length) % sponsors.length);
  };

  const nextBlog = () => {
    setCurrentBlog((prev) => (prev + 1) % featuredPosts.length);
  };

  const prevBlog = () => {
    setCurrentBlog(
      (prev) => (prev - 1 + featuredPosts.length) % featuredPosts.length
    );
  };

  const handlePartnerSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Save to localStorage for admin panel to access
    const existingPartners = JSON.parse(
      localStorage.getItem("partnershipApplications") || "[]"
    );
    const newPartner = {
      id: Date.now(),
      ...partnerForm,
      submittedAt: new Date().toISOString(),
    };
    localStorage.setItem(
      "partnershipApplications",
      JSON.stringify([...existingPartners, newPartner])
    );

    toast({
      title: "Data collected successfully",
      description: "We will contact you soon.",
    });
    setPartnerForm({
      fullName: "",
      role: "",
      organizationName: "",
      email: "",
      phoneNumber: "",
      type: "",
    });
  };

  const handleVolunteerSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Save to localStorage for admin panel to access
    const existingVolunteers = JSON.parse(
      localStorage.getItem("volunteerApplications") || "[]"
    );
    const newVolunteer = {
      id: Date.now(),
      ...volunteerForm,
      submittedAt: new Date().toISOString(),
    };
    localStorage.setItem(
      "volunteerApplications",
      JSON.stringify([...existingVolunteers, newVolunteer])
    );

    toast({
      title: "Data collected successfully",
      description: "We will contact you soon.",
    });
    setVolunteerForm({
      fullName: "",
      email: "",
      phoneNumber: "",
      type: "volunteer",
    });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToBottom = () => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  };

  return (
    <div className="relative">
      {/* 1. Landing Page with Video Background */}
      <div className="relative min-h-screen">
        <div className="absolute inset-0 overflow-hidden">
          <video
            autoPlay
            muted
            loop
            className="w-full h-full object-cover"
            poster="/placeholder.svg?height=1080&width=1920"
          >
            <source src="/hero-video.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-black/60" />
        </div>

        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-center text-white px-4 max-w-4xl mx-auto animate-fade-in">
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-4 sm:mb-6 animate-slide-up mt-20 flex flex-col items-center justify-center">
              Restoring Dignity,
              <span className="text-[#e51083]">Empowering Education.</span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl mb-6 sm:mb-8 text-gray-200 animate-slide-up animation-delay-200 mt-4 sm:mt-6">
              {t("heroDescription")}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center animate-slide-up animation-delay-400 mb-8 sm:mb-12">
              <DonateButton />
              <Link href="/projects">
                <Button
                  variant="outline"
                  size="lg"
                  className="bg-transparent border-white text-white hover:bg-white hover:text-black transition-all duration-300 w-full sm:w-auto"
                >
                  {t("learnMore")}{" "}
                  <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
              </Link>
            </div>

            {/* Mobile: Horizontal layout for statistics */}
            <div className="flex flex-row justify-center gap-4 sm:gap-6 md:hidden mt-8 pt-8 border-t border-white/20 animate-slide-up animation-delay-600">
              <div className="text-center flex-1">
                <div className="text-xl sm:text-2xl font-bold text-[#e51083] mb-1">
                  5000+
                </div>
                <div className="text-xs sm:text-sm text-gray-300">
                  {t("girlsSupported")}
                </div>
              </div>
              <div className="text-center flex-1">
                <div className="text-xl sm:text-2xl font-bold text-[#e51083] mb-1">
                  20+
                </div>
                <div className="text-xs sm:text-sm text-gray-300">
                  {t("schoolsReached")}
                </div>
              </div>
              <div className="text-center flex-1">
                <div className="text-xl sm:text-2xl font-bold text-[#e51083] mb-1">
                  10+
                </div>
                <div className="text-xs sm:text-sm text-gray-300">
                  {t("yearsImpact")}
                </div>
              </div>
            </div>

            {/* Desktop: Grid layout for statistics */}
            <div className="hidden md:grid grid-cols-3 gap-8 mt-16 pt-16 border-t border-white/20 animate-slide-up animation-delay-600">
              <div className="text-center">
                <div className="text-3xl font-bold text-[#e51083] mb-2">
                  5000+{" "}
                </div>
                <div className="text-gray-300">{t("girlsSupported")}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#e51083] mb-2">
                  20+
                </div>
                <div className="text-gray-300">{t("schoolsReached")}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#e51083] mb-2">
                  10+
                </div>
                <div className="text-gray-300">{t("yearsImpact")}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Featured Campaigns */}
      <section className="py-12 sm:py-16 md:py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 sm:mb-12 animate-fade-in-up">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
              {t("featuredCampaigns")}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-sm sm:text-base">
              {t("campaignsDescription")}
            </p>
          </div>

          {/* Mobile: Show only 2 campaigns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:hidden gap-6">
            {featuredCampaigns.slice(0, 2).map((campaign, index) => (
              <Card
                key={campaign.id}
                className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-105 animate-fade-in-up"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="relative">
                  <Image
                    src={campaign.image || "/placeholder.svg"}
                    alt={campaign.title}
                    width={400}
                    height={300}
                    className="w-full h-40 sm:h-48 object-cover"
                  />
                  <Badge
                    className={`absolute top-3 right-3 text-xs ${
                      campaign.urgency === "Urgent"
                        ? "bg-red-500"
                        : campaign.urgency === "Active"
                        ? "bg-green-500"
                        : "bg-blue-500"
                    }`}
                  >
                    {campaign.urgency}
                  </Badge>
                </div>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base sm:text-lg">
                    {campaign.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 sm:space-y-4">
                  <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">
                    {campaign.description}
                  </p>

                  <div className="flex items-center justify-between text-xs sm:text-sm text-gray-500">
                    <span className="flex items-center">
                      <Users className="h-3 w-3 sm:h-4 sm:w-4 mr-1 text-[#e51083]" />
                      {campaign.beneficiaries} girls
                    </span>
                  </div>

                  <div className="flex flex-col gap-2">
                    <DonateButton className="flex-1 h-11 flex items-center justify-center rounded-md font-medium transition-all duration-200 hover:scale-[0.98]" />
                    <Link
                      href={`/blog/${campaign.linkedBlog}`}
                      className="flex-1"
                    >
                      <Button
                        variant="outline"
                        className="w-full h-11 flex items-center justify-center rounded-md font-medium transition-all duration-200 hover:scale-[0.98] border-[#e51083] text-[#e51083] hover:bg-[#e51083] hover:text-white bg-transparent"
                      >
                        {t("readMore")}
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Desktop: Show all 3 campaigns */}
          <div className="hidden md:grid grid-cols-3 gap-8">
            {featuredCampaigns.map((campaign, index) => (
              <Card
                key={campaign.id}
                className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-105 animate-fade-in-up"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="relative">
                  <Image
                    src={campaign.image || "/placeholder.svg"}
                    alt={campaign.title}
                    width={400}
                    height={300}
                    className="w-full h-48 object-cover"
                  />
                  <Badge
                    className={`absolute top-4 right-4 ${
                      campaign.urgency === "Urgent"
                        ? "bg-red-500"
                        : campaign.urgency === "Active"
                        ? "bg-green-500"
                        : "bg-blue-500"
                    }`}
                  >
                    {campaign.urgency}
                  </Badge>
                </div>
                <CardHeader>
                  <CardTitle className="text-lg">{campaign.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {campaign.description}
                  </p>

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span className="flex items-center">
                      <Users className="h-4 w-4 mr-1 text-[#e51083]" />
                      {campaign.beneficiaries} girls
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2">
                    <DonateButton className="flex-1 h-11 flex items-center justify-center rounded-md font-medium transition-all duration-200 hover:scale-[0.98]" />
                    <Link
                      href={`/blog/${campaign.linkedBlog}`}
                      className="flex-1"
                    >
                      <Button
                        variant="outline"
                        className="w-full h-11 flex items-center justify-center rounded-md font-medium transition-all duration-200 hover:scale-[0.98] border-[#e51083] text-[#e51083] hover:bg-[#e51083] hover:text-white bg-transparent"
                      >
                        {t("readMore")}
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Sponsors Carousel */}
      <section className="py-12 sm:py-16 bg-gray-50 dark:bg-gray-800 border-y">
        <div className="container mx-auto px-4">
          <h2 className="text-xl sm:text-2xl font-bold text-center mb-6 sm:mb-8 animate-fade-in-up">
            {t("partnersSponsors")}
          </h2>
          <div className="relative max-w-4xl mx-auto">
            <div className="flex items-center justify-center space-x-4 sm:space-x-8 overflow-hidden">
              {sponsors
                .slice(
                  currentSponsor,
                  currentSponsor +
                    (typeof window !== "undefined" && window.innerWidth < 768
                      ? 2
                      : 4)
                )
                .map((sponsor, index) => (
                  <div key={index} className="flex-shrink-0 animate-fade-in">
                    <a
                      href={sponsor.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block hover:scale-110 transition-all duration-300"
                    >
                      <Image
                        src={sponsor.logo || "/placeholder.svg"}
                        alt={sponsor.name}
                        width={120}
                        height={80}
                        className="grayscale hover:grayscale-0 transition-all duration-300 opacity-70 hover:opacity-100 w-16 h-12 sm:w-20 sm:h-16 md:w-24 md:h-20 object-contain"
                      />
                    </a>
                  </div>
                ))}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={prevSponsor}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 hover:scale-110 transition-transform"
            >
              <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={nextSponsor}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 hover:scale-110 transition-transform"
            >
              <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* 4. Statistics and Info Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
            <div className="animate-fade-in-left">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">
                {t("ourImpact")}
              </h2>
              <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 mb-6 sm:mb-8">
                {t("impactDescription")}
              </p>

              <div className="grid grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
                <div className="text-center p-3 sm:p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:scale-105 transition-transform duration-300">
                  <div className="text-xl sm:text-2xl font-bold text-[#e51083] mb-1 sm:mb-2">
                    5000+
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    {t("girlsSupported")}
                  </div>
                </div>
                <div className="text-center p-3 sm:p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:scale-105 transition-transform duration-300">
                  <div className="text-xl sm:text-2xl font-bold text-[#e51083] mb-1 sm:mb-2">
                    20+
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    {t("schoolsReached")}
                  </div>
                </div>
                <div className="text-center p-3 sm:p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:scale-105 transition-transform duration-300">
                  <div className="text-xl sm:text-2xl font-bold text-[#e51083] mb-1 sm:mb-2">
                    10,000+
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    {t("productsDistributed")}
                  </div>
                </div>
                <div className="text-center p-3 sm:p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:scale-105 transition-transform duration-300">
                  <div className="text-xl sm:text-2xl font-bold text-[#e51083] mb-1 sm:mb-2">
                    85%
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    {t("attendanceRate")}
                  </div>
                </div>
              </div>

              <Link href="/about">
                <Button className="bg-[#e51083] hover:bg-[#c50e73] text-white hover:scale-105 transition-all duration-300 w-full sm:w-auto">
                  {t("learnMoreAboutUs")}{" "}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="animate-fade-in-right">
              {/* <Image src="/placeholder.svg?height=500&width=600" alt="Girls in classroom" width={600} height={500} /> */}
              <Image
                src="/about-homepage.png?height=500&width=600"
                alt="organization stats"
                width={600}
                height={500}
                className="rounded-lg  hover:scale-105 transition-transform duration-300 w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 5. How We Help Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 sm:mb-12 animate-fade-in-up">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
              {t("howWeHelp")}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-sm sm:text-base">
              {t("howWeHelpDescription")}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                icon: BookOpen,
                title: t("education"),
                description: t("educationDescription"),
                delay: "0ms",
              },
              {
                icon: Heart,
                title: t("support"),
                description: t("supportDescription"),
                delay: "200ms",
              },
              {
                icon: Lightbulb,
                title: t("empowerment"),
                description: t("empowermentDescription"),
                delay: "400ms",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="text-center animate-fade-in-up hover:scale-105 transition-all duration-300"
                style={{ animationDelay: item.delay }}
              >
                <div className="bg-[#e51083] w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 hover:bg-[#c50e73] transition-colors duration-300">
                  <item.icon className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">
                  {item.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Call to Action for Partners and Volunteers */}
      <section className="py-12 sm:py-16 md:py-20 bg-[#e51083] text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 animate-fade-in-up">
            {t("joinOurMission")}
          </h2>
          <p className="text-lg sm:text-xl mb-6 sm:mb-8 max-w-2xl mx-auto animate-fade-in-up animation-delay-200">
            {t("joinDescription")}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center animate-fade-in-up animation-delay-400">
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  size="lg"
                  className="bg-white text-[#e51083] hover:bg-gray-100 hover:scale-105 transition-all duration-300 w-full sm:w-auto"
                  onClick={() =>
                    setPartnerForm((prev) => ({ ...prev, type: "partner" }))
                  }
                >
                  <Users className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                  {t("becomePartner")}
                </Button>
              </DialogTrigger>
              <DialogContent className="mx-4 max-w-md">
                <DialogHeader>
                  <DialogTitle>{t("partnershipInquiry")}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handlePartnerSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="partner-fullName">Full Name</Label>
                    <Input
                      id="partner-fullName"
                      value={partnerForm.fullName}
                      onChange={(e) =>
                        setPartnerForm((prev) => ({
                          ...prev,
                          fullName: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="partner-role">Role</Label>
                    <Input
                      id="partner-role"
                      value={partnerForm.role}
                      onChange={(e) =>
                        setPartnerForm((prev) => ({
                          ...prev,
                          role: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="partner-organizationName">
                      Business/Organization Name
                    </Label>
                    <Input
                      id="partner-organizationName"
                      value={partnerForm.organizationName}
                      onChange={(e) =>
                        setPartnerForm((prev) => ({
                          ...prev,
                          organizationName: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="partner-email">Email Address</Label>
                    <Input
                      id="partner-email"
                      type="email"
                      value={partnerForm.email}
                      onChange={(e) =>
                        setPartnerForm((prev) => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="partner-phoneNumber">
                      Phone Number (Optional)
                    </Label>
                    <Input
                      id="partner-phoneNumber"
                      value={partnerForm.phoneNumber}
                      onChange={(e) =>
                        setPartnerForm((prev) => ({
                          ...prev,
                          phoneNumber: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-[#e51083] hover:bg-[#c50e73]"
                  >
                    {t("submitPartnership")}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-[#e51083] bg-transparent hover:scale-105 transition-all duration-300 w-full sm:w-auto"
                  onClick={() =>
                    setVolunteerForm((prev) => ({ ...prev, type: "volunteer" }))
                  }
                >
                  <Heart className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                  {t("volunteerWithUs")}
                </Button>
              </DialogTrigger>
              <DialogContent className="mx-4 max-w-md">
                <DialogHeader>
                  <DialogTitle>{t("volunteerApplication")}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleVolunteerSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="volunteer-fullName">Full Name</Label>
                    <Input
                      id="volunteer-fullName"
                      value={volunteerForm.fullName}
                      onChange={(e) =>
                        setVolunteerForm((prev) => ({
                          ...prev,
                          fullName: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="volunteer-email">Email Address</Label>
                    <Input
                      id="volunteer-email"
                      type="email"
                      value={volunteerForm.email}
                      onChange={(e) =>
                        setVolunteerForm((prev) => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="volunteer-phoneNumber">
                      Phone Number (Optional)
                    </Label>
                    <Input
                      id="volunteer-phoneNumber"
                      value={volunteerForm.phoneNumber}
                      onChange={(e) =>
                        setVolunteerForm((prev) => ({
                          ...prev,
                          phoneNumber: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-[#e51083] hover:bg-[#c50e73]"
                  >
                    {t("submitVolunteer")}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </section>

      {/* 7. Featured Projects */}
      <section className="py-12 sm:py-16 md:py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 sm:mb-12 animate-fade-in-up">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
              {t("ourProjects")}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-sm sm:text-base">
              {t("projectsDescription")}
            </p>
          </div>

          {/* Mobile: Show only 2 projects */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:hidden gap-6">
            {featuredCampaigns.slice(0, 2).map((project, index) => (
              <Card
                key={project.id}
                className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-105 animate-fade-in-up"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="relative">
                  <Image
                    src={project.image || "/placeholder.svg"}
                    alt={project.title}
                    width={400}
                    height={300}
                    className="w-full h-40 sm:h-48 object-cover"
                  />
                </div>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base sm:text-lg">
                    {project.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 sm:space-y-4">
                  <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">
                    {project.description}
                  </p>
                  <div className="flex flex-col gap-2">
                    <DonateButton className="flex-1 h-11 flex items-center justify-center rounded-md font-medium transition-all duration-200 hover:scale-[0.98]" />
                    <Link
                      href={`/blog/${project.linkedBlog}`}
                      className="flex-1"
                    >
                      <Button
                        variant="outline"
                        className="w-full h-11 flex items-center justify-center rounded-md font-medium transition-all duration-200 hover:scale-[0.98] border-[#e51083] text-[#e51083] hover:bg-[#e51083] hover:text-white bg-transparent"
                      >
                        {t("readMore")}
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Desktop: Show all 3 projects */}
          <div className="hidden md:grid grid-cols-3 gap-8">
            {featuredCampaigns.map((project, index) => (
              <Card
                key={project.id}
                className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-105 animate-fade-in-up"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="relative">
                  <Image
                    src={project.image || "/placeholder.svg"}
                    alt={project.title}
                    width={400}
                    height={300}
                    className="w-full h-48 object-cover"
                  />
                </div>
                <CardHeader>
                  <CardTitle className="text-lg">{project.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {project.description}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <DonateButton className="flex-1 h-11 flex items-center justify-center rounded-md font-medium transition-all duration-200 hover:scale-[0.98]" />
                    <Link
                      href={`/blog/${project.linkedBlog}`}
                      className="flex-1"
                    >
                      <Button
                        variant="outline"
                        className="w-full h-11 flex items-center justify-center rounded-md font-medium transition-all duration-200 hover:scale-[0.98] border-[#e51083] text-[#e51083] hover:bg-[#e51083] hover:text-white bg-transparent"
                      >
                        {t("readMore")}
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8 sm:mt-12 animate-fade-in-up">
            <Link href="/projects">
              <Button className="bg-[#e51083] hover:bg-[#c50e73] text-white hover:scale-105 transition-all duration-300 w-full sm:w-auto">
                {t("viewAllProjects")} <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 8. Latest Blogs Carousel - Mobile Horizontal Scroll */}
      <section className="py-12 sm:py-16 md:py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 sm:mb-12 animate-fade-in-up">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
              {t("latestStories")}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
              {t("storiesDescription")}
            </p>
          </div>

          {/* Mobile: Horizontal scrolling carousel */}
          <div className="md:hidden">
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
              {featuredPosts.map((post, index) => (
                <Card
                  key={post.id}
                  className="flex-shrink-0 w-72 overflow-hidden hover:shadow-lg transition-all duration-300 animate-fade-in-up"
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  <div className="relative">
                    <Image
                      src={post.image || "/placeholder.svg"}
                      alt={post.title}
                      width={300}
                      height={200}
                      className="w-full h-40 object-cover"
                    />
                    <Badge className="absolute top-3 left-3 bg-[#e51083] text-xs">
                      {post.category}
                    </Badge>
                  </div>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base line-clamp-2">
                      {post.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-gray-400 line-clamp-2 mb-3 text-sm">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">{post.date}</span>
                      <Link
                        href={`/blog/${post.id}`}
                        className="text-[#e51083] hover:text-[#c50e73] font-semibold text-xs transition-colors duration-300"
                      >
                        {t("readMore")}
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Desktop: Grid with carousel controls */}
          <div className="hidden md:block relative max-w-6xl mx-auto">
            <div className="grid grid-cols-3 gap-8">
              {featuredPosts
                .slice(currentBlog, currentBlog + 3)
                .map((post, index) => (
                  <Card
                    key={post.id}
                    className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-105 animate-fade-in-up"
                    style={{ animationDelay: `${index * 200}ms` }}
                  >
                    <div className="relative">
                      <Image
                        src={post.image || "/placeholder.svg"}
                        alt={post.title}
                        width={300}
                        height={200}
                        className="w-full h-48 object-cover"
                      />
                      <Badge className="absolute top-4 left-4 bg-[#e51083]">
                        {post.category}
                      </Badge>
                    </div>
                    <CardHeader>
                      <CardTitle className="text-lg line-clamp-2">
                        {post.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 dark:text-gray-400 line-clamp-3 mb-4">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">
                          {post.date}
                        </span>
                        <Link
                          href={`/blog/${post.id}`}
                          className="text-[#e51083] hover:text-[#c50e73] font-semibold text-sm transition-colors duration-300"
                        >
                          {t("readMore")}
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={prevBlog}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 hover:scale-110 transition-transform duration-300"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={nextBlog}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 hover:scale-110 transition-transform duration-300"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>

          <div className="text-center mt-8 sm:mt-12 animate-fade-in-up">
            <Link href="/blog">
              <Button
                variant="outline"
                className="border-[#e51083] text-[#e51083] hover:bg-[#e51083] hover:text-white bg-transparent hover:scale-105 transition-all duration-300 w-full sm:w-auto"
              >
                {t("viewAllPosts")} <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Sticky Scroll Buttons */}
      <div className="fixed right-3 sm:right-4 bottom-3 sm:bottom-4 flex flex-col space-y-2 z-50">
        <Button
          size="sm"
          onClick={scrollToTop}
          className="bg-[#e51083] hover:bg-[#c50e73] text-white rounded-full p-2 hover:scale-110 transition-all duration-300 w-8 h-8 sm:w-10 sm:h-10"
        >
          <ArrowUp className="h-3 w-3 sm:h-4 sm:w-4" />
        </Button>
        <Button
          size="sm"
          onClick={scrollToBottom}
          className="bg-[#e51083] hover:bg-[#c50e73] text-white rounded-full p-2 hover:scale-110 transition-all duration-300 w-8 h-8 sm:w-10 sm:h-10"
        >
          <ArrowDown className="h-3 w-3 sm:h-4 sm:w-4" />
        </Button>
      </div>
    </div>
  );
}
