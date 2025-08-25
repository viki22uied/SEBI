import { Router } from "express";
import auth from "../routes/modules/auth";
import dashboard from "../routes/modules/dashboard";
import fraud from "../routes/modules/fraud";
import learning from "../routes/modules/learning";
import community from "../routes/modules/community";
import settings from "../routes/modules/settings";

const router = Router();

router.use("/auth", auth);
router.use("/dashboard", dashboard);
router.use("/fraud", fraud);
router.use("/learning", learning);
router.use("/community", community);
router.use("/settings", settings);

export default router;

