import { Switch, Route, Router as WouterRouter, Redirect } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

import AdminDashboard from "@/pages/admin/Dashboard";
import EventsList from "@/pages/admin/EventsList";
import EventDetail from "@/pages/admin/EventDetail";
import VenuesList from "@/pages/admin/VenuesList";
import VenueDetail from "@/pages/admin/VenueDetail";
import VenueCandidates from "@/pages/admin/VenueCandidates";
import VenueDuplicates from "@/pages/admin/VenueDuplicates";
import CitiesList from "@/pages/admin/CitiesList";
import CityDetail from "@/pages/admin/CityDetail";
import SuppliersList from "@/pages/admin/SuppliersList";
import SupplierDetail from "@/pages/admin/SupplierDetail";
import OrdersList from "@/pages/admin/OrdersList";
import OrderDetail from "@/pages/admin/OrderDetail";
import LandingsList from "@/pages/admin/LandingsList";
import LandingDetail from "@/pages/admin/LandingDetail";
import PromoBlocksList from "@/pages/admin/PromoBlocksList";
import PromoBlockDetail from "@/pages/admin/PromoBlockDetail";
import PromoPlacementsList from "@/pages/admin/PromoPlacementsList";
import PromoPlacementDetail from "@/pages/admin/PromoPlacementDetail";
import Settings from "@/pages/admin/Settings";
import SettingsLocale from "@/pages/admin/SettingsLocale";
import UsersList from "@/pages/admin/UsersList";
import UserDetail from "@/pages/admin/UserDetail";
import RefundsList from "@/pages/admin/RefundsList";
import RefundDetail from "@/pages/admin/RefundDetail";
import ReviewsList from "@/pages/admin/ReviewsList";
import SupportList from "@/pages/admin/SupportList";
import SupportDetail from "@/pages/admin/SupportDetail";
import ArticlesList from "@/pages/admin/ArticlesList";
import ArticleDetail from "@/pages/admin/ArticleDetail";
import CollectionsList from "@/pages/admin/CollectionsList";
import CollectionDetail from "@/pages/admin/CollectionDetail";
import SeoAudit from "@/pages/admin/SeoAudit";
import CategoriesList from "@/pages/admin/CategoriesList";
import TagsList from "@/pages/admin/TagsList";
import Logs from "@/pages/admin/Logs";
import Integrations from "@/pages/admin/Integrations";
import FinanceDashboard from "@/pages/admin/FinanceDashboard";
import Transactions from "@/pages/admin/Transactions";
import PayoutsList from "@/pages/admin/PayoutsList";
import PayoutDetail from "@/pages/admin/PayoutDetail";
import Reconciliation from "@/pages/admin/Reconciliation";
import ReportsHub from "@/pages/admin/ReportsHub";
import SalesReport from "@/pages/admin/SalesReport";
import ChannelReport from "@/pages/admin/ChannelReport";
import ChatInbox from "@/pages/admin/ChatInbox";
import ChatConversation from "@/pages/admin/ChatConversation";
import StaffList from "@/pages/admin/StaffList";
import StaffDetail from "@/pages/admin/StaffDetail";

