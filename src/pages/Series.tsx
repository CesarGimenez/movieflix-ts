
import { useInfiniteQuery } from "@tanstack/react-query";
import { useState, useEffect, useRef } from "react";
import { Movie, fetchTrending } from "@/services/movieApi";
import MovieCard from "@/components/MovieCard";
import LoadMoreIndicator from "@/components/LoadMoreIndicator";

const Series = () => {
  const [selectedBanner, setSelectedBanner] = useState<Movie | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Fetch trending TV shows
  const { 
    data, 
    fetchNextPage, 
    hasNextPage, 
    isFetchingNextPage, 
    isLoading 
  } = useInfiniteQuery({
    queryKey: ["trending", "tv"],
    queryFn: ({ pageParam = 1 }) => fetchTrending("tv", pageParam),
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

  // Get all series from all pages
  const allSeries = data?.pages.flatMap(page => page.movies) || [];

  return (
    <div className="min-h-screen bg-netflix-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-6 font-netflix-sans tracking-wider">Series de TV</h2>
          <p className="text-gray-400 mb-8">Descubre las ultimas y mejores series de television de todo el mundo</p>
          
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="aspect-[2/3] bg-gray-800 rounded-sm animate-pulse"></div>
              ))}
            </div>
          ) : (
            <>
              <div className="netflix-row animate-slide-up">
                <h3 className="netflix-row-title">🔥 Series Populares</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {allSeries.slice(0, 10).map((series) => (
                    <MovieCard key={series.id} movie={{...series, media_type: "tv"}} />
                  ))}
                </div>
              </div>
              
              <div className="netflix-row animate-slide-up" style={{animationDelay: '0.2s'}}>
                <h3 className="netflix-row-title">🌟 Tendencias</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {allSeries.slice(10, 20).map((series) => (
                    <MovieCard key={series.id} movie={{...series, media_type: "tv"}} />
                  ))}
                </div>
              </div>
              
              <div className="netflix-row animate-slide-up" style={{animationDelay: '0.4s'}}>
                <h3 className="netflix-row-title">📺 Mas series</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {allSeries.slice(20).map((series) => (
                    <MovieCard key={series.id} movie={{...series, media_type: "tv"}} />
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Loading indicator for infinite scroll */}
        <LoadMoreIndicator ref={loadMoreRef} isFetchingNextPage={!!isFetchingNextPage} />
      </div>
    </div>
  );
};

export default Series;
