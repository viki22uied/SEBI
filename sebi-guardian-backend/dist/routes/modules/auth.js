"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = require("../../lib/prisma");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const zod_1 = require("zod");
const ioredis_1 = __importDefault(require("ioredis"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const router = (0, express_1.Router)();
const redis = new ioredis_1.default(process.env.REDIS_URL || "redis://localhost:6379");
const transporter = nodemailer_1.default.createTransport({
    host: process.env.SMTP_HOST || "localhost",
    port: Number(process.env.SMTP_PORT || 1025),
    secure: false,
    auth: process.env.SMTP_USER
        ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
        : undefined,
});
function signTokens(userId, role) {
    const accessToken = jsonwebtoken_1.default.sign({ sub: userId, role }, process.env.JWT_SECRET || "dev-secret", {
        expiresIn: "15m",
    });
    const refreshToken = jsonwebtoken_1.default.sign({ sub: userId, type: "refresh" }, process.env.JWT_REFRESH_SECRET || "dev-refresh", {
        expiresIn: "7d",
    });
    return { accessToken, refreshToken };
}
router.post("/signup", async (req, res) => {
    const schema = zod_1.z.object({ email: zod_1.z.string().email(), password: zod_1.z.string().min(8), name: zod_1.z.string().optional() });
    const { email, password, name } = schema.parse(req.body);
    const existing = await prisma_1.prisma.user.findUnique({ where: { email } });
    if (existing)
        return res.status(409).json({ error: "Email already registered" });
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await redis.setex(`otp:${email}`, 600, otp);
    await transporter.sendMail({
        from: process.env.MAIL_FROM || "noreply@sebi-guardian.local",
        to: email,
        subject: "Your verification code",
        text: `Your OTP is ${otp}`,
    });
    const passwordHash = await bcrypt_1.default.hash(password, 12);
    await prisma_1.prisma.user.create({ data: { email, passwordHash, name } });
    res.json({ status: "OTP sent" });
});
router.post("/verify-otp", async (req, res) => {
    const schema = zod_1.z.object({ email: zod_1.z.string().email(), otp: zod_1.z.string().length(6) });
    const { email, otp } = schema.parse(req.body);
    const stored = await redis.get(`otp:${email}`);
    if (!stored || stored !== otp)
        return res.status(400).json({ error: "Invalid OTP" });
    await redis.del(`otp:${email}`);
    const user = await prisma_1.prisma.user.findUnique({ where: { email } });
    if (!user)
        return res.status(404).json({ error: "User not found" });
    const tokens = signTokens(user.id, user.role);
    await redis.setex(`refresh:${user.id}`, 7 * 24 * 3600, tokens.refreshToken);
    res.json({ userId: user.id, accessToken: tokens.accessToken, refreshToken: tokens.refreshToken });
});
router.post("/login", async (req, res) => {
    const schema = zod_1.z.object({ email: zod_1.z.string().email(), password: zod_1.z.string() });
    const { email, password } = schema.parse(req.body);
    const user = await prisma_1.prisma.user.findUnique({ where: { email } });
    if (!user)
        return res.status(401).json({ error: "Invalid credentials" });
    const ok = await bcrypt_1.default.compare(password, user.passwordHash);
    if (!ok)
        return res.status(401).json({ error: "Invalid credentials" });
    const tokens = signTokens(user.id, user.role);
    await redis.setex(`refresh:${user.id}`, 7 * 24 * 3600, tokens.refreshToken);
    res.json({ userId: user.id, accessToken: tokens.accessToken, refreshToken: tokens.refreshToken });
});
router.post("/logout", async (req, res) => {
    const auth = req.headers.authorization;
    if (!auth)
        return res.json({ status: "ok" });
    const token = auth.replace("Bearer ", "");
    try {
        const payload = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || "dev-secret");
        await redis.del(`refresh:${payload.sub}`);
    }
    catch { }
    res.json({ status: "ok" });
});
router.post("/refresh", async (req, res) => {
    const { refreshToken } = req.body || {};
    if (!refreshToken)
        return res.status(400).json({ error: "refreshToken required" });
    try {
        const payload = jsonwebtoken_1.default.verify(refreshToken, process.env.JWT_REFRESH_SECRET || "dev-refresh");
        const stored = await redis.get(`refresh:${payload.sub}`);
        if (stored !== refreshToken)
            return res.status(401).json({ error: "Invalid refresh token" });
        const user = await prisma_1.prisma.user.findUnique({ where: { id: payload.sub } });
        if (!user)
            return res.status(401).json({ error: "Invalid refresh token" });
        const tokens = signTokens(user.id, user.role);
        await redis.setex(`refresh:${user.id}`, 7 * 24 * 3600, tokens.refreshToken);
        res.json({ accessToken: tokens.accessToken, refreshToken: tokens.refreshToken });
    }
    catch {
        return res.status(401).json({ error: "Invalid refresh token" });
    }
});
router.get("/profile", async (req, res) => {
    const auth = req.headers.authorization;
    if (!auth)
        return res.status(401).json({ error: "Unauthorized" });
    try {
        const token = auth.replace("Bearer ", "");
        const payload = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || "dev-secret");
        const user = await prisma_1.prisma.user.findUnique({ where: { id: payload.sub } });
        if (!user)
            return res.status(404).json({ error: "Not found" });
        res.json({ userId: user.id, email: user.email, name: user.name, role: user.role, riskScore: user.riskScore, badges: user.badges, settings: user.settings });
    }
    catch {
        return res.status(401).json({ error: "Unauthorized" });
    }
});
exports.default = router;
