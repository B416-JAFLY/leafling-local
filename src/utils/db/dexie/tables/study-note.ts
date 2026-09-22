import { Entity } from "dexie"

/** A private note stored only in this browser profile's IndexedDB. */
export default class StudyNote extends Entity {
  id!: string
  term!: string
  definition!: string
  sourceUrl!: string | null
  createdAt!: Date
  updatedAt!: Date
}
