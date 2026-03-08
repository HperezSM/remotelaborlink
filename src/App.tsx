import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import ForCompanies from "./pages/ForCompanies";
import ForTalent from "./pages/ForTalent";
import ClientPortal from "./pages/ClientPortal";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Legal from "./pages/Legal";
import NotFound from "./pages/NotFound";
import CandidateSignup from "./pages/auth/CandidateSignup";
import CompanySignup from "./pages/auth/CompanySignup";
import CandidateLogin from "./pages/auth/CandidateLogin";
import CompanyLogin from "./pages/auth/CompanyLogin";
import AdminLogin from "./pages/auth/AdminLogin";
import CandidateDashboard from "./pages/talent/CandidateDashboard";
import CandidateProfileEdit from "./pages/talent/CandidateProfileEdit";
import CandidateProfile from "./pages/talent/CandidateProfile";
import CompanyDashboard from "./pages/company/CompanyDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Marketing */}
            <Route path="/" element={<Index />} />
            <Route path="/for-companies" element={<ForCompanies />} />
            <Route path="/for-talent" element={<ForTalent />} />
            <Route path="/portal" element={<ClientPortal />} />
            <Route path="/client-portal" element={<ClientPortal />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/legal" element={<Legal />} />

            {/* Auth */}
            <Route path="/signup/talent" element={<CandidateSignup />} />
            <Route path="/signup/company" element={<CompanySignup />} />
            <Route path="/login/talent" element={<CandidateLogin />} />
            <Route path="/login/company" element={<CompanyLogin />} />
            <Route path="/admin/login" element={<AdminLogin />} />

            {/* Candidate */}
            <Route path="/talent/dashboard" element={<CandidateDashboard />} />
            <Route path="/talent/profile/edit" element={<CandidateProfileEdit />} />

            {/* Company */}
            <Route path="/company/dashboard" element={<CompanyDashboard />} />

            {/* Admin */}
            <Route path="/admin" element={<AdminDashboard />} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
