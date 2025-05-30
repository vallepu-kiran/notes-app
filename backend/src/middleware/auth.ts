import type { Response, NextFunction } from "express"
import { verifyToken, type AuthRequest } from "../utils/auth"

export function authenticateToken(req: AuthRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers["authorization"]
  const token = authHeader && authHeader.split(" ")[1]

  if (!token) {
    res.status(401).json({ error: "Access token required" })
    return
  }

  const user = verifyToken(token)
  if (!user) {
    res.status(403).json({ error: "Invalid or expired token" })
    return
  }

  req.user = user
  next()
}
