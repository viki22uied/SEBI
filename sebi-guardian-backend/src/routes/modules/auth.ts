import { Router } from "express";
import { prisma } from "../../lib/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { z } from "zod";
import Redis from "ioredis";
import nodemailer from "nodemailer";

const router = Router();
const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "localhost",
  port: Number(process.env.SMTP_PORT || 1025),
  secure: false,
  auth: process.env.SMTP_USER
    ? { user: process.env.SMTP_USER!, pass: process.env.SMTP_PASS! }
    : undefined,
});

function signTokens(userId: string, role: string) {
  const accessToken = jwt.sign({ sub: userId, role }, process.env.JWT_SECRET || "dev-secret", {
    expiresIn: "15m",
  });
  const refreshToken = jwt.sign({ sub: userId, type: "refresh" }, process.env.JWT_REFRESH_SECRET || "dev-refresh", {
    expiresIn: "7d",
  });
  return { accessToken, refreshToken };
}

router.post("/signup", async (req, res) => {
  const schema = z.object({ email: z.string().email(), password: z.string().min(8), name: z.string().optional() });
  const { email, password, name } = schema.parse(req.body);

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return res.status(409).json({ error: "Email already registered" });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  await redis.setex(`otp:${email}`, 600, otp);

  await transporter.sendMail({
    from: process.env.MAIL_FROM || "noreply@sebi-guardian.local",
    to: email,
    subject: "Your verification code",
    text: `Your OTP is ${otp}`,
  });

  const passwordHash = await bcrypt.hash(password, 12);
  await prisma.user.create({ data: { email, passwordHash, name } });
  res.json({ status: "OTP sent" });
});

router.post("/verify-otp", async (req, res) => {
  const schema = z.object({ email: z.string().email(), otp: z.string().length(6) });
  const { email, otp } = schema.parse(req.body);
  const stored = await redis.get(`otp:${email}`);
  if (!stored || stored !== otp) return res.status(400).json({ error: "Invalid OTP" });
  await redis.del(`otp:${email}`);

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(404).json({ error: "User not found" });

  const tokens = signTokens(user.id, user.role);
  await redis.setex(`refresh:${user.id}`, 7 * 24 * 3600, tokens.refreshToken);
  res.json({ userId: user.id, accessToken: tokens.accessToken, refreshToken: tokens.refreshToken });
});

router.post("/login", async (req, res) => {
  const schema = z.object({ email: z.string().email(), password: z.string() });
  const { email, password } = schema.parse(req.body);
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(401).json({ error: "Invalid credentials" });
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ error: "Invalid credentials" });
  const tokens = signTokens(user.id, user.role);
  await redis.setex(`refresh:${user.id}`, 7 * 24 * 3600, tokens.refreshToken);
  res.json({ userId: user.id, accessToken: tokens.accessToken, refreshToken: tokens.refreshToken });
});

router.post("/logout", async (req, res) => {
  const auth = req.headers.authorization;
  if (!auth) return res.json({ status: "ok" });
  const token = auth.replace("Bearer ", "");
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || "dev-secret") as any;
    await redis.del(`refresh:${payload.sub}`);
  } catch {}
  res.json({ status: "ok" });
});

router.post("/refresh", async (req, res) => {
  const { refreshToken } = req.body || {};
  if (!refreshToken) return res.status(400).json({ error: "refreshToken required" });
  try {
    const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || "dev-refresh") as any;
    const stored = await redis.get(`refresh:${payload.sub}`);
    if (stored !== refreshToken) return res.status(401).json({ error: "Invalid refresh token" });
    const user = await prisma.user.findUnique({ where: { id: payload.sub } });
    if (!user) return res.status(401).json({ error: "Invalid refresh token" });
    const tokens = signTokens(user.id, user.role);
    await redis.setex(`refresh:${user.id}`, 7 * 24 * 3600, tokens.refreshToken);
    res.json({ accessToken: tokens.accessToken, refreshToken: tokens.refreshToken });
  } catch {
    return res.status(401).json({ error: "Invalid refresh token" });
  }
});

router.get("/profile", async (req, res) => {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: "Unauthorized" });
  try {
    const token = auth.replace("Bearer ", "");
    const payload = jwt.verify(token, process.env.JWT_SECRET || "dev-secret") as any;
    const user = await prisma.user.findUnique({ where: { id: payload.sub } });
    if (!user) return res.status(404).json({ error: "Not found" });
    res.json({ userId: user.id, email: user.email, name: user.name, role: user.role, riskScore: user.riskScore, badges: user.badges, settings: user.settings });
  } catch {
    return res.status(401).json({ error: "Unauthorized" });
  }
});

export default router;

