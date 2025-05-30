import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm"
import { Note } from "./Note"

@Entity("users")
export class User {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ type: "varchar", length: 255, unique: true })
  email!: string

  @Column({ type: "varchar", length: 255 })
  password!: string

  @OneToMany(
    () => Note,
    (note) => note.user,
  )
  notes!: Note[]

  @CreateDateColumn()
  createdAt!: Date

  @UpdateDateColumn()
  updatedAt!: Date
}
