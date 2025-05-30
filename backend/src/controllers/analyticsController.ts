import type { Response } from "express"
import { AppDataSource } from "../database"
import { Note } from "../entities/Note"
import type { AuthRequest } from "../utils/auth"

const noteRepository = AppDataSource.getRepository(Note)

export async function getTagAnalytics(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Unauthorized" })
      return
    }

    const notes = await noteRepository.find({
      where: {
        userId: req.user.userId,
      },
    })

    // Count tag occurrences
    const tagCounts: { [key: string]: number } = {}

    notes.forEach((note) => {
      if (note.tags) {
        note.tags.forEach((tag) => {
          tagCounts[tag] = (tagCounts[tag] || 0) + 1
        })
      }
    })

    // Convert to array and sort by count
    const analytics = Object.entries(tagCounts)
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5) // Top 5 tags

    res.json(analytics)
  } catch (error) {
    console.error("Error fetching tag analytics:", error)
    res.status(500).json({ error: "Failed to fetch analytics" })
  }
}
