"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.auditLog = auditLog;
const prisma_1 = require("../lib/prisma");
async function auditLog(req, _res, next) {
    try {
        await prisma_1.prisma.auditLog.create({
            data: {
                userId: req.user?.id,
                action: `${req.method}`,
                route: req.originalUrl,
                ip: req.ip,
                userAgent: req.headers["user-agent"] || undefined,
            },
        });
    }
    catch {
        // swallow audit errors
    }
    next();
}
