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
import Settings from "@/pages/admin/Settings";

import SupplierDashboard from "@/pages/supplier/SupplierDashboard";
import SupplierEventsList from "@/pages/supplier/SupplierEventsList";
import SupplierEventDetail from "@/pages/supplier/SupplierEventDetail";
import SupplierOrders from "@/pages/supplier/SupplierOrders";
import SupplierProfile from "@/pages/supplier/SupplierProfile";
import SupplierReports from "@/pages/supplier/SupplierReports";
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
      <Route path="/admin/venues/:id" component={VenueDetail} />
      <Route path="/admin/cities" component={CitiesList} />
      <Route path="/admin/cities/:id" component={CityDetail} />
      <Route path="/admin/suppliers" component={SuppliersList} />
      <Route path="/admin/suppliers/:id" component={SupplierDetail} />
      <Route path="/admin/orders" component={OrdersList} />
      <Route path="/admin/orders/:id" component={OrderDetail} />
      <Route path="/admin/landings" component={LandingsList} />
      <Route path="/admin/landings/:id" component={LandingDetail} />
      <Route path="/admin/promo-blocks" component={PromoBlocksList} />
      <Route path="/admin/promo-blocks/:id" component={PromoBlockDetail} />
      <Route path="/admin/settings" component={Settings} />

      {/* Supplier cabinet routes */}
      <Route path="/supplier" component={SupplierDashboard} />
      <Route path="/supplier/events" component={SupplierEventsList} />
      <Route path="/supplier/events/:id" component={SupplierEventDetail} />
      <Route path="/supplier/orders" component={SupplierOrders} />
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
