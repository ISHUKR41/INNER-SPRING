import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { 
  Brain, 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin,
  Youtube,
  Phone,
  Mail,
  MapPin,
  Shield,
  Heart,
  AlertTriangle,
  Users,
  BookOpen,
  MessageSquare,
  ExternalLink,
  Clock,
  Globe,
  Sparkles,
  ArrowUp,
  CheckCircle2
} from "lucide-react";

/**
 * Footer Component - Contact info, links, and emergency resources
 * Features comprehensive site navigation and support information
 */
export default function Footer() {
  const currentYear = new Date().getFullYear();

  // Crisis Resources - Emergency contacts with click-to-call
  const emergencyContacts = [
    { 
      label: "988 Suicide & Crisis Lifeline", 
      contact: "988",
      href: "tel:988",
      type: "phone",
      available: "24/7",
      urgent: true
    },
    { 
      label: "Crisis Text Line", 
      contact: "Text HOME to 741741",
      href: "sms:741741?body=HOME",
      type: "text",
      available: "24/7",
      urgent: true
    },
    { 
      label: "Campus Counseling Emergency", 
      contact: "(555) 123-4567",
      href: "tel:+15551234567",
      type: "phone",
      available: "24/7",
      urgent: false
    },
    { 
      label: "Online Crisis Resources", 
      contact: "Crisis Text Line",
      href: "https://www.crisistextline.org",
      type: "external",
      available: "24/7",
      urgent: false
    },
    { 
      label: "Local Emergency Services", 
      contact: "911",
      href: "tel:911",
      type: "phone",
      available: "Emergency Only",
      urgent: true
    }
  ];

  // Platform Information - About MindCare links
  const platformLinks = [
    { href: "/about", label: "Our Evidence-Based Approach", icon: BookOpen },
    { href: "/privacy", label: "Privacy & Security Practices", icon: Shield },
    { href: "/accessibility", label: "Accessibility Commitment", icon: Heart }
  ];

  // Student Resources - Additional support links
  const studentResourceLinks = [
    { href: "/resources", label: "Mental Health Resources", icon: BookOpen },
    { href: "/peer-support", label: "Peer Support Community", icon: Users },
    { href: "/emergency", label: "Emergency Support", icon: AlertTriangle }
  ];

  // Social Links with expanded options
  const socialLinks = [
    { icon: Facebook, href: "https://facebook.com/mindcareplatform", label: "Facebook" },
    { icon: Twitter, href: "https://twitter.com/mindcareplatform", label: "Twitter" },
    { icon: Instagram, href: "https://instagram.com/mindcareplatform", label: "Instagram" },
    { icon: Linkedin, href: "https://linkedin.com/company/mindcareplatform", label: "LinkedIn" },
    { icon: Youtube, href: "https://youtube.com/mindcareplatform", label: "YouTube" }
  ];

  // Legal and Compliance Links
  const legalLinks = [
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms of Service" },
    { href: "/accessibility", label: "Accessibility Statement" },
    { href: "/non-discrimination", label: "Non-Discrimination Policy" }
  ];

  return (
    <footer 
      className="relative bg-gradient-to-b from-gray-900 via-black to-gray-950 dark:from-gray-950 dark:via-black dark:to-gray-900 border-t border-gray-700/30 dark:border-gray-600/40 overflow-hidden"
      role="contentinfo"
    >
      {/* Professional Dark Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.05] via-transparent to-secondary/[0.05] dark:from-primary/[0.08] dark:to-secondary/[0.08]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(59,130,246,0.08),transparent_60%)] dark:bg-[radial-gradient(circle_at_50%_0%,rgba(59,130,246,0.12),transparent_60%)]" />
      <div className="absolute inset-0 opacity-30 dark:opacity-50">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Banner with Emergency Highlight - Professional Dark Design */}
        <div className="py-8 mb-12 relative">
          <div className="bg-gradient-to-r from-red-900/30 via-red-800/20 to-red-900/30 dark:from-red-900/40 dark:via-red-800/30 dark:to-red-900/40 rounded-3xl p-8 border border-red-500/30 dark:border-red-400/40 backdrop-blur-md shadow-2xl dark:shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
            <div className="flex items-center justify-center space-x-6 mb-6">
              <div className="w-12 h-12 rounded-full bg-red-500/20 dark:bg-red-400/30 flex items-center justify-center animate-pulse motion-reduce:animate-none shadow-lg">
                <AlertTriangle className="text-red-400 dark:text-red-300" size={24} />
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-bold font-heading text-red-400 dark:text-red-300 mb-2">
                  Crisis Support Available 24/7
                </h3>
                <p className="text-base text-gray-300 dark:text-gray-200">
                  Immediate help is always available. You're not alone in this journey.
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-red-500/20 dark:bg-red-400/30 flex items-center justify-center animate-pulse motion-reduce:animate-none shadow-lg">
                <Heart className="text-red-400 dark:text-red-300" size={24} />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {emergencyContacts.slice(0, 3).map((contact, index) => {
                const isClickable = contact.type === 'phone' || contact.type === 'text';
                const content = (
                  <div className="flex items-center space-x-3 p-4 rounded-xl bg-gray-800/60 dark:bg-gray-700/60 hover:bg-gray-700/80 dark:hover:bg-gray-600/80 transition-all duration-300 border border-gray-600/40 dark:border-gray-500/50 backdrop-blur-md shadow-lg hover:shadow-xl">
                    <div className="w-8 h-8 rounded-full bg-primary/20 dark:bg-primary/30 flex items-center justify-center">
                      {contact.type === 'phone' && <Phone size={14} className="text-primary dark:text-primary" />}
                      {contact.type === 'text' && <MessageSquare size={14} className="text-primary dark:text-primary" />}
                      {contact.type === 'link' && <Globe size={14} className="text-primary dark:text-primary" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-white dark:text-gray-100 truncate">
                        {contact.label}
                      </p>
                      <p className="text-blue-400 dark:text-blue-300 text-xs font-medium">
                        {contact.contact}
                      </p>
                    </div>
                  </div>
                );
                
                if (isClickable) {
                  return (
                    <a
                      key={index}
                      href={contact.href}
                      className="block transform hover:scale-105 motion-reduce:hover:scale-100 transition-transform duration-200 focus-ring rounded-xl"
                      data-testid={`crisis-contact-${contact.type}-${index}`}
                      aria-label={`Call ${contact.label}`}
                    >
                      {content}
                    </a>
                  );
                } else {
                  return (
                    <Link
                      key={index}
                      href={contact.href}
                      className="block transform hover:scale-105 motion-reduce:hover:scale-100 transition-transform duration-200 focus-ring rounded-xl"
                      data-testid={`crisis-resource-link-${index}`}
                    >
                      {content}
                    </Link>
                  );
                }
              })}
            </div>
          </div>
        </div>

        {/* Main Footer Content - Enhanced 4 Column Layout */}
        <div className="py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            
            {/* Column 1 - Extended Crisis Resources */}
            <div className="space-y-6">
              <div className="relative">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-600/30 to-red-500/20 dark:from-red-500/40 dark:to-red-400/30 flex items-center justify-center mb-6 shadow-xl">
                  <AlertTriangle className="text-red-400 dark:text-red-300" size={24} />
                </div>
                <h4 className="text-2xl font-bold font-heading text-white dark:text-gray-100 mb-3">
                  Additional Emergency Resources
                </h4>
                <p className="text-base text-gray-300 dark:text-gray-200 mb-8">
                  Comprehensive crisis support network for every situation
                </p>
              </div>
              
              <div className="space-y-3">
                {emergencyContacts.slice(3).map((contact, index) => {
                  const isClickable = contact.type === 'phone' || contact.type === 'text';
                  const content = (
                    <div className="group p-5 rounded-xl bg-gray-800/50 dark:bg-gray-700/50 hover:bg-gray-700/70 dark:hover:bg-gray-600/70 border border-gray-600/40 dark:border-gray-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 dark:hover:shadow-primary/20 backdrop-blur-md">
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 rounded-lg bg-primary/20 dark:bg-primary/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                          {contact.type === 'phone' && <Phone size={12} className="text-primary" />}
                          {contact.type === 'text' && <MessageSquare size={12} className="text-primary" />}
                          {contact.type === 'link' && <Globe size={12} className="text-primary" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-base text-white dark:text-gray-100 group-hover:text-blue-400 transition-colors">
                            {contact.label}
                          </p>
                          <p className="text-gray-300 dark:text-gray-200 text-sm font-medium">
                            {contact.contact}
                          </p>
                          <div className="flex items-center space-x-1 mt-2">
                            <Clock size={10} className="text-muted-foreground" />
                            <p className="text-muted-foreground dark:text-gray-400 text-xs">
                              {contact.available}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                  
                  if (isClickable) {
                    return (
                      <a
                        key={index}
                        href={contact.href}
                        className="block transform hover:scale-[1.02] motion-reduce:hover:scale-100 transition-transform duration-200 focus-ring rounded-xl"
                        data-testid={`crisis-contact-${contact.type}-${index + 3}`}
                        aria-label={`Call ${contact.label}`}
                      >
                        {content}
                      </a>
                    );
                  } else {
                    return (
                      <Link
                        key={index}
                        href={contact.href}
                        className="block transform hover:scale-[1.02] motion-reduce:hover:scale-100 transition-transform duration-200 focus-ring rounded-xl"
                        data-testid={`crisis-resource-link-${index + 3}`}
                      >
                        {content}
                      </Link>
                    );
                  }
                })}
              </div>
            </div>

            {/* Column 2 - Platform Information */}
            <div className="space-y-6">
              <div className="relative">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600/40 to-purple-600/30 dark:from-blue-500/50 dark:to-purple-500/40 flex items-center justify-center mb-6 shadow-xl">
                  <Brain className="text-white" size={24} />
                </div>
                <h4 className="text-2xl font-bold font-heading text-white dark:text-gray-100 mb-3">
                  About MindCare Platform
                </h4>
                <p className="text-base text-gray-300 dark:text-gray-200 mb-8">
                  Evidence-based mental health support designed specifically for students
                </p>
              </div>
              
              <ul className="space-y-2">
                {platformLinks.map((link) => {
                  const IconComponent = link.icon;
                  return (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="group flex items-center space-x-4 p-4 rounded-xl bg-gray-800/40 dark:bg-gray-700/40 hover:bg-gray-700/60 dark:hover:bg-gray-600/60 border border-transparent hover:border-blue-500/30 dark:hover:border-blue-400/40 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 dark:hover:shadow-blue-400/20 backdrop-blur-md"
                        data-testid={`platform-link-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                      >
                        <div className="w-10 h-10 rounded-lg bg-blue-500/20 dark:bg-blue-400/30 group-hover:bg-blue-500/30 dark:group-hover:bg-blue-400/40 flex items-center justify-center transition-colors">
                          <IconComponent size={16} className="text-blue-400 dark:text-blue-300 group-hover:text-blue-300 dark:group-hover:text-blue-200" />
                        </div>
                        <span className="text-base font-medium text-gray-300 dark:text-gray-200 group-hover:text-white dark:group-hover:text-gray-100 transition-colors">
                          {link.label}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>

              <div className="mt-8 p-6 rounded-xl bg-gradient-to-br from-gray-800/60 to-gray-700/40 dark:from-gray-700/60 dark:to-gray-600/40 border border-gray-600/40 dark:border-gray-500/50 backdrop-blur-md shadow-xl">
                <h5 className="font-semibold text-lg text-white dark:text-gray-100 mb-4 flex items-center space-x-2">
                  <Mail size={16} className="text-blue-400 dark:text-blue-300" />
                  <span>Direct Contact</span>
                </h5>
                <div className="space-y-3">
                  <a href="mailto:support@mindcare.edu" className="flex items-center space-x-2 text-base text-blue-400 dark:text-blue-300 hover:text-blue-300 dark:hover:text-blue-200 transition-colors" data-testid="email-support">
                    <span className="font-medium">support@mindcare.edu</span>
                  </a>
                  <div className="flex items-center space-x-2 text-base text-gray-300 dark:text-gray-200">
                    <MapPin size={16} className="text-blue-400 dark:text-blue-300" />
                    <span>Student Health Center</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Column 3 - Student Resources */}
            <div className="space-y-6">
              <div className="relative">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-600/40 to-teal-600/30 dark:from-green-500/50 dark:to-teal-500/40 flex items-center justify-center mb-6 shadow-xl">
                  <Users className="text-white" size={24} />
                </div>
                <h4 className="text-2xl font-bold font-heading text-white dark:text-gray-100 mb-3">
                  Student Support Network
                </h4>
                <p className="text-base text-gray-300 dark:text-gray-200 mb-8">
                  Comprehensive academic and wellness resources for your success
                </p>
              </div>
              
              <ul className="space-y-2">
                {studentResourceLinks.map((link) => {
                  const IconComponent = link.icon;
                  return (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="group flex items-center space-x-3 p-3 rounded-xl bg-card/30 dark:bg-gray-800/30 hover:bg-card dark:hover:bg-gray-700/50 border border-transparent hover:border-secondary/20 dark:hover:border-secondary/30 transition-all duration-300 hover:shadow-md hover:shadow-secondary/5 dark:hover:shadow-secondary/10 backdrop-blur-sm"
                        data-testid={`student-resource-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                      >
                        <div className="w-8 h-8 rounded-lg bg-secondary/10 dark:bg-secondary/20 group-hover:bg-secondary/20 dark:group-hover:bg-secondary/30 flex items-center justify-center transition-colors">
                          <IconComponent size={14} className="text-secondary group-hover:text-secondary" />
                        </div>
                        <span className="text-sm font-medium text-muted-foreground dark:text-gray-300 group-hover:text-foreground dark:group-hover:text-white transition-colors">
                          {link.label}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>

              {/* Enhanced Quick Access */}
              <div className="mt-8 p-4 rounded-xl bg-gradient-to-br from-secondary/5 to-secondary/10 dark:from-secondary/10 dark:to-secondary/20 border border-secondary/20 dark:border-secondary/30 backdrop-blur-sm">
                <h5 className="font-semibold text-sm text-foreground dark:text-white mb-4 flex items-center space-x-2">
                  <Sparkles size={14} className="text-secondary" />
                  <span>Quick Access Tools</span>
                </h5>
                <div className="grid grid-cols-1 gap-2">
                  <Link href="/chatbot" className="flex items-center space-x-3 p-2 rounded-lg bg-background/80 dark:bg-gray-800/60 hover:bg-background dark:hover:bg-gray-700/80 border border-border/30 dark:border-gray-600/50 transition-all duration-200" data-testid="quick-access-chatbot">
                    <MessageSquare size={12} className="text-primary" />
                    <span className="text-xs font-medium text-foreground dark:text-white">24/7 AI Support Chat</span>
                  </Link>
                  <Link href="/assessments" className="flex items-center space-x-3 p-2 rounded-lg bg-gray-800/60 dark:bg-gray-700/60 hover:bg-gray-700/80 dark:hover:bg-gray-600/80 border border-gray-600/40 dark:border-gray-500/50 transition-all duration-200" data-testid="quick-access-assessment">
                    <BookOpen size={12} className="text-primary" />
                    <span className="text-xs font-medium text-foreground dark:text-white">Mental Health Assessment</span>
                  </Link>
                  <Link href="/appointments" className="flex items-center space-x-3 p-2 rounded-lg bg-background/80 dark:bg-gray-800/60 hover:bg-background dark:hover:bg-gray-700/80 border border-border/30 dark:border-gray-600/50 transition-all duration-200" data-testid="quick-access-appointments">
                    <Users size={12} className="text-primary" />
                    <span className="text-xs font-medium text-foreground dark:text-white">Book Counseling Session</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Column 4 - Community & Enhanced Engagement */}
            <div className="space-y-6">
              <div className="relative">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-600/40 to-pink-600/30 dark:from-purple-500/50 dark:to-pink-500/40 flex items-center justify-center mb-6 shadow-xl">
                  <Heart className="text-white" size={24} />
                </div>
                <h4 className="text-2xl font-bold font-heading text-white dark:text-gray-100 mb-3">
                  Join Our Community
                </h4>
                <p className="text-base text-gray-300 dark:text-gray-200 mb-8">
                  Connect with others on their wellness journey and stay informed
                </p>
              </div>
              
              {/* Enhanced Newsletter Signup */}
              <div className="p-5 rounded-xl bg-gradient-to-br from-primary/5 to-secondary/5 dark:from-primary/10 dark:to-secondary/10 border border-primary/20 dark:border-primary/30 backdrop-blur-sm">
                <div className="flex items-center space-x-2 mb-3">
                  <Sparkles size={16} className="text-primary" />
                  <h5 className="font-semibold text-sm text-foreground dark:text-white">
                    Wellness Newsletter
                  </h5>
                </div>
                <p className="text-muted-foreground dark:text-gray-300 text-xs mb-4">
                  Weekly mental health tips, resources, and community insights delivered to your inbox.
                </p>
                <div className="flex space-x-2 mb-3">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    className="text-xs bg-background/80 dark:bg-gray-800/60 border-border/50 dark:border-gray-600/50 text-foreground dark:text-white placeholder:text-muted-foreground focus:border-primary dark:focus:border-primary backdrop-blur-sm"
                    data-testid="input-newsletter-email"
                  />
                  <Button 
                    size="sm"
                    className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white px-4 shadow-lg hover:shadow-xl transition-all duration-300"
                    data-testid="button-subscribe-newsletter"
                  >
                    <CheckCircle2 size={12} className="mr-1" />
                    Subscribe
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground dark:text-gray-400 flex items-center space-x-1">
                  <Shield size={10} />
                  <span>We respect your privacy and never share your email</span>
                </p>
              </div>

              {/* Enhanced Feedback Section */}
              <div className="p-4 rounded-xl bg-card/50 dark:bg-gray-800/40 border border-border/30 dark:border-gray-600/40 backdrop-blur-sm">
                <h5 className="font-semibold text-sm text-foreground dark:text-white mb-3 flex items-center space-x-2">
                  <MessageSquare size={14} className="text-secondary" />
                  <span>Help Us Improve</span>
                </h5>
                <div className="space-y-2">
                  <Link href="/feedback" className="flex items-center space-x-2 text-xs text-muted-foreground dark:text-gray-300 hover:text-secondary transition-colors p-2 rounded-lg hover:bg-secondary/5 dark:hover:bg-secondary/10" data-testid="feedback-portal">
                    <MessageSquare size={12} />
                    <span>Student Feedback Portal</span>
                  </Link>
                  <Link href="/partnership" className="flex items-center space-x-2 text-xs text-muted-foreground dark:text-gray-300 hover:text-secondary transition-colors p-2 rounded-lg hover:bg-secondary/5 dark:hover:bg-secondary/10" data-testid="campus-partnership">
                    <Users size={12} />
                    <span>Campus Partnership Requests</span>
                  </Link>
                  <Link href="/support" className="flex items-center space-x-2 text-xs text-muted-foreground dark:text-gray-300 hover:text-secondary transition-colors p-2 rounded-lg hover:bg-secondary/5 dark:hover:bg-secondary/10" data-testid="technical-support">
                    <ExternalLink size={12} />
                    <span>Technical Support Contact</span>
                  </Link>
                </div>
              </div>

              {/* Enhanced Social Media */}
              <div className="p-4 rounded-xl bg-gradient-to-br from-accent/5 to-primary/5 dark:from-accent/10 dark:to-primary/10 border border-accent/20 dark:border-accent/30 backdrop-blur-sm">
                <h5 className="font-semibold text-sm text-foreground dark:text-white mb-4 flex items-center space-x-2">
                  <Heart size={14} className="text-accent" />
                  <span>Follow Our Journey</span>
                </h5>
                <div className="flex space-x-2">
                  {socialLinks.map((social) => {
                    const IconComponent = social.icon;
                    return (
                      <Button
                        key={social.label}
                        variant="ghost"
                        size="sm"
                        className="w-10 h-10 p-0 rounded-xl bg-background/60 dark:bg-gray-800/60 hover:bg-primary/20 dark:hover:bg-primary/30 border border-border/30 dark:border-gray-600/50 hover:border-primary/40 dark:hover:border-primary/50 text-muted-foreground dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 backdrop-blur-sm transform hover:scale-110 motion-reduce:hover:scale-100"
                        asChild
                        data-testid={`social-${social.label.toLowerCase()}`}
                      >
                        <a href={social.href} aria-label={`Follow us on ${social.label}`} target="_blank" rel="noopener noreferrer">
                          <IconComponent size={16} />
                        </a>
                      </Button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Bottom Section with Modern Design */}
        <div className="relative py-8 mt-8">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-border/20 dark:via-gray-600/20 to-transparent h-px" />
          
          <div className="pt-8">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-6 lg:space-y-0">
              {/* Enhanced Copyright Section */}
              <div className="text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start space-x-3 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/30 to-secondary/20 dark:from-primary/40 dark:to-secondary/30 flex items-center justify-center">
                    <Brain size={14} className="text-white" />
                  </div>
                  <p className="text-foreground dark:text-white text-base font-semibold">
                    MindCare Platform
                  </p>
                </div>
                <p className="text-muted-foreground dark:text-gray-300 text-sm mb-4">
                  © {currentYear} MindCare Platform - Confidential Mental Health Support for Students
                </p>
                
                {/* Enhanced Trust Badges */}
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
                  <div className="flex items-center space-x-2 bg-card/50 dark:bg-gray-800/40 px-3 py-2 rounded-full border border-border/30 dark:border-gray-600/40 backdrop-blur-sm">
                    <Shield size={14} className="text-primary" />
                    <span className="text-xs font-medium text-foreground dark:text-white">HIPAA Compliant</span>
                  </div>
                  <div className="flex items-center space-x-2 bg-card/50 dark:bg-gray-800/40 px-3 py-2 rounded-full border border-border/30 dark:border-gray-600/40 backdrop-blur-sm">
                    <Shield size={14} className="text-secondary" />
                    <span className="text-xs font-medium text-foreground dark:text-white">SSL Secured</span>
                  </div>
                  <div className="flex items-center space-x-2 bg-card/50 dark:bg-gray-800/40 px-3 py-2 rounded-full border border-border/30 dark:border-gray-600/40 backdrop-blur-sm">
                    <CheckCircle2 size={14} className="text-accent" />
                    <span className="text-xs font-medium text-foreground dark:text-white">Privacy Protected</span>
                  </div>
                </div>
              </div>

              {/* Enhanced Legal Links */}
              <div className="flex flex-col items-center lg:items-end space-y-3">
                <div className="flex flex-wrap justify-center gap-2">
                  {legalLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="px-3 py-2 text-xs text-muted-foreground dark:text-gray-300 hover:text-foreground dark:hover:text-white transition-all duration-300 bg-card/30 dark:bg-gray-800/30 hover:bg-card dark:hover:bg-gray-700/50 rounded-lg border border-transparent hover:border-primary/20 dark:hover:border-primary/30 backdrop-blur-sm"
                      data-testid={`footer-legal-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
                
                {/* Back to Top Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="text-muted-foreground dark:text-gray-300 hover:text-primary dark:hover:text-primary hover:bg-primary/10 dark:hover:bg-primary/20 rounded-full transition-all duration-300"
                  data-testid="back-to-top"
                >
                  <ArrowUp size={14} className="mr-1" />
                  <span className="text-xs">Back to Top</span>
                </Button>
              </div>
            </div>

            {/* Enhanced Mission Statement */}
            <div className="mt-8 text-center">
              <div className="inline-flex items-center justify-center space-x-2 px-4 py-3 rounded-full bg-gradient-to-r from-primary/10 via-secondary/5 to-accent/10 dark:from-primary/20 dark:via-secondary/10 dark:to-accent/20 border border-primary/20 dark:border-primary/30 backdrop-blur-sm">
                <span className="text-sm text-muted-foreground dark:text-gray-300">Made with</span>
                <Heart size={16} className="text-destructive animate-pulse motion-reduce:animate-none" />
                <span className="text-sm text-muted-foreground dark:text-gray-300">for student wellness and mental health advocacy</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
