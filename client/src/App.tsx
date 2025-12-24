// SPDX-License-Identifier: BUSL-1.1
/**
 * Copyright (c) 2024 Temple Earth
 *
 * Entire stack is licensed under BUSL-1.1. Production use requires a license
 * agreement; see /LICENSE and docs/LICENSING.md.
 */
import { useEffect } from "react";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/Home";
import MapPage from "@/pages/Map";
import BridgePage from "@/pages/Bridge";
import Buy from "@/pages/Buy";
import StablecoinPage from "@/pages/Stablecoin";
import TokenizationPage from "@/pages/Tokenization";
import ProjectFormPage from "@/pages/ProjectForm";
import NotFound from "@/pages/not-found";

// Router component scoped to the Vite base path (GitHub Pages needs the repo name prefix)
function AppRouter() {
  const basePath =
    (import.meta.env.BASE_URL ?? "/").replace(/\/$/, "") || "/";

  return (
    <WouterRouter base={basePath}>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/map" component={MapPage} />
        <Route path="/bridge" component={BridgePage} />
        <Route path="/buy" component={Buy} />
        <Route path="/stablecoin" component={StablecoinPage} />
        <Route path="/tokenization" component={TokenizationPage} />
        <Route path="/projects/submit" component={ProjectFormPage} />
        <Route component={NotFound} />
      </Switch>
    </WouterRouter>
  );
}

function App() {
  useEffect(() => {
    document.title = "We Won";
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <AppRouter />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
