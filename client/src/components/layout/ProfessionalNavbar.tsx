import React, { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Brain,
  Home,
  MessageCircle,
  Calendar,
  ClipboardList,
  BookOpen,
  Users,
  BarChart3,
  Info,
  Menu,
  User,
  LogOut,
  AlertTriangle,
  Phone,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const ProfessionalNavbar: React.FC = () => {
  const { currentUser: firebaseUser, logout } = useAuth();
  const [location, setLocation] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll effect for navbar transparency
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navigationItems = [
    {
      href: "/",
      label: "Home",
      icon: Home,
    },
    {
      href: "/chat",
      label: "AI Chat",
      icon: MessageCircle,
    },
    {
      href: "/appointments",
      label: "Appointments",
      icon: Calendar,
    },
    {
      href: "/assessments",
      label: "Assessments",
      icon: ClipboardList,
    },
    {
      href: "/resources",
      label: "Resources",
      icon: BookOpen,
    },
    {
      href: "/community",
      label: "Community",
      icon: Users,
    },
    {
      href: "/analytics",
      label: "Analytics",
      icon: BarChart3,
    },
    {
      href: "/crisis",
      label: "Crisis",
      icon: AlertTriangle,
    },
    {
      href: "/contact",
      label: "Contact",
      icon: Phone,
    },
    {
      href: "/about",
      label: "About",
      icon: Info,
    },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      setLocation("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const getUserDisplayName = () => {
    if (firebaseUser?.displayName) return firebaseUser.displayName;
    if (firebaseUser?.email) return firebaseUser.email.split("@")[0];
    return "User";
  };

  const getUserInitials = () => {
    const name = getUserDisplayName();
    return name.charAt(0).toUpperCase();
  };

  const isActivePath = (href: string) => {
    if (href === "/" && location === "/") return true;
    if (href !== "/" && location.startsWith(href)) return true;
    return false;
  };

  return (
    <header className="bg-white backdrop-blur-xl border-b-2 border-gray-500 shadow-2xl sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between h-16 sm:h-18 md:h-20 lg:h-16 px-4 sm:px-6 md:px-8 lg:px-6 xl:px-8">
          {/* Logo - Responsive sizing */}
          <div className="flex items-center flex-shrink-0">
            <Link href="/">
              <div className="flex items-center space-x-2 sm:space-x-3 cursor-pointer hover:opacity-80 transition-opacity">
                <div className="h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 lg:h-11 lg:w-11 xl:h-12 xl:w-12 bg-gradient-to-br from-blue-800 to-indigo-900 rounded-xl flex items-center justify-center shadow-xl border-2 border-blue-600">
                  <Brain className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 lg:h-5 lg:w-5 xl:h-6 xl:w-6 text-white" />
                </div>
                <div className="hidden xs:block">
                  <h1 className="text-lg sm:text-xl md:text-2xl lg:text-xl xl:text-2xl font-black text-gray-900 leading-tight">
                    InnerSpring
                  </h1>
                  <p className="text-sm sm:text-base md:text-lg lg:text-sm xl:text-base text-gray-800 -mt-0.5 hidden sm:block font-bold">
                    Mental Health Platform
                  </p>
                </div>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation - Hidden on mobile/tablet */}
          <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2">
            {navigationItems.slice(0, 6).map((item) => (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={isActivePath(item.href) ? "default" : "ghost"}
                  size="sm"
                  className={cn(
                    "h-12 lg:h-11 xl:h-12 px-4 lg:px-5 xl:px-6 text-sm lg:text-sm xl:text-base font-bold transition-all duration-200 border-2 rounded-lg shadow-lg",
                    isActivePath(item.href)
                      ? "bg-blue-800 text-white hover:bg-blue-900 shadow-2xl border-blue-700 ring-2 ring-blue-300"
                      : "text-gray-900 hover:text-black hover:bg-gray-200 border-gray-500 hover:border-gray-600 hover:shadow-xl bg-gray-100"
                  )}
                >
                  <item.icon className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span className="hidden xl:inline">{item.label}</span>
                </Button>
              </Link>
            ))}

            {/* More dropdown for desktop */}
            {navigationItems.length > 6 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-12 lg:h-11 xl:h-12 px-4 lg:px-5 xl:px-6 text-sm lg:text-sm xl:text-base font-bold text-gray-900 hover:text-black hover:bg-gray-200 border-2 border-gray-500 hover:border-gray-600 hover:shadow-xl bg-gray-100 rounded-lg shadow-lg"
                  >
                    <Menu className="h-4 w-4 mr-2" />
                    <span className="hidden xl:inline">More</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 bg-white/98 backdrop-blur-lg shadow-xl border border-gray-300">
                  {navigationItems.slice(6).map((item) => (
                    <DropdownMenuItem key={item.href} asChild>
                      <Link href={item.href} className="flex items-center text-gray-800 hover:text-gray-900">
                        <item.icon className="mr-2 h-4 w-4" />
                        <span>{item.label}</span>
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </nav>

          {/* Tablet Navigation - Visible on medium screens */}
          <nav className="hidden md:flex lg:hidden items-center space-x-1">
            {navigationItems.slice(0, 4).map((item) => (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={isActivePath(item.href) ? "default" : "ghost"}
                  size="sm"
                  className={cn(
                    "h-12 md:h-14 px-3 md:px-4 text-sm md:text-base font-bold border-2 rounded-lg shadow-lg",
                    isActivePath(item.href)
                      ? "bg-blue-800 text-white hover:bg-blue-900 border-blue-700 shadow-2xl ring-2 ring-blue-300"
                      : "text-gray-900 hover:text-black hover:bg-gray-200 border-gray-500 hover:border-gray-600 bg-gray-100 hover:shadow-xl"
                  )}
                >
                  <item.icon className="h-3.5 w-3.5" />
                </Button>
              </Link>
            ))}

            {/* More dropdown for tablet */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-12 md:h-14 px-3 md:px-4 text-sm md:text-base font-bold text-gray-900 hover:text-black hover:bg-gray-200 border-2 border-gray-500 hover:border-gray-600 bg-gray-100 hover:shadow-xl rounded-lg shadow-lg">
                  <Menu className="h-3.5 w-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-white/98 backdrop-blur-lg shadow-xl border border-gray-300">
                {navigationItems.slice(4).map((item) => (
                  <DropdownMenuItem key={item.href} asChild>
                    <Link href={item.href} className="flex items-center text-gray-800 hover:text-gray-900">
                      <item.icon className="mr-2 h-4 w-4" />
                      <span>{item.label}</span>
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>

          {/* Right side - User Menu & Mobile Menu */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* User Menu - Always visible */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="relative h-12 w-12 sm:h-13 sm:w-13 md:h-14 md:w-14 lg:h-12 lg:w-12 xl:h-14 xl:w-14 rounded-full hover:bg-gray-200 border-2 border-gray-500 hover:border-gray-600 transition-all shadow-xl hover:shadow-2xl bg-gray-100"
                >
                  <Avatar className="h-10 w-10 sm:h-11 sm:w-11 md:h-12 md:w-12 lg:h-10 lg:w-10 xl:h-12 xl:w-12">
                    <AvatarImage
                      src={firebaseUser?.photoURL || undefined}
                      alt={getUserDisplayName()}
                    />
                    <AvatarFallback className="bg-gradient-to-br from-blue-800 to-indigo-900 text-white text-sm sm:text-base md:text-lg lg:text-sm xl:text-lg font-black border-2 border-blue-600">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-white/98 backdrop-blur-lg shadow-xl border border-gray-300">
                <DropdownMenuLabel className="text-gray-800">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {getUserDisplayName()}
                    </p>
                    <p className="text-xs leading-none text-gray-600">
                      {firebaseUser?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-gray-300" />
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="flex items-center text-gray-800">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-gray-300" />
                <DropdownMenuItem 
                  onClick={handleLogout}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 cursor-pointer"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Menu Button - Only visible on mobile */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-12 w-12 sm:h-14 sm:w-14 p-0 md:hidden hover:bg-gray-200 border-2 border-gray-500 hover:border-gray-600 bg-gray-100 hover:shadow-xl rounded-lg shadow-lg"
                >
                  <Menu className="h-7 w-7 sm:h-8 sm:w-8 text-gray-900" />
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-[280px] sm:w-[320px] p-0 bg-white/98 backdrop-blur-lg shadow-2xl"
              >
                {/* Mobile Menu Header */}
                <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-300 bg-gray-50/80">
                  <div className="flex items-center space-x-3">
                    <div className="h-8 w-8 bg-gradient-to-br from-blue-700 to-indigo-700 rounded-lg flex items-center justify-center shadow-lg">
                      <Brain className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-gray-800">
                        InnerSpring
                      </h2>
                      <p className="text-xs text-gray-600">
                        Mental Health Platform
                      </p>
                    </div>
                  </div>
                  <SheetClose asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-gray-200">
                      <X className="h-4 w-4" />
                    </Button>
                  </SheetClose>
                </div>

                {/* Mobile Navigation */}
                <div className="flex flex-col p-4 sm:p-6 space-y-2">
                  <div className="mb-4">
                    <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
                      Navigation
                    </h3>
                  </div>

                  {navigationItems.map((item, index) => (
                    <Link key={item.href} href={item.href}>
                      <SheetClose asChild>
                        <Button
                          variant={
                            isActivePath(item.href) ? "default" : "ghost"
                          }
                          className={cn(
                            "w-full justify-start h-12 px-4 text-sm font-medium transition-all duration-200 touch-manipulation border",
                            isActivePath(item.href)
                              ? "bg-blue-700 text-white hover:bg-blue-800 shadow-lg border-blue-600"
                              : "text-gray-800 hover:text-gray-900 hover:bg-gray-200 active:bg-gray-300 border-transparent hover:border-gray-300"
                          )}
                        >
                          <item.icon className="h-5 w-5 mr-3 flex-shrink-0" />
                          <span className="flex-1 text-left">{item.label}</span>
                          {isActivePath(item.href) && (
                            <div className="h-2 w-2 bg-white rounded-full animate-pulse" />
                          )}
                        </Button>
                      </SheetClose>
                    </Link>
                  ))}

                  {/* Mobile User Actions */}
                  <div className="mt-6 pt-6 border-t border-gray-300">
                    <div className="flex items-center space-x-3 mb-4 p-3 bg-gray-100 rounded-lg border border-gray-200">
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={firebaseUser?.photoURL || undefined}
                          alt={getUserDisplayName()}
                        />
                        <AvatarFallback className="bg-gradient-to-br from-blue-700 to-indigo-700 text-white font-semibold">
                          {getUserInitials()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate">
                          {getUserDisplayName()}
                        </p>
                        <p className="text-xs text-gray-600 truncate">
                          {firebaseUser?.email}
                        </p>
                      </div>
                    </div>

                    <Button
                      variant="ghost"
                      onClick={handleLogout}
                      className="w-full justify-start h-11 text-red-600 hover:text-red-700 hover:bg-red-50 border border-transparent hover:border-red-200"
                    >
                      <LogOut className="h-4 w-4 mr-3" />
                      Log out
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
};

export default ProfessionalNavbar;