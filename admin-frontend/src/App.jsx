import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {  Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import UserManagement from "./pages/UserManagement";
import PlatformReports from "./pages/PlatformReports";
import NotFound from "./pages/NotFound";
import AdminLogin from "./components/AdminLogin";
import EventDetails from "./pages/EventDetails";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Sonner />
      <Routes>
        <Route path="/" element={<AdminLogin />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/users" element={<UserManagement />} />
        <Route path="/reports" element={<PlatformReports />} />
        <Route path="/event-details/:eventId" element={<EventDetails />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
