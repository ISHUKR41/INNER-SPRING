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
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[90px]">          
          {/* Left Logo Section - 320px */}
          <Link 
            href="/"
            className="flex items-center space-x-4 focus-ring rounded-lg w-[320px]"
            data-testid="link-logo"
          >
            <div 
              className="w-[55px] h-[55px] rounded-full flex items-center justify-center shadow-lg relative overflow-hidden gradient-primary"
            >
              <Brain className="text-white" size={28} />
              {/* Subtle glow pulse animation */}
              <div className="absolute inset-0 rounded-full animate-pulse bg-white/10"></div>
            </div>
            <div>
              <h1 
                className="font-heading font-semibold leading-tight text-[26px] text-mindcare-navy dark:text-foreground"
                data-testid="text-brand-name"
              >
                MindCare
              </h1>
              <p 
                className="leading-tight text-xs font-normal text-muted-foreground"
                data-testid="text-brand-tagline"
              >
                Safe - Confidential - Always Here
              </p>
            </div>
          </Link>

          {/* Center Navigation - 700px */}
          <nav 
            className="hidden lg:flex items-center justify-center w-[700px]"
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
                    flex items-center justify-center px-3 py-6 text-sm font-medium transition-all duration-300 relative w-[77px]
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

          {/* Right User Controls - 380px */}
          <div className="flex items-center space-x-3 w-[380px] justify-end">
            {/* Crisis Button - 130px x 45px */}
            <Link href="/crisis-help">
              <Button 
                className="emergency-pulse text-white text-sm font-bold hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl hidden sm:flex w-[130px] h-[45px] bg-gradient-to-br from-red-500 to-red-600 dark:from-red-600 dark:to-red-700 hover:from-red-600 hover:to-red-700 dark:hover:from-red-500 dark:hover:to-red-600 border-2 border-red-400 dark:border-red-500"
                data-testid="button-crisis-help"
              >
                🚨 Crisis Help
              </Button>
            </Link>

            {/* Language Selector - 70px */}
            <Select defaultValue="en">
              <SelectTrigger 
                className="w-[70px] h-10 border-0 bg-transparent focus:ring-0 focus:ring-offset-0"
                data-testid="select-language"
              >
                <div className="flex items-center space-x-1">
                  <Globe size={16} className="text-muted-foreground" />
                  <ChevronDown size={12} className="text-muted-foreground" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">🇺🇸 EN</SelectItem>
                <SelectItem value="hi">🇮🇳 HI</SelectItem>
                <SelectItem value="es">🇪🇸 ES</SelectItem>
              </SelectContent>
            </Select>

            {/* Notification Bell - 20px */}
            <Button
              variant="ghost"
              size="icon"
              className="relative focus-ring w-10 h-10"
              data-testid="button-notifications"
              aria-label="View notifications"
            >
              <Bell size={20} className="text-muted-foreground" />
              <Badge 
                variant="destructive" 
                className="absolute -top-1 -right-1 w-2 h-2 p-0 flex items-center justify-center"
              >
                <span className="sr-only">New notifications</span>
              </Badge>
            </Button>

            {/* Profile Menu with Dropdown - 120px */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-10 h-10 rounded-full text-white focus-ring overflow-hidden gradient-primary hover:opacity-90 transition-opacity"
                  data-testid="button-user-profile"
                  aria-label="Open user menu"
                >
                  <User size={18} />
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

            {/* Mobile Menu Toggle - 40px touchable area */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden focus-ring w-10 h-10"
                  data-testid="button-mobile-menu"
                  aria-label="Open mobile menu"
                >
                  <Menu size={24} className="text-muted-foreground" />
                  <span className="sr-only">Open mobile menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full bg-background/95 dark:bg-background/95 backdrop-blur-md border-l border-border/40 dark:border-border/60">
                <div className="flex flex-col h-full">
                  {/* Mobile Logo */}
                  <div className="flex items-center space-x-3 mb-8 pt-4">
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg gradient-primary"
                    >
                      <Brain className="text-white" size={24} />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold font-heading text-mindcare-navy dark:text-foreground">MindCare</h2>
                      <p className="text-xs text-muted-foreground">Mental Health Support</p>
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
                            flex items-center space-x-3 px-4 py-4 rounded-lg text-base font-medium transition-all duration-300
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
                          <IconComponent size={20} />
                          <span>{item.label}</span>
                        </Link>
                      );
                    })}
                  </div>

                  {/* Mobile Emergency Button */}
                  <div className="pt-6 border-t border-border/20 pb-6">
                    <Link href="/crisis-help">
                      <Button 
                        className="w-full emergency-pulse text-white text-base font-bold h-12 shadow-lg bg-gradient-to-br from-red-500 to-red-600 dark:from-red-600 dark:to-red-700 hover:from-red-600 hover:to-red-700 dark:hover:from-red-500 dark:hover:to-red-600 border-2 border-red-400 dark:border-red-500 hover:scale-[1.02] transition-all duration-200"
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
