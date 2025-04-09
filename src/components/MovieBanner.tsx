
import { useState } from "react";
import { Link } from "react-router-dom";
import { Star, Play, Plus, Info, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Movie, getImageUrl } from "@/services/movieApi";
import { useMovieStore } from "@/store/movieStore";
import { Dialog, DialogContent, DialogTitle, DialogHeader } from "@/components/ui/dialog";
import SubscriptionPlans from "@/components/SubscriptionPlans";
import { useIsMobile } from '../hooks/use-mobile';

interface MovieBannerProps {
  movie: Movie | null;
}

const MovieBanner = ({ movie }: MovieBannerProps) => {
  const [isSubscribeDialogOpen, setIsSubscribeDialogOpen] = useState(false);
  const { addToWatchlist, watchlist } = useMovieStore();
  const isMobile = useIsMobile()
  
  if (!movie || isMobile) return null;
  
  const isInWatchlist = watchlist.some(item => item.id === movie.id);

  return (
    <div className="relative h-[80vh] w-full overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${getImageUrl(movie.backdrop_path)})`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-netflix-black/90 via-netflix-black/60 to-transparent"></div>
        <div className="absolute inset-0 banner-gradient"></div>
        
        <div className="absolute bottom-0 left-0 p-6 md:p-16 w-full md:w-2/3 netflix-slide-up" style={{animationDelay: '0.3s'}}>
          <h1 className="text-4xl md:text-6xl font-bold mb-4 font-bebas-neue tracking-wider">{movie.title}</h1>
          
          <div className="flex items-center mb-4">
            <div className="flex items-center mr-4">
              <Star className="h-5 w-5 text-movie-star fill-movie-star mr-1" />
              <span className="font-medium">{movie.vote_average.toFixed(1)}</span>
            </div>
            <span className="text-gray-300">{new Date(movie.release_date).getFullYear()}</span>
          </div>
          
          <p className="text-sm md:text-base line-clamp-3 text-gray-200 mb-6 max-w-2xl">{movie.overview}</p>
          
          <div className="flex items-center space-x-3">
            <Button 
              className="bg-netflix-red hover:bg-netflix-red/90 text-white flex items-center px-6 py-5"
              onClick={() => setIsSubscribeDialogOpen(true)}
            >
              <Play className="h-5 w-5 mr-2" />
              Ver ahora
            </Button>
            
            <Button
              variant="outline"
              className="bg-netflix-dark-gray/60 hover:bg-netflix-dark-gray text-white border-gray-600 flex items-center px-6 py-5"
              onClick={() => !isInWatchlist && addToWatchlist(movie)}
            >
              {isInWatchlist ? (
                <>
                  <Check className="h-5 w-5 mr-2" />
                  Mi lista
                </>
              ) : (
                <>
                  <Plus className="h-5 w-5 mr-2" />
                  Agregar a mi lista
                </>
              )}
            </Button>
            
            <Link to={`/movie/${movie.id}`}>
              <Button variant="outline" className="bg-netflix-dark-gray/60 hover:bg-netflix-dark-gray text-white border-gray-600 flex items-center py-5">
                <Info className="h-5 w-5 mr-2" />
                Detalles
              </Button>
            </Link>
          </div>
        </div>
      </div>
      
      <Dialog open={isSubscribeDialogOpen} onOpenChange={setIsSubscribeDialogOpen}>
        <DialogContent className="sm:max-w-[800px] bg-netflix-black border-gray-800">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bebas-neue text-white">Suscribete</DialogTitle>
          </DialogHeader>
          <SubscriptionPlans onSubscribe={() => setIsSubscribeDialogOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MovieBanner;
