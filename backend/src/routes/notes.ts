import { Router } from "express"
import { getNotes, createNote, deleteNote } from "../controllers/noteController"
import { authenticateToken } from "../middleware/auth"

const router = Router()

router.use(authenticateToken) // All note routes require authentication

router.get("/", getNotes)
router.post("/", createNote)
router.delete("/:id", deleteNote)

export default router
