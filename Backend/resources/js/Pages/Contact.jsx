import { Head } from "@inertiajs/react";
import { useState } from "react";
import { Link } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Facebook,
  Instagram,
  Youtube,
} from "lucide-react";
import GuestLayout from "@/Layouts/GuestLayout";

const API_BASE_URL = window.location.origin + '/api';

export default function Contact({ auth }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        toast({
          title: "Message Sent!",
          description:
            "Thank you for contacting us. We'll get back to you soon.",
        });
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        toast({
          title: "Error",
          description:
            result.error || "Failed to send message. Please try again.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <GuestLayout>
      <Head title="Contact Us" />
      
      <div>
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-r from-[#e51083] to-pink-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Contact Us</h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto">
              Get in touch with us to learn more about our work or how you can get
              involved
            </p>
          </div>
        </section>

        {/* Contact Content */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <div>
                <h2 className="text-3xl font-bold mb-8">Send us a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      name="message"
                      rows={6}
                      value={formData.message}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-[#e51083] hover:bg-[#c50e73]"
                    disabled={isLoading}
                  >
                    {isLoading ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </div>

              {/* Contact Information */}
              <div className="space-y-8">
                <div>
                  <h2 className="text-3xl font-bold mb-8">Get in Touch</h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-8">
                    We'd love to hear from you. Whether you're interested in
                    volunteering, partnering with us, or simply want to learn more
                    about our work, don't hesitate to reach out.
                  </p>
                </div>

                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Mail className="h-5 w-5 text-[#e51083]" />
                        <span>Email</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>support@bidiigirlsprogramme.org</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        We typically respond within 24 hours
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Phone className="h-5 w-5 text-[#e51083]" />
                        <span>Phone</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>+254 728 078 066</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Monday - Friday, 9:00 AM - 5:00 PM EAT
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <MapPin className="h-5 w-5 text-[#e51083]" />
                        <span>Address</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>PO BOX 16067-00610,</p>
                      <p>Nairobi, Kenya</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <span>Social Media</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex space-x-4">
                        <Link
                          href="https://www.facebook.com/profile.php?id=61568344795094"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-600 hover:text-[#e51083]"
                        >
                          <Facebook className="h-6 w-6" />
                        </Link>
                        <Link
                          href="https://www.instagram.com/bidiigirlsprogram?igsh=MTB4ZWRmOHh1M2txdw=="
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-600 hover:text-[#e51083]"
                        >
                          <Instagram className="h-6 w-6" />
                        </Link>
                        <Link
                          href="https://www.youtube.com/@Bidiigirlsprogram"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-600 hover:text-[#e51083]"
                        >
                          <Youtube className="h-6 w-6" />
                        </Link>
                        <Link
                          href="https://www.tiktok.com/@jossysimonet?_t=ZM-8yjgd3TPjC1&_r=1"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-600 hover:text-[#e51083]"
                        >
                          <svg
                            className="h-6 w-6"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                          </svg>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Map Section */}
        <section className="py-20 bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-8">Find Us</h2>
            <div className="bg-gray-300 dark:bg-gray-700 h-96 rounded-lg flex items-center justify-center">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.81956079669!2d36.79694431475399!3d-1.307923999047647!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f11354b0f0a5d%3A0x5b0b5b5b5b5b5b5b!2sKibera%2C%20Nairobi%2C%20Kenya!5e0!3m2!1sen!2ske!4v1620000000000!5m2!1sen!2ske"
                width="100%"
                height="100%"
                className="rounded-lg"
                allowFullScreen
                loading="lazy"
              ></iframe>
            </div>
          </div>
        </section>
      </div>
    </GuestLayout>
  );
}
