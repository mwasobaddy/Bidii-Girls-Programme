import { useState, useEffect } from "react";
import { Head, Link } from "@inertiajs/react";
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
  Target,
  Building,
  GraduationCap,
} from "lucide-react";
import { DonateButton } from "@/components/donate-button";
import GuestLayout from "@/Layouts/GuestLayout";
import { useLanguage } from "@/hooks/use-language.jsx";
import { useToast } from "@/hooks/use-toast.jsx";

const API_BASE_URL = window.location.origin + '/api';

// Helper function to construct proper image URLs
function getImageUrl(imagePath) {
  if (!imagePath) return "/placeholder.svg";
  
  // If it's already a full URL or base64, return as is
  if (imagePath.startsWith('http') || imagePath.startsWith('data:')) {
    return imagePath;
  }
  
  // If it's a relative path, prepend the backend URL
  const BACKEND_URL = API_BASE_URL.replace('/api', '');
  return `${BACKEND_URL}${imagePath}`;
}



// Remove this duplicate function declaration and its code above

export default function Welcome({ auth, campaigns: initialCampaigns = [], projects: initialProjects = [], sponsors: initialSponsors = [] }) {
  const [sponsors, setSponsors] = useState(initialSponsors);
  const [sponsorsLoading, setSponsorsLoading] = useState(false);
  const [campaigns, setCampaigns] = useState(initialCampaigns);
  const [campaignsLoading, setCampaignsLoading] = useState(false);
  const [projects, setProjects] = useState(initialProjects);
  const [projectsLoading, setProjectsLoading] = useState(false);
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

  // Featured posts state
  const [featuredPosts, setFeaturedPosts] = useState([]);
  const [featuredPostsLoading, setFeaturedPostsLoading] = useState(false);

  // Fetch featured posts from backend
  useEffect(() => {
    const fetchFeaturedPosts = async () => {
      setFeaturedPostsLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/featured-posts`);
        if (response.ok) {
          const posts = await response.json();
          setFeaturedPosts(posts);
        } else {
          setFeaturedPosts([]);
        }
      } catch (error) {
        setFeaturedPosts([]);
      } finally {
        setFeaturedPostsLoading(false);
      }
    };
    fetchFeaturedPosts();
  }, []);

  // Fetch sponsors from database
  useEffect(() => {
    const fetchSponsors = async () => {
      try {
        setSponsorsLoading(true);
        const response = await fetch(`${API_BASE_URL}/sponsors`);
        if (response.ok) {
          const sponsorsData = await response.json();
          setSponsors(sponsorsData);
        } else {
          console.error('Failed to fetch sponsors');
          setSponsors([]);
        }
      } catch (error) {
        console.error('Error fetching sponsors:', error);
        setSponsors([]);
      } finally {
        setSponsorsLoading(false);
      }
    };

    if (initialSponsors.length === 0) {
      fetchSponsors();
    }
  }, []);

  // Fetch campaigns from database
  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        setCampaignsLoading(true);
        const response = await fetch(`${API_BASE_URL}/campaigns`);
        if (response.ok) {
          const campaignsData = await response.json();
          setCampaigns(campaignsData);
        } else {
          console.error('Failed to fetch campaigns');
          setCampaigns([]);
        }
      } catch (error) {
        console.error('Error fetching campaigns:', error);
        setCampaigns([]);
      } finally {
        setCampaignsLoading(false);
      }
    };

    if (initialCampaigns.length === 0) {
      fetchCampaigns();
    }
  }, []);

  // Fetch projects from database
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setProjectsLoading(true);
        const response = await fetch(`${API_BASE_URL}/projects`);
        if (response.ok) {
          const projectsData = await response.json();
          setProjects(projectsData);
        } else {
          console.error('Failed to fetch projects');
          setProjects([]);
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
        setProjects([]);
      } finally {
        setProjectsLoading(false);
      }
    };

    if (initialProjects.length === 0) {
      fetchProjects();
    }
  }, []);

  const nextSponsor = () => {
    if (sponsors.length > 0) {
      setCurrentSponsor((prev) => (prev + 1) % sponsors.length);
    }
  };

  const prevSponsor = () => {
    if (sponsors.length > 0) {
      setCurrentSponsor((prev) => (prev - 1 + sponsors.length) % sponsors.length);
    }
  };

  const nextBlog = () => {
    setCurrentBlog((prev) => (prev + 1) % featuredPosts.length);
  };

  const prevBlog = () => {
    setCurrentBlog(
      (prev) => (prev - 1 + featuredPosts.length) % featuredPosts.length
    );
  };

  const handlePartnerSubmit = (e) => {
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

  const handleVolunteerSubmit = (e) => {
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
    <GuestLayout>
      <Head title="Home" />
      
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
                  <Button variant="outline" size="lg" className="border-white text-white bg-transparent hover:bg-white hover:text-black">
                    {t("learnMore")}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>

              {/* Mobile: Horizontal layout for statistics */}
              <div className="flex flex-row justify-center gap-4 sm:gap-6 md:hidden mt-8 pt-8 border-t border-white/20 animate-slide-up animation-delay-600">
                <div className="text-center flex-1">
                  <div className="text-2xl sm:text-3xl font-bold text-[#e51083] mb-1">1,500+</div>
                  <div className="text-xs sm:text-sm text-gray-300">{t("girlsSupported")}</div>
                </div>
                <div className="text-center flex-1">
                  <div className="text-2xl sm:text-3xl font-bold text-[#e51083] mb-1">50+</div>
                  <div className="text-xs sm:text-sm text-gray-300">{t("schoolsReached")}</div>
                </div>
                <div className="text-center flex-1">
                  <div className="text-2xl sm:text-3xl font-bold text-[#e51083] mb-1">5+</div>
                  <div className="text-xs sm:text-sm text-gray-300">{t("yearsImpact")}</div>
                </div>
              </div>

              {/* Desktop: Grid layout for statistics */}
              <div className="hidden md:grid grid-cols-3 gap-8 mt-16 pt-16 border-t border-white/20 animate-slide-up animation-delay-600">
                <div className="text-center">
                  <div className="text-4xl font-bold text-[#e51083] mb-2">1,500+</div>
                  <div className="text-gray-300">{t("girlsSupported")}</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-[#e51083] mb-2">50+</div>
                  <div className="text-gray-300">{t("schoolsReached")}</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-[#e51083] mb-2">5+</div>
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
              {campaignsLoading ? (
                <div className="col-span-full flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#e51083]"></div>
                </div>
              ) : campaigns.length === 0 ? (
                <div className="col-span-full text-center py-8 text-gray-600">
                  No campaigns available at the moment.
                </div>
              ) : (
                campaigns.slice(0, 2).map((campaign, index) => (
                  <Card
                    key={campaign.id}
                    className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-105 animate-fade-in-up"
                    style={{ animationDelay: `${index * 200}ms` }}
                  >
                    <div className="relative h-48">
                      <img
                        src={getImageUrl(campaign.image)}
                        alt={campaign.title}
                        className="w-full h-full object-cover"
                      />
                      <Badge className="absolute top-4 left-4 bg-[#e51083]">
                        {campaign.status || 'Active'}
                      </Badge>
                    </div>
                    <CardHeader>
                      <CardTitle className="line-clamp-2 text-sm">{campaign.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4 line-clamp-2 text-xs">
                        {campaign.description}
                      </p>
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-xs">
                          <span>{t("raised")}</span>
                          <span>{campaign.progress_percentage || 0}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div
                            className="bg-[#e51083] h-1.5 rounded-full transition-all duration-300"
                            style={{ width: `${campaign.progress_percentage || 0}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-xs">
                          <span>KES {campaign.amount_raised?.toLocaleString() || 0}</span>
                          <span>KES {campaign.target_amount?.toLocaleString() || 0}</span>
                        </div>
                      </div>
                      <DonateButton className="w-full text-xs py-2" />
                    </CardContent>
                  </Card>
                ))
              )}
            </div>

            {/* Desktop: Show all 3 campaigns */}
            <div className="hidden md:grid grid-cols-3 gap-8">
              {campaignsLoading ? (
                <div className="col-span-full flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#e51083]"></div>
                </div>
              ) : campaigns.length === 0 ? (
                <div className="col-span-full text-center py-8 text-gray-600">
                  No campaigns available at the moment.
                </div>
              ) : (
                campaigns.slice(0, 3).map((campaign, index) => (
                  <Card
                    key={campaign.id}
                    className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-105 animate-fade-in-up flex flex-col justify-between"
                    style={{ animationDelay: `${index * 200}ms` }}
                  >
                    <div className="relative h-48">
                      <img
                        src={getImageUrl(campaign.image)}
                        alt={campaign.title}
                        className="w-full h-full object-cover"
                      />
                      <Badge className="absolute top-4 left-4 bg-[#e51083]">
                        {campaign.status || 'Active'}
                      </Badge>
                    </div>
                    <CardHeader>
                      <CardTitle className="line-clamp-2">{campaign.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {campaign.description}
                      </p>
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-sm">
                          <span>{t("raised")}</span>
                          <span>{campaign.progress_percentage || 0}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-[#e51083] h-2 rounded-full transition-all duration-300"
                            style={{ width: `${campaign.progress_percentage || 0}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>KES {campaign.amount_raised?.toLocaleString() || 0}</span>
                          <span>KES {campaign.target_amount?.toLocaleString() || 0}</span>
                        </div>
                      </div>
                      <DonateButton className="w-full" />
                    </CardContent>
                  </Card>
                ))
              )}
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
              {sponsorsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#e51083]"></div>
                </div>
              ) : sponsors.length === 0 ? (
                <div className="text-center py-8 text-gray-600">
                  No sponsors available at the moment.
                </div>
              ) : (
                <>
                  <div className="flex flex-row justify-center gap-6">
                    {sponsors.slice(currentSponsor, currentSponsor + 4).map((sponsor) => (
                      <div key={sponsor.id} className="text-center p-4">
                        <img
                          src={getImageUrl(sponsor.logo)}
                          alt={sponsor.name}
                          className="h-16 mx-auto mb-2 object-contain"
                        />
                        <p className="text-sm text-gray-600 dark:text-gray-400">{sponsor.name}</p>
                      </div>
                    ))}
                  </div>
                  {sponsors.length > 4 && (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={prevSponsor}
                        className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={nextSponsor}
                        className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </Button>
                    </>
                  )}
                </>
              )}
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
                  <div>
                    <div className="text-2xl sm:text-3xl font-bold text-[#e51083] mb-2">15,000+</div>
                    <div className="text-sm sm:text-base text-gray-600 dark:text-gray-400">{t("productsDistributed")}</div>
                  </div>
                  <div>
                    <div className="text-2xl sm:text-3xl font-bold text-[#e51083] mb-2">95%</div>
                    <div className="text-sm sm:text-base text-gray-600 dark:text-gray-400">{t("attendanceRate")}</div>
                  </div>
                </div>

                <Link href="/about">
                  <Button className="bg-[#e51083] hover:bg-[#c50e73] text-white">
                    {t("learnMoreAboutUs")}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
              <div className="animate-fade-in-right">
                <img
                  src="/about-homepage.png?height=500&width=600"
                  alt="organization stats"
                  width={600}
                  height={500}
                  className="rounded-lg hover:scale-105 transition-transform duration-300 w-full"
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
                <Card
                  key={index}
                  className="text-center p-6 sm:p-8 hover:shadow-lg transition-all duration-300 hover:scale-105 animate-fade-in-up"
                  style={{ animationDelay: item.delay }}
                >
                  <CardContent className="pt-6">
                    <item.icon className="h-12 w-12 sm:h-16 sm:w-16 text-[#e51083] mx-auto mb-4" />
                    <h3 className="text-lg sm:text-xl font-semibold mb-4">{item.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">{item.description}</p>
                  </CardContent>
                </Card>
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
                    className="bg-white text-[#e51083] hover:bg-gray-100"
                  >
                    <Building className="mr-2 h-4 w-4" />
                    {t("becomePartner")}
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>{t("partnershipInquiry")}</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handlePartnerSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="partner-name">{t("fullName")}</Label>
                      <Input
                        id="partner-name"
                        value={partnerForm.fullName}
                        onChange={(e) =>
                          setPartnerForm({ ...partnerForm, fullName: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="partner-email">{t("emailAddress")}</Label>
                      <Input
                        id="partner-email"
                        type="email"
                        value={partnerForm.email}
                        onChange={(e) =>
                          setPartnerForm({ ...partnerForm, email: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="partner-phone">{t("whatsappNumber")}</Label>
                      <Input
                        id="partner-phone"
                        value={partnerForm.phoneNumber}
                        onChange={(e) =>
                          setPartnerForm({ ...partnerForm, phoneNumber: e.target.value })
                        }
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full bg-[#e51083] hover:bg-[#c50e73]">
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
                    className="border-white text-white bg-transparent hover:bg-white hover:text-[#e51083]"
                  >
                    <Users className="mr-2 h-4 w-4" />
                    {t("volunteerWithUs")}
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>{t("volunteerApplication")}</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleVolunteerSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="volunteer-name">{t("fullName")}</Label>
                      <Input
                        id="volunteer-name"
                        value={volunteerForm.fullName}
                        onChange={(e) =>
                          setVolunteerForm({ ...volunteerForm, fullName: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="volunteer-email">{t("emailAddress")}</Label>
                      <Input
                        id="volunteer-email"
                        type="email"
                        value={volunteerForm.email}
                        onChange={(e) =>
                          setVolunteerForm({ ...volunteerForm, email: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="volunteer-phone">{t("whatsappNumber")}</Label>
                      <Input
                        id="volunteer-phone"
                        value={volunteerForm.phoneNumber}
                        onChange={(e) =>
                          setVolunteerForm({ ...volunteerForm, phoneNumber: e.target.value })
                        }
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full bg-[#e51083] hover:bg-[#c50e73]">
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
              {projectsLoading ? (
                <div className="col-span-full flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#e51083]"></div>
                </div>
              ) : projects.length === 0 ? (
                <div className="col-span-full text-center py-8 text-gray-600">
                  No projects available at the moment.
                </div>
              ) : (
                projects.slice(0, 2).map((project, index) => (
                  <Card
                    key={project.id}
                    className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-105 animate-fade-in-up"
                    style={{ animationDelay: `${index * 200}ms` }}
                  >
                    <div className="relative h-48">
                      <img
                        src={getImageUrl(project.featured_image)}
                        alt={project.title}
                        className="w-full h-full object-cover"
                      />
                      <Badge className="absolute top-4 left-4 bg-blue-600">
                        {project.status || 'Active'}
                      </Badge>
                    </div>
                    <CardHeader>
                      <CardTitle className="line-clamp-2 text-sm">{project.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4 line-clamp-2 text-xs">
                        {project.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                          {project.location}
                        </span>
                        <Link href={`/projects/${project.id}`}>
                            <Button variant="outline" size="sm" className="gap-2 whitespace-nowrap text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border px-4 py-2 w-full h-11 flex items-center justify-center rounded-md font-medium transition-all duration-200 hover:scale-[0.98] border-[#e51083] text-[#e51083] hover:bg-[#e51083] hover:text-white bg-transparent">
                            {t("readMore")}
                            <ArrowRight className="ml-1 h-3 w-3" />
                            </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>

            {/* Desktop: Show all 3 projects */}
            <div className="hidden md:grid grid-cols-3 gap-8">
              {projectsLoading ? (
                <div className="col-span-full flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#e51083]"></div>
                </div>
              ) : projects.length === 0 ? (
                <div className="col-span-full text-center py-8 text-gray-600">
                  No projects available at the moment.
                </div>
              ) : (
                projects.slice(0, 3).map((project, index) => (
                  <Card
                    key={project.id}
                    className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-105 animate-fade-in-up"
                    style={{ animationDelay: `${index * 200}ms` }}
                  >
                    <div className="relative h-48">
                      <img
                        src={getImageUrl(project.featured_image)}
                        alt={project.title}
                        className="w-full h-full object-cover"
                      />
                      <Badge className="absolute top-4 left-4 bg-blue-600">
                        {project.status || 'Active'}
                      </Badge>
                    </div>
                    <CardHeader>
                      <CardTitle className="line-clamp-2">{project.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {project.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">
                          {project.location}
                        </span>
                        <Link href={`/projects/${project.id}`}>
                            <Button variant="outline" size="sm" className="gap-2 whitespace-nowrap text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border px-4 py-2 w-full h-11 flex items-center justify-center rounded-md font-medium transition-all duration-200 hover:scale-[0.98] border-[#e51083] text-[#e51083] hover:bg-[#e51083] hover:text-white bg-transparent">
                            {t("readMore")}
                            <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>

            <div className="text-center mt-8 sm:mt-12 animate-fade-in-up">
              <Link href="/projects">
                <Button variant="outline" className="border-[#e51083] text-[#e51083] hover:bg-[#e51083] hover:text-white">
                  {t("viewAllProjects")}
                  <ArrowRight className="ml-2 h-4 w-4" />
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
                  <Card key={post.id} className="flex-shrink-0 w-80 overflow-hidden">
                    <div className="relative h-40">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                      <Badge className="absolute top-2 left-2 bg-[#e51083] text-xs">
                        {post.category}
                      </Badge>
                    </div>
                    <CardHeader className="pb-2">
                      <CardTitle className="line-clamp-2 text-sm">{post.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 line-clamp-2 text-xs mb-2">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">{post.date}</span>
                          <Link href={`/blog/${post.id}`}>
                            <Button variant="outline" size="sm" className="gap-2 whitespace-nowrap text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border px-4 py-2 w-full h-11 flex items-center justify-center rounded-md font-medium transition-all duration-200 hover:scale-[0.98] border-[#e51083] text-[#e51083] hover:bg-[#e51083] hover:text-white bg-transparent">
                              {t("readMore")}
                              <ArrowRight className="ml-1 h-3 w-3" />
                            </Button>
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
                {featuredPosts.slice(currentBlog, currentBlog + 3).map((post, index) => (
                  <Card
                    key={post.id}
                    className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-105 animate-fade-in-up"
                    style={{ animationDelay: `${index * 200}ms` }}
                  >
                    <div className="relative h-48">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                      <Badge className="absolute top-4 left-4 bg-[#e51083]">
                        {post.category}
                      </Badge>
                    </div>
                    <CardHeader>
                      <CardTitle className="line-clamp-2">{post.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">{post.date}</span>
                          <Link href={`/blog/${post.id}`}>
                            <Button variant="outline" size="sm" className="gap-2 whitespace-nowrap text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border px-4 py-2 w-full h-11 flex items-center justify-center rounded-md font-medium transition-all duration-200 hover:scale-[0.98] border-[#e51083] text-[#e51083] hover:bg-[#e51083] hover:text-white bg-transparent">
                              {t("readMore")}
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
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
                <Button variant="outline" className="border-[#e51083] text-[#e51083] hover:bg-[#e51083] hover:text-white">
                  {t("viewAllPosts")}
                  <ArrowRight className="ml-2 h-4 w-4" />
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
    </GuestLayout>
  );
}
