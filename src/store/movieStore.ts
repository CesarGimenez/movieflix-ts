import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Movie } from '@/services/movieApi';

export type Genre = {
  id: number;
  name: string;
};

export type FilterState = {
  searchQuery: string;
  selectedGenres: number[];
  selectedActors: string[];
  yearRange: [number, number];
};

type MovieStore = {
  // Search and filters
  filters: FilterState;
  setSearchQuery: (query: string) => void;
  setYearRange: (range: [number, number]) => void;
  toggleGenre: (genreId: number) => void;
  toggleActor: (actorId: string) => void;
  clearFilters: () => void;
  
  // UI state
  isNavOpen: boolean;
  toggleNav: () => void;

  // Recently viewed
  recentlyViewed: number[];
  addToRecentlyViewed: (movieId: number) => void;
  
  // Watchlist
  watchlist: Movie[];
  addToWatchlist: (movie: Movie) => void;
  removeFromWatchlist: (movieId: number) => void;
  isInWatchlist: (movieId: number) => boolean;

  // Pagination
  currentPage: number;
  incrementPage: () => void;
  resetPage: () => void;
};

export const useMovieStore = create<MovieStore>()(
  persist(
    (set, get) => ({
      // Filter state
      filters: {
        searchQuery: '',
        selectedGenres: [],
        selectedActors: [],
        yearRange: [1900, new Date().getFullYear()]
      },
      
      setSearchQuery: (query) => 
        set((state) => ({ 
          filters: { ...state.filters, searchQuery: query } 
        })),
      
      setYearRange: (range) =>
        set((state) => ({
          filters: { ...state.filters, yearRange: range }
        })),
      
      toggleGenre: (genreId) => 
        set((state) => {
          const isSelected = state.filters.selectedGenres.includes(genreId);
          return {
            filters: {
              ...state.filters,
              selectedGenres: isSelected 
                ? state.filters.selectedGenres.filter(id => id !== genreId)
                : [...state.filters.selectedGenres, genreId]
            }
          };
        }),
      
      toggleActor: (actorId) => 
        set((state) => {
          const isSelected = state.filters.selectedActors.includes(actorId);
          return {
            filters: {
              ...state.filters,
              selectedActors: isSelected 
                ? state.filters.selectedActors.filter(id => id !== actorId)
                : [...state.filters.selectedActors, actorId]
            }
          };
        }),
      
      clearFilters: () => 
        set((state) => ({ 
          filters: { 
            searchQuery: '', 
            selectedGenres: [], 
            selectedActors: [],
            yearRange: [1900, new Date().getFullYear()]
          } 
        })),
      
      // UI state
      isNavOpen: false,
      toggleNav: () => set((state) => ({ isNavOpen: !state.isNavOpen })),
      
      // Recently viewed
      recentlyViewed: [],
      addToRecentlyViewed: (movieId) => 
        set((state) => {
          const updatedHistory = state.recentlyViewed.filter(id => id !== movieId);
          return {
            recentlyViewed: [movieId, ...updatedHistory].slice(0, 10) // Keep only the 10 most recent
          };
        }),
        
      // Watchlist
      watchlist: [],
      addToWatchlist: (movie) =>
        set((state) => {
          if (state.watchlist.some(m => m.id === movie.id)) {
            return state; // Movie already in watchlist
          }
          return { watchlist: [...state.watchlist, movie] };
        }),
      removeFromWatchlist: (movieId) =>
        set((state) => ({
          watchlist: state.watchlist.filter(movie => movie.id !== movieId)
        })),
      isInWatchlist: (movieId) =>
        get().watchlist.some(movie => movie.id === movieId),
        
      // Pagination for infinite scroll
      currentPage: 1,
      incrementPage: () => set(state => ({ currentPage: state.currentPage + 1 })),
      resetPage: () => set({ currentPage: 1 })
    }),
    {
      name: 'movie-store', // Name for localStorage
    }
  )
);
