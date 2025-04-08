import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { Login } from "./components/auth/Login";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Create a client
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <style>{`
          @keyframes floatStar {
            0% { transform: translateY(0) rotate(0deg); }
            50% { transform: translateY(-10px) rotate(5deg); }
            100% { transform: translateY(0) rotate(0deg); }
          }
          
          @keyframes wave {
            0%, 100% { transform: scaleY(1); }
            50% { transform: scaleY(0.5); }
          }
          
          .animate-float {
            animation: floatStar 6s ease-in-out infinite;
          }
          
          .animate-pulse-soft {
            animation: pulse 3s ease-in-out infinite;
          }
          
          .text-shadow {
            text-shadow: 0 1px 2px rgba(0,0,0,0.1);
          }
        `}</style>
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Index />
                  </ProtectedRoute>
                }
              />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
