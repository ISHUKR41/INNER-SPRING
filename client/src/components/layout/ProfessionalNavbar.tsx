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

  // Navigation items - simplified without emojis
  const navigationItems = [
    {
      href: "/",
      label: "Home",
      icon: Home,
    },
    {
      href: "/chatbot",
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
      label: "Assessment",
      icon: ClipboardList,
    },
    {
      href: "/resources",
      label: "Resources",
      icon: BookOpen,
    },
    {
      href: "/peer-support",
      label: "Community",
      icon: Users,
    },
    {
      href: "/emergency",
      label: "Emergency",
      icon: AlertTriangle,
    },
    {
      href: "/crisis-help",
      label: "Crisis Help",
      icon: Phone,
    },
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: BarChart3,
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
    <header className="bg-white/95 backdrop-blur-md border-b border-gray-200/80 shadow-sm sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between h-14 sm:h-16 px-2 xs:px-3 sm:px-4 lg:px-6">
          
          {/* Logo - Responsive sizing */}
          <div className="flex items-center flex-shrink-0">
            <Link href="/">
              <div className="flex items-center space-x-2 sm:space-x-3 cursor-pointer hover:opacity-80 transition-opacity">
                <div className="h-8 w-8 sm:h-10 sm:w-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-md">
                  <Brain className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-white" />
                </div>
                <div className="hidden xs:block">
                  <h1 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 leading-tight">
                    InnerSpring
                  </h1>
                  <p className="text-xs text-gray-500 -mt-0.5 hidden sm:block">
                    Mental Health Platform
                  </p>
                </div>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation - Hidden on mobile and tablet */}
          <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2">
            {navigationItems.slice(0, 6).map((item) => (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={isActivePath(item.href) ? "default" : "ghost"}
                  size="sm"
                  className={cn(
                    "h-9 px-2 xl:px-3 text-xs xl:text-sm font-medium transition-all duration-200 relative",
                    isActivePath(item.href)
                      ? "bg-blue-600 text-white hover:bg-blue-700 shadow-md"
                      : "text-gray-700 hover:text-gray-900 hover:bg-gray-100/80"
                  )}
                >
                  <item.icon className="h-3.5 w-3.5 xl:h-4 xl:w-4 mr-1.5 xl:mr-2" />
                  <span className="hidden xl:inline">{item.label}</span>
                  <span className="xl:hidden">{item.label.split(' ')[0]}</span>
                </Button>
              </Link>
            ))}
            
            {/* More menu for remaining items */}
            {navigationItems.length > 6 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-9 px-2 xl:px-3">
                    <Menu className="h-3.5 w-3.5 xl:h-4 xl:w-4 mr-1.5" />
                    <span className="text-xs xl:text-sm">More</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  {navigationItems.slice(6).map((item) => (
                    <DropdownMenuItem key={item.href} asChild>
                      <Link href={item.href} className="flex items-center">
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
                    "h-9 px-2 text-xs font-medium",
                    isActivePath(item.href)
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                  )}
                >
                  <item.icon className="h-3.5 w-3.5" />
                </Button>
              </Link>
            ))}
            
            {/* More dropdown for tablet */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-9 px-2">
                  <Menu className="h-3.5 w-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {navigationItems.slice(4).map((item) => (
                  <DropdownMenuItem key={item.href} asChild>
                    <Link href={item.href} className="flex items-center">
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
                  className="h-8 w-8 sm:h-9 sm:w-9 lg:h-10 lg:w-10 rounded-full p-0 hover:bg-gray-100"
                >
                  <Avatar className="h-7 w-7 sm:h-8 sm:w-8 lg:h-9 lg:w-9">
                    <AvatarImage
                      src={firebaseUser?.photoURL || undefined}
                      alt={getUserDisplayName()}
                    />
                    <AvatarFallback className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-semibold text-xs sm:text-sm">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 sm:w-64">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none truncate">
                      {getUserDisplayName()}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground truncate">
                      {firebaseUser?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Menu Button - Visible on mobile and tablet */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="md:hidden h-8 w-8 sm:h-9 sm:w-9 p-0 hover:bg-gray-100"
                >
                  <Menu className="h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent 
                side="right" 
                className="w-[280px] sm:w-[320px] p-0 bg-white/95 backdrop-blur-md"
              >
                {/* Mobile Menu Header */}
                <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
                  <div className="flex items-center space-x-3">
                    <div className="h-8 w-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                      <Brain className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-gray-900">InnerSpring</h2>
                      <p className="text-xs text-gray-500">Mental Health Platform</p>
                    </div>
                  </div>
                  <SheetClose asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <X className="h-4 w-4" />
                    </Button>
                  </SheetClose>
                </div>

                {/* Mobile Navigation */}
                <div className="flex flex-col p-4 sm:p-6 space-y-2">
                  <div className="mb-4">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                      Navigation
                    </h3>
                  </div>
                  
                  {navigationItems.map((item, index) => (
                    <Link key={item.href} href={item.href}>
                      <SheetClose asChild>
                        <Button
                          variant={isActivePath(item.href) ? "default" : "ghost"}
                          className={cn(
                            "w-full justify-start h-12 px-4 text-sm font-medium transition-all duration-200 touch-manipulation",
                            isActivePath(item.href)
                              ? "bg-blue-600 text-white hover:bg-blue-700 shadow-md"
                              : "text-gray-700 hover:text-gray-900 hover:bg-gray-100 active:bg-gray-200"
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
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="flex items-center space-x-3 mb-4 p-3 bg-gray-50 rounded-lg">
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={firebaseUser?.photoURL || undefined}
                          alt={getUserDisplayName()}
                        />
                        <AvatarFallback className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-semibold">
                          {getUserInitials()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {getUserDisplayName()}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {firebaseUser?.email}
                        </p>
                      </div>
                    </div>
                    
                    <Button
                      variant="ghost"
                      onClick={handleLogout}
                      className="w-full justify-start h-11 text-red-600 hover:text-red-700 hover:bg-red-50"
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
      
      {/* Content spacer to prevent overlap - responsive height */}
      <div className="h-14 sm:h-16" aria-hidden="true" />
    </header>
  );
};

export default ProfessionalNavbar;
