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
  Phone,
  Mail,
  MapPin,
  Shield,
  Heart
} from "lucide-react";

/**
 * Footer Component - Contact info, links, and emergency resources
 * Features comprehensive site navigation and support information
 */
export default function Footer() {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { href: "/", label: "Home" },
    { href: "/chatbot", label: "AI Chatbot" },
    { href: "/appointments", label: "Appointments" },
    { href: "/assessment", label: "Self-Assessment" },
    { href: "/resources", label: "Resources" },
  ];

  const supportLinks = [
    { href: "/peer-support", label: "Peer Support" },
    { href: "/emergency", label: "Emergency Help" },
    { href: "/dashboard", label: "Dashboard" },
    { href: "/about", label: "About Us" },
    { href: "/privacy", label: "Privacy Policy" },
  ];

  const platformLinks = [
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms of Service" },
    { href: "/accessibility", label: "Accessibility Statement" },
    { href: "/security", label: "Data Security Information" },
  ];

  const emergencyContacts = [
    { 
      label: "National Suicide Prevention", 
      contact: "988",
      type: "phone",
      available: "24/7"
    },
    { 
      label: "Crisis Text Line", 
      contact: "Text HOME to 741741",
      type: "text",
      available: "24/7"
    },
    { 
      label: "Campus Counseling", 
      contact: "(555) 123-4567",
      type: "phone",
      available: "9 AM - 5 PM"
    },
  ];

  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
  ];

  return (
    <footer className="bg-foreground text-white" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center">
                  <Brain className="text-white" size={20} />
                </div>
                <h3 className="text-xl font-bold font-heading">MindCare</h3>
              </div>
              
              <p className="text-gray-300 leading-relaxed">
                Supporting student mental health with confidential, professional, and accessible resources. 
                Your wellbeing is our priority.
              </p>
              
              <div className="flex space-x-4">
                {socialLinks.map((social) => {
                  const IconComponent = social.icon;
                  return (
                    <Button
                      key={social.label}
                      variant="ghost"
                      size="icon"
                      className="text-gray-300 hover:text-white hover:bg-white/10 focus-ring"
                      asChild
                      data-testid={`social-${social.label.toLowerCase()}`}
                    >
                      <a href={social.href} aria-label={social.label}>
                        <IconComponent size={20} />
                      </a>
                    </Button>
                  );
                })}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-6 font-heading">Quick Links</h4>
              <ul className="space-y-3">
                {quickLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-gray-300 hover:text-white transition-colors duration-300 focus-ring rounded"
                      data-testid={`footer-link-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support Links */}
            <div>
              <h4 className="text-lg font-semibold mb-6 font-heading">Support</h4>
              <ul className="space-y-3">
                {supportLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-gray-300 hover:text-white transition-colors duration-300 focus-ring rounded"
                      data-testid={`footer-support-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Emergency Contacts */}
            <div>
              <h4 className="text-lg font-semibold mb-6 font-heading text-destructive">
                Emergency Contacts
              </h4>
              <div className="space-y-4">
                {emergencyContacts.map((contact, index) => (
                  <div key={index} className="space-y-1">
                    <div className="flex items-start space-x-2">
                      <Phone size={16} className="text-destructive mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-white">{contact.label}</p>
                        <p className="text-gray-300 text-sm">{contact.contact}</p>
                        <p className="text-gray-400 text-xs">{contact.available}</p>
                      </div>
                    </div>
                  </div>
                ))}
                
                <div className="mt-6 pt-4 border-t border-gray-700">
                  <div className="flex items-center space-x-2 text-sm">
                    <Mail size={16} className="text-primary" />
                    <span className="text-gray-300">support@mindcare.edu</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm mt-2">
                    <MapPin size={16} className="text-primary" />
                    <span className="text-gray-300">Student Health Center</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Newsletter Signup */}
          <div className="mt-12 pt-8 border-t border-gray-700">
            <div className="max-w-md">
              <h4 className="text-lg font-semibold mb-4 font-heading">Mental Health Tips</h4>
              <p className="text-gray-300 text-sm mb-4">
                Get weekly mental health tips and resources delivered to your inbox.
              </p>
              <div className="flex space-x-2">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-primary"
                  data-testid="input-newsletter-email"
                />
                <Button 
                  variant="secondary"
                  className="bg-primary hover:bg-primary/90"
                  data-testid="button-subscribe-newsletter"
                >
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
        </div>

        <Separator className="bg-gray-700" />

        {/* Bottom Footer */}
        <div className="py-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Copyright and Trust Message */}
            <div className="text-center md:text-left">
              <p className="text-gray-300 text-sm">
                © {currentYear} MindCare Platform. All rights reserved. Your privacy and confidentiality are our priority.
              </p>
              <div className="flex items-center justify-center md:justify-start space-x-4 mt-2">
                <div className="flex items-center space-x-1 text-xs text-gray-400">
                  <Shield size={12} className="text-primary" />
                  <span>SSL Secured</span>
                </div>
                <div className="flex items-center space-x-1 text-xs text-gray-400">
                  <Shield size={12} className="text-secondary" />
                  <span>HIPAA Compliant</span>
                </div>
              </div>
            </div>

            {/* Platform Links */}
            <div className="flex flex-wrap justify-center md:justify-end space-x-6">
              {platformLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-gray-300 hover:text-white text-sm transition-colors duration-300 focus-ring rounded"
                  data-testid={`footer-platform-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Made with Love Message */}
          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm flex items-center justify-center space-x-1">
              <span>Made with</span>
              <Heart size={14} className="text-destructive" />
              <span>for student wellness</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
