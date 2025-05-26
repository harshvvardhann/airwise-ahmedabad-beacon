
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./components/Layout/MainLayout";
import Index from "./pages/Index";
import About from "./pages/About";
import Alerts from "./pages/Alerts";
import Predictions from "./pages/Predictions";
import Emissions from "./pages/Emissions";
import History from "./pages/History";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={
            <MainLayout>
              <Index />
            </MainLayout>
          } />
          <Route path="/history" element={
            <MainLayout>
              <History />
            </MainLayout>
          } />
          <Route path="/about" element={
            <MainLayout showFooter={false}>
              <About />
            </MainLayout>
          } />
          <Route path="/alerts" element={
            <MainLayout>
              <Alerts />
            </MainLayout>
          } />
          <Route path="/predictions" element={
            <MainLayout>
              <Predictions />
            </MainLayout>
          } />
          <Route path="/emissions" element={
            <MainLayout>
              <Emissions />
            </MainLayout>
          } />
          <Route path="*" element={
            <MainLayout showFooter={false}>
              <NotFound />
            </MainLayout>
          } />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
