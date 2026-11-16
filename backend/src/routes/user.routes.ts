import { Router } from "express";
import { getUserProfile, toggleWatchlist, getWatchlist, updateMe } from "../controllers/user.controller";
import { isAuthenticated } from "../middleware/isAuthenticated";

// routes only map URL -> controller function, the logic lives in controllers/user.controller.ts
const router = Router();

// GET /api/users/watchlist
// must stay above /:username, otherwise "watchlist" would be read as a username
router.get("/watchlist", isAuthenticated, getWatchlist);

// POST /api/users/watchlist/:movieId
router.post("/watchlist/:movieId", isAuthenticated, toggleWatchlist);

// PUT /api/users/me
// above /:username for the same reason as /watchlist
router.put("/me", isAuthenticated, updateMe);

// GET /api/users/:username
router.get("/:username", getUserProfile);

export default router;
