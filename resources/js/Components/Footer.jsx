import { useState } from "react";
import { Link } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
} from "lucide-react";

// TikTok icon component since it's not in lucide-react
const TikTokIcon = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
  </svg>
);

export function Footer() {
  const [email, setEmail] = useState("");

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (email) {
      alert("Thank you for subscribing to our newsletter!");
      setEmail("");
    }
  };

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4"></div>
            <p className="text-gray-400 mb-6">
              Empowering girls through education, technology, and community support 
              to create lasting change in underserved communities across Kenya.
            </p>

            {/* Newsletter Subscription */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4">
                Subscribe to Newsletter
              </h3>
              <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                  required
                />
                <Button
                  type="submit"
                  className="bg-[#e51083] hover:bg-[#c50e73]"
                >
                  Subscribe
                </Button>
              </form>
            </div>

            {/* Social Media Icons */}
            <div className="flex space-x-4">
              <Link
                href="https://www.facebook.com/profile.php?id=61568344795094"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-[#e51083] hover:bg-transparent p-2"
                >
                  <Facebook className="h-5 w-5" />
                </Button>
              </Link>
              <Link
                href="https://www.instagram.com/bidiigirlsprogram?igsh=MTB4ZWRmOHh1M2txdw=="
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-[#e51083] hover:bg-transparent p-2"
                >
                  <Instagram className="h-5 w-5" />
                </Button>
              </Link>
              <Link
                href="https://www.tiktok.com/@jossysimonet?_t=ZM-8yjgd3TPjC1&_r=1"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-[#e51083] hover:bg-transparent p-2"
                >
                  <TikTokIcon className="h-5 w-5" />
                </Button>
              </Link>
              <Link
                href="https://www.youtube.com/@Bidiigirlsprogram"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-[#e51083] hover:bg-transparent p-2"
                >
                  <Youtube className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/about"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/projects"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Our Projects
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/gallery"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Gallery
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/login"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Admin
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-[#e51083]" />
                <span className="text-gray-400">
                  support@bidiigirlsprogramme.org
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-[#e51083]" />
                <span className="text-gray-400">+254 728 078 066</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-[#e51083]" />
                <span className="text-gray-400">Nairobi, Kenya</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © {new Date().getFullYear()} Bidii Girls Program.{" "}
            All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
