import { Router } from "express";
import { signup } from "../controllers/auth.controller";

// routes only map URL -> controller function, the logic lives in controllers/auth.controller.ts
const router = Router();

// POST /api/auth/signup
router.post("/signup", signup);

export default router;
