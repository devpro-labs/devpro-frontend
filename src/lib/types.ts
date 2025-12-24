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