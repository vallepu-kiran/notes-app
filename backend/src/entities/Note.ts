import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm"
import { User } from "./User"

@Entity("notes")
export class Note {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ type: "varchar", length: 255 })
  title!: string

  @Column({ type: "text" })
  content!: string

  @Column({ type: "simple-array", nullable: true })
  tags!: string[]

  @Column({ type: "int" })
  userId!: number

  @ManyToOne(
    () => User,
    (user) => user.notes,
  )
  @JoinColumn({ name: "userId" })
  user!: User

  @CreateDateColumn()
  createdAt!: Date

  @UpdateDateColumn()
  updatedAt!: Date
}
