import { Router } from "express";
import { signup, login } from "../controllers/auth.controller";

// routes only map URL -> controller function, the logic lives in controllers/auth.controller.ts
const router = Router();

// POST /api/auth/signup
router.post("/signup", signup);

// POST /api/auth/login
router.post("/login", login);

export default router;
