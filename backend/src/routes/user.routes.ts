import { Router } from "express";
import { getUserProfile } from "../controllers/user.controller";

// routes only map URL -> controller function, the logic lives in controllers/user.controller.ts
const router = Router();

// GET /api/users/:username
router.get("/:username", getUserProfile);

export default router;
