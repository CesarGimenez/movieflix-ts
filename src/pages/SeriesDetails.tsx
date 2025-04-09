
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import {
  fetchSeriesDetails,
  fetchSeriesCredits,
  getImageUrl,
} from "@/services/movieApi";
import { ArrowLeft, Star, Clock, Calendar, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useMovieStore } from "@/store/movieStore";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";

const SeriesDetails = () => {
  const { id } = useParams<{ id: string }>();
  const addToRecentlyViewed = useMovieStore((state) => state.addToRecentlyViewed);
  const isMobile = useIsMobile();

  // Record this series in recently viewed
  useEffect(() => {
    if (id) {
      addToRecentlyViewed(parseInt(id));
    }
  }, [id, addToRecentlyViewed]);

  // Fetch series details
  const {
    data: series,
    isLoading: isLoadingSeries,
    error: seriesError,
  } = useQuery({
    queryKey: ["seriesDetails", id as string],
    queryFn: fetchSeriesDetails,
    enabled: !!id,
  });

  // Fetch cast
  const {
    data: cast,
    isLoading: isLoadingCast,
    error: castError,
  } = useQuery({
    queryKey: ["seriesCredits", id as string],
    queryFn: fetchSeriesCredits,
    enabled: !!id,
  });

  // Handle loading states
  const isLoading = isLoadingSeries || isLoadingCast;

  // Handle errors
  if (seriesError || castError) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Error loading series details</h1>
        <p className="mb-6">There was a problem retrieving the series information.</p>
        <Link to="/series">
          <Button variant="outline">Back to Series</Button>
        </Link>
      </div>
    );
  }

  // Handle bookmark click
  const handleBookmarkClick = () => {
    toast({
      title: "Added to Watchlist",
      description: `${series?.title} has been added to your watchlist`,
    });
  };

  return (
    <div className="min-h-screen">
      {/* Back button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <Link to="/series">
          <Button variant="ghost" className="flex items-center">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Series
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <SeriesDetailsSkeleton />
      ) : (
        series && (
          <>
            {/* Backdrop and Series Info */}
            <div className="relative">
              {/* Series backdrop */}
              <div className="relative h-[40vh] md:h-[60vh] w-full overflow-hidden">
                <div
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                  style={{
                    backgroundImage: `url(${getImageUrl(series.backdrop_path)})`,
                  }}
                >
                  <div className="absolute inset-0 banner-gradient"></div>
                </div>
              </div>

              {/* Series details card */}
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="relative md:absolute md:bottom-0 md:left-1/2 md:transform md:-translate-x-1/2 w-full">
                  <div className={`flex flex-col md:flex-row md:items-end mt-[-100px] md:mt-0 md:mb-8 gap-6 ${isMobile ? "px-4" : "ml-20 pl-20"}`}>
                  {/* Poster */}
                    <div className="w-[200px] mx-auto md:mx-0 aspect-[2/3] rounded-lg overflow-hidden shadow-xl flex-shrink-0">
                      <img
                        src={getImageUrl(series.poster_path, "w500")}
                        alt={series.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = "/placeholder.svg";
                        }}
                      />
                    </div>

                    {/* Series info */}
                    <div className="flex-1 text-center md:text-left pb-4">
                      <h1 className="text-2xl md:text-4xl font-bold mb-2">{series.title}</h1>
                      {series.tagline && (
                        <p className="text-sm md:text-base italic text-gray-300 mb-4">
                          {series.tagline}
                        </p>
                      )}

                      <div className="flex flex-wrap gap-2 justify-center md:justify-start mt-2 mb-4">
                        {series.genres.map((genre) => (
                          <Badge
                            key={genre.id}
                            variant="default"
                            className="border-movie-accent p-2 px-4"
                          >
                            {genre.name}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex flex-wrap justify-center md:justify-start items-center gap-4 mb-4 text-sm">
                        <div className="flex items-center">
                          <Star className="h-5 w-5 text-movie-star fill-movie-star mr-1" />
                          <span className="font-medium">
                            {series.vote_average.toFixed(1)} ({series.vote_count.toLocaleString()})
                          </span>
                        </div>
                        {series.runtime > 0 && (
                          <div className="flex items-center">
                            <Clock className="h-5 w-5 mr-1" />
                            <span>{series.runtime} min/episode</span>
                          </div>
                        )}
                        <div className="flex items-center">
                          <Calendar className="h-5 w-5 mr-1" />
                          <span>{new Date(series.release_date).getFullYear()}</span>
                        </div>
                      </div>

                      <Button
                        className="bg-movie-accent hover:bg-movie-accent/80 text-white"
                        onClick={handleBookmarkClick}
                      >
                        <Bookmark className="h-4 w-4 mr-2" />
                        Agregar a mi lista
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Series content sections */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {/* Overview section */}
              <section className="mb-10">
                <h2 className="text-xl font-bold mb-4">Sinopsis</h2>
                <p className="text-gray-300">{series.overview}</p>
              </section>

              {/* Cast section */}
              <section className="mb-10">
                <h2 className="text-xl font-bold mb-4">Reparto</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {cast?.slice(0, 12).map((actor) => (
                    <div
                      key={actor.id}
                      className="bg-movie-card rounded-lg overflow-hidden transition-transform hover:scale-105"
                    >
                      <div className="aspect-[2/3] relative">
                        <img
                          src={getImageUrl(actor.profile_path, "w200")}
                          alt={actor.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = "/placeholder.svg";
                          }}
                        />
                      </div>
                      <div className="p-2">
                        <p className="font-medium text-sm line-clamp-1">{actor.name}</p>
                        <p className="text-xs text-gray-400 line-clamp-1">{actor.character}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Production info section */}
              {series.production_companies && series.production_companies.length > 0 && (
                <section>
                  <h2 className="text-xl font-bold mb-4">Produccion</h2>
                  <div className="flex flex-wrap gap-6">
                    {series.production_companies.map((company) => (
                      <div key={company.id} className="flex items-center">
                        {company.logo_path ? (
                          <img
                            src={getImageUrl(company.logo_path, "w200")}
                            alt={company.name}
                            className="h-8 mr-2 bg-white p-1 rounded"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded bg-gray-700 flex items-center justify-center mr-2">
                            <span className="text-xs font-bold">
                              {company.name.charAt(0)}
                            </span>
                          </div>
                        )}
                        <span className="text-sm">{company.name}</span>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>
          </>
        )
      )}
    </div>
  );
};

// Skeleton loader for series details
const SeriesDetailsSkeleton = () => {
  return (
    <div>
      <div className="relative h-[40vh] md:h-[60vh] bg-movie-card">
        <Skeleton className="h-full w-full" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end mt-[-100px] md:mt-[-150px] gap-6">
          <Skeleton className="w-[200px] mx-auto md:mx-0 aspect-[2/3] rounded-lg" />
          <div className="flex-1 space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <div className="flex gap-2">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-20" />
            </div>
            <div className="flex gap-4">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-6 w-24" />
            </div>
            <Skeleton className="h-10 w-40" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Skeleton className="h-6 w-32 mb-4" />
        <Skeleton className="h-20 w-full mb-10" />

        <Skeleton className="h-6 w-32 mb-4" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div key={idx}>
              <Skeleton className="aspect-[2/3] rounded-lg" />
              <Skeleton className="h-4 w-3/4 mt-2" />
              <Skeleton className="h-3 w-1/2 mt-1" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SeriesDetails;
