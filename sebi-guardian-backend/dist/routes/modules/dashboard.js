"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = require("../../lib/prisma");
const router = (0, express_1.Router)();
router.get("/risk-score", async (req, res) => {
    const userId = String(req.query.userId || "");
    if (!userId)
        return res.status(400).json({ error: "userId required" });
    const user = await prisma_1.prisma.user.findUnique({ where: { id: userId } });
    if (!user)
        return res.status(404).json({ error: "Not found" });
    const fraudRiskScore = user.riskScore;
    const riskLevel = fraudRiskScore >= 70 ? "High" : fraudRiskScore >= 40 ? "Medium" : "Low";
    res.json({ userId, fraudRiskScore, riskLevel, lastUpdated: new Date().toISOString() });
});
router.get("/alerts", async (req, res) => {
    const userId = String(req.query.userId || "");
    if (!userId)
        return res.status(400).json({ error: "userId required" });
    const alerts = await prisma_1.prisma.alert.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, take: 50 });
    res.json({ alerts });
});
router.post("/actions/report-fraud", async (req, res) => {
    const { userId, type, details } = req.body || {};
    if (!userId || !type || !details)
        return res.status(400).json({ error: "userId, type, details required" });
    const report = await prisma_1.prisma.fraudReport.create({ data: { userId, type, details } });
    res.json({ reportId: report.id, status: report.status });
});
router.post("/actions/verify-advice", async (_req, res) => {
    res.json({ status: "queued", reference: `advice_${Date.now()}` });
});
router.post("/actions/check-source", async (_req, res) => {
    res.json({ valid: true, confidence: 0.78 });
});
exports.default = router;
// Server-Sent Events endpoint for real-time alerts
router.get("/alerts/stream", async (req, res) => {
    const userId = String(req.query.userId || "");
    if (!userId) {
        res.status(400).json({ error: "userId required" });
        return;
    }
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders?.();
    const interval = setInterval(async () => {
        const alert = await prisma_1.prisma.alert.create({
            data: { userId, description: "Periodic security check", riskLevel: "Low" },
        });
        res.write(`event: alert\n`);
        res.write(`data: ${JSON.stringify(alert)}\n\n`);
    }, 15000);
    req.on("close", () => {
        clearInterval(interval);
    });
});
