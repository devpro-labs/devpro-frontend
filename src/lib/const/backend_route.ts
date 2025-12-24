
export const API_URL = process.env.API_URL || "http://localhost:9000/api";

if (!API_URL) {
  throw new Error("API_URL is not defined in environment variables");
}

const backendRoute = {
  problems :{
    getAllProblems: `/problems`,
    getProblemById: (problemId: string) => `/problems/${problemId}`,
  },
  testcases : {
    getSampleTestcasesByProblemId: (problemId: string) => `/problems/test-cases/sample/${problemId}`,
  },
  code:{
    runCode: (id: string) => `/code-runner/run/${id}`,
    submitCode: (id: string) => `/code-runner/submit/${id}`,
  },
 
}

export default backendRoute;