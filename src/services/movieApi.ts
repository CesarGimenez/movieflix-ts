import { QueryFunctionContext } from "@tanstack/react-query";

// Replace with your actual TMDB API key
const API_KEY = "3fd2be6f0c70a2a598f084ddfb75487c"; // This is a public demo API key from TMDB
const BASE_URL = "https://api.themoviedb.org/3";

export type Movie = {
  id: number;
  title: string;
  poster_path: string;
  backdrop_path: string;
  overview: string;
  release_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  original_language: string;
  popularity: number;
  media_type?: string;
};

export type MovieDetails = Movie & {
  genres: { id: number; name: string }[];
  runtime: number;
  budget: number;
  revenue: number;
  tagline: string;
  status: string;
  production_companies: {
    id: number;
    logo_path: string;
    name: string;
    origin_country: string;
  }[];
};

export type Actor = {
  id: number;
  name: string;
  character: string;
  profile_path: string;
  popularity: number;
};

export type Genre = {
  id: number;
  name: string;
};

export const fetchTrendingMovies = async (pageParam = 1) => {
  const response = await fetch(
    `${BASE_URL}/trending/movie/week?api_key=${API_KEY}&page=${pageParam}`
  );
  const data = await response.json();
  return {
    movies: data.results as Movie[],
    currentPage: data.page,
    totalPages: data.total_pages
  };
};

export const fetchMoviesByGenre = async (genreId: number, pageParam = 1, yearRange: [number, number] = [1900, new Date().getFullYear()]) => {
  const [startYear, endYear] = yearRange;
  
  const response = await fetch(
    `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${genreId}&primary_release_date.gte=${startYear}-01-01&primary_release_date.lte=${endYear}-12-31&page=${pageParam}`
  );
  const data = await response.json();
  return {
    movies: data.results as Movie[],
    currentPage: data.page,
    totalPages: data.total_pages
  };
};

export const fetchMovieDetails = async ({ queryKey }: QueryFunctionContext<[string, string]>) => {
  const [_, movieId] = queryKey;
  const response = await fetch(
    `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}`
  );
  const data = await response.json();
  return data as MovieDetails;
};

export const fetchMovieCredits = async ({ queryKey }: QueryFunctionContext<[string, string]>) => {
  const [_, movieId] = queryKey;
  const response = await fetch(
    `${BASE_URL}/movie/${movieId}/credits?api_key=${API_KEY}`
  );
  const data = await response.json();
  return data.cast as Actor[];
};

export const fetchGenres = async () => {
  const response = await fetch(
    `${BASE_URL}/genre/movie/list?api_key=${API_KEY}`
  );
  const data = await response.json();
  return data.genres as Genre[];
};

export const fetchMoviesBySearch = async (query: string, pageParam = 1, yearRange: [number, number] = [1900, new Date().getFullYear()]) => {
  if (!query || query.trim() === '') return { movies: [], currentPage: 1, totalPages: 0 };
  
  const [startYear, endYear] = yearRange;
  
  const response = await fetch(
    `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&primary_release_date.gte=${startYear}-01-01&primary_release_date.lte=${endYear}-12-31&page=${pageParam}`
  );
  const data = await response.json();
  return {
    movies: data.results as Movie[],
    currentPage: data.page,
    totalPages: data.total_pages
  };
};

export const fetchDiscoverMovies = async (pageParam = 1, yearRange: [number, number] = [1900, new Date().getFullYear()]) => {
  const [startYear, endYear] = yearRange;
  
  const response = await fetch(
    `${BASE_URL}/discover/movie?api_key=${API_KEY}&sort_by=popularity.desc&primary_release_date.gte=${startYear}-01-01&primary_release_date.lte=${endYear}-12-31&page=${pageParam}`
  );
  const data = await response.json();
  return {
    movies: data.results as Movie[],
    currentPage: data.page,
    totalPages: data.total_pages
  };
};

export const fetchActorDetails = async ({ queryKey }: QueryFunctionContext<[string, number]>) => {
  const [_, actorId] = queryKey;
  const response = await fetch(
    `${BASE_URL}/person/${actorId}?api_key=${API_KEY}`
  );
  const data = await response.json();
  
  // Fetch movies the actor has been in
  const creditsResponse = await fetch(
    `${BASE_URL}/person/${actorId}/movie_credits?api_key=${API_KEY}`
  );
  const creditsData = await creditsResponse.json();
  
  return { ...data, movies: creditsData.cast };
};

export const getImageUrl = (path: string | null, size: string = 'original') => {
  if (!path) return '/placeholder.svg';
  return `https://image.tmdb.org/t/p/${size}${path}`;
};

export const fetchTrending = async (mediaType: "movie" | "tv", pageParam = 1) => {
  const response = await fetch(
    `${BASE_URL}/trending/${mediaType}/week?api_key=${API_KEY}&page=${pageParam}`
  );
  const data = await response.json();
  
  // For TV shows, rename "name" to "title" and "first_air_date" to "release_date" to match Movie type
  const processedResults = data.results.map((item: any) => {
    if (mediaType === "tv") {
      return {
        ...item,
        title: item.name || item.title,
        release_date: item.first_air_date || item.release_date,
        media_type: "tv"
      };
    }
    return {...item, media_type: "movie"};
  });
  
  return {
    movies: processedResults as Movie[],
    currentPage: data.page,
    totalPages: data.total_pages
  };
};

export const fetchSeriesDetails = async ({ queryKey }: QueryFunctionContext<[string, string]>) => {
  const [_, seriesId] = queryKey;
  const response = await fetch(
    `${BASE_URL}/tv/${seriesId}?api_key=${API_KEY}`
  );
  const data = await response.json();
  
  // Adapt TV show data to match MovieDetails structure
  return {
    ...data,
    title: data.name,
    release_date: data.first_air_date,
    runtime: data.episode_run_time?.[0] || 0,
    media_type: "tv"
  } as MovieDetails;
};

export const fetchSeriesCredits = async ({ queryKey }: QueryFunctionContext<[string, string]>) => {
  const [_, seriesId] = queryKey;
  const response = await fetch(
    `${BASE_URL}/tv/${seriesId}/credits?api_key=${API_KEY}`
  );
  const data = await response.json();
  return data.cast as Actor[];
};
