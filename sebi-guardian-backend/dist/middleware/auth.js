"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateJWT = authenticateJWT;
exports.requireRole = requireRole;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function authenticateJWT(req, res, next) {
    const header = req.headers.authorization;
    if (!header)
        return res.status(401).json({ error: "Unauthorized" });
    const token = header.replace("Bearer ", "");
    try {
        const payload = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || "dev-secret");
        req.user = { id: payload.sub, role: payload.role };
        return next();
    }
    catch {
        return res.status(401).json({ error: "Unauthorized" });
    }
}
function requireRole(...roles) {
    return (req, res, next) => {
        if (!req.user)
            return res.status(401).json({ error: "Unauthorized" });
        if (!roles.includes(req.user.role))
            return res.status(403).json({ error: "Forbidden" });
        next();
    };
}
