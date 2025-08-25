import { Router } from "express";
import auth from "../routes/modules/auth";
import dashboard from "../routes/modules/dashboard";
import fraud from "../routes/modules/fraud";
import learning from "../routes/modules/learning";
import community from "../routes/modules/community";
import settings from "../routes/modules/settings";
import integrations from "../routes/modules/integrations";
import { authenticateJWT } from "../middleware/auth";
import { auditLog } from "../middleware/audit";

const router = Router();

router.use("/auth", auth);
router.use(auditLog);
router.use("/dashboard", authenticateJWT, dashboard);
router.use("/fraud", authenticateJWT, fraud);
router.use("/learning", authenticateJWT, learning);
router.use("/community", authenticateJWT, community);
router.use("/settings", authenticateJWT, settings);
router.use("/integrations", authenticateJWT, integrations);

export default router;

