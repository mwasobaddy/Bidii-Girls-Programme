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
import { Link } from "@inertiajs/react";
import { DonateButton } from "@/components/donate-button";

const navigation = [
  { name: "HOME", href: "/" },
  { name: "ABOUT", href: "/about" },
  { name: "PROJECTS", href: "/projects" },
  { name: "BLOG", href: "/blog" },
  { name: "GALLERY", href: "/gallery" },
  { name: "CONTACT", href: "/contact" },
];

const languages = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "sw", name: "Kiswahili", flag: "🇰🇪" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState('light');
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    setMounted(true);
    // Check for saved theme preference or default to light
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    // Apply theme class to document
    document.documentElement.classList.toggle('dark', savedTheme === 'dark');
  }, []);

  const handleNavClick = () => {
    setIsOpen(false);
    // Scroll to top when navigating
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  if (!mounted) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex justify-center">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center space-x-2 hover:scale-105 transition-transform duration-300 pl-[10px]"
          onClick={handleNavClick}
        >
            <img
              src="/logo.webp"
              alt="Bidii Girls Program"
              width={100}
              height={120}
              className="rounded-full"
            />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center space-x-6 text-sm font-medium md:flex">
            {navigation.map((item) => {
              const isHome = item.href === "/";
              const isActive = isHome
                ? window.location.pathname === "/"
                : window.location.pathname.startsWith(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`transition-all duration-200 hover:underline hover:text-pink-600 !font-[900] ${
                    isActive ? 'underline text-pink-600' : 'text-foreground/60'
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden items-center space-x-4 md:flex">
          {/* Language Selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-1">
                <Globe className="h-4 w-4" />
                <span className="hidden sm:inline">
                  {languages.find(lang => lang.code === language)?.name || 'English'}
                </span>
                <ChevronDown className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {languages.map((lang) => (
                <DropdownMenuItem
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  className="flex items-center gap-2"
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
          <Button variant="ghost" size="sm" onClick={toggleTheme}>
            {theme === 'light' ? (
              <Moon className="h-4 w-4" />
            ) : (
              <Sun className="h-4 w-4" />
            )}
          </Button>

          {/* Donate Button */}
          <DonateButton />
        </div>

        {/* Mobile Menu */}
        <div className="flex items-center space-x-2 md:hidden">
          {/* Mobile Theme Toggle */}
          <Button variant="ghost" size="sm" onClick={toggleTheme}>
            {theme === 'light' ? (
              <Moon className="h-4 w-4" />
            ) : (
              <Sun className="h-4 w-4" />
            )}
          </Button>

          {/* Mobile Menu Trigger */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col space-y-4">
                {/* Mobile Logo */}
                <div className="flex items-center space-x-2 pb-4 border-b">
                  <img
                    src="/logo.webp"
                    alt="Bidii Girls Programme"
                    className="h-8 w-8"
                  />
                  <span className="font-bold">Bidii Girls Programme</span>
                </div>

                {/* Mobile Navigation */}
                <nav className="flex flex-col space-y-3">
                    {navigation.map((item) => {
                      const isHome = item.href === "/";
                      const isActive = isHome
                        ? window.location.pathname === "/"
                        : window.location.pathname.startsWith(item.href);
                      return (
                        <Link
                          key={item.name}
                          href={item.href}
                          onClick={handleNavClick}
                          className={`text-lg font-medium transition-all duration-200 hover:underline hover:text-pink-600 ${
                            isActive ? 'underline text-pink-600' : 'text-foreground/60'
                          }`}
                        >
                          {item.name}
                        </Link>
                      );
                    })}
                </nav>

                {/* Mobile Language Selector */}
                <div className="pt-4 border-t">
                  <div className="text-sm font-medium mb-2">Language</div>
                  <div className="grid grid-cols-1 gap-2">
                    {languages.map((lang) => (
                      <Button
                        key={lang.code}
                        variant={language === lang.code ? "default" : "ghost"}
                        onClick={() => {
                          setLanguage(lang.code);
                          setIsOpen(false);
                        }}
                        className="justify-start gap-2"
                      >
                        <span>{lang.flag}</span>
                        <span>{lang.name}</span>
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Mobile Donate Button */}
                <div className="pt-4">
                  <DonateButton className="w-full" onClick={() => setIsOpen(false)} />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
