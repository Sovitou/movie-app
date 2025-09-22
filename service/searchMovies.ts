import axios from "axios";

const API_KEY = process.env.EXPO_PUBLIC_API_KEY;
const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

// Need a fallback message 
if (!API_KEY || !BASE_URL) {
  throw new Error("API_KEY or BASE_URL is missing in environment variables");
}

export const searchMovies = async (query: string) => {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        apikey: API_KEY,
        s: query,
      },
    });

    const data = response.data;
    console.log(data);

    if (data.Response === "True") {
      return {
        movies: data.Search || [],
        totalResults: parseInt(data.totalResults, 100) || 0,
      };
    } else {
      return { movies: [], totalResults: 0 };
    }
  } catch (error) {
    console.error("OMDb axios error:", error);
    return { movies: [], totalResults: 0 };
  }
};
