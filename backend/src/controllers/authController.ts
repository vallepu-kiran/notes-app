import type { Request, Response } from "express"
import { AppDataSource } from "../database"
import { User } from "../entities/User"
import { hashPassword, verifyPassword, generateToken, type AuthRequest } from "../utils/auth"

const userRepository = AppDataSource.getRepository(User)

export async function register(req: Request, res: Response): Promise<void> {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      res.status(400).json({ error: "Email and password are required" })
      return
    }

    if (password.length < 6) {
      res.status(400).json({ error: "Password must be at least 6 characters" })
      return
    }

    // Check if user already exists
    const existingUser = await userRepository.findOne({ where: { email } })
    if (existingUser) {
      res.status(400).json({ error: "User already exists" })
      return
    }

    // Create new user
    const hashedPass = await hashPassword(password)
    const user = userRepository.create({
      email,
      password: hashedPass,
    })

    const savedUser = await userRepository.save(user)

    // Generate token
    const token = generateToken(savedUser.id)

    res.status(201).json({
      user: { id: savedUser.id, email: savedUser.email },
      token,
      message: "User created successfully",
    })
  } catch (error) {
    console.error("Error creating user:", error)
    res.status(500).json({ error: "Failed to create user" })
  }
}

export async function login(req: Request, res: Response): Promise<void> {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      res.status(400).json({ error: "Email and password are required" })
      return
    }

    // Find user
    const user = await userRepository.findOne({ where: { email } })
    if (!user) {
      res.status(401).json({ error: "Invalid credentials" })
      return
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, user.password)
    if (!isValidPassword) {
      res.status(401).json({ error: "Invalid credentials" })
      return
    }

    // Generate token
    const token = generateToken(user.id)

    res.json({
      user: { id: user.id, email: user.email },
      token,
      message: "Login successful",
    })
  } catch (error) {
    console.error("Error logging in:", error)
    res.status(500).json({ error: "Failed to login" })
  }
}

export async function getMe(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Not authenticated" })
      return
    }

    const user = await userRepository.findOne({ where: { id: req.user.userId } })

    if (!user) {
      res.status(404).json({ error: "User not found" })
      return
    }

    res.json({
      id: user.id,
      email: user.email,
    })
  } catch (error) {
    console.error("Error fetching user:", error)
    res.status(500).json({ error: "Failed to fetch user" })
  }
}

export function logout(req: Request, res: Response): void {
  res.json({ message: "Logout successful" })
}
