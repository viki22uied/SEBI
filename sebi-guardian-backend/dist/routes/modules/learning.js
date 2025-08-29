"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = require("../../lib/prisma");
const router = (0, express_1.Router)();
const modules = [
    { id: "m1", title: "Identify Investment Scams" },
    { id: "m2", title: "Secure Your Accounts" },
    { id: "m3", title: "Spot Deepfakes" },
];
router.get("/modules", (_req, res) => {
    res.json({ modules });
});
router.post("/quiz/submit", async (req, res) => {
    const { userId, moduleId, correctCount } = req.body || {};
    if (!userId || !moduleId)
        return res.status(400).json({ error: "userId, moduleId required" });
    const progress = Math.min(100, Number(correctCount || 0) * 10);
    const lp = await prisma_1.prisma.learningProgress.upsert({
        where: { userId_moduleId: { userId, moduleId } },
        create: { userId, moduleId, progress, badgeEarned: progress >= 70 },
        update: { progress, badgeEarned: progress >= 70 },
    });
    res.json({ progress: lp.progress, badgeEarned: lp.badgeEarned });
});
router.get("/progress/:userId", async (req, res) => {
    const { userId } = req.params;
    const items = await prisma_1.prisma.learningProgress.findMany({ where: { userId } });
    const avg = items.length ? Math.round(items.reduce((a, b) => a + b.progress, 0) / items.length) : 0;
    res.json({ userId, items, immunityLevel: avg });
});
exports.default = router;
