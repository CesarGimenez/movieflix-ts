
import { Movie } from "@/services/movieApi";
import MovieCard from "@/components/MovieCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface MovieGridProps {
  movies: Movie[];
  isLoading: boolean;
  clearFilters: () => void;
}

const MovieGrid = ({ movies, isLoading, clearFilters }: MovieGridProps) => {
  // Loading skeletons
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {Array.from({ length: 10 }).map((_, idx) => (
          <div key={idx} className="flex flex-col">
            <Skeleton className="w-full aspect-[2/3] rounded-lg" />
            <Skeleton className="h-5 w-2/3 mt-2" />
            <Skeleton className="h-4 w-1/3 mt-1" />
          </div>
        ))}
      </div>
    );
  }

  // Movies grid
  if (movies && movies.length > 0) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {movies.map((movie, index) => (
          <MovieCard key={`${movie.id}-${index}`} movie={movie} />
        ))}
      </div>
    );
  }

  // No movies found
  return (
    <div className="text-center py-10">
      <p className="text-xl">No movies found</p>
      <Button
        className="mt-4 bg-movie-accent hover:bg-movie-accent/80 text-white"
        onClick={clearFilters}
      >
        Limpiar filtros
      </Button>
    </div>
  );
};

export default MovieGrid;
