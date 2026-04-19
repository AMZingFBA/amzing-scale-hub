import React, { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import { AuthProvider } from "./hooks/use-auth";
import { PushNotificationsProvider } from "./components/PushNotificationsProvider";
import { StoreProvider } from "./components/StoreProvider";
import ImpersonationBar from "./components/ImpersonationBar";

// Pages critiques chargées immédiatement
import Index from "./pages/Index";
import Auth from "./pages/Auth";

// Lazy loading des pages non critiques pour réduire le bundle initial
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Debuter = lazy(() => import("./pages/Debuter"));
const CreationSociete = lazy(() => import("./pages/CreationSociete"));
const GestionProduitsInfo = lazy(() => import("./pages/GestionProduitsInfo"));
const FactureAutorisation = lazy(() => import("./pages/FactureAutorisation"));
const Cashback = lazy(() => import("./pages/Cashback"));
const AvisPage = lazy(() => import("./pages/AvisPage"));
const Guides = lazy(() => import("./pages/Guides"));
const Services = lazy(() => import("./pages/Services"));
const Formation = lazy(() => import("./pages/Formation"));
const Catalogue = lazy(() => import("./pages/Catalogue"));
const Tarifs = lazy(() => import("./pages/Tarifs"));
const AndroidPayment = lazy(() => import("./pages/AndroidPayment"));
const Contact = lazy(() => import("./pages/Contact"));
const FAQ = lazy(() => import("./pages/FAQ"));
const CGV = lazy(() => import("./pages/CGV"));
const CGU = lazy(() => import("./pages/CGU"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Confidentialite = lazy(() => import("./pages/Confidentialite"));
const Refund = lazy(() => import("./pages/Refund"));
const SuppressionCompte = lazy(() => import("./pages/SuppressionCompte"));
const Unsubscribe = lazy(() => import("./pages/Unsubscribe"));
const MentionsLegales = lazy(() => import("./pages/MentionsLegales"));
const Support = lazy(() => import("./pages/Support"));
const Ticket = lazy(() => import("./pages/Ticket"));
const AdminTickets = lazy(() => import("./pages/AdminTickets"));
const AdminAlerts = lazy(() => import("./pages/AdminAlerts"));
const Chat = lazy(() => import("./pages/Chat"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Success = lazy(() => import("./pages/Success"));
const Sales = lazy(() => import("./pages/Sales"));
const Suggestions = lazy(() => import("./pages/Suggestions"));
const Marketplace = lazy(() => import("./pages/Marketplace"));
const WantToSell = lazy(() => import("./pages/WantToSell"));
const ProductAlerts = lazy(() => import("./pages/ProductAlerts"));
const ProductFindAlerts = lazy(() => import("./pages/ProductFindAlerts"));
const Sitelist = lazy(() => import("./pages/Sitelist"));
const NotificationAlerts = lazy(() => import("./pages/NotificationAlerts"));
const RulesAlerts = lazy(() => import("./pages/RulesAlerts"));
const Annonces = lazy(() => import("./pages/Annonces"));
const Actualite = lazy(() => import("./pages/Actualite"));
const CatalogueProduits = lazy(() => import("./pages/CatalogueProduits"));
const CatalogueDJI = lazy(() => import("./pages/CatalogueDJI"));
const CatalogueXiaomi = lazy(() => import("./pages/CatalogueXiaomi"));
const CataloguePlaymobil = lazy(() => import("./pages/CataloguePlaymobil"));
const CatalogueLego = lazy(() => import("./pages/CatalogueLego"));
const CatalogueQogita = lazy(() => import("./pages/CatalogueQogita"));
const CatalogueEany = lazy(() => import("./pages/CatalogueEany"));
const CatalogueVibraforce = lazy(() => import("./pages/CatalogueVibraforce"));
const CatalogueFranceHexagone = lazy(() => import("./pages/CatalogueFranceHexagone"));
const CatalogueBHDistribution = lazy(() => import("./pages/CatalogueBHDistribution"));
const Questions = lazy(() => import("./pages/Questions"));
const Avis = lazy(() => import("./pages/Avis"));
const AdminProfiles = lazy(() => import("./pages/AdminProfiles"));
const Profile = lazy(() => import("./pages/Profile"));
const TestPushNotifications = lazy(() => import("./pages/TestPushNotifications"));
const DebugPushNotifications = lazy(() => import("./pages/DebugPushNotifications"));
const AffiliateLanding = lazy(() => import("./pages/affiliate/AffiliateLanding"));
const AffiliateSignup = lazy(() => import("./pages/affiliate/AffiliateSignup"));
const AffiliateLogin = lazy(() => import("./pages/affiliate/AffiliateLogin"));
const AffiliateVerify = lazy(() => import("./pages/affiliate/AffiliateVerify"));
const AffiliateDashboard = lazy(() => import("./pages/affiliate/AffiliateDashboard"));
const AffiliateAdmin = lazy(() => import("./pages/affiliate/AffiliateAdmin"));
const ProductSearch = lazy(() => import("./pages/ProductSearch"));
const AnalyseFichier = lazy(() => import("./pages/AnalyseFichier"));
const MonitorQogita = lazy(() => import("./pages/MonitorQogita"));
const ProduitsQogita = lazy(() => import("./pages/ProduitsQogita"));
const ProduitsEany = lazy(() => import("./pages/ProduitsEany"));
const AdminAirtableContacts = lazy(() => import("./pages/AdminAirtableContacts"));
const AdminAirtableUsers = lazy(() => import("./pages/AdminAirtableUsers"));
const AdminSubscriptions = lazy(() => import("./pages/AdminSubscriptions"));

const AdminFailedPayments = lazy(() => import("./pages/AdminFailedPayments"));
const AdminWhatsAppBulk = lazy(() => import("./pages/AdminWhatsAppBulk"));
const AdminWhatsAppCRM = lazy(() => import("./pages/AdminWhatsAppCRM"));
const AmazonToAmazon = lazy(() => import("./pages/AmazonToAmazon"));
const ProduitsIbood = lazy(() => import("./pages/ProduitsIbood"));
const ProduitsAuchan = lazy(() => import("./pages/ProduitsAuchan"));
const AMZingMP = lazy(() => import("./pages/AMZingMP"));
const CoursParticulier = lazy(() => import("./pages/CoursParticulier"));

const AndroidApp = lazy(() => import("./pages/AndroidApp"));
const AmazonFbaDebutant = lazy(() => import("./pages/AmazonFbaDebutant"));
const OutilAmazonFba = lazy(() => import("./pages/OutilAmazonFba"));
const ProduitsRentablesAmazon = lazy(() => import("./pages/ProduitsRentablesAmazon"));
const PaymentSuccess = lazy(() => import("./pages/PaymentSuccess"));

// Guide pages
const AmazonFbaCestQuoi = lazy(() => import("./pages/guide/AmazonFbaCestQuoi"));
const AmazonFbaVsFbm = lazy(() => import("./pages/guide/AmazonFbaVsFbm"));
const CommentDebuterAmazonFba = lazy(() => import("./pages/guide/CommentDebuterAmazonFba"));
const CombienCouteAmazonFba = lazy(() => import("./pages/guide/CombienCouteAmazonFba"));
const FormationAmazonFbaDebutant = lazy(() => import("./pages/guide/FormationAmazonFbaDebutant"));
const SuiteLanding = lazy(() => import("./pages/SuiteLanding"));
const SuiteSuccess = lazy(() => import("./pages/SuiteSuccess"));
const PaymentSuccessSysteme = lazy(() => import("./pages/PaymentSuccessSysteme"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));

const queryClient = new QueryClient();

// Loading fallback minimal pour le lazy loading
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <StoreProvider>
            <PushNotificationsProvider>
              <ScrollToTop />
              <ImpersonationBar />
              <Suspense fallback={<PageLoader />}>
            <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/debuter" element={<Debuter />} />
            <Route path="/creation-societe" element={<CreationSociete />} />
            <Route path="/gestion-produits-info" element={<GestionProduitsInfo />} />
            <Route path="/facture-autorisation" element={<FactureAutorisation />} />
            <Route path="/cashback" element={<Cashback />} />
            <Route path="/avis-page" element={<AvisPage />} />
            <Route path="/guides" element={<Guides />} />
            <Route path="/services" element={<Services />} />
            <Route path="/formation" element={<Formation />} />
            <Route path="/catalogue" element={<Catalogue />} />
            <Route path="/tarifs" element={<Tarifs />} />
            <Route path="/android-payment" element={<AndroidPayment />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/cgv" element={<CGV />} />
            <Route path="/cgu" element={<CGU />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/confidentialite" element={<Confidentialite />} />
            <Route path="/refund" element={<Refund />} />
            <Route path="/suppression-compte" element={<SuppressionCompte />} />
            <Route path="/unsubscribe" element={<Unsubscribe />} />
            <Route path="/mentions-legales" element={<MentionsLegales />} />
            <Route path="/support" element={<Support />} />
            <Route path="/ticket/:id" element={<Ticket />} />
            <Route path="/admin/tickets" element={<AdminTickets />} />
            <Route path="/admin/alerts" element={<AdminAlerts />} />
            <Route path="/produits-find" element={<ProductAlerts />} />
            <Route path="/produits-qogita" element={<ProductAlerts />} />
            <Route path="/produits-eany" element={<ProductAlerts />} />
            <Route path="/grossistes" element={<ProductAlerts />} />
            <Route path="/promotions" element={<ProductAlerts />} />
            <Route path="/product-alerts" element={<ProductFindAlerts />} />
            <Route path="/product-alerts/:source" element={<ProductFindAlerts />} />
            <Route path="/a2a/:source" element={<AmazonToAmazon />} />
            <Route path="/produits-ibood" element={<ProduitsIbood />} />
            <Route path="/produits-auchan" element={<ProduitsAuchan />} />
            <Route path="/sitelist" element={<Sitelist />} />
            <Route path="/notification-alerts" element={<NotificationAlerts />} />
            <Route path="/rules-alerts" element={<RulesAlerts />} />
            <Route path="/annonces" element={<Annonces />} />
            <Route path="/actualite" element={<Actualite />} />
            <Route path="/catalogue-produits" element={<CatalogueProduits />} />
            <Route path="/catalogue/dji" element={<CatalogueDJI />} />
            <Route path="/catalogue/xiaomi" element={<CatalogueXiaomi />} />
<Route path="/catalogue/playmobil" element={<CataloguePlaymobil />} />
            <Route path="/catalogue/lego" element={<CatalogueLego />} />
            <Route path="/catalogue/qogita" element={<CatalogueQogita />} />
            <Route path="/catalogue/eany" element={<CatalogueEany />} />
            <Route path="/catalogue/vibraforce" element={<CatalogueVibraforce />} />
            <Route path="/catalogue/france-hexagone" element={<CatalogueFranceHexagone />} />
            <Route path="/catalogue/bh-distribution" element={<CatalogueBHDistribution />} />
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
            <Route path="/test-push" element={<TestPushNotifications />} />
            <Route path="/debug-push" element={<DebugPushNotifications />} />
            <Route path="/affiliate" element={<AffiliateLanding />} />
            <Route path="/affiliate/signup" element={<AffiliateSignup />} />
            <Route path="/affiliate/login" element={<AffiliateLogin />} />
            <Route path="/affiliate/verify" element={<AffiliateVerify />} />
            <Route path="/affiliate/dashboard" element={<AffiliateDashboard />} />
            <Route path="/affiliate/admin" element={<AffiliateAdmin />} />
            <Route path="/product-search" element={<ProductSearch />} />
            <Route path="/analyse-fichier" element={<AnalyseFichier />} />
            <Route path="/monitor/qogita" element={<MonitorQogita />} />
            <Route path="/produits-gagnants/produits-qogita" element={<ProduitsQogita />} />
            <Route path="/products/qogita" element={<ProduitsQogita />} />
            <Route path="/products/eany" element={<ProduitsEany />} />
            <Route path="/admin/airtable-contacts" element={<AdminAirtableContacts />} />
            <Route path="/admin/airtable-users" element={<AdminAirtableUsers />} />
            <Route path="/admin/subscriptions" element={<AdminSubscriptions />} />
            <Route path="/admin/whatsapp" element={<Navigate to="/admin/whatsapp-crm" replace />} />
            <Route path="/admin/failed-payments" element={<AdminFailedPayments />} />
            <Route path="/admin/whatsapp-bulk" element={<AdminWhatsAppBulk />} />
            <Route path="/admin/whatsapp-crm" element={<AdminWhatsAppCRM />} />
            
            <Route path="/android" element={<AndroidApp />} />
            <Route path="/amazon-fba-debutant" element={<AmazonFbaDebutant />} />
            <Route path="/outil-amazon-fba" element={<OutilAmazonFba />} />
            <Route path="/produits-rentables-amazon" element={<ProduitsRentablesAmazon />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />
            
            {/* Guide pages */}
            <Route path="/guide/amazon-fba-cest-quoi" element={<AmazonFbaCestQuoi />} />
            <Route path="/guide/amazon-fba-vs-fbm" element={<AmazonFbaVsFbm />} />
            <Route path="/guide/comment-debuter-amazon-fba" element={<CommentDebuterAmazonFba />} />
            <Route path="/guide/combien-coute-amazon-fba" element={<CombienCouteAmazonFba />} />
            <Route path="/guide/formation-amazon-fba-debutant" element={<FormationAmazonFbaDebutant />} />
            
            {/* Landing page AMZing FBA Suite pour amzingfba.fr */}
            <Route path="/suite" element={<SuiteLanding />} />
            <Route path="/suite-success" element={<SuiteSuccess />} />
            <Route path="/payment-success-systeme" element={<PaymentSuccessSysteme />} />
            
            {/* Blog SEO */}
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            
            <Route path="/amzing-amp" element={<AMZingMP />} />
            <Route path="/cours-particulier" element={<CoursParticulier />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
              </Suspense>
            </PushNotificationsProvider>
          </StoreProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
