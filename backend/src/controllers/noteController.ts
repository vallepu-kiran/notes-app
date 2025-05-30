import type { Response } from "express"
import { AppDataSource } from "../database"
import { Note } from "../entities/Note"
import type { AuthRequest } from "../utils/auth"

const noteRepository = AppDataSource.getRepository(Note)

export async function getNotes(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Unauthorized" })
      return
    }

    const page = Number.parseInt(req.query.page as string) || 1
    const limit = Number.parseInt(req.query.limit as string) || 10
    const search = (req.query.search as string) || ""

    let query = noteRepository.createQueryBuilder("note").where("note.userId = :userId", { userId: req.user.userId })

    if (search) {
      query = query.andWhere("(note.title ILIKE :search OR note.content ILIKE :search OR :search = ANY(note.tags))", {
        search: `%${search}%`,
      })
    }

    const [notes, total] = await query
      .orderBy("note.createdAt", "DESC")
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount()

    const hasMore = total > page * limit

    res.json({
      notes,
      hasMore,
      total,
      page,
      limit,
    })
  } catch (error) {
    console.error("Error fetching notes:", error)
    res.status(500).json({ error: "Failed to fetch notes" })
  }
}

export async function createNote(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Unauthorized" })
      return
    }

    const { title, content, tags } = req.body

    if (!title || !content) {
      res.status(400).json({ error: "Title and content are required" })
      return
    }

    const note = noteRepository.create({
      title,
      content,
      tags: tags || [],
      userId: req.user.userId,
    })

    const savedNote = await noteRepository.save(note)

    res.status(201).json(savedNote)
  } catch (error) {
    console.error("Error creating note:", error)
    res.status(500).json({ error: "Failed to create note" })
  }
}

export async function deleteNote(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Unauthorized" })
      return
    }

    const noteId = Number.parseInt(req.params.id)

    const note = await noteRepository.findOne({
      where: {
        id: noteId,
        userId: req.user.userId,
      },
    })

    if (!note) {
      res.status(404).json({ error: "Note not found" })
      return
    }

    await noteRepository.remove(note)

    res.json({ message: "Note deleted successfully" })
  } catch (error) {
    console.error("Error deleting note:", error)
    res.status(500).json({ error: "Failed to delete note" })
  }
}
