import { fetchMovieDetails, fetchTrending, searchMovies } from "@/service/tmdb";
import { useQuery } from "@tanstack/react-query";

export const useTrendingMovies = () =>
  useQuery({ queryKey: ["trending"], queryFn: fetchTrending });

export const useMovieDetails = (id: number) =>
  useQuery({
    queryKey: ["movie", id],
    queryFn: () => fetchMovieDetails(id),
    enabled: !!id,
  });

export const useSearchMovies = (query: string) =>
  useQuery({
    queryKey: ["search", query],
    queryFn: () => searchMovies(query),
    enabled: !!query,
  });
