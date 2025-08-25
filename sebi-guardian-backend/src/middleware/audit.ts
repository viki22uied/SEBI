import { NextFunction, Response } from "express";
import { prisma } from "../lib/prisma";
import { AuthenticatedRequest } from "./auth";

export async function auditLog(req: AuthenticatedRequest, _res: Response, next: NextFunction) {
  try {
    await prisma.auditLog.create({
      data: {
        userId: req.user?.id,
        action: `${req.method}`,
        route: req.originalUrl,
        ip: req.ip,
        userAgent: req.headers["user-agent"] || undefined,
      },
    });
  } catch {
    // swallow audit errors
  }
  next();
}

