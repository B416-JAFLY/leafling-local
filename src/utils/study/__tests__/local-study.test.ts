import { describe, expect, it } from "vitest"
import { calculateNextReview } from "../local-study"

describe("calculateNextReview", () => {
  const now = new Date("2026-09-22T12:00:00.000Z")

  it("brings an incorrect card back in ten minutes", () => {
    const next = calculateNextReview({ intervalDays: 5, repetitions: 3 }, "again", now)

    expect(next.intervalDays).toBe(0)
    expect(next.repetitions).toBe(0)
    expect(next.dueAt).toEqual(new Date("2026-09-22T12:10:00.000Z"))
  })

  it("expands the interval for a successful review", () => {
    const next = calculateNextReview({ intervalDays: 2, repetitions: 1 }, "good", now)

    expect(next.intervalDays).toBe(4)
    expect(next.repetitions).toBe(2)
    expect(next.dueAt).toEqual(new Date("2026-09-26T12:00:00.000Z"))
  })
})
