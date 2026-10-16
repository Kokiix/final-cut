import { Router } from "express";
import { signup, login, verify, logout } from "../controllers/auth.controller";
import { isAuthenticated } from "../middleware/isAuthenticated";

// routes only map URL -> controller function, the logic lives in controllers/auth.controller.ts
const router = Router();

// POST /api/auth/signup
router.post("/signup", signup);

// POST /api/auth/login
router.post("/login", login);

// GET /api/auth/verify
router.get("/verify", isAuthenticated, verify);

// POST /api/auth/logout
router.post("/logout", logout);

export default router;
