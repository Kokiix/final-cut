// Same fields the backend Movie model sends back.
export interface Movie {
  _id: string;
  tmdbId: number;
  title: string;
  overview: string;
  releaseDate?: string;
  genres: string[];
  posterUrl: string | null;
  rating: number;
  voteCount: number;
}

// What the search endpoint sends back.
interface SearchResponse {
  success: boolean;
  message?: string;
  movies?: Movie[];
}

// TMDb genre names, used for the genre dropdown.
export const GENRES = [
  "Action", "Adventure", "Animation", "Comedy", "Crime", "Documentary",
  "Drama", "Family", "Fantasy", "History", "Horror", "Music", "Mystery",
  "Romance", "Science Fiction", "Thriller", "War", "Western",
];

// Searches movies by title and genre. Both are optional.
export async function searchMovies(q: string, genre: string): Promise<SearchResponse> {
  const params = new URLSearchParams();
  if (q.trim()) {
    params.set("q", q.trim());
  }
  if (genre) {
    params.set("genre", genre);
  }

  try {
    const res = await fetch("/api/movies/search?" + params.toString());
    return await res.json();
  } catch {
    return { success: false, message: "Could not reach the server. Try again." };
  }
}