import { UserExits } from "@/components/signin/type";

export const API_URL = process.env.API_URL || "http://localhost:9000/api";
export const WS_URL = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8083";

if (!API_URL) {
  throw new Error("API_URL is not defined in environment variables");
}

const backendRoute = {
  user: {
    checkUserInDB: `/user/login`
  },
  problems: {
    getAllProblems: `/problems`,
    getProblemById: (problemId: string) => `/problems/${problemId}`,
  },
  testcases: {
    getSampleTestcasesByProblemId: (problemId: string) => `/problems/test-cases/sample/${problemId}`,
  },
  code: {
    runCode: (id: string) => `/code-runner/run/${id}`,
    submitCode: (id: string) => `/code-runner/submit/${id}`,
  },
  ws: {
    execution: (executionId: string) => `/ws/execution/${executionId}`,
  },
}

export default backendRoute;