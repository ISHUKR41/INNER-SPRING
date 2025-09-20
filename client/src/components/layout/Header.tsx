import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  AlertTriangle,
  BarChart3, 
  Info,
  Menu,
  Bell,
  User,
  ChevronDown,
  Globe,
  Settings,
  LogOut
} from "lucide-react";

/**
 * Header Component - Fixed navigation with logo, menu items, and user controls
 * Features responsive design with mobile hamburger menu
 */
export default function Header() {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);

  // Handle scroll shadow effect
  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Navigation items configuration - Updated to match specifications
  const navItems = [
    { 
      path: "/", 
      label: "Home", 
      icon: Home, 
      active: location === "/" 
    },
    { 
      path: "/chatbot", 
      label: "AI Support", 
      icon: MessageCircle, 
      active: location === "/chatbot" 
    },
    { 
      path: "/appointments", 
      label: "Counseling", 
      icon: Calendar, 
      active: location === "/appointments" 
    },
    { 
      path: "/assessment", 
      label: "Assessment", 
      icon: ClipboardList, 
      active: location === "/assessment" 
    },
    { 
      path: "/resources", 
      label: "Resources", 
      icon: BookOpen, 
      active: location === "/resources" 
    },
    { 
      path: "/peer-support", 
      label: "Community", 
      icon: Users, 
      active: location === "/peer-support" 
    },
    { 
      path: "/crisis-help", 
      label: "Crisis Help", 
      icon: AlertTriangle, 
      active: location === "/crisis-help",
      isEmergency: true 
    },
    { 
      path: "/dashboard", 
      label: "Dashboard", 
      icon: BarChart3, 
      active: location === "/dashboard" 
    },
    { 
      path: "/about", 
      label: "About", 
      icon: Info, 
      active: location === "/about" 
    },
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-[1000] transition-all duration-300 ${
        hasScrolled 
          ? 'bg-background/95 dark:bg-background/95 backdrop-blur-md shadow-[0_2px_20px_rgba(0,0,0,0.1)] dark:shadow-[0_2px_20px_rgba(255,255,255,0.1)]' 
          : 'bg-background/95 dark:bg-background/95 backdrop-blur-md'
      } border-b border-border/40 dark:border-border/60`}
      role="banner"
    >
      <div className="max-w-full mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 3xl:px-24">
        <div className="flex items-center justify-between h-14 xs:h-16 sm:h-20 md:h-[90px] xl:h-24 2xl:h-28 3xl:h-32">          
          {/* Left Logo Section - Fully Responsive */}
          <Link 
            href="/"
            className="flex items-center space-x-2 xs:space-x-3 md:space-x-4 focus-ring rounded-lg min-w-fit flex-shrink-0"
            data-testid="link-logo"
          >
            <div 
              className="w-8 h-8 xs:w-10 xs:h-10 sm:w-12 sm:h-12 md:w-[55px] md:h-[55px] xl:w-16 xl:h-16 2xl:w-20 2xl:h-20 3xl:w-24 3xl:h-24 rounded-full flex items-center justify-center shadow-lg relative overflow-hidden gradient-primary transition-all duration-300"
            >
              <Brain className="text-white w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 xl:w-8 xl:h-8 2xl:w-10 2xl:h-10 3xl:w-12 3xl:h-12" />
              {/* Subtle glow pulse animation */}
              <div className="absolute inset-0 rounded-full animate-pulse bg-white/10"></div>
            </div>
            <div className="hidden xs:block">
              <h1 
                className="font-heading font-semibold leading-tight text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl 3xl:text-5xl text-mindcare-navy dark:text-foreground transition-all duration-300"
                data-testid="text-brand-name"
              >
                MindCare
              </h1>
              <p 
                className="leading-tight text-xs xs:text-sm md:text-xs lg:text-sm xl:text-base 2xl:text-lg 3xl:text-xl font-normal text-muted-foreground transition-all duration-300 hidden sm:block"
                data-testid="text-brand-tagline"
              >
                Safe - Confidential - Always Here
              </p>
            </div>
          </Link>

          {/* Center Navigation - Fully Responsive */}
          <nav 
            className="hidden lg:flex items-center justify-center flex-1 max-w-4xl mx-4 xl:mx-8 2xl:mx-12 3xl:mx-16"
            role="navigation"
            aria-label="Main navigation"
          >
            {navItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`
                    flex items-center justify-center px-2 lg:px-3 xl:px-4 2xl:px-6 3xl:px-8 py-6 text-xs lg:text-sm xl:text-base 2xl:text-lg 3xl:text-xl font-medium transition-all duration-300 relative whitespace-nowrap min-w-fit
                    ${item.active 
                      ? 'font-semibold border-b-[3px] border-primary text-primary dark:text-primary' 
                      : item.isEmergency 
                        ? 'text-destructive dark:text-red-400 hover:text-destructive dark:hover:text-red-300 font-medium' 
                        : 'text-muted-foreground dark:text-muted-foreground hover:text-primary dark:hover:text-primary'
                    }
                    focus-ring
                  `}
                  data-testid={`nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right User Controls - Fully Responsive */}
          <div className="flex items-center space-x-1 xs:space-x-2 md:space-x-3 xl:space-x-4 2xl:space-x-6 3xl:space-x-8 justify-end flex-shrink-0">
            {/* Crisis Button - Responsive Sizing */}
            <Link href="/crisis-help">
              <Button 
                className="emergency-pulse text-white text-xs sm:text-sm lg:text-base xl:text-lg 2xl:text-xl font-bold hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl hidden sm:flex px-2 sm:px-3 lg:px-4 xl:px-6 2xl:px-8 3xl:px-10 py-2 sm:py-3 lg:py-4 2xl:py-5 bg-gradient-to-br from-red-500 to-red-600 dark:from-red-600 dark:to-red-700 hover:from-red-600 hover:to-red-700 dark:hover:from-red-500 dark:hover:to-red-600 border-2 border-red-400 dark:border-red-500 min-h-8 sm:min-h-10 lg:min-h-12 xl:min-h-14 2xl:min-h-16"
                data-testid="button-crisis-help"
              >
                <span className="hidden lg:inline">🚨 Crisis Help</span>
                <span className="lg:hidden">🚨 Crisis</span>
              </Button>
            </Link>

            {/* Language Selector - Responsive */}
            <Select defaultValue="en">
              <SelectTrigger 
                className="w-10 sm:w-12 lg:w-16 xl:w-20 2xl:w-24 3xl:w-28 h-8 sm:h-10 lg:h-12 xl:h-14 2xl:h-16 3xl:h-18 border-0 bg-transparent focus:ring-0 focus:ring-offset-0"
                data-testid="select-language"
              >
                <div className="flex items-center space-x-1">
                  <Globe className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 xl:w-6 xl:h-6 2xl:w-7 2xl:h-7 text-muted-foreground" />
                  <ChevronDown className="w-2 h-2 sm:w-3 sm:h-3 lg:w-4 lg:h-4 xl:w-5 xl:h-5 2xl:w-6 2xl:h-6 text-muted-foreground" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">🇺🇸 EN</SelectItem>
                <SelectItem value="hi">🇮🇳 HI</SelectItem>
                <SelectItem value="es">🇪🇸 ES</SelectItem>
              </SelectContent>
            </Select>

            {/* Notification Bell - Responsive */}
            <Button
              variant="ghost"
              size="icon"
              className="relative focus-ring w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 xl:w-14 xl:h-14 2xl:w-16 2xl:h-16 3xl:w-20 3xl:h-20"
              data-testid="button-notifications"
              aria-label="View notifications"
            >
              <Bell className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 xl:w-7 xl:h-7 2xl:w-8 2xl:h-8 3xl:w-10 3xl:h-10 text-muted-foreground" />
              <Badge 
                variant="destructive" 
                className="absolute -top-1 -right-1 w-2 h-2 sm:w-3 sm:h-3 lg:w-4 lg:h-4 xl:w-5 xl:h-5 p-0 flex items-center justify-center"
              >
                <span className="sr-only">New notifications</span>
              </Badge>
            </Button>

            {/* Profile Menu with Dropdown - Responsive */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 xl:w-14 xl:h-14 2xl:w-16 2xl:h-16 3xl:w-20 3xl:h-20 rounded-full text-white focus-ring overflow-hidden gradient-primary hover:opacity-90 transition-opacity"
                  data-testid="button-user-profile"
                  aria-label="Open user menu"
                >
                  <User className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 xl:w-7 xl:h-7 2xl:w-8 2xl:h-8 3xl:w-10 3xl:h-10" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel data-testid="dropdown-label-account">My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem data-testid="dropdown-item-profile">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem data-testid="dropdown-item-settings">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem data-testid="dropdown-item-logout">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Menu Toggle - Enhanced Touch Targets */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden focus-ring w-10 h-10 xs:w-12 xs:h-12 sm:w-14 sm:h-14 md:w-16 md:h-16"
                  data-testid="button-mobile-menu"
                  aria-label="Open mobile menu"
                >
                  <Menu className="w-5 h-5 xs:w-6 xs:h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-muted-foreground" />
                  <span className="sr-only">Open mobile menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full xs:w-80 sm:w-96 md:w-[28rem] bg-background/95 dark:bg-background/95 backdrop-blur-md border-l border-border/40 dark:border-border/60">
                <div className="flex flex-col h-full">
                  {/* Mobile Logo */}
                  <div className="flex items-center space-x-3 mb-8 pt-4">
                    <div 
                      className="w-12 h-12 xs:w-14 xs:h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center shadow-lg gradient-primary"
                    >
                      <Brain className="text-white w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8" />
                    </div>
                    <div>
                      <h2 className="text-lg xs:text-xl sm:text-2xl font-bold font-heading text-mindcare-navy dark:text-foreground">MindCare</h2>
                      <p className="text-xs xs:text-sm text-muted-foreground">Mental Health Support</p>
                    </div>
                  </div>

                  {/* Mobile Navigation Items */}
                  <div className="flex-1 space-y-2">
                    {navItems.map((item) => {
                      const IconComponent = item.icon;
                      return (
                        <Link
                          key={item.path}
                          href={item.path}
                          className={`
                            flex items-center space-x-3 px-4 xs:px-6 py-4 xs:py-5 sm:py-6 rounded-lg text-base xs:text-lg sm:text-xl font-medium transition-all duration-300 min-h-12 xs:min-h-14 sm:min-h-16
                            ${item.active 
                              ? 'bg-primary/10 dark:bg-primary/20 border-l-4 border-primary text-primary dark:text-primary' 
                              : item.isEmergency 
                                ? 'text-destructive dark:text-red-400 hover:bg-destructive/10 dark:hover:bg-red-500/10 font-semibold' 
                                : 'text-foreground dark:text-foreground hover:bg-muted dark:hover:bg-muted hover:text-primary dark:hover:text-primary'
                            }
                            focus-ring
                          `}
                          onClick={() => setIsMobileMenuOpen(false)}
                          data-testid={`mobile-nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                        >
                          <IconComponent className="w-5 h-5 xs:w-6 xs:h-6 sm:w-7 sm:h-7 flex-shrink-0" />
                          <span>{item.label}</span>
                        </Link>
                      );
                    })}
                  </div>

                  {/* Mobile Emergency Button */}
                  <div className="pt-6 border-t border-border/20 pb-6">
                    <Link href="/crisis-help">
                      <Button 
                        className="w-full emergency-pulse text-white text-base xs:text-lg sm:text-xl font-bold h-12 xs:h-14 sm:h-16 shadow-lg bg-gradient-to-br from-red-500 to-red-600 dark:from-red-600 dark:to-red-700 hover:from-red-600 hover:to-red-700 dark:hover:from-red-500 dark:hover:to-red-600 border-2 border-red-400 dark:border-red-500 hover:scale-[1.02] transition-all duration-200"
                        onClick={() => setIsMobileMenuOpen(false)}
                        data-testid="mobile-button-crisis-help"
                      >
                        🚨 Crisis Help
                      </Button>
                    </Link>
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
