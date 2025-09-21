import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger
} from "@/components/ui/dropdown-menu";
import { 
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator 
} from "@/components/ui/breadcrumb";
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
  Bell,
  User,
  ChevronDown,
  Globe,
  Settings,
  LogOut,
  Heart,
  ArrowLeft,
  PhoneCall,
  Shield,
  Bot,
  Wifi,
  WifiOff,
  Signal,
  UserCircle,
  Lock,
  Volume2,
  VolumeX,
  Palette,
  BellOff,
  Eye,
  EyeOff,
  Maximize,
  Minimize,
  Languages
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { User as UserType } from "@/types";

/**
 * Connection quality and status types for chat functionality
 */
export type ConnectionQuality = 'excellent' | 'good' | 'fair' | 'poor' | 'disconnected';
export type ConnectionStatus = 'connected' | 'connecting' | 'reconnecting' | 'disconnected';

/**
 * Header component props interface
 */
export interface HeaderProps {
  // Chat-specific props (optional)
  isChatMode?: boolean;
  currentUser?: UserType | null;
  isAnonymousMode?: boolean;
  
  // Connection and AI status for chat
  connectionStatus?: ConnectionStatus;
  connectionQuality?: ConnectionQuality;
  aiModel?: string;
  
  // UI state for chat
  isFullscreen?: boolean;
  isSoundEnabled?: boolean;
  isNotificationsEnabled?: boolean;
  selectedLanguage?: string;
  
  // Event handlers for chat
  onEmergencyClick?: () => void;
  onSettingsChange?: (setting: string, value: any) => void;
  onNavigateBack?: () => void;
  onToggleFullscreen?: () => void;
  onToggleAnonymousMode?: (enabled: boolean) => void;
  onProfileClick?: () => void;
  onLogout?: () => void;
}

/**
 * Header Component - Enhanced with chat-specific features for mental health platform
 * Features responsive design, chat mode detection, and comprehensive mental health support
 */
