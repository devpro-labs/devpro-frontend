export interface TestCase {
  inputJson: any
  expectedOutputJson: any
  endpoint: string
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH"
  expectedStatus: number
}

export interface ProblemDetail {
  id: string
  title: string
  slug: string
  tech: "Express.js" | "FastAPI" | "Spring Boot"
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  problemStatement: string
  detailedExplanation: string
  sampleTestCases: TestCase[]
  hiddenTestCases: TestCase[]
}


export type Difficulty =
  | "Beginner"
  | "Intermediate"
  | "Advanced"
  | "Expert"

export interface Problem {
  id: string
  title: string
  slug: string
  difficulty: Difficulty
  category: string
  tags: string[]
  description: string
}

export type SubmissionStatus =
  | "PENDING"
  | "RUNNING"
  | "ACCEPTED"
  | "WRONG_ANSWER"
  | "TIME_LIMIT_EXCEEDED"
  | "MEMORY_LIMIT_EXCEEDED"
  | "RUNTIME_ERROR"
  | "COMPILATION_ERROR"

export interface Submission {
  id: string
  problemId: string
  userId: string
  framework: string
  testcasesPassed: number
  totalTestcases: number
  status: SubmissionStatus
  executionTimeMs: number | null
  memoryUsedMB: number | null
  submittedAt: string
}

export interface SubmissionApiResponse {
  DATA: {
    submission: Submission[]
  }
  MESSAGE: string
  STATUS: number
  ERROR: string | null
}