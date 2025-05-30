import { Router } from "express"
import { getTagAnalytics } from "../controllers/analyticsController"
import { authenticateToken } from "../middleware/auth"

const router = Router()

router.use(authenticateToken) // All analytics routes require authentication

router.get("/tags", getTagAnalytics)

export default router
