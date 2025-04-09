import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  X,
  Menu,
  Film,
  Home,
  Bookmark,
  TrendingUp,
  SquareUser,
  Tv,
} from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { useMovieStore } from "@/store/movieStore";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { fetchGenres } from "@/services/movieApi";
import { useIsMobile } from "@/hooks/use-mobile";
import { genderMovieName } from '../lib/utils';

const Navbar = () => {
  const searchRef = useRef<HTMLInputElement>(null);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { isNavOpen, toggleNav, filters, setSearchQuery } = useMovieStore();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const { data: genres = [] } = useQuery({
    queryKey: ["genres"],
    queryFn: fetchGenres,
  });

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchRef.current?.value) {
      setSearchQuery(searchRef.current.value);
      navigate("/");
      if (isMobile) {
        setIsSearchVisible(false);
      }
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
          isScrolled
            ? "bg-[#141414]"
            : "bg-gradient-to-b from-[#141414]/90 to-transparent"
        }`}
      >
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              {
                isMobile && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="mr-2 text-white hover:bg-transparent"
                    onClick={toggleNav}
                  >
                    {isNavOpen ? <X /> : <Menu />}
                  </Button>
                )
              }
              <Link to="/" className="flex items-center">
                <span className="font-bebas-neue font-bold text-netflix-red text-3xl tracking-wider">
                  MOVIEFLIX
                </span>
              </Link>

              <div className="hidden md:flex ml-6 space-x-6">
                <Link
                  to="/"
                  className="flex gap-2 text-white transition-colors hover:text-movie-accent"
                >
                  <Home /> Inicio
                </Link>
                <Link
                  to="/trending"
                  className="flex gap-2 text-white transition-colors hover:text-movie-accent"
                >
                  <TrendingUp /> Populares
                </Link>
                <Link
                  to="/series"
                  className="flex gap-2 text-white transition-colors hover:text-movie-accent"
                >
                  <Film /> Series
                </Link>
                <Link
                  to="/watchlist"
                  className="flex gap-2 text-white ransition-colors hover:text-movie-accent"
                >
                  <Bookmark /> Mi lista
                </Link>
              </div>
            </div>

            <div className="hidden md:flex items-center space-x-4">
              <form onSubmit={handleSearchSubmit} className="relative">
                <input
                  ref={searchRef}
                  type="text"
                  placeholder="Buscar..."
                  className="py-1 pl-8 pr-4 rounded-sm bg-netflix-black/50 border border-gray-700 focus:outline-none focus:ring-1 focus:ring-netflix-red text-sm w-48 transition-all"
                  defaultValue={filters.searchQuery}
                />
                <Search className="absolute left-2 top-2 h-4 w-4 text-gray-400" />
              </form>
              <Avatar className="cursor-pointer">
                <AvatarFallback className="bg-netflix-red text-white">
                  <SquareUser className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
            </div>

            <div className="flex md:hidden items-center space-x-2">
              {isSearchVisible ? (
                <form
                  onSubmit={handleSearchSubmit}
                  className="absolute inset-x-0 top-0 bg-[#141414] px-4 py-3 flex items-center"
                >
                  <input
                    ref={searchRef}
                    type="text"
                    placeholder="Search..."
                    className="flex-1 py-1 pl-8 pr-4 rounded-sm bg-netflix-black/50 border border-gray-700 focus:outline-none focus:ring-1 focus:ring-netflix-red text-sm"
                    autoFocus
                    defaultValue={filters.searchQuery}
                  />
                  <Search className="absolute left-7 top-5 h-4 w-4 text-gray-400" />
                  <button
                    type="button"
                    className="ml-2 text-white"
                    onClick={() => setIsSearchVisible(false)}
                  >
                    <X className="h-6 w-6" />
                  </button>
                </form>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-transparent"
                    onClick={() => setIsSearchVisible(true)}
                  >
                    <Search className="h-5 w-5" />
                  </Button>
                  <Avatar className="cursor-pointer w-7 h-7">
                    <AvatarFallback className="bg-netflix-red text-white">
                      <SquareUser className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {isMobile && (
        <div
          className={`fixed inset-y-0 left-0 transform ${
            isNavOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0 z-30 transition duration-300 ease-in-out ${
            isNavOpen ? "md:w-64" : "md:w-0 md:opacity-0"
          }`}
        >
          <div className="h-full w-64 bg-netflix-black border-r border-gray-800 shadow-lg pt-20">
            <div className="p-6 space-y-6">
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider">
                  Explorar
                </h3>
                <nav className="space-y-1">
                  <Link
                    to="/"
                    className="flex items-center px-3 py-2 text-base font-medium rounded-md hover:bg-gray-800 hover:text-netflix-red transition"
                    onClick={() => isMobile && toggleNav()}
                  >
                    <Home className="mr-3 h-5 w-5" />
                    Inicio
                  </Link>
                  <Link
                    to="/trending"
                    className="flex items-center px-3 py-2 text-base font-medium rounded-md hover:bg-gray-800 hover:text-netflix-red transition"
                    onClick={() => isMobile && toggleNav()}
                  >
                    <TrendingUp className="mr-3 h-5 w-5" />
                    Populares
                  </Link>
                  <Link
                    to="/series"
                    className="flex items-center px-3 py-2 text-base font-medium rounded-md hover:bg-gray-800 hover:text-netflix-red transition"
                    onClick={() => isMobile && toggleNav()}
                  >
                    <Tv className="mr-3 h-5 w-5" />
                    Series
                  </Link>
                  <Link
                    to="/watchlist"
                    className="flex items-center px-3 py-2 text-base font-medium rounded-md hover:bg-gray-800 hover:text-netflix-red transition"
                    onClick={() => isMobile && toggleNav()}
                  >
                    <Bookmark className="mr-3 h-5 w-5" />
                    Mi lista
                  </Link>
                </nav>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider">
                  Generos
                </h3>
                <div className="flex flex-wrap gap-2">
                  {genres.slice(0, 12).map((genre) => (
                    <button
                      key={genre.id}
                      onClick={() => {
                        useMovieStore.getState().toggleGenre(genre.id);
                        navigate("/");
                        if (isMobile) {
                          toggleNav();
                        }
                      }}
                      className={`px-3 py-1 text-sm rounded-sm ${
                        filters.selectedGenres.includes(genre.id)
                          ? "bg-netflix-red text-white"
                          : "bg-gray-800 text-white hover:bg-gray-700"
                      } transition-colors`}
                    >
                      {genderMovieName(genre.name)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Extra spacer for fixed navbar */}
      <div className="h-16"></div>
    </>
  );
};

export default Navbar;
