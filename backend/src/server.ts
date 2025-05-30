import "reflect-metadata"
import express from "express"
import cors from "cors"
import helmet from "helmet"
import morgan from "morgan"
import dotenv from "dotenv"
import { AppDataSource } from "./database"
import authRoutes from "./routes/auth"
import noteRoutes from "./routes/notes"
import analyticsRoutes from "./routes/analytics"

// Load environment variables first
dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(helmet())
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  }),
)
app.use(morgan("combined"))
app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true, limit: "10mb" }))

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/notes", noteRoutes)
app.use("/api/analytics", analyticsRoutes)

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Server is running" })
})

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack)
  res.status(500).json({ error: "Something went wrong!" })
})

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ error: "Route not found" })
})

// Initialize database and start server
async function startServer() {
  try {
    await AppDataSource.initialize()
    console.log("✅ Database connected successfully")

    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`)
      console.log(`📊 Health check: http://localhost:${PORT}/api/health`)
    })
  } catch (error) {
    console.error("❌ Database connection failed:", error)
    process.exit(1)
  }
}

startServer()

export default app
