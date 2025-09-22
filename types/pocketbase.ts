// types/pocketbase.ts
export interface Favorite {
  id: string;
  user_id: string; // user id
  tmdb_id: number;
  media_type: "movie" | "tv";
  title?: string;
  poster_path?: string;
}

export interface Watchlist {
  id: string;
  user_id: string;
  tmdb_id: number;
  media_type: "movie" | "tv";
  status: "planned" | "watching" | "completed";
}

export interface Review {
  id: string;
  user_id: string;
  tmdb_id: number;
  rating?: number;
  content?: string;
}

export interface Comment {
  id: string;
  user_id: string;
  review: string;
  content: string;
}

export interface Like {
  id: string;
  user_id: string;
  target_type: "review" | "comment";
  target_id: string;
}
