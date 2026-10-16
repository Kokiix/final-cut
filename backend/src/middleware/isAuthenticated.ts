import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// what we put inside the token at login
export interface TokenPayload {
  _id: string;
}

// tells TypeScript that `req.payload` exists on every request (we fill it in below)
declare global {
  namespace Express {
    interface Request {
      payload?: TokenPayload;
    }
  }
}

// put this before any route that needs a logged in user.
// it reads the authToken cookie, checks it, and saves the user id in req.payload
export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  const authToken: unknown = req.cookies?.authToken;

  // no cookie = not logged in
  if (typeof authToken !== "string" || !authToken) {
    res.status(401).json({ success: false, message: "Not logged in." });
    return;
  }

  const tokenSecret = process.env.TOKEN_SECRET;
  if (!tokenSecret) {
    next(new Error("TOKEN_SECRET is missing from .env"));
    return;
  }

  try {
    // verify checks the signature (nobody edited it) and the expiry date. If either fails it throws
    const decoded = jwt.verify(authToken, tokenSecret) as TokenPayload;

    // save the user id so the next function (the actual route) knows who is making the request
    req.payload = { _id: decoded._id };

    // token is fine, move on to the route
    next();
  } catch {
    // token was edited, signed with another secret, or expired
    res.status(401).json({ success: false, message: "Session expired or invalid. Please log in again." });
  }
};
