
import { Movie, getImageUrl } from "@/services/movieApi";
import { Link } from "react-router-dom";
import { Star, Play, Plus, Info, Check } from "lucide-react";
import { useMovieStore } from "@/store/movieStore";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import SubscriptionPlans from "@/components/SubscriptionPlans";

interface MovieCardProps {
  movie: Movie & { media_type?: string };
}

const MovieCard = ({ movie }: MovieCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isSubscribeDialogOpen, setIsSubscribeDialogOpen] = useState(false);
  const { addToWatchlist, watchlist } = useMovieStore();
  
  const isInWatchlist = watchlist.some(item => item.id === movie.id);
  const mediaType = movie.media_type || "movie";
  const detailLink = mediaType === "tv" ? `/series/${movie.id}` : `/movie/${movie.id}`;

  return (
    <div
      className="relative netflix-card-hover rounded-sm overflow-hidden h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link
        to={detailLink}
        className="block h-full"
      >
        <div className={`relative aspect-[2/3] w-full overflow-hidden ${isHovered && 'hover:shadow-md hover:shadow-movie-accent transition-shadow duration-300'}`}>
          <img
            src={getImageUrl(movie.poster_path, "w500")}
            alt={movie.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = "/placeholder.svg";
            }}
          />
          
          {isHovered && (
            <div className="absolute inset-0 bg-black/20 flex flex-col justify-end p-3 animate-fade-in">
              <h3 className="font-medium text-sm mb-1">{movie.title}</h3>
              <div className="flex items-center text-xs text-gray-400 mb-2">
                <div className="flex items-center">
                  <Star className="h-3 w-3 text-movie-star fill-movie-star mr-1" />
                  <span>{movie.vote_average.toFixed(1)}</span>
                </div>
                <span className="mx-2">•</span>
                <span>{new Date(movie.release_date).getFullYear()}</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button 
                  size="sm"
                  className="bg-white hover:bg-white/90 text-black rounded-full h-8 w-8 p-0"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsSubscribeDialogOpen(true);
                  }}
                >
                  <Play className="h-4 w-4" />
                </Button>
                
                <Button
                  size="sm"
                  variant="outline"
                  className="rounded-full h-8 w-8 p-0 border-white/40 bg-black/30"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                    !isInWatchlist && addToWatchlist(movie);
                  }}
                >
                  {isInWatchlist ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          )}
        </div>
        
        {!isHovered && (
          <div className="p-2">
            <h3 className="font-medium text-sm line-clamp-1">{movie.title}</h3>
          </div>
        )}
      </Link>
      
      <Dialog open={isSubscribeDialogOpen} onOpenChange={setIsSubscribeDialogOpen}>
        <DialogContent className="sm:max-w-[800px] bg-netflix-black border-gray-800">
          <DialogHeader>
            <DialogTitle className="text-2xl font-netflix-sans text-white">Suscribete</DialogTitle>
          </DialogHeader>
          <SubscriptionPlans onSubscribe={() => setIsSubscribeDialogOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MovieCard;
