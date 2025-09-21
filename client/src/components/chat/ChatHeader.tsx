import { Button } from "@/components/ui/button";
import { 
  Brain,
  PhoneCall
} from "lucide-react";

/**
 * Simplified Chat header component props interface
 */
export interface ChatHeaderProps {
  onEmergencyClick: () => void;
}

/**
 * Simple Mental Health Chat Header Component
 * 
 * Clean, minimal header with just logo, title, and emergency button.
 * Inspired by ChatGPT, WhatsApp, and other modern messaging apps.
 */
export default function ChatHeader({
  onEmergencyClick
}: ChatHeaderProps) {
  return (
    <header 
      className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm"
      role="banner"
      aria-label="Simple chat header"
    >
      <div className="px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          
          {/* Left Section: Logo & Title */}
          <div className="flex items-center space-x-3" data-testid="header-logo-title">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center" data-testid="logo-mindcare">
              <Brain className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white" data-testid="title-mindcare-support">
              MindCare AI Support
            </h1>
          </div>

          {/* Right Section: Emergency Button */}
          <Button
            onClick={onEmergencyClick}
            className="bg-red-600 hover:bg-red-700 text-white font-medium px-4 py-2 h-10"
            data-testid="button-emergency-help"
            aria-label="Get emergency help and crisis support"
          >
            <PhoneCall className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Emergency Help</span>
            <span className="sm:hidden">SOS</span>
          </Button>
        </div>
      </div>
    </header>
  );
}