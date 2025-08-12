"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, X, ChevronDown, Sun, Moon, Globe } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";
import { useLanguage, type Language } from "@/hooks/use-language";
import { DonateButton } from "@/components/donate-button";
import { usePathname } from "next/navigation";

const navigation = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Projects", href: "/projects" },
  { name: "Blog", href: "/blog" },
  { name: "Gallery", href: "/gallery" },
  { name: "Contact", href: "/contact" },
];

const languages = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "sw", name: "Kiswahili", flag: "🇰🇪" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleNavClick = () => {
    setIsOpen(false);
    // Scroll to top when navigating
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 100);
  };

  const currentLanguage =
    languages.find((lang) => lang.code === language) || languages[0];

  if (!mounted) {
    return null;
  }

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800 z-50 transition-all duration-300">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center space-x-2 hover:scale-105 transition-transform duration-300"
            onClick={handleNavClick}
          >
            <Image
              src="/placeholder-logo.png"
              alt="Bidii Girls Program"
              width={100}
              height={120}
              className="rounded-full"
            />
            {/* <div className="flex flex-col">
              <span className="font-bold text-lg text-[#e51083] leading-tight">Bidii Girls</span>
              <span className="text-xs text-gray-600 dark:text-gray-400 leading-tight">Program</span>
            </div>*/}
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navigation.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`font-medium transition-colors duration-300 relative group uppercase text-sm tracking-wide ${
                    isActive
                      ? "text-[#e51083] dark:text-[#e51083]"
                      : "text-gray-700 dark:text-gray-300 hover:text-[#e51083] dark:hover:text-[#e51083]"
                  }`}
                  onClick={handleNavClick}
                >
                  {t(item.name.toLowerCase())}
                  <span
                    className={`absolute bottom-0 left-0 h-0.5 bg-[#e51083] transition-all duration-300 ${
                      isActive ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  ></span>
                </Link>
              );
            })}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center space-x-4">
            {/* Language Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center space-x-2 bg-transparent"
                >
                  <Globe className="h-4 w-4" />
                  <span className="text-sm">{currentLanguage.flag}</span>
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {languages.map((lang) => (
                  <DropdownMenuItem
                    key={lang.code}
                    onClick={() => setLanguage(lang.code as Language)}
                    className="flex items-center space-x-2"
                  >
                    <span>{lang.flag}</span>
                    <span>{lang.name}</span>
                    {language === lang.code && (
                      <Badge variant="secondary" className="ml-auto">
                        Active
                      </Badge>
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="hover:scale-110 transition-transform duration-300 bg-transparent"
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>

            {/* Donate Button */}
            <DonateButton className="!px-2 !py-1 sm:!px-4 sm:!py-2" />
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center space-x-2">
            <DonateButton className="!px-0.5 !py-0.5 text-xs sm:!px-4 sm:!py-2 sm:text-base !w-[70px] sm:!w-auto" />
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="hover:scale-110 transition-transform duration-300 bg-transparent"
                >
                  {isOpen ? (
                    <X className="h-5 w-5" />
                  ) : (
                    <Menu className="h-5 w-5" />
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col space-y-4 mt-8">
                  {/* Mobile Navigation */}
                  <nav className="flex flex-col space-y-4">
                    {navigation.map((item) => {
                      const isActive =
                        pathname === item.href ||
                        (item.href !== "/" && pathname.startsWith(item.href));
                      return (
                        <Link
                          key={item.name}
                          href={item.href}
                          onClick={handleNavClick}
                          className={`text-lg font-medium transition-colors duration-300 py-2 border-b border-gray-200 dark:border-gray-700 uppercase tracking-wide ${
                            isActive
                              ? "text-[#e51083] dark:text-[#e51083] border-[#e51083]"
                              : "text-gray-700 dark:text-gray-300 hover:text-[#e51083] dark:hover:text-[#e51083]"
                          }`}
                        >
                          {t(item.name.toLowerCase())}
                        </Link>
                      );
                    })}
                  </nav>

                  {/* Mobile Actions */}
                  <div className="flex flex-col space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    {/* Language Selector */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-between bg-transparent"
                        >
                          <div className="flex items-center space-x-2">
                            <Globe className="h-4 w-4" />
                            <span>{currentLanguage.name}</span>
                            <span>{currentLanguage.flag}</span>
                          </div>
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-56">
                        {languages.map((lang) => (
                          <DropdownMenuItem
                            key={lang.code}
                            onClick={() => setLanguage(lang.code as Language)}
                            className="flex items-center space-x-2"
                          >
                            <span>{lang.flag}</span>
                            <span>{lang.name}</span>
                            {language === lang.code && (
                              <Badge variant="secondary" className="ml-auto">
                                Active
                              </Badge>
                            )}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Theme Toggle */}
                    <Button
                      variant="outline"
                      onClick={() =>
                        setTheme(theme === "dark" ? "light" : "dark")
                      }
                      className="w-full justify-start space-x-2 bg-transparent"
                    >
                      {theme === "dark" ? (
                        <Sun className="h-4 w-4" />
                      ) : (
                        <Moon className="h-4 w-4" />
                      )}
                      <span>
                        {theme === "dark" ? "Light Mode" : "Dark Mode"}
                      </span>
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
