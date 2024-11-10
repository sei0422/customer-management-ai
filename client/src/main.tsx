import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { Switch, Route, useLocation } from "wouter";
import "./index.css";
import { SWRConfig } from "swr";
import { fetcher } from "./lib/fetcher";
import { Toaster } from "@/components/ui/toaster";

// Pages
import Dashboard from "./pages/dashboard";
import Accounts from "./pages/accounts";
import Contacts from "./pages/contacts";
import Opportunities from "./pages/opportunities";
import Login from "./pages/login";

// Layout
import SidebarNav from "./components/layout/sidebar-nav";
import Header from "./components/layout/header";

const App = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <SidebarNav />
        <main className="flex-1 p-8">
          <Switch>
            <Route path="/" component={Dashboard} />
            <Route path="/accounts" component={Accounts} />
            <Route path="/contacts" component={Contacts} />
            <Route path="/opportunities" component={Opportunities} />
            <Route>404 ページが見つかりません</Route>
          </Switch>
        </main>
      </div>
      <Toaster />
    </div>
  );
};

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SWRConfig value={{ fetcher }}>
      <Switch>
        <Route path="/login" component={Login} />
        <Route>
          {() => {
            const [location, setLocation] = useLocation();
            useEffect(() => {
              if (location === '/login') return;
              fetch('/api/metrics').catch(() => setLocation('/login'));
            }, []);
            return <App />;
          }}
        </Route>
      </Switch>
    </SWRConfig>
  </StrictMode>
);
