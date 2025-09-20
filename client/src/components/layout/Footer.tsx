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
  Globe
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
      label: "International Crisis Resources", 
      contact: "Global Support",
      href: "/international-crisis",
      type: "link",
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
    { href: "/clinical-team", label: "Clinical Advisory Team", icon: Users },
    { href: "/privacy", label: "Privacy & Security Practices", icon: Shield },
    { href: "/accessibility", label: "Accessibility Commitment", icon: Heart },
    { href: "/research", label: "Platform Effectiveness Research", icon: ExternalLink }
  ];

  // Student Resources - Additional support links
  const studentResourceLinks = [
    { href: "/campus-resources", label: "Campus Resource Directory", icon: MapPin },
    { href: "/academic-support", label: "Academic Support Connections", icon: BookOpen },
    { href: "/financial-aid", label: "Financial Aid Counseling", icon: Shield },
    { href: "/career-services", label: "Career Services Integration", icon: ExternalLink },
    { href: "/student-rights", label: "Student Rights & Advocacy", icon: Users }
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
    <footer className="bg-background dark:bg-foreground text-foreground dark:text-white border-t border-border dark:border-gray-700" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content - 4 Column Layout */}
        <div className="py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* Column 1 - Crisis Resources */}
            <div className="space-y-6">
              <div className="flex items-center space-x-2 mb-6">
                <AlertTriangle className="text-destructive" size={24} />
                <h4 className="text-lg font-bold font-heading text-destructive dark:text-red-400">
                  Immediate Help Available
                </h4>
              </div>
              
              <div className="space-y-4">
                {emergencyContacts.map((contact, index) => {
                  const isClickable = contact.type === 'phone' || contact.type === 'text';
                  const content = (
                    <div className="flex items-start space-x-3 p-3 rounded-lg bg-muted/50 dark:bg-gray-800/50 hover:bg-muted dark:hover:bg-gray-700 transition-colors">
                      {contact.type === 'phone' && <Phone size={16} className={contact.urgent ? 'text-destructive' : 'text-primary'} />}
                      {contact.type === 'text' && <MessageSquare size={16} className={contact.urgent ? 'text-destructive' : 'text-primary'} />}
                      {contact.type === 'link' && <Globe size={16} className="text-primary" />}
                      <div className="flex-1">
                        <p className={`font-semibold text-sm ${contact.urgent ? 'text-destructive dark:text-red-400' : 'text-foreground dark:text-white'}`}>
                          {contact.label}
                        </p>
                        <p className="text-muted-foreground dark:text-gray-300 text-xs font-medium">
                          {contact.contact}
                        </p>
                        <div className="flex items-center space-x-1 mt-1">
                          <Clock size={10} className="text-muted-foreground" />
                          <p className="text-muted-foreground dark:text-gray-400 text-xs">
                            {contact.available}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                  
                  if (isClickable) {
                    return (
                      <a
                        key={index}
                        href={contact.href}
                        className="block focus-ring rounded-lg"
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
                        className="block focus-ring rounded-lg"
                        data-testid={`crisis-resource-link-${index}`}
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
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                  <Brain className="text-white" size={16} />
                </div>
                <h4 className="text-lg font-semibold font-heading text-foreground dark:text-white">
                  About MindCare Platform
                </h4>
              </div>
              
              <ul className="space-y-3">
                {platformLinks.map((link) => {
                  const IconComponent = link.icon;
                  return (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="flex items-center space-x-3 text-muted-foreground dark:text-gray-300 hover:text-foreground dark:hover:text-white transition-colors duration-300 focus-ring rounded p-2 hover:bg-muted/50 dark:hover:bg-gray-800/50"
                        data-testid={`platform-link-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                      >
                        <IconComponent size={16} className="text-primary" />
                        <span className="text-sm font-medium">{link.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>

              <div className="mt-6 pt-4 border-t border-border dark:border-gray-700">
                <div className="flex items-center space-x-2 text-sm mb-2">
                  <Mail size={14} className="text-primary" />
                  <a href="mailto:support@mindcare.edu" className="text-muted-foreground dark:text-gray-300 hover:text-primary transition-colors" data-testid="email-support">
                    support@mindcare.edu
                  </a>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <MapPin size={14} className="text-primary" />
                  <span className="text-muted-foreground dark:text-gray-300">Student Health Center</span>
                </div>
              </div>
            </div>

            {/* Column 3 - Student Resources */}
            <div className="space-y-6">
              <div className="flex items-center space-x-2 mb-6">
                <Users className="text-secondary" size={20} />
                <h4 className="text-lg font-semibold font-heading text-foreground dark:text-white">
                  Additional Support
                </h4>
              </div>
              
              <ul className="space-y-3">
                {studentResourceLinks.map((link) => {
                  const IconComponent = link.icon;
                  return (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="flex items-center space-x-3 text-muted-foreground dark:text-gray-300 hover:text-foreground dark:hover:text-white transition-colors duration-300 focus-ring rounded p-2 hover:bg-muted/50 dark:hover:bg-gray-800/50"
                        data-testid={`student-resource-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                      >
                        <IconComponent size={16} className="text-secondary" />
                        <span className="text-sm font-medium">{link.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>

              {/* Quick Action Links */}
              <div className="mt-6 pt-4 border-t border-border dark:border-gray-700">
                <h5 className="font-semibold text-sm text-foreground dark:text-white mb-3">Quick Access</h5>
                <div className="space-y-2">
                  <Link href="/chatbot" className="flex items-center space-x-2 text-xs text-primary hover:text-primary/80 transition-colors" data-testid="quick-access-chatbot">
                    <MessageSquare size={12} />
                    <span>24/7 AI Support Chat</span>
                  </Link>
                  <Link href="/assessment" className="flex items-center space-x-2 text-xs text-primary hover:text-primary/80 transition-colors" data-testid="quick-access-assessment">
                    <BookOpen size={12} />
                    <span>Mental Health Assessment</span>
                  </Link>
                  <Link href="/appointments" className="flex items-center space-x-2 text-xs text-primary hover:text-primary/80 transition-colors" data-testid="quick-access-appointments">
                    <Users size={12} />
                    <span>Book Counseling Session</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Column 4 - Community & Contact */}
            <div className="space-y-6">
              <div className="flex items-center space-x-2 mb-6">
                <Heart className="text-accent" size={20} />
                <h4 className="text-lg font-semibold font-heading text-foreground dark:text-white">
                  Stay Connected
                </h4>
              </div>
              
              {/* Newsletter Signup */}
              <div className="space-y-4">
                <div>
                  <h5 className="font-semibold text-sm text-foreground dark:text-white mb-2">Mental Health Newsletter</h5>
                  <p className="text-muted-foreground dark:text-gray-300 text-xs mb-3">
                    Weekly tips, resources, and wellness insights delivered to your inbox.
                  </p>
                  <div className="flex space-x-2">
                    <Input
                      type="email"
                      placeholder="Your email"
                      className="text-xs bg-background dark:bg-gray-800/50 border-border dark:border-gray-600 text-foreground dark:text-white placeholder:text-muted-foreground focus:border-primary dark:focus:border-primary"
                      data-testid="input-newsletter-email"
                    />
                    <Button 
                      size="sm"
                      className="bg-primary hover:bg-primary/90 text-primary-foreground px-3"
                      data-testid="button-subscribe-newsletter"
                    >
                      Join
                    </Button>
                  </div>
                </div>

                {/* Feedback Portal */}
                <div className="pt-4 border-t border-border dark:border-gray-700">
                  <h5 className="font-semibold text-sm text-foreground dark:text-white mb-2">Help Us Improve</h5>
                  <div className="space-y-2">
                    <Link href="/feedback" className="flex items-center space-x-2 text-xs text-muted-foreground dark:text-gray-300 hover:text-primary transition-colors" data-testid="feedback-portal">
                      <MessageSquare size={12} />
                      <span>Student Feedback Portal</span>
                    </Link>
                    <Link href="/partnership" className="flex items-center space-x-2 text-xs text-muted-foreground dark:text-gray-300 hover:text-primary transition-colors" data-testid="campus-partnership">
                      <Users size={12} />
                      <span>Campus Partnership Requests</span>
                    </Link>
                    <Link href="/support" className="flex items-center space-x-2 text-xs text-muted-foreground dark:text-gray-300 hover:text-primary transition-colors" data-testid="technical-support">
                      <ExternalLink size={12} />
                      <span>Technical Support Contact</span>
                    </Link>
                  </div>
                </div>

                {/* Social Media */}
                <div className="pt-4 border-t border-border dark:border-gray-700">
                  <h5 className="font-semibold text-sm text-foreground dark:text-white mb-3">Follow Us</h5>
                  <div className="flex space-x-3">
                    {socialLinks.map((social) => {
                      const IconComponent = social.icon;
                      return (
                        <Button
                          key={social.label}
                          variant="ghost"
                          size="sm"
                          className="text-muted-foreground dark:text-gray-300 hover:text-primary dark:hover:text-primary hover:bg-muted/50 dark:hover:bg-gray-700 w-8 h-8 p-0"
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
        </div>

        <Separator className="bg-border dark:bg-gray-700" />

        {/* Bottom Footer */}
        <div className="py-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Copyright and Trust Message */}
            <div className="text-center md:text-left">
              <p className="text-muted-foreground dark:text-gray-300 text-sm">
                © {currentYear} MindCare Platform - Confidential Mental Health Support for Students
              </p>
              <div className="flex items-center justify-center md:justify-start space-x-6 mt-3">
                <div className="flex items-center space-x-1 text-xs text-muted-foreground dark:text-gray-400">
                  <Shield size={14} className="text-primary" />
                  <span className="font-medium">HIPAA Compliance</span>
                </div>
                <div className="flex items-center space-x-1 text-xs text-muted-foreground dark:text-gray-400">
                  <Shield size={14} className="text-secondary" />
                  <span className="font-medium">SSL Secured</span>
                </div>
                <div className="flex items-center space-x-1 text-xs text-muted-foreground dark:text-gray-400">
                  <Shield size={14} className="text-accent" />
                  <span className="font-medium">Student Privacy Protected</span>
                </div>
              </div>
            </div>

            {/* Legal Links */}
            <div className="flex flex-wrap justify-center md:justify-end space-x-4 lg:space-x-6">
              {legalLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-muted-foreground dark:text-gray-300 hover:text-foreground dark:hover:text-white text-xs transition-colors duration-300 focus-ring rounded px-1 py-1"
                  data-testid={`footer-legal-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Mission Statement */}
          <div className="mt-6 text-center">
            <p className="text-muted-foreground dark:text-gray-400 text-sm flex items-center justify-center space-x-1">
              <span>Made with</span>
              <Heart size={14} className="text-destructive animate-pulse" />
              <span>for student wellness and mental health advocacy</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
