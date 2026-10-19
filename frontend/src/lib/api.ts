// calls the backend auth routes. Vite proxies /api to the backend (see vite.config.js)

// same shape the backend sends back (without the password)
export interface User {
  _id: string;
  name: string;
  username: string;
  email: string;
}

// every backend response has `success`, plus a `message` or a `user`
export interface AuthResponse {
  success: boolean;
  message?: string;
  user?: User;
}

interface RequestOptions {
  method?: "GET" | "POST";
  body?: object;
}

async function request(path: string, { method = "GET", body }: RequestOptions = {}): Promise<AuthResponse> {
  try {
    const res = await fetch(`/api/auth${path}`, {
      method,
      headers: body ? { "Content-Type": "application/json" } : undefined,
      body: body ? JSON.stringify(body) : undefined,
      // send/receive the authToken cookie
      credentials: "include",
    });
    return await res.json();
  } catch {
    // backend is down or didn't send json
    return { success: false, message: "Could not reach the server. Try again." };
  }
}

export const signup = (data: { name: string; username: string; email: string; password: string }) =>
  request("/signup", { method: "POST", body: data });

export const login = (data: { email: string; password: string }) =>
  request("/login", { method: "POST", body: data });

export const verify = () => request("/verify");

export const logout = () => request("/logout", { method: "POST" });
