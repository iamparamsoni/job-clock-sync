import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Login from "./pages/Login";
import VendorDashboard from "./pages/vendor/VendorDashboard";
import VendorWorkOrders from "./pages/vendor/WorkOrders";
import CompanyDashboard from "./pages/company/CompanyDashboard";
import CompanyWorkOrders from "./pages/company/WorkOrders";
import ProtectedRoute from "./components/ProtectedRoute";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route
              path="/vendor/dashboard"
              element={
                <ProtectedRoute allowedRole="vendor">
                  <VendorDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/company/dashboard"
              element={
                <ProtectedRoute allowedRole="company">
                  <CompanyDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/vendor/work-orders"
              element={
                <ProtectedRoute allowedRole="vendor">
                  <VendorWorkOrders />
                </ProtectedRoute>
              }
            />
            <Route
              path="/company/work-orders"
              element={
                <ProtectedRoute allowedRole="company">
                  <CompanyWorkOrders />
                </ProtectedRoute>
              }
            />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
