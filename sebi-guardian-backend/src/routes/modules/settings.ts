import { Router } from "express";
import { prisma } from "../../lib/prisma";

const router = Router();

router.get("/", async (req, res) => {
  const userId = String(req.query.userId || "");
  if (!userId) return res.status(400).json({ error: "userId required" });
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return res.status(404).json({ error: "Not found" });
  res.json({ settings: user.settings });
});

router.put("/update", async (req, res) => {
  const { userId, settings } = req.body || {};
  if (!userId || typeof settings !== "object") return res.status(400).json({ error: "userId, settings required" });
  await prisma.user.update({ where: { id: userId }, data: { settings } });
  res.json({ status: "updated" });
});

router.put("/notifications", async (req, res) => {
  const { userId, notifications } = req.body || {};
  if (!userId || typeof notifications !== "object") return res.status(400).json({ error: "userId, notifications required" });
  await prisma.user.update({ where: { id: userId }, data: { settings: { ...(notifications ? notifications : {}) } as any } });
  res.json({ status: "updated" });
});

router.put("/privacy", async (req, res) => {
  const { userId, privacy } = req.body || {};
  if (!userId || typeof privacy !== "object") return res.status(400).json({ error: "userId, privacy required" });
  await prisma.user.update({ where: { id: userId }, data: { settings: { ...(privacy ? privacy : {}) } as any } });
  res.json({ status: "updated" });
});

router.post("/language", async (req, res) => {
  const { userId, language } = req.body || {};
  if (!userId || !language) return res.status(400).json({ error: "userId, language required" });
  const user = await prisma.user.update({ where: { id: userId }, data: { settings: { language } as any } });
  res.json({ language: (user.settings as any).language });
});

export default router;

