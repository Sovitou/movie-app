// services/tmdb.ts
import axios from "axios";

const API_KEY = process.env.EXPO_PUBLIC_TMDB_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

const tmdb = axios.create({
  baseURL: BASE_URL,
  params: { api_key: API_KEY, language: "en-US" },
});

export const fetchTrending = async () => {
  const { data } = await tmdb.get("/trending/movie/week");
  return data.results;
};

export const fetchMovieDetails = async (id: number) => {
  const { data } = await tmdb.get(`/movie/${id}`, {
    params: { append_to_response: "credits,recommendations" },
  });
  return data;
};

export const searchMovies = async (query: string) => {
  const { data } = await tmdb.get("/search/movie", { params: { query } });
  return data.results;
};
