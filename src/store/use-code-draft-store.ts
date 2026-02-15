import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { FileItem } from "@/components/problems/right-panal/file-explorer"

interface CodeDraft {
  fileTree: FileItem[]
  selectedFileId: string | null
  openTabs: string[]
  code: string
  timestamp: number
}

interface CodeDraftStore {
  drafts: Record<string, CodeDraft>

  // Save draft with key format: {problemId}:{framework}
  saveDraft: (
    problemId: string,
    framework: string,
    draft: Omit<CodeDraft, "timestamp">
  ) => void

  // Get draft by problemId and framework
  getDraft: (problemId: string, framework: string) => CodeDraft | null

  // Delete draft
  deleteDraft: (problemId: string, framework: string) => void

  // Clear all drafts
  clearAllDrafts: () => void
}

export const useCodeDraftStore = create<CodeDraftStore>()(
  persist(
    (set, get) => ({
      drafts: {},

      saveDraft: (problemId, framework, draft) => {
        const key = `${problemId}:${framework}`
        set((state) => ({
          drafts: {
            ...state.drafts,
            [key]: {
              ...draft,
              timestamp: Date.now(),
            },
          },
        }))
      },

      getDraft: (problemId, framework) => {
        const key = `${problemId}:${framework}`
        return get().drafts[key] ?? null
      },

      deleteDraft: (problemId, framework) => {
        const key = `${problemId}:${framework}`
        set((state) => {
          const { [key]: _, ...rest } = state.drafts
          return { drafts: rest }
        })
      },

      clearAllDrafts: () => {
        set({ drafts: {} })
      },
    }),
    {
      name: "devpro-code-drafts",
    }
  )
)
