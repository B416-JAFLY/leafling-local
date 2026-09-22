import type StudyCard from "@/utils/db/dexie/tables/study-card"
import type StudyNote from "@/utils/db/dexie/tables/study-note"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/base-ui/button"
import { Input } from "@/components/ui/base-ui/input"
import {
  createStudyNote,
  deleteStudyNote,
  gradeStudyCard,
  listDueStudyCards,
  listStudyNotes,
  type StudyGrade,
} from "@/utils/study/local-study"
import { PageLayout } from "../../components/page-layout"

interface StudySnapshot {
  notes: StudyNote[]
  dueCards: StudyCard[]
}

async function readSnapshot(): Promise<StudySnapshot> {
  const [notes, dueCards] = await Promise.all([listStudyNotes(), listDueStudyCards()])
  return { notes, dueCards }
}

/** Notes and cards persist only in this browser's IndexedDB. */
export function LocalStudyPage() {
  const [snapshot, setSnapshot] = useState<StudySnapshot>({ notes: [], dueCards: [] })
  const [term, setTerm] = useState("")
  const [definition, setDefinition] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const refresh = async () => setSnapshot(await readSnapshot())

  useEffect(() => {
    let active = true
    void readSnapshot().then((nextSnapshot) => {
      if (active) {
        setSnapshot(nextSnapshot)
      }
    })
    return () => {
      active = false
    }
  }, [])

  const saveNote = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSaving(true)
    setError(null)
    try {
      await createStudyNote({ term, definition })
      setTerm("")
      setDefinition("")
      await refresh()
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not save the note")
    } finally {
      setIsSaving(false)
    }
  }
  const grade = async (id: string, value: StudyGrade) => {
    await gradeStudyCard(id, value)
    await refresh()
  }

  return (
    <PageLayout
      title="本地学习库"
      description="笔记和复习卡只保存在此浏览器；不需要登录，也不会同步到官方服务。"
      innerClassName="flex flex-col gap-10"
    >
      <section className="rounded-xl border border-border bg-card p-5 shadow-xs">
        <h2 className="text-base font-semibold">新建笔记与复习卡</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          每条笔记会同时创建一张卡片，并立刻进入待复习队列。
        </p>
        <form className="mt-4 grid gap-3" onSubmit={saveNote}>
          <Input
            value={term}
            onChange={(event) => setTerm(event.target.value)}
            placeholder="词语、短语或问题"
            aria-label="笔记正面"
          />
          <textarea
            value={definition}
            onChange={(event) => setDefinition(event.target.value)}
            placeholder="释义、翻译、例句或答案"
            aria-label="笔记背面"
            className="min-h-24 w-full rounded-md border border-input bg-transparent px-2.5 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
          />
          {error && <p className="text-sm text-destructive">{error}</p>}
          <div>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "保存中…" : "保存到本地"}
            </Button>
          </div>
        </form>
      </section>

      <section className="rounded-xl border border-border bg-card p-5 shadow-xs">
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="text-base font-semibold">待复习</h2>
          <span className="text-sm text-muted-foreground">{snapshot.dueCards.length} 张到期</span>
        </div>
        {snapshot.dueCards.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">现在没有到期卡片。</p>
        ) : (
          <div className="mt-4 flex flex-col gap-4">
            {snapshot.dueCards.map((card) => (
              <article key={card.id} className="rounded-lg border border-border p-4">
                <p className="font-medium">{card.front}</p>
                <p className="mt-2 text-sm whitespace-pre-wrap text-muted-foreground">
                  {card.back}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {(["again", "hard", "good", "easy"] as const).map((value) => (
                    <Button
                      key={value}
                      size="sm"
                      variant={value === "again" ? "outline" : "secondary"}
                      onClick={() => void grade(card.id, value)}
                    >
                      {{ again: "重来", hard: "困难", good: "良好", easy: "简单" }[value]}
                    </Button>
                  ))}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="rounded-xl border border-border bg-card p-5 shadow-xs">
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="text-base font-semibold">全部笔记</h2>
          <span className="text-sm text-muted-foreground">{snapshot.notes.length} 条</span>
        </div>
        {snapshot.notes.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">还没有本地笔记。</p>
        ) : (
          <ul className="mt-4 divide-y divide-border">
            {snapshot.notes.map((note) => (
              <li key={note.id} className="flex items-start justify-between gap-4 py-3">
                <div>
                  <p className="font-medium">{note.term}</p>
                  <p className="mt-1 text-sm whitespace-pre-wrap text-muted-foreground">
                    {note.definition}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => void deleteStudyNote(note.id).then(refresh)}
                >
                  删除
                </Button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </PageLayout>
  )
}
