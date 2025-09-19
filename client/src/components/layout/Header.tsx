import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { 
  Brain, 
  Home, 
  MessageCircle, 
  Calendar, 
  ClipboardList, 
  BookOpen, 
  Users, 
  Phone, 
  BarChart3, 
  Info,
  Menu,
  Bell,
  User,
  AlertTriangle
} from "lucide-react";

/**
 * Header Component - Fixed navigation with logo, menu items, and user controls
 * Features responsive design with mobile hamburger menu
 */
export default function Header() {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Navigation items configuration
  const navItems = [
    { 
      path: "/", 
      label: "Home", 
      icon: Home, 
      active: location === "/" 
    },
    { 
      path: "/chatbot", 
      label: "AI Chatbot", 
      icon: MessageCircle, 
      active: location === "/chatbot" 
    },
    { 
      path: "/appointments", 
      label: "Appointments", 
      icon: Calendar, 
      active: location === "/appointments" 
    },
    { 
      path: "/assessment", 
      label: "Self-Assessment", 
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
      label: "Peer Support", 
      icon: Users, 
      active: location === "/peer-support" 
    },
    { 
      path: "/emergency", 
      label: "Emergency Help", 
      icon: Phone, 
      active: location === "/emergency",
      isEmergency: true 
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
      label: "About Us", 
      icon: Info, 
      active: location === "/about" 
    },
  ];

  return (
    <header 
      className="fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border shadow-sm"
      role="banner"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo Section */}
          <Link 
            href="/"
            className="flex items-center space-x-3 focus-ring rounded-lg"
            data-testid="logo-link"
          >
            <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center shadow-lg">
              <Brain className="text-white text-xl" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground font-heading">MindCare</h1>
              <p className="text-xs text-muted-foreground">Safe • Confidential • Always Here</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav 
            className="hidden lg:flex items-center space-x-6"
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
                    flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300
                    ${item.active 
                      ? "text-primary bg-primary/10 border-b-2 border-primary" 
                      : item.isEmergency 
                        ? "text-destructive hover:text-destructive/80 hover:bg-destructive/10" 
                        : "text-foreground hover:text-primary hover:bg-muted"
                    }
                    focus-ring
                  `}
                  data-testid={`nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  <IconComponent size={16} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* User Controls */}
          <div className="flex items-center space-x-4">
            {/* Emergency Crisis Help Button */}
            <Link href="/crisis-help">
              <Button 
                size="sm"
                className="emergency-pulse bg-destructive text-destructive-foreground hover:bg-destructive/90 hidden sm:flex"
                data-testid="button-crisis-help"
              >
                <AlertTriangle size={16} className="mr-1" />
                Crisis Help
              </Button>
            </Link>

            {/* Notification Bell */}
            <Button
              variant="ghost"
              size="icon"
              className="relative focus-ring"
              data-testid="button-notifications"
            >
              <Bell size={20} />
              <Badge 
                variant="destructive" 
                className="absolute -top-1 -right-1 w-3 h-3 p-0 flex items-center justify-center"
              >
                <span className="sr-only">New notifications</span>
              </Badge>
            </Button>

            {/* User Profile */}
            <Button
              variant="ghost"
              size="icon"
              className="w-10 h-10 rounded-full gradient-accent text-white focus-ring"
              data-testid="button-user-profile"
            >
              <User size={20} />
            </Button>

            {/* Mobile Menu Toggle */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden focus-ring"
                  data-testid="button-mobile-menu"
                >
                  <Menu size={24} />
                  <span className="sr-only">Open mobile menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="flex flex-col space-y-4 mt-8">
                  {/* Mobile Logo */}
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center">
                      <Brain className="text-white" size={20} />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-foreground font-heading">MindCare</h2>
                      <p className="text-xs text-muted-foreground">Mental Health Support</p>
                    </div>
                  </div>

                  {/* Mobile Navigation Items */}
                  {navItems.map((item) => {
                    const IconComponent = item.icon;
                    return (
                      <Link
                        key={item.path}
                        href={item.path}
                        className={`
                          flex items-center space-x-3 px-4 py-3 rounded-lg text-base font-medium transition-all duration-300
                          ${item.active 
                            ? "text-primary bg-primary/10 border-l-4 border-primary" 
                            : item.isEmergency 
                              ? "text-destructive hover:bg-destructive/10" 
                              : "text-foreground hover:bg-muted"
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

                  {/* Mobile Emergency Button */}
                  <div className="pt-4 border-t border-border">
                    <Link href="/crisis-help">
                      <Button 
                        className="w-full emergency-pulse bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        onClick={() => setIsMobileMenuOpen(false)}
                        data-testid="mobile-button-crisis-help"
                      >
                        <AlertTriangle size={18} className="mr-2" />
                        Crisis Help
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
