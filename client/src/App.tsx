import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/home";
import Transport from "@/pages/transport";
import BusinessPage from "@/pages/business";
import BusinessPanel from "@/pages/business-panel";
import UserPanel from "@/pages/user-panel";
import Login from "@/pages/login";
import Register from "@/pages/register";
import Community from "@/pages/community";
import Emergency from "@/pages/emergency";
import Outages from "@/pages/outages";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/transport" component={Transport} />
      <Route path="/business" component={BusinessPage} />
      <Route path="/business-panel"><BusinessPanel /></Route>
      <Route path="/user-panel"><UserPanel /></Route>
      <Route path="/login"><Login /></Route>
      <Route path="/register"><Register /></Route>
      <Route path="/community" component={Community} />
      <Route path="/emergency" component={Emergency} />
      <Route path="/outages" component={Outages} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
