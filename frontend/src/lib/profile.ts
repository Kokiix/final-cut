import type { User } from "./auth.svelte";
import type { Player } from "./rooms";

// A finished game as GET /api/game-rooms?status=completed sends it back.
export interface CompletedGame {
  _id: string;
  code: string;
  host: Player;
  players: Player[];
  winner: { _id: string; title: string; posterUrl: string | null };
  createdAt: string;
}

interface UpdateResponse {
  success: boolean;
  message?: string;
  user?: User;
}

interface GamesResponse {
  success: boolean;
  message?: string;
  gameRooms?: CompletedGame[];
}

// Saves the logged in user's name, username and email.
export async function updateProfile(data: { name: string; username: string; email: string }): Promise<UpdateResponse> {
  try {
    const res = await fetch("/api/users/me", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      credentials: "include",
    });
    return await res.json();
  } catch {
    return { success: false, message: "Could not reach the server. Try again." };
  }
}

// The logged in user's finished games, newest first. Only games with a winner come back.
export async function getCompletedGames(): Promise<GamesResponse> {
  try {
    const res = await fetch("/api/game-rooms?status=completed", { credentials: "include" });
    return await res.json();
  } catch {
    return { success: false, message: "Could not reach the server. Try again." };
  }
}
