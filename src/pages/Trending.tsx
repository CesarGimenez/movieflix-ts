
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { fetchTrendingMovies, Movie } from "@/services/movieApi";
import MovieCard from "@/components/MovieCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useMovieStore } from "@/store/movieStore";

const Trending = () => {
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const { resetPage } = useMovieStore();
  
  useEffect(() => {
    resetPage();
  }, [resetPage]);

  const { 
    data, 
    fetchNextPage, 
    hasNextPage, 
    isFetchingNextPage, 
    isLoading 
  } = useInfiniteQuery({
    queryKey: ["trending"],
    queryFn: ({ pageParam = 1 }) => fetchTrendingMovies(pageParam),
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

  // Flatten movies from all pages
  const movies = data?.pages.flatMap(page => page.movies) || [];

  return (
    <div className="min-h-screen">
      {/* Movie listing section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">🔥 Populares esta semana</h2>
        </div>

        {/* Loading skeletons */}
        {isLoading && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {Array.from({ length: 10 }).map((_, idx) => (
              <div key={idx} className="flex flex-col">
                <Skeleton className="w-full aspect-[2/3] rounded-lg" />
                <Skeleton className="h-5 w-2/3 mt-2" />
                <Skeleton className="h-4 w-1/3 mt-1" />
              </div>
            ))}
          </div>
        )}

        {/* Movies grid */}
        {!isLoading && (
          <>
            {movies && movies.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {movies.map((movie: Movie) => (
                  <MovieCard key={`${movie.id}-${Math.random()}`} movie={movie} />
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <p className="text-xl">No movies found</p>
              </div>
            )}
          </>
        )}

        {/* Loading more indicator */}
        <div ref={loadMoreRef} className="py-8 flex justify-center">
          {isFetchingNextPage && (
            <div className="flex flex-col items-center">
              <div className="loader"></div>
              <p className="mt-2">Loading more movies...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Trending;
