"use client"

import { createContext, useContext, ReactNode } from "react"

// Types based on API response
export interface Problem {
  id: string
  title: string
  description: string
  difficulty: string
  tags: string[]
  entryFile: string
  services: string[]
  composeFile: Record<string, string>
  keys: Record<string, string | number>
  timeLimitSeconds: number
  memoryLimitMB: number
  cpuLimit: number
  isActive: boolean
  createdAt: string
}

export interface TestCase {
  id: string
  problemId: string
  inputJson: Record<string, any>
  expectedOutputJson: Record<string, any>
  sizeKb: number
  expectedStatus: number
  isHidden: boolean
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH"
  endpoint: string
}

interface ProblemContextType {
  problem: Problem | null
  testCases: TestCase[]
  services: string[]
  keys: Record<string, string | number>
}

const ProblemContext = createContext<ProblemContextType | null>(null)

interface ProblemProviderProps {
  children: ReactNode
  problem: Problem | null
  testCases: TestCase[]
}

export const ProblemProvider = ({
  children,
  problem,
  testCases,
}: ProblemProviderProps) => {
  const services = problem?.services ?? []
  const keys = problem?.keys ?? {}

  return (
    <ProblemContext.Provider
      value={{
        problem,
        testCases,
        services,
        keys,
      }}
    >
      {children}
    </ProblemContext.Provider>
  )
}

export const useProblem = () => {
  const context = useContext(ProblemContext)
  if (!context) {
    throw new Error("useProblem must be used within a ProblemProvider")
  }
  return context
}

// Safe hook for optional usage (returns defaults if no provider)
export const useProblemSafe = () => {
  const context = useContext(ProblemContext)
  return context ?? {
    problem: null,
    testCases: [],
    services: [],
    keys: {},
  }
}
