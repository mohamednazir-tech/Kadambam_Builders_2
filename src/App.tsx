import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import AdminPage from "./pages/AdminPage.tsx";
import HouseConstructionTirunelveli from "./pages/HouseConstructionTirunelveli.tsx";
import EditGuidePage from "./pages/EditGuidePage.tsx";
import EditContactPage from "./pages/EditContactPage.tsx";
import EditPasswordPage from "./pages/EditPasswordPage.tsx";
import EditAboutPage from "./pages/EditAboutPage.tsx";
import EditServicesPage from "./pages/EditServicesPage.tsx";
import EditTestimonialsPage from "./pages/EditTestimonialsPage.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/house-construction-tirunelveli" element={<HouseConstructionTirunelveli />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/admin/edit-guide" element={
          <ProtectedRoute>
            <EditGuidePage />
          </ProtectedRoute>
        } />
        <Route path="/admin/edit-contact" element={
          <ProtectedRoute>
            <EditContactPage />
          </ProtectedRoute>
        } />
        <Route path="/admin/edit-password" element={
          <ProtectedRoute>
            <EditPasswordPage />
          </ProtectedRoute>
        } />
        <Route path="/admin/edit-about" element={
          <ProtectedRoute>
            <EditAboutPage />
          </ProtectedRoute>
        } />
        <Route path="/admin/edit-services" element={
          <ProtectedRoute>
            <EditServicesPage />
          </ProtectedRoute>
        } />
        <Route path="/admin/edit-testimonials" element={
          <ProtectedRoute>
            <EditTestimonialsPage />
          </ProtectedRoute>
        } />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
