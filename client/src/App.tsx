import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { queryClient } from "./lib/queryClient";

// Import pages
import Home from "@/pages/Home";
import ChatBot from "@/pages/ChatBot";
import Appointments from "@/pages/Appointments";
import SelfAssessment from "@/pages/SelfAssessment";
import Resources from "@/pages/Resources";
import PeerSupport from "@/pages/PeerSupport";
import Emergency from "@/pages/Emergency";
import Dashboard from "@/pages/Dashboard";
import About from "@/pages/About";
import NotFound from "@/pages/not-found";

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
