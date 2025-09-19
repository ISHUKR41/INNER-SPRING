import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { queryClient } from "./lib/queryClient";

// Import pages from their new organized folder structure
// Each page now lives in its own dedicated folder for better organization
import Home from "@/pages/home/Home";
import ChatBot from "@/pages/chatbot/ChatBot";
import Appointments from "@/pages/appointments/Appointments";
import SelfAssessment from "@/pages/assessments/SelfAssessment";
import Resources from "@/pages/resources/Resources";
import PeerSupport from "@/pages/peer-support/PeerSupport";
import Emergency from "@/pages/emergency/Emergency";
import Dashboard from "@/pages/dashboard/Dashboard";
import About from "@/pages/about/About";
import NotFound from "@/pages/not-found/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/chatbot" component={ChatBot} />
      <Route path="/appointments" component={Appointments} />
      <Route path="/assessment" component={SelfAssessment} />
      <Route path="/resources" component={Resources} />
      <Route path="/peer-support" component={PeerSupport} />
      <Route path="/emergency" component={Emergency} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/about" component={About} />
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-background text-foreground">
          <Toaster />
          <Router />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