export default function Header({
  isChatMode = false,
  currentUser,
  isAnonymousMode = false,
  connectionStatus = 'connected',
  connectionQuality = 'excellent',
  aiModel = "Gemini Pro",
  isFullscreen = false,
  isSoundEnabled = true,
  isNotificationsEnabled = true,
  selectedLanguage = "English",
  onEmergencyClick,
  onSettingsChange,
  onNavigateBack,
  onToggleFullscreen,
  onToggleAnonymousMode,
  onProfileClick,
  onLogout
}: HeaderProps = {}) {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [showPrivacyBanner, setShowPrivacyBanner] = useState(isChatMode);

  // Handle scroll shadow effect
  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Connection quality indicator configuration for chat mode
  const getConnectionIndicator = () => {
    const indicators = {
      excellent: { color: "bg-green-500", strength: 4, text: "Excellent" },
      good: { color: "bg-green-400", strength: 3, text: "Good" },
      fair: { color: "bg-yellow-500", strength: 2, text: "Fair" },
      poor: { color: "bg-orange-500", strength: 1, text: "Poor" },
      disconnected: { color: "bg-red-500", strength: 0, text: "Disconnected" }
    };
    return indicators[connectionQuality];
  };

  const getConnectionStatusText = () => {
    switch (connectionStatus) {
      case 'connected': return 'Online';
      case 'connecting': return 'Connecting...';
      case 'reconnecting': return 'Reconnecting...';
      case 'disconnected': return 'Offline';
      default: return 'Unknown';
    }
  };

  // Language options for chat mode
  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' },
    { code: 'zh', name: '中文' },
    { code: 'ar', name: 'العربية' }
  ];

  const currentLanguage = languages.find(lang => lang.name === selectedLanguage) || languages[0];
  const connectionIndicator = getConnectionIndicator();

  // Navigation items configuration - Crisis Help removed as requested by user
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
      path: "/assessments", 
      label: "Assessment", 
      icon: ClipboardList, 
      active: location === "/assessments" 
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
      aria-label={isChatMode ? "Mental health chat header with navigation and controls" : "Main navigation header"}
    >
      {/* Privacy Banner for Chat Mode */}
      {isChatMode && showPrivacyBanner && (
        <div className="bg-blue-50 dark:bg-blue-950/30 border-b border-blue-200 dark:border-blue-800/50 px-4 py-2">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Shield className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <span className="font-medium">Confidential Support:</span> This conversation is private and secure. 
                <span className="hidden sm:inline"> Your wellbeing is our priority.</span>
              </p>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setShowPrivacyBanner(false)}
              className="text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50 h-6 w-6 p-0"
              data-testid="button-close-privacy-banner"
              aria-label="Close privacy notice"
            >
              ×
            </Button>
          </div>
        </div>
      )}
      <div className="max-w-full mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 3xl:px-24">
        <div className="flex items-center justify-between h-14 xs:h-16 sm:h-20 md:h-[90px] xl:h-24 2xl:h-28 3xl:h-32">          
          {/* Left Section: Navigation & Branding */}
          <div className="flex items-center space-x-4 flex-1 min-w-0">
            
            {/* Back Navigation (Chat Mode Only) */}
            {isChatMode && onNavigateBack && (
              <Button
                size="icon"
                variant="ghost"
                onClick={onNavigateBack}
                className="flex-shrink-0 h-10 w-10 sm:h-11 sm:w-11"
                data-testid="button-navigate-back"
                aria-label="Go back to previous page"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
            )}

            {/* Mental Health Branding */}
            <div className="flex items-center space-x-3 min-w-0">
              <div className="relative flex-shrink-0">
                <div 
                  className={cn(
                    "rounded-full flex items-center justify-center shadow-lg relative overflow-hidden gradient-primary transition-all duration-300",
                    isChatMode 
                      ? "w-10 h-10 sm:w-12 sm:h-12" 
                      : "w-8 h-8 xs:w-10 xs:h-10 sm:w-12 sm:h-12 md:w-[55px] md:h-[55px] xl:w-16 xl:h-16 2xl:w-20 2xl:h-20 3xl:w-24 3xl:h-24"
                  )}
                >
                  <div className="relative">
                    <Brain className={cn(
                      "text-white",
                      isChatMode 
                        ? "h-5 w-5 sm:h-6 sm:w-6" 
                        : "w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 xl:w-8 xl:h-8 2xl:w-10 2xl:h-10 3xl:w-12 3xl:h-12"
                    )} />
                    {isChatMode && <Heart className="absolute -bottom-1 -right-1 h-3 w-3 text-white opacity-80" />}
                  </div>
                </div>
                {/* Pulse animation for active AI in chat mode */}
                {isChatMode && connectionStatus === 'connected' && (
                  <div className="absolute inset-0 rounded-full animate-ping bg-primary/20"></div>
                )}
                {!isChatMode && (
                  <div className="absolute inset-0 rounded-full animate-pulse bg-white/10"></div>
                )}
              </div>
              
              <div className={cn("min-w-0", isChatMode ? "hidden sm:block" : "hidden xs:block")}>
                {isChatMode ? (
                  <>
                    <h1 className="font-heading font-semibold text-lg lg:text-xl text-foreground truncate">
                      MindCare AI
                    </h1>
                    <div className="flex items-center space-x-2">
                      <Breadcrumb className="text-sm">
                        <BreadcrumbList>
                          <BreadcrumbItem>
                            <BreadcrumbLink href="/" className="text-muted-foreground hover:text-foreground">
                              Home
                            </BreadcrumbLink>
                          </BreadcrumbItem>
                          <BreadcrumbSeparator />
                          <BreadcrumbItem>
                            <BreadcrumbPage className="text-primary font-medium">
                              AI Mental Health Support
                            </BreadcrumbPage>
                          </BreadcrumbItem>
                        </BreadcrumbList>
                      </Breadcrumb>
                    </div>
                  </>
                ) : (
                  <>
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
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Center Section: AI Status (Chat Mode) or Navigation (Normal Mode) */}
          {isChatMode ? (
            <div className="hidden lg:flex items-center space-x-4 px-6">
              <div className="flex items-center space-x-3 bg-muted/50 rounded-full px-4 py-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/api/placeholder/32/32" alt="AI Assistant" />
                  <AvatarFallback className="gradient-primary text-white font-medium">
                    <Bot className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                
                <div className="text-sm">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-foreground">{aiModel}</span>
                    <Badge 
                      variant={connectionStatus === 'connected' ? 'default' : 'secondary'}
                      className={cn(
                        "text-xs",
                        connectionStatus === 'connected' && "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                      )}
                    >
                      {getConnectionStatusText()}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center space-x-2 mt-1">
                    <div className="flex items-center space-x-1">
                      {[...Array(4)].map((_, i) => (
                        <div
                          key={i}
                          className={cn(
                            "w-1 h-3 rounded-full",
                            i < connectionIndicator.strength ? connectionIndicator.color : "bg-muted"
                          )}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {connectionIndicator.text}
                    </span>
                    {connectionStatus === 'connected' ? (
                      <Wifi className="h-3 w-3 text-green-600 dark:text-green-400" />
                    ) : (
                      <WifiOff className="h-3 w-3 text-red-500" />
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
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
          )}

          {/* Right Section: Controls */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            
            {/* Emergency Button (Chat Mode) */}
            {isChatMode && onEmergencyClick && (
              <Button
                onClick={onEmergencyClick}
                className={cn(
                  "bg-red-50 text-red-700 border-red-200 hover:bg-red-100 hover:text-red-800",
                  "dark:bg-red-950/30 dark:text-red-300 dark:border-red-800/50 dark:hover:bg-red-900/50",
                  "font-medium shadow-sm transition-all duration-200",
                  "h-10 px-4 sm:h-11 sm:px-6 lg:px-8"
                )}
                variant="outline"
                data-testid="button-emergency-help"
                aria-label="Get emergency help and crisis support"
              >
                <PhoneCall className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Emergency Help</span>
                <span className="sm:hidden">SOS</span>
              </Button>
            )}

            {/* Language Selector - Enhanced for Chat Mode */}
            {isChatMode ? (
              <Select value={currentLanguage.code} onValueChange={(value) => {
                const lang = languages.find(l => l.code === value);
                if (lang && onSettingsChange) {
                  onSettingsChange('language', lang.name);
                }
              }}>
                <SelectTrigger 
                  className="w-12 sm:w-14 lg:w-16 h-10 sm:h-11 border-0 bg-transparent focus:ring-0 focus:ring-offset-0"
                  data-testid="select-language-chat"
                >
                  <div className="flex items-center space-x-1">
                    <Globe className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
                    <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      {lang.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
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
            )}

            {/* Desktop Controls */}
            <div className="hidden md:flex items-center space-x-2">
              
              {/* Fullscreen Toggle (Chat Mode Only) */}
              {isChatMode && onToggleFullscreen && (
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={onToggleFullscreen}
                  className="h-10 w-10"
                  data-testid="button-toggle-fullscreen"
                  aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
                >
                  {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
                </Button>
              )}

              {/* Enhanced Settings Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    size="icon"
                    variant="ghost"
                    className={cn("h-10 w-10", !isChatMode && "relative focus-ring w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 xl:w-14 xl:h-14 2xl:w-16 2xl:h-16 3xl:w-20 3xl:h-20")}
                    data-testid="button-settings-menu"
                    aria-label="Open settings menu"
                  >
                    <Settings className={cn("h-4 w-4", !isChatMode && "w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 xl:w-7 xl:h-7 2xl:w-8 2xl:h-8 3xl:w-10 3xl:h-10 text-muted-foreground")} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64">
                  {isChatMode ? (
                    <>
                      <DropdownMenuLabel>Chat Settings</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      
                      {/* Sound Toggle */}
                      <DropdownMenuItem 
                        onClick={() => onSettingsChange && onSettingsChange('sound', !isSoundEnabled)}
                        data-testid="menu-item-toggle-sound"
                      >
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center space-x-2">
                            {isSoundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                            <span>Sound Effects</span>
                          </div>
                          <Switch checked={isSoundEnabled} />
                        </div>
                      </DropdownMenuItem>

                      {/* Notifications Toggle */}
                      <DropdownMenuItem 
                        onClick={() => onSettingsChange && onSettingsChange('notifications', !isNotificationsEnabled)}
                        data-testid="menu-item-toggle-notifications"
                      >
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center space-x-2">
                            {isNotificationsEnabled ? <Bell className="h-4 w-4" /> : <BellOff className="h-4 w-4" />}
                            <span>Notifications</span>
                          </div>
                          <Switch checked={isNotificationsEnabled} />
                        </div>
                      </DropdownMenuItem>

                      <DropdownMenuSeparator />

                      {/* Language Selection */}
                      <DropdownMenuSub>
                        <DropdownMenuSubTrigger data-testid="menu-sub-trigger-language">
                          <Languages className="h-4 w-4 mr-2" />
                          <span>Language</span>
                          <span className="ml-auto text-sm text-muted-foreground">
                            {currentLanguage.name}
                          </span>
                        </DropdownMenuSubTrigger>
                        <DropdownMenuSubContent>
                          {languages.map((lang) => (
                            <DropdownMenuItem
                              key={lang.code}
                              onClick={() => onSettingsChange && onSettingsChange('language', lang.name)}
                              data-testid={`menu-item-language-${lang.code}`}
                            >
                              {lang.name}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuSubContent>
                      </DropdownMenuSub>

                      <DropdownMenuSeparator />
                      <DropdownMenuLabel>Privacy Controls</DropdownMenuLabel>
                      
                      {/* Anonymous Mode Toggle */}
                      <DropdownMenuItem 
                        onClick={() => onToggleAnonymousMode && onToggleAnonymousMode(!isAnonymousMode)}
                        data-testid="menu-item-toggle-anonymous"
                      >
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center space-x-2">
                            {isAnonymousMode ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            <span>Anonymous Mode</span>
                          </div>
                          <Switch checked={isAnonymousMode} />
                        </div>
                      </DropdownMenuItem>
                    </>
                  ) : (
                    <>
                      <DropdownMenuLabel data-testid="dropdown-label-settings">Settings</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem data-testid="dropdown-item-general-settings">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>General Settings</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem data-testid="dropdown-item-notifications">
                        <Bell className="mr-2 h-4 w-4" />
                        <span>Notifications</span>
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Notification Bell (Non-Chat Mode Only) */}
              {!isChatMode && (
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
                    className="absolute -top-1 -right-1 w-2 h-2 sm:w-3 sm:h-3 lg:w-4 lg:w-4 xl:w-5 xl:h-5 p-0 flex items-center justify-center"
                  >
                    <span className="sr-only">New notifications</span>
                  </Badge>
                </Button>
              )}
            </div>

            {/* Enhanced User Profile (Chat Mode) */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className={cn(
                    "rounded-full text-white focus-ring overflow-hidden gradient-primary hover:opacity-90 transition-opacity",
                    isChatMode ? "h-10 w-10" : "w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 xl:w-14 xl:h-14 2xl:w-16 2xl:h-16 3xl:w-20 3xl:h-20"
                  )}
                  data-testid="button-user-profile"
                  aria-label="Open user profile menu"
                >
                  {isChatMode ? (
                    currentUser && !isAnonymousMode ? (
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {currentUser.firstName?.[0] || currentUser.username?.[0] || 'U'}
                        </AvatarFallback>
                      </Avatar>
                    ) : (
                      <UserCircle className="h-5 w-5" />
                    )
                  ) : (
                    <User className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 xl:w-7 xl:h-7 2xl:w-8 2xl:h-8 3xl:w-10 3xl:h-10" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {isChatMode ? (
                  <>
                    <DropdownMenuLabel>
                      {isAnonymousMode ? 'Anonymous User' : (
                        currentUser ? `${currentUser.firstName || currentUser.username}` : 'User'
                      )}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    
                    <DropdownMenuItem onClick={onProfileClick} data-testid="menu-item-profile">
                      <User className="h-4 w-4 mr-2" />
                      Profile Settings
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem data-testid="menu-item-conversation-history">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Conversation History
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem data-testid="menu-item-privacy-settings">
                      <Lock className="h-4 w-4 mr-2" />
                      Privacy Settings
                    </DropdownMenuItem>
                    
                    <DropdownMenuSeparator />
                    
                    {onLogout && (
                      <DropdownMenuItem onClick={onLogout} data-testid="menu-item-logout">
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign Out
                      </DropdownMenuItem>
                    )}
                  </>
                ) : (
                  <>
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
                  </>
                )}
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

                  {/* Mobile Content - Enhanced for Chat Mode */}
                  <div className="flex-1 space-y-4">
                    {isChatMode ? (
                      <>
                        {/* Emergency Button for Mobile */}
                        {onEmergencyClick && (
                          <Button
                            onClick={() => {
                              onEmergencyClick();
                              setIsMobileMenuOpen(false);
                            }}
                            className={cn(
                              "w-full bg-red-50 text-red-700 border-red-200 hover:bg-red-100 hover:text-red-800",
                              "dark:bg-red-950/30 dark:text-red-300 dark:border-red-800/50 dark:hover:bg-red-900/50",
                              "font-medium shadow-sm transition-all duration-200 h-14"
                            )}
                            variant="outline"
                            data-testid="mobile-button-emergency-help"
                          >
                            <PhoneCall className="h-5 w-5 mr-2" />
                            Emergency Help
                          </Button>
                        )}

                        {/* AI Status Display for Mobile */}
                        <div className="bg-muted/50 rounded-lg p-4">
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-12 w-12">
                              <AvatarImage src="/api/placeholder/48/48" alt="AI Assistant" />
                              <AvatarFallback className="gradient-primary text-white font-medium">
                                <Bot className="h-6 w-6" />
                              </AvatarFallback>
                            </Avatar>
                            
                            <div className="flex-1">
                              <div className="flex items-center space-x-2">
                                <span className="font-medium text-foreground">{aiModel}</span>
                                <Badge 
                                  variant={connectionStatus === 'connected' ? 'default' : 'secondary'}
                                  className={cn(
                                    "text-xs",
                                    connectionStatus === 'connected' && "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                                  )}
                                >
                                  {getConnectionStatusText()}
                                </Badge>
                              </div>
                              
                              <div className="flex items-center space-x-2 mt-1">
                                <div className="flex items-center space-x-1">
                                  {[...Array(4)].map((_, i) => (
                                    <div
                                      key={i}
                                      className={cn(
                                        "w-2 h-4 rounded-full",
                                        i < connectionIndicator.strength ? connectionIndicator.color : "bg-muted"
                                      )}
                                    />
                                  ))}
                                </div>
                                <span className="text-sm text-muted-foreground">
                                  {connectionIndicator.text}
                                </span>
                                {connectionStatus === 'connected' ? (
                                  <Wifi className="h-4 w-4 text-green-600 dark:text-green-400" />
                                ) : (
                                  <WifiOff className="h-4 w-4 text-red-500" />
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Mobile Chat Settings */}
                        <div className="space-y-4 border-t pt-4">
                          <h4 className="font-medium text-sm text-muted-foreground">Chat Settings</h4>
                          
                          {/* Language Selector */}
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Language</span>
                            <Select value={currentLanguage.code} onValueChange={(value) => {
                              const lang = languages.find(l => l.code === value);
                              if (lang && onSettingsChange) {
                                onSettingsChange('language', lang.name);
                              }
                            }}>
                              <SelectTrigger className="w-32">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {languages.map((lang) => (
                                  <SelectItem key={lang.code} value={lang.code}>
                                    {lang.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          {/* Sound Toggle */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              {isSoundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                              <span className="text-sm font-medium">Sound Effects</span>
                            </div>
                            <Switch 
                              checked={isSoundEnabled} 
                              onCheckedChange={(checked) => onSettingsChange && onSettingsChange('sound', checked)}
                            />
                          </div>

                          {/* Notifications Toggle */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              {isNotificationsEnabled ? <Bell className="h-4 w-4" /> : <BellOff className="h-4 w-4" />}
                              <span className="text-sm font-medium">Notifications</span>
                            </div>
                            <Switch 
                              checked={isNotificationsEnabled} 
                              onCheckedChange={(checked) => onSettingsChange && onSettingsChange('notifications', checked)}
                            />
                          </div>

                          {/* Anonymous Mode Toggle */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              {isAnonymousMode ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                              <span className="text-sm font-medium">Anonymous Mode</span>
                            </div>
                            <Switch 
                              checked={isAnonymousMode} 
                              onCheckedChange={(checked) => onToggleAnonymousMode && onToggleAnonymousMode(checked)}
                            />
                          </div>

                          {/* Fullscreen Toggle */}
                          {onToggleFullscreen && (
                            <Button
                              variant="outline"
                              onClick={() => {
                                onToggleFullscreen();
                                setIsMobileMenuOpen(false);
                              }}
                              className="w-full h-12"
                              data-testid="mobile-button-fullscreen"
                            >
                              {isFullscreen ? <Minimize className="h-4 w-4 mr-2" /> : <Maximize className="h-4 w-4 mr-2" />}
                              {isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
                            </Button>
                          )}
                        </div>
                      </>
                    ) : (
                      <>
                        {/* Standard Navigation Items */}
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
                      </>
                    )}
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
