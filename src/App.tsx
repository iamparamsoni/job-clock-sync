import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Login from "./pages/Login";
import VendorDashboard from "./pages/vendor/VendorDashboard";
import VendorWorkOrders from "./pages/vendor/WorkOrders";
import VendorJobs from "./pages/vendor/Jobs";
import VendorTimesheets from "./pages/vendor/Timesheets";
import VendorInvoices from "./pages/vendor/Invoices";
import CompanyDashboard from "./pages/company/CompanyDashboard";
import CompanyWorkOrders from "./pages/company/WorkOrders";
import CompanyJobs from "./pages/company/Jobs";
import CompanyTimesheets from "./pages/company/Timesheets";
import CompanyInvoices from "./pages/company/Invoices";
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
                <ProtectedRoute allowedRoles={['VENDOR']}>
                  <VendorDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/company/dashboard"
              element={
                <ProtectedRoute allowedRoles={['COMPANY']}>
                  <CompanyDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/vendor/work-orders"
              element={
                <ProtectedRoute allowedRoles={['VENDOR']}>
                  <VendorWorkOrders />
                </ProtectedRoute>
              }
            />
            <Route
              path="/company/work-orders"
              element={
                <ProtectedRoute allowedRoles={['COMPANY']}>
                  <CompanyWorkOrders />
                </ProtectedRoute>
              }
            />
            <Route
              path="/company/jobs"
              element={
                <ProtectedRoute allowedRoles={['COMPANY']}>
                  <CompanyJobs />
                </ProtectedRoute>
              }
            />
            <Route
              path="/company/timesheets"
              element={
                <ProtectedRoute allowedRoles={['COMPANY']}>
                  <CompanyTimesheets />
                </ProtectedRoute>
              }
            />
            <Route
              path="/company/invoices"
              element={
                <ProtectedRoute allowedRoles={['COMPANY']}>
                  <CompanyInvoices />
                </ProtectedRoute>
              }
            />
            <Route
              path="/vendor/jobs"
              element={
                <ProtectedRoute allowedRoles={['VENDOR']}>
                  <VendorJobs />
                </ProtectedRoute>
              }
            />
            <Route
              path="/vendor/timesheets"
              element={
                <ProtectedRoute allowedRoles={['VENDOR']}>
                  <VendorTimesheets />
                </ProtectedRoute>
              }
            />
            <Route
              path="/vendor/invoices"
              element={
                <ProtectedRoute allowedRoles={['VENDOR']}>
                  <VendorInvoices />
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