import SupplierDashboard from "@/pages/supplier/SupplierDashboard";
import SupplierEventsList from "@/pages/supplier/SupplierEventsList";
import SupplierEventDetail from "@/pages/supplier/SupplierEventDetail";
import SupplierOrders from "@/pages/supplier/SupplierOrders";
import SupplierRefunds from "@/pages/supplier/SupplierRefunds";
import SupplierProfile from "@/pages/supplier/SupplierProfile";
import SupplierReports from "@/pages/supplier/SupplierReports";
import SupplierFinance from "@/pages/supplier/SupplierFinance";
import SupplierSupport from "@/pages/supplier/SupplierSupport";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/">
        <Redirect to="/admin" />
      </Route>

      {/* Admin routes */}
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/admin/events" component={EventsList} />
      <Route path="/admin/events/:id" component={EventDetail} />
      <Route path="/admin/venues" component={VenuesList} />
      <Route path="/admin/venues/candidates" component={VenueCandidates} />
      <Route path="/admin/venues/duplicates" component={VenueDuplicates} />
      <Route path="/admin/venues/:id" component={VenueDetail} />
      <Route path="/admin/cities" component={CitiesList} />
      <Route path="/admin/cities/:id" component={CityDetail} />
      <Route path="/admin/categories" component={CategoriesList} />
      <Route path="/admin/tags" component={TagsList} />
      <Route path="/admin/suppliers" component={SuppliersList} />
      <Route path="/admin/suppliers/:id" component={SupplierDetail} />
      <Route path="/admin/integrations" component={Integrations} />
      <Route path="/admin/orders" component={OrdersList} />
      <Route path="/admin/orders/:id" component={OrderDetail} />
      <Route path="/admin/refunds" component={RefundsList} />
      <Route path="/admin/refunds/:id" component={RefundDetail} />
      <Route path="/admin/users" component={UsersList} />
      <Route path="/admin/users/:id" component={UserDetail} />
      <Route path="/admin/reviews" component={ReviewsList} />
      <Route path="/admin/support" component={SupportList} />
      <Route path="/admin/support/:id" component={SupportDetail} />
      <Route path="/admin/articles" component={ArticlesList} />
      <Route path="/admin/articles/:id" component={ArticleDetail} />
      <Route path="/admin/collections" component={CollectionsList} />
      <Route path="/admin/collections/:id" component={CollectionDetail} />
      <Route path="/admin/seo-audit" component={SeoAudit} />
      <Route path="/admin/landings" component={LandingsList} />
      <Route path="/admin/landings/:id" component={LandingDetail} />
      <Route path="/admin/promo-blocks" component={PromoBlocksList} />
      <Route path="/admin/promo-blocks/:id" component={PromoBlockDetail} />
      <Route path="/admin/promo-placements" component={PromoPlacementsList} />
      <Route path="/admin/promo-placements/:id" component={PromoPlacementDetail} />
      <Route path="/admin/logs" component={Logs} />
      <Route path="/admin/settings" component={Settings} />
      <Route path="/admin/settings/locale" component={SettingsLocale} />

      {/* Finance */}
      <Route path="/admin/finance" component={FinanceDashboard} />
      <Route path="/admin/finance/transactions" component={Transactions} />
      <Route path="/admin/finance/payouts" component={PayoutsList} />
      <Route path="/admin/finance/payouts/:id" component={PayoutDetail} />
      <Route path="/admin/finance/reconciliation" component={Reconciliation} />

      {/* Reports */}
      <Route path="/admin/reports" component={ReportsHub} />
      <Route path="/admin/reports/sales" component={SalesReport} />
      <Route path="/admin/reports/channels" component={ChannelReport} />

      {/* Chat */}
      <Route path="/admin/chat" component={ChatInbox} />
      <Route path="/admin/chat/:id" component={ChatConversation} />

      {/* Staff RBAC */}
      <Route path="/admin/staff" component={StaffList} />
      <Route path="/admin/staff/:id" component={StaffDetail} />

      {/* Supplier cabinet routes */}
      <Route path="/supplier" component={SupplierDashboard} />
      <Route path="/supplier/events" component={SupplierEventsList} />
      <Route path="/supplier/events/:id" component={SupplierEventDetail} />
      <Route path="/supplier/orders" component={SupplierOrders} />
      <Route path="/supplier/refunds" component={SupplierRefunds} />
      <Route path="/supplier/finance" component={SupplierFinance} />
      <Route path="/supplier/profile" component={SupplierProfile} />
      <Route path="/supplier/reports" component={SupplierReports} />
      <Route path="/supplier/support" component={SupplierSupport} />

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
