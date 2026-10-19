import { verify, logout, type User } from "./api";

export const auth = $state<{ user: User | null }>({ user: null });

// asks the backend who we are. The cookie is httpOnly, so JS can't read it directly
export async function loadUser() {
  const res = await verify();
  auth.user = res.success ? (res.user ?? null) : null;
}

export async function logOut() {
  await logout();
  auth.user = null;
}
