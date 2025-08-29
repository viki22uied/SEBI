import { Router } from "express";
import { prisma } from "../../lib/prisma";

const router = Router();

router.post("/report", async (req, res) => {
  const { userId, type, details } = req.body || {};
  if (!userId || !type || !details) return res.status(400).json({ error: "userId, type, details required" });
  const report = await prisma.fraudReport.create({ data: { userId, type, details } });
  res.json({ reportId: report.id, status: report.status });
});

router.get("/reports/:userId", async (req, res) => {
  const { userId } = req.params;
  const reports = await prisma.fraudReport.findMany({ where: { userId }, orderBy: { createdAt: "desc" } });
  res.json({ reports });
});

router.post("/trusted-contacts", async (req, res) => {
  const { userId, name, email } = req.body || {};
  if (!userId || !name || !email) return res.status(400).json({ error: "userId, name, email required" });
  const contact = await prisma.trustedContact.create({ data: { userId, name, email } });
  res.json({ id: contact.id });
});

router.get("/trusted-contacts/:userId", async (req, res) => {
  const { userId } = req.params;
  const contacts = await prisma.trustedContact.findMany({ where: { userId } });
  res.json({ contacts });
});

router.get("/regulatory-updates", async (_req, res) => {
  res.json({ updates: [{ id: "u1", title: "SEBI advisory on unsolicited messages", date: new Date().toISOString() }] });
});

export default router;

