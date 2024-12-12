import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./components/ThemeProvider";
import { ThemeToggle } from "./components/ThemeToggle";
import { Dashboard } from "./components/Dashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="system" storageKey="tasktimer-theme">
      <TooltipProvider>
        <div className="min-h-screen bg-background">
          <div className="fixed right-4 top-4">
            <ThemeToggle />
          </div>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Dashboard />} />
            </Routes>
          </BrowserRouter>
        </div>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;