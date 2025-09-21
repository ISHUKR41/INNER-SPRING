import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
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
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { 
  Brain,
  Heart,
  ArrowLeft,
  PhoneCall,
  Shield,
  User as UserIcon,
  Settings,
  Languages,
  Maximize,
  Minimize,
  Menu,
  Bot,
  Wifi,
  WifiOff,
  Signal,
  LogOut,
  UserCircle,
  MessageCircle,
  Lock,
  Volume2,
  VolumeX,
  Palette,
  Bell,
  BellOff,
  Eye,
  EyeOff,
  ChevronDown,
  Info
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { User, ChatConversation } from "@/types";

/**
 * Connection quality and status types
 */
export type ConnectionQuality = 'excellent' | 'good' | 'fair' | 'poor' | 'disconnected';
export type ConnectionStatus = 'connected' | 'connecting' | 'reconnecting' | 'disconnected';

/**
 * Chat header component props interface
 */
export interface ChatHeaderProps {
  // Conversation and user state
  currentConversation?: ChatConversation | null;
  userProfile?: User | null;
  isAnonymousMode?: boolean;
  
  // Connection and AI status
  connectionStatus: ConnectionStatus;
  connectionQuality: ConnectionQuality;
  aiModel?: string;
  
  // UI state
  isFullscreen?: boolean;
  isSoundEnabled?: boolean;
  isNotificationsEnabled?: boolean;
  selectedLanguage?: string;
  
  // Event handlers
  onEmergencyClick: () => void;
  onSettingsChange: (setting: string, value: any) => void;
  onNavigateBack: () => void;
  onToggleFullscreen: () => void;
  onToggleAnonymousMode: (enabled: boolean) => void;
  onProfileClick: () => void;
  onLogout?: () => void;
}

/**
 * Mental Health Chat Header Component
 * 
 * Comprehensive header with professional design for mental health chat interface.
 * Features branding, AI status, emergency controls, privacy, user controls, and navigation.
 */
export default function ChatHeader({
  currentConversation,
  userProfile,
  isAnonymousMode = false,
  connectionStatus,
  connectionQuality,
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
}: ChatHeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showPrivacyBanner, setShowPrivacyBanner] = useState(true);
  
  // Connection quality indicator configuration
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

  const connectionIndicator = getConnectionIndicator();

  // Language options
  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' },
    { code: 'zh', name: '中文' },
    { code: 'ar', name: 'العربية' }
  ];

  const currentLanguage = languages.find(lang => lang.name === selectedLanguage) || languages[0];

  return (
    <header 
      className="sticky top-0 z-50 bg-background/95 dark:bg-background/95 backdrop-blur-md border-b border-border/60 shadow-sm"
      role="banner"
      aria-label="Chat header with navigation and controls"
    >
      {/* Privacy Banner */}
      {showPrivacyBanner && (
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

      {/* Main Header */}
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Left Section: Navigation & Branding */}
          <div className="flex items-center space-x-4 flex-1 min-w-0">
            
            {/* Back Navigation */}
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

            {/* Mental Health Branding */}
            <div className="flex items-center space-x-3 min-w-0">
              <div className="relative flex-shrink-0">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full gradient-primary flex items-center justify-center shadow-lg">
                  <div className="relative">
                    <Brain className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                    <Heart className="absolute -bottom-1 -right-1 h-3 w-3 text-white opacity-80" />
                  </div>
                </div>
                {/* Pulse animation for active AI */}
                {connectionStatus === 'connected' && (
                  <div className="absolute inset-0 rounded-full animate-ping bg-primary/20"></div>
                )}
              </div>
              
              <div className="min-w-0 hidden sm:block">
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
              </div>
            </div>
          </div>

          {/* Center Section: AI Status (Hidden on mobile) */}
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

          {/* Right Section: Controls */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            
            {/* Emergency Button */}
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

            {/* Desktop Controls */}
            <div className="hidden md:flex items-center space-x-2">
              
              {/* Fullscreen Toggle */}
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

              {/* Settings Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-10 w-10"
                    data-testid="button-settings-menu"
                    aria-label="Open settings menu"
                  >
                    <Settings className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64">
                  <DropdownMenuLabel>Chat Settings</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  
                  {/* Sound Toggle */}
                  <DropdownMenuItem 
                    onClick={() => onSettingsChange('sound', !isSoundEnabled)}
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
                    onClick={() => onSettingsChange('notifications', !isNotificationsEnabled)}
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
                          onClick={() => onSettingsChange('language', lang.name)}
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
                    onClick={() => onToggleAnonymousMode(!isAnonymousMode)}
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
                </DropdownMenuContent>
              </DropdownMenu>

              {/* User Profile */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-10 w-10"
                    data-testid="button-user-profile"
                    aria-label="Open user profile menu"
                  >
                    {userProfile && !isAnonymousMode ? (
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {userProfile.firstName?.[0] || userProfile.username?.[0] || 'U'}
                        </AvatarFallback>
                      </Avatar>
                    ) : (
                      <UserCircle className="h-5 w-5" />
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    {isAnonymousMode ? 'Anonymous User' : (
                      userProfile ? `${userProfile.firstName || userProfile.username}` : 'User'
                    )}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  
                  <DropdownMenuItem onClick={onProfileClick} data-testid="menu-item-profile">
                    <UserIcon className="h-4 w-4 mr-2" />
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
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Mobile Menu */}
            <div className="md:hidden">
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-10 w-10"
                    data-testid="button-mobile-menu"
                    aria-label="Open mobile menu"
                  >
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80 p-0">
                  <div className="p-6 space-y-6">
                    
                    {/* Mobile AI Status */}
                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg">AI Assistant Status</h3>
                      <div className="flex items-center space-x-3 bg-muted/50 rounded-lg p-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="gradient-primary text-white">
                            <Bot className="h-5 w-5" />
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">{aiModel}</span>
                            <Badge 
                              variant={connectionStatus === 'connected' ? 'default' : 'secondary'}
                              className={cn(
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
                                    "w-1.5 h-4 rounded-full",
                                    i < connectionIndicator.strength ? connectionIndicator.color : "bg-muted"
                                  )}
                                />
                              ))}
                            </div>
                            <span className="text-sm text-muted-foreground">
                              {connectionIndicator.text}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Mobile User Profile */}
                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg">Profile</h3>
                      <div className="flex items-center space-x-3">
                        {userProfile && !isAnonymousMode ? (
                          <Avatar className="h-12 w-12">
                            <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                              {userProfile.firstName?.[0] || userProfile.username?.[0] || 'U'}
                            </AvatarFallback>
                          </Avatar>
                        ) : (
                          <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                            <UserCircle className="h-6 w-6" />
                          </div>
                        )}
                        <div>
                          <p className="font-medium">
                            {isAnonymousMode ? 'Anonymous User' : (
                              userProfile ? `${userProfile.firstName || userProfile.username}` : 'User'
                            )}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {isAnonymousMode ? 'Privacy mode enabled' : 'Authenticated session'}
                          </p>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Button 
                          variant="outline" 
                          className="w-full justify-start h-12" 
                          onClick={onProfileClick}
                          data-testid="mobile-button-profile"
                        >
                          <UserIcon className="h-4 w-4 mr-3" />
                          Profile Settings
                        </Button>
                        
                        <Button 
                          variant="outline" 
                          className="w-full justify-start h-12"
                          data-testid="mobile-button-conversation-history"
                        >
                          <MessageCircle className="h-4 w-4 mr-3" />
                          Conversation History
                        </Button>
                      </div>
                    </div>

                    <Separator />

                    {/* Mobile Settings */}
                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg">Settings</h3>
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            {isSoundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                            <span>Sound Effects</span>
                          </div>
                          <Switch 
                            checked={isSoundEnabled} 
                            onCheckedChange={(checked) => onSettingsChange('sound', checked)}
                            data-testid="mobile-switch-sound"
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            {isNotificationsEnabled ? <Bell className="h-4 w-4" /> : <BellOff className="h-4 w-4" />}
                            <span>Notifications</span>
                          </div>
                          <Switch 
                            checked={isNotificationsEnabled} 
                            onCheckedChange={(checked) => onSettingsChange('notifications', checked)}
                            data-testid="mobile-switch-notifications"
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            {isAnonymousMode ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            <span>Anonymous Mode</span>
                          </div>
                          <Switch 
                            checked={isAnonymousMode} 
                            onCheckedChange={onToggleAnonymousMode}
                            data-testid="mobile-switch-anonymous"
                          />
                        </div>

                        <Button 
                          variant="outline" 
                          className="w-full justify-start h-12"
                          onClick={onToggleFullscreen}
                          data-testid="mobile-button-fullscreen"
                        >
                          {isFullscreen ? <Minimize className="h-4 w-4 mr-3" /> : <Maximize className="h-4 w-4 mr-3" />}
                          {isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
                        </Button>
                      </div>
                    </div>

                    {onLogout && (
                      <>
                        <Separator />
                        <Button 
                          variant="outline" 
                          className="w-full justify-start h-12 text-red-600 border-red-200 hover:bg-red-50 dark:text-red-400 dark:border-red-800 dark:hover:bg-red-950/30"
                          onClick={onLogout}
                          data-testid="mobile-button-logout"
                        >
                          <LogOut className="h-4 w-4 mr-3" />
                          Sign Out
                        </Button>
                      </>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}