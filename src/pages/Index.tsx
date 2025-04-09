
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useState, useEffect, useRef, useMemo } from "react";
import {
  fetchDiscoverMovies,
  fetchGenres,
  fetchMoviesByGenre,
  fetchMoviesBySearch,
  Movie
} from "@/services/movieApi";
import { useMovieStore } from "@/store/movieStore";
import MovieBanner from "@/components/MovieBanner";
import MovieGrid from "@/components/MovieGrid";
import MovieCard from "@/components/MovieCard";
import FilterPanel from "@/components/FilterPanel";
import LoadMoreIndicator from "@/components/LoadMoreIndicator";
import { AnimatePresence, motion } from "framer-motion";
import { FireExtinguisher } from "lucide-react";
import { genderMovieName } from "@/lib/utils";

const Index = () => {
  const { filters, toggleGenre, clearFilters, setYearRange, resetPage } = useMovieStore();
  const [selectedBanner, setSelectedBanner] = useState<Movie | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const [shouldRenderBanner, setShouldRenderBanner] = useState(false);

  // Reset pagination when filters change
  useEffect(() => {
    resetPage();
  }, [filters.searchQuery, filters.selectedGenres, filters.yearRange, resetPage]);

  // Fetch genres for filters
  const { data: genres } = useQuery({
    queryKey: ["genres"],
    queryFn: fetchGenres,
  });

  // Fetch movies based on filters
  const { 
    data, 
    fetchNextPage, 
    hasNextPage, 
    isFetchingNextPage, 
    isLoading 
  } = useInfiniteQuery({
    queryKey: [
      filters.searchQuery ? "search" : filters.selectedGenres.length > 0 ? "genre" : "discover",
      filters.searchQuery || undefined,
      filters.selectedGenres[0] || undefined,
      filters.yearRange
    ],
    queryFn: ({ pageParam = 1 }) => {
      if (filters.searchQuery) {
        return fetchMoviesBySearch(filters.searchQuery, pageParam, filters.yearRange);
      } else if (filters.selectedGenres.length > 0) {
        return fetchMoviesByGenre(filters.selectedGenres[0], pageParam, filters.yearRange);
      } else {
        return fetchDiscoverMovies(pageParam, filters.yearRange);
      }
    },
    getNextPageParam: (lastPage) => {
      return lastPage.currentPage < lastPage.totalPages ? lastPage.currentPage + 1 : undefined;
    },
    initialPageParam: 1,
  });

  // Setup intersection observer for infinite scrolling
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { rootMargin: "200px" }
    );

    const currentRef = loadMoreRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [loadMoreRef, fetchNextPage, hasNextPage, isFetchingNextPage]);

  const allMovies = useMemo(() => data?.pages.flatMap(page => page.movies) || [], [data]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (allMovies && allMovies.length > 0 && !filters.searchQuery && filters.selectedGenres.length === 0) {
        const randomIndex = Math.floor(Math.random() * Math.min(20, allMovies.length));
        const newBanner = allMovies[randomIndex];

        setShouldRenderBanner(false);

        setTimeout(() => {
          setSelectedBanner(newBanner);
          setShouldRenderBanner(true);
        }, 2500);
      } else {
        setSelectedBanner(null);
        setShouldRenderBanner(false);
      }
    }, 30000);
    return () => clearInterval(timer);
  }, [allMovies, filters.searchQuery, filters.selectedGenres]);

  const getFilterInfo = () => {
    if (filters.searchQuery) {
      return `Resultados para "${filters.searchQuery}"`;
    } else if (filters.selectedGenres.length > 0 && genres) {
      const genreNames = filters.selectedGenres
        .map((id) => genres.find((g) => g.id === id)?.name)
        .filter(Boolean);
      return `Peliculas de: ${genreNames.map((name) => genderMovieName(name)).join(", ")}`;
    }
    
    if (filters.yearRange[0] !== 1900 || filters.yearRange[1] !== new Date().getFullYear()) {
      return `Peliculas desde ${filters.yearRange[0]} hasta ${filters.yearRange[1]}`;
    }
    
    return "Peliculas populares";
  };

  // Check if there are active filters
  const hasActiveFilters = (
    filters.searchQuery !== '' || 
    filters.selectedGenres.length > 0 || 
    filters.yearRange[0] !== 1900 || 
    filters.yearRange[1] !== new Date().getFullYear()
  );

  return (
    <div className="min-h-screen bg-netflix-black">
      {/* Banner */}
      <div className="relative">
        {!filters.searchQuery && filters.selectedGenres.length === 0 && (
          <AnimatePresence>
            {shouldRenderBanner && selectedBanner && (
              <motion.div
                key={selectedBanner.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 2.5, ease: "easeInOut" }}
              >
                <MovieBanner movie={selectedBanner} />
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    
      {/* Movie listing section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl md:text-3xl font-bold font-bebas-neue tracking-wider">🎞 {getFilterInfo()}</h2>
          <FilterPanel 
            filters={filters}
            genres={genres}
            toggleGenre={toggleGenre}
            clearFilters={clearFilters}
            setYearRange={setYearRange}
            hasActiveFilters={hasActiveFilters}
          />
        </div>

        {/* Movies grid */}
        {!isLoading && allMovies.length > 0 && !filters.searchQuery && filters.selectedGenres.length === 0 ? (
          <>
            <div className="netflix-row animate-slide-up">
              <h3 className="netflix-row-title">🔥 Estrenos</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {allMovies.slice(0, 10).map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </div>
            </div>
            
            <div className="netflix-row animate-slide-up" style={{animationDelay: '0.2s'}}>
              <h3 className="netflix-row-title">🌟 Populares en MovieFlix</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {allMovies.slice(10, 20).map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </div>
            </div>
            
            <div className="netflix-row animate-slide-up" style={{animationDelay: '0.4s'}}>
              <h3 className="netflix-row-title">👏 Aclamados por la crítica</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {allMovies.slice(20).map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </div>
            </div>
          </>
        ) : (
          <MovieGrid 
            movies={allMovies} 
            isLoading={isLoading} 
            clearFilters={clearFilters} 
          />
        )}

        {/* Loading indicator for infinite scroll */}
        <LoadMoreIndicator ref={loadMoreRef} isFetchingNextPage={!!isFetchingNextPage} />
      </div>
    </div>
  );
};

export default Index;
