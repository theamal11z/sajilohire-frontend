import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Jobs from "./pages/Jobs";
import JobProfile from "./pages/JobProfile";
import PhantomBusterCandidatePage from "./pages/PhantomBusterCandidatePage";
import Apply from "./pages/Apply";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import CandidateDetail from "./pages/CandidateDetail";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/job/:jobId" element={<JobProfile />} />
          <Route path="/apply" element={<Apply />} />
          <Route path="/onboarding/:candidateId" element={<Onboarding />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/candidate/:candidateId" element={<CandidateDetail />} />
          <Route path="/candidate/:candidateId/phantombuster" element={<PhantomBusterCandidatePage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
