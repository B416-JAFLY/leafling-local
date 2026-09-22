import { Entity } from "dexie"

/** A review card owned by a local study note. Never sent to a service. */
export default class StudyCard extends Entity {
  id!: string
  noteId!: string
  front!: string
  back!: string
  dueAt!: Date
  intervalDays!: number
  repetitions!: number
  createdAt!: Date
  updatedAt!: Date
}
