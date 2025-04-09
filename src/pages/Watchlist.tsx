
import { useMovieStore } from "@/store/movieStore";
import { Movie } from "@/services/movieApi";
import MovieCard from "@/components/MovieCard";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { BookmarkX } from "lucide-react";

const Watchlist = () => {
  const { watchlist } = useMovieStore();

  return (
    <div className="min-h-screen">
      {/* Movie listing section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Tu lista de favoritos</h2>
        </div>

        {/* Watchlist movies grid */}
        {watchlist.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {watchlist.map((movie) => (
              <MovieCard key={movie.id} movie={movie as Movie} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <BookmarkX className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-xl font-medium mb-2">Tu lista de favoritos está vacía</h3>
            <p className="text-gray-500 mb-6">
              Las películas que marques como favoritas aparecerán aquí.
            </p>
            <Link to="/">
              <Button className="bg-movie-accent hover:bg-movie-accent/80 text-white">
                Explora películas
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Watchlist;
