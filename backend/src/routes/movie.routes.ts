import { Router } from "express";
import { searchMovies, getMovie } from "../controllers/movie.controller";

// routes only map URL -> controller function, the logic lives in controllers/movie.controller.ts
const router = Router();

// GET /api/movies/search?q=&genre=
// must stay above /:movieId, otherwise "search" would be read as a movie id
router.get("/search", searchMovies);

// GET /api/movies/:movieId
router.get("/:movieId", getMovie);

export default router;
