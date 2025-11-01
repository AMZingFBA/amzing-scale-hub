import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import { AuthProvider } from "./hooks/use-auth";
import { PushNotificationsProvider } from "./components/PushNotificationsProvider";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import Guides from "./pages/Guides";
import Services from "./pages/Services";
import Formation from "./pages/Formation";
import Catalogue from "./pages/Catalogue";
import Tarifs from "./pages/Tarifs";
import Contact from "./pages/Contact";
import FAQ from "./pages/FAQ";
import CGV from "./pages/CGV";
import Privacy from "./pages/Privacy";
import Refund from "./pages/Refund";
import Support from "./pages/Support";
import Ticket from "./pages/Ticket";
import AdminTickets from "./pages/AdminTickets";
import AdminAlerts from "./pages/AdminAlerts";
import Chat from "./pages/Chat";
import NotFound from "./pages/NotFound";
import Success from "./pages/Success";
import Sales from "./pages/Sales";
import Suggestions from "./pages/Suggestions";
import Marketplace from "./pages/Marketplace";
import WantToSell from "./pages/WantToSell";
import ProductAlerts from "./pages/ProductAlerts";
import NotificationAlerts from "./pages/NotificationAlerts";
import RulesAlerts from "./pages/RulesAlerts";
import Annonces from "./pages/Annonces";
import Actualite from "./pages/Actualite";
import CatalogueProduits from "./pages/CatalogueProduits";
import Questions from "./pages/Questions";
import Avis from "./pages/Avis";
import AdminProfiles from "./pages/AdminProfiles";
import Profile from "./pages/Profile";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <PushNotificationsProvider>
            <ScrollToTop />
            <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/guides" element={<Guides />} />
            <Route path="/services" element={<Services />} />
            <Route path="/formation" element={<Formation />} />
            <Route path="/catalogue" element={<Catalogue />} />
            <Route path="/tarifs" element={<Tarifs />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/cgv" element={<CGV />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/refund" element={<Refund />} />
            <Route path="/support" element={<Support />} />
            <Route path="/ticket/:id" element={<Ticket />} />
            <Route path="/admin/tickets" element={<AdminTickets />} />
            <Route path="/admin/alerts" element={<AdminAlerts />} />
            <Route path="/produits-find" element={<ProductAlerts />} />
            <Route path="/produits-qogita" element={<ProductAlerts />} />
            <Route path="/produits-eany" element={<ProductAlerts />} />
            <Route path="/grossistes" element={<ProductAlerts />} />
            <Route path="/promotions" element={<ProductAlerts />} />
            <Route path="/sitelist" element={<ProductAlerts />} />
            <Route path="/notification-alerts" element={<NotificationAlerts />} />
            <Route path="/rules-alerts" element={<RulesAlerts />} />
            <Route path="/annonces" element={<Annonces />} />
            <Route path="/actualite" element={<Actualite />} />
            <Route path="/catalogue-produits" element={<CatalogueProduits />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/success" element={<Success />} />
            <Route path="/sales" element={<Sales />} />
            <Route path="/suggestions" element={<Suggestions />} />
            <Route path="/questions" element={<Questions />} />
            <Route path="/acheter" element={<Marketplace />} />
            <Route path="/vendre" element={<WantToSell />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/avis" element={<Avis />} />
            <Route path="/admin/profiles" element={<AdminProfiles />} />
            <Route path="/profile" element={<Profile />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          </PushNotificationsProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
