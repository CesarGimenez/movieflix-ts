
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import MovieDetails from "./pages/MovieDetails";
import SeriesDetails from "./pages/SeriesDetails";
import Layout from "./components/Layout";
import Watchlist from "./pages/Watchlist";
import Trending from "./pages/Trending";
import Series from "./pages/Series";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const App = () => {
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Index />} />
              <Route path="/movie/:id" element={<MovieDetails />} />
              <Route path="/series/:id" element={<SeriesDetails />} />
              <Route path="/watchlist" element={<Watchlist />} />
              <Route path="/trending" element={<Trending />} />
              <Route path="/series" element={<Series />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
};

export default App;
