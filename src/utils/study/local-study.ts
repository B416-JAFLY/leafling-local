import { db } from "@/utils/db/dexie/db"
import StudyCard from "@/utils/db/dexie/tables/study-card"
import StudyNote from "@/utils/db/dexie/tables/study-note"

export type StudyGrade = "again" | "hard" | "good" | "easy"

function newId(): string {
  return crypto.randomUUID()
}

export async function listStudyNotes(): Promise<StudyNote[]> {
  return db.studyNote.orderBy("updatedAt").reverse().toArray()
}

export async function listDueStudyCards(now = new Date()): Promise<StudyCard[]> {
  return db.studyCard.where("dueAt").belowOrEqual(now).sortBy("dueAt")
}

export async function createStudyNote(input: {
  term: string
  definition: string
  sourceUrl?: string | null
}): Promise<StudyNote> {
  const term = input.term.trim()
  const definition = input.definition.trim()
  if (!term || !definition) throw new Error("A term and its definition are required")

  const now = new Date()
  const note = {
    id: newId(),
    term,
    definition,
    sourceUrl: input.sourceUrl ?? null,
    createdAt: now,
    updatedAt: now,
  } as StudyNote
  const card = {
    id: newId(),
    noteId: note.id,
    front: term,
    back: definition,
    dueAt: now,
    intervalDays: 0,
    repetitions: 0,
    createdAt: now,
    updatedAt: now,
  } as StudyCard

  await db.transaction("rw", db.studyNote, db.studyCard, async () => {
    await db.studyNote.add(note)
    await db.studyCard.add(card)
  })
  return note
}

export async function deleteStudyNote(noteId: string): Promise<void> {
  await db.transaction("rw", db.studyNote, db.studyCard, async () => {
    await db.studyCard.where("noteId").equals(noteId).delete()
    await db.studyNote.delete(noteId)
  })
}

/** A compact local SRS policy; every interval stays on the card for later migration. */
export function calculateNextReview(
  card: Pick<StudyCard, "intervalDays" | "repetitions">,
  grade: StudyGrade,
  now = new Date(),
): Pick<StudyCard, "dueAt" | "intervalDays" | "repetitions" | "updatedAt"> {
  const base = Math.max(1, card.intervalDays)
  const intervalDays =
    grade === "again"
      ? 0
      : grade === "hard"
        ? Math.ceil(base * 1.2)
        : grade === "good"
          ? Math.ceil(base * 2)
          : Math.max(4, Math.ceil(base * 3))
  const dueAt = new Date(now)
  if (grade === "again") dueAt.setMinutes(dueAt.getMinutes() + 10)
  else dueAt.setDate(dueAt.getDate() + intervalDays)
  return {
    dueAt,
    intervalDays,
    repetitions: grade === "again" ? 0 : card.repetitions + 1,
    updatedAt: now,
  }
}

export async function gradeStudyCard(
  id: string,
  grade: StudyGrade,
  now = new Date(),
): Promise<void> {
  const card = await db.studyCard.get(id)
  if (!card) return
  await db.studyCard.update(id, calculateNextReview(card, grade, now))
}
