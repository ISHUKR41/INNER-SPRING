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
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
  Settings,
  LogOut,
  ChevronDown,
  X,
  Bell,
  Search,
  Sparkles,
  Heart,
  Shield,
  Zap,
  Activity,
  Globe,
  ChevronRight,
  Mic,
  Video,
  Phone,
  Star,
} from "lucide-react";
import { cn } from "@/lib/utils";

const ProfessionalNavbar: React.FC = () => {
  const { currentUser: firebaseUser, logout } = useAuth();
  const [location, setLocation] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [notifications, setNotifications] = useState(3);

  // Handle scroll effect for navbar transparency
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Navigation items with professional structure
  const navigationItems = [
    {
      href: "/",
      label: "Home",
      icon: Home,
      description: "Dashboard and overview",
      category: "main",
    },
    {
      href: "/chat",
      label: "AI Support",
      icon: MessageCircle,
      description: "Mental health chatbot",
      category: "main",
      badge: "AI",
    },
    {
      href: "/appointments",
      label: "Counseling",
      icon: Calendar,
      description: "Professional sessions",
      category: "main",
    },
    {
      href: "/assessments",
      label: "Assessment",
      icon: ClipboardList,
      description: "Mental health evaluation",
      category: "main",
    },
    {
      href: "/resources",
      label: "Resources",
      icon: BookOpen,
      description: "Learning materials",
      category: "secondary",
    },
    {
      href: "/peer-support",
      label: "Community",
      icon: Users,
      description: "Peer support network",
      category: "secondary",
    },
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: BarChart3,
      description: "Progress tracking",
      category: "secondary",
    },
    {
      href: "/about",
      label: "About",
      icon: Info,
      description: "Platform information",
      category: "secondary",
    },
  ];

  const mainNavItems = navigationItems.filter(
    (item) => item.category === "main"
  );
  const secondaryNavItems = navigationItems.filter(
    (item) => item.category === "secondary"
  );

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
    <TooltipProvider>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out",
          isScrolled
            ? "bg-white/95 backdrop-blur-xl border-b border-gray-200/50 shadow-lg shadow-gray-900/5"
            : "bg-white/80 backdrop-blur-md border-b border-gray-100/50"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo Section */}
            <div className="flex items-center space-x-4">
              <Link href="/">
                <div className="flex items-center space-x-3 hover:opacity-80 transition-opacity duration-200 cursor-pointer">
                  <div className="relative">
                    <div className="h-10 w-10 lg:h-12 lg:w-12 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-xl">
                      <Brain className="h-6 w-6 lg:h-7 lg:w-7 text-white" />
                    </div>
                    {/* Live indicator */}
                    <div className="absolute -top-1 -right-1 h-4 w-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
                  </div>
                  <div className="hidden sm:block">
                    <h1 className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-gray-900 via-indigo-900 to-purple-900 bg-clip-text text-transparent">
                      InnerSpring
                    </h1>
                    <p className="text-xs text-gray-500 -mt-1">
                      Mental Health Platform
                    </p>
                  </div>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1">
              {mainNavItems.map((item) => (
                <Tooltip key={item.href} delayDuration={300}>
                  <TooltipTrigger asChild>
                    <Link href={item.href}>
                      <Button
                        variant={isActivePath(item.href) ? "default" : "ghost"}
                        className={cn(
                          "h-10 px-4 font-medium text-sm transition-all duration-200 relative group",
                          isActivePath(item.href)
                            ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30"
                            : "text-gray-700 hover:text-gray-900 hover:bg-gray-100/80"
                        )}
                      >
                        <item.icon className="h-4 w-4 mr-2" />
                        {item.label}
                        {item.badge && (
                          <Badge
                            variant="secondary"
                            className="ml-2 text-xs bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 border-0"
                          >
                            {item.badge}
                          </Badge>
                        )}
                        {/* Active indicator */}
                        {isActivePath(item.href) && (
                          <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full"></div>
                        )}
                      </Button>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent
                    side="bottom"
                    className="bg-gray-900 text-white border-gray-700"
                  >
                    <p className="font-medium">{item.label}</p>
                    <p className="text-xs text-gray-300">{item.description}</p>
                  </TooltipContent>
                </Tooltip>
              ))}

              {/* More menu for secondary items */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="h-10 px-4 text-gray-700 hover:text-gray-900 hover:bg-gray-100/80"
                  >
                    <span className="text-sm font-medium">More</span>
                    <ChevronDown className="h-4 w-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="center"
                  className="w-64 p-2 bg-white/95 backdrop-blur-xl border border-gray-200/50 shadow-xl"
                >
                  <DropdownMenuLabel className="text-gray-900 font-semibold">
                    Additional Features
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {secondaryNavItems.map((item) => (
                    <DropdownMenuItem key={item.href} className="p-0">
                      <Link href={item.href} className="w-full">
                        <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                          <div className="h-10 w-10 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center">
                            <item.icon className="h-5 w-5 text-gray-600" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">
                              {item.label}
                            </p>
                            <p className="text-xs text-gray-500">
                              {item.description}
                            </p>
                          </div>
                          <ChevronRight className="h-4 w-4 text-gray-400" />
                        </div>
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </nav>

            {/* Search and User Section */}
            <div className="flex items-center space-x-4">
              {/* Search (Desktop) */}
              <div className="hidden md:flex relative">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search resources..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-64 h-10 pl-10 pr-4 text-sm bg-gray-50/80 border border-gray-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300 transition-all duration-200"
                  />
                </div>
              </div>

              {/* Notifications */}
              <Tooltip delayDuration={300}>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="relative h-10 w-10 rounded-xl hover:bg-gray-100/80"
                  >
                    <Bell className="h-5 w-5 text-gray-600" />
                    {notifications > 0 && (
                      <div className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 rounded-full flex items-center justify-center">
                        <span className="text-xs text-white font-medium">
                          {notifications}
                        </span>
                      </div>
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>Notifications ({notifications})</p>
                </TooltipContent>
              </Tooltip>

              {/* User Menu */}
              <DropdownMenu
                open={isUserMenuOpen}
                onOpenChange={setIsUserMenuOpen}
              >
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="h-10 px-3 rounded-xl hover:bg-gray-100/80 transition-all duration-200"
                  >
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8 ring-2 ring-gray-200/50">
                        <AvatarImage
                          src={firebaseUser?.photoURL || undefined}
                          alt={getUserDisplayName()}
                        />
                        <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-500 text-white font-semibold">
                          {getUserInitials()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="hidden lg:block text-left">
                        <p className="text-sm font-medium text-gray-900 max-w-32 truncate">
                          {getUserDisplayName()}
                        </p>
                        <div className="flex items-center space-x-1">
                          <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                          <p className="text-xs text-gray-500">Online</p>
                        </div>
                      </div>
                      <ChevronDown className="h-4 w-4 text-gray-500 hidden lg:block" />
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-80 p-4 bg-white/95 backdrop-blur-xl border border-gray-200/50 shadow-xl"
                >
                  {/* User Info Section */}
                  <div className="flex items-center space-x-4 p-3 mb-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl">
                    <Avatar className="h-12 w-12 ring-2 ring-white shadow-lg">
                      <AvatarImage
                        src={firebaseUser?.photoURL || undefined}
                        alt={getUserDisplayName()}
                      />
                      <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-500 text-white font-semibold text-lg">
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">
                        {getUserDisplayName()}
                      </p>
                      <p className="text-sm text-gray-500">
                        {firebaseUser?.email}
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge
                          variant="secondary"
                          className="text-xs bg-green-100 text-green-700 border-0"
                        >
                          <div className="h-1.5 w-1.5 bg-green-500 rounded-full mr-1"></div>
                          Verified
                        </Badge>
                        <Badge
                          variant="secondary"
                          className="text-xs bg-blue-100 text-blue-700 border-0"
                        >
                          Premium
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <DropdownMenuSeparator />

                  {/* Quick Actions */}
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-16 flex-col space-y-1 hover:bg-gray-50"
                    >
                      <Video className="h-5 w-5 text-blue-600" />
                      <span className="text-xs">Video Call</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-16 flex-col space-y-1 hover:bg-gray-50"
                    >
                      <Phone className="h-5 w-5 text-green-600" />
                      <span className="text-xs">Voice Call</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-16 flex-col space-y-1 hover:bg-gray-50"
                    >
                      <Star className="h-5 w-5 text-yellow-600" />
                      <span className="text-xs">Favorites</span>
                    </Button>
                  </div>

                  <DropdownMenuSeparator />

                  {/* Menu Items */}
                  <DropdownMenuItem className="p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <User className="h-5 w-5 mr-3 text-gray-500" />
                    <div className="flex-1">
                      <p className="font-medium">Profile Settings</p>
                      <p className="text-xs text-gray-500">
                        Manage your account
                      </p>
                    </div>
                  </DropdownMenuItem>

                  <DropdownMenuItem className="p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <Settings className="h-5 w-5 mr-3 text-gray-500" />
                    <div className="flex-1">
                      <p className="font-medium">Preferences</p>
                      <p className="text-xs text-gray-500">
                        Customize your experience
                      </p>
                    </div>
                  </DropdownMenuItem>

                  <DropdownMenuItem className="p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <Activity className="h-5 w-5 mr-3 text-gray-500" />
                    <div className="flex-1">
                      <p className="font-medium">Activity Log</p>
                      <p className="text-xs text-gray-500">
                        View your progress
                      </p>
                    </div>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  {/* Security & Trust */}
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg mb-2">
                    <div className="flex items-center space-x-3">
                      <Shield className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="text-sm font-medium text-green-900">
                          Secure Session
                        </p>
                        <p className="text-xs text-green-600">
                          256-bit encryption
                        </p>
                      </div>
                    </div>
                    <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                  </div>

                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="p-3 rounded-lg hover:bg-red-50 cursor-pointer text-red-600 hover:text-red-700"
                  >
                    <LogOut className="h-5 w-5 mr-3" />
                    <div className="flex-1">
                      <p className="font-medium">Sign Out</p>
                      <p className="text-xs text-red-500">
                        End your session securely
                      </p>
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Mobile Menu Button */}
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="lg:hidden h-10 w-10 rounded-xl hover:bg-gray-100/80"
                  >
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="right"
                  className="w-full sm:w-80 p-0 bg-white/95 backdrop-blur-xl border-l border-gray-200/50"
                >
                  {/* Mobile Menu Header */}
                  <div className="flex items-center justify-between p-6 border-b border-gray-200/50">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-2xl flex items-center justify-center">
                        <Brain className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-gray-900">
                          InnerSpring
                        </h2>
                        <p className="text-xs text-gray-500">
                          Mental Health Platform
                        </p>
                      </div>
                    </div>
                    <SheetClose asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 rounded-lg"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </SheetClose>
                  </div>

                  {/* Mobile Search */}
                  <div className="p-6 border-b border-gray-200/50">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search resources..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full h-12 pl-10 pr-4 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300"
                      />
                    </div>
                  </div>

                  {/* Mobile Navigation */}
                  <div className="p-6 space-y-2">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
                      Main Navigation
                    </h3>
                    {navigationItems.map((item) => (
                      <Link key={item.href} href={item.href}>
                        <SheetClose asChild>
                          <Button
                            variant={
                              isActivePath(item.href) ? "default" : "ghost"
                            }
                            className={cn(
                              "w-full justify-start h-12 px-4 rounded-xl transition-all duration-200",
                              isActivePath(item.href)
                                ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
                                : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                            )}
                          >
                            <item.icon className="h-5 w-5 mr-3" />
                            <div className="flex-1 text-left">
                              <p className="font-medium">{item.label}</p>
                              <p className="text-xs opacity-70">
                                {item.description}
                              </p>
                            </div>
                            {item.badge && (
                              <Badge
                                variant="secondary"
                                className="ml-2 text-xs"
                              >
                                {item.badge}
                              </Badge>
                            )}
                          </Button>
                        </SheetClose>
                      </Link>
                    ))}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>

        {/* Progress bar for page loading */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 opacity-0"></div>
      </header>

      {/* Content spacer */}
      <div className="h-16 lg:h-20"></div>
    </TooltipProvider>
  );
};

export default ProfessionalNavbar;
