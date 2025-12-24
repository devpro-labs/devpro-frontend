import { ProblemDetail } from "@/lib/types";

export const springbootRestApi: ProblemDetail = {
  id: "5",
  title: "Spring Boot REST API",
  slug: "5-springboot-rest-api",
  tech: "Spring Boot",
  difficulty: "Beginner",

  problemStatement:
    "Create basic REST APIs using Spring Boot.",

  detailedExplanation:
    `You must implement the following APIs:

GET /api/hello  
- Response: { message }

POST /api/echo  
- Request body: { message }
- Response: { message }`,

  sampleTestCases: [
    {
      input: { endpoint: "/api/hello" },
      expectedOutput: { status: 200 },
    },
    {
      input: { endpoint: "/api/echo", method: "POST", body: { message: "Hi" } },
      expectedOutput: { status: 200 },
    },
  ],

  hiddenTestCases: [
    { input: { endpoint: "/api/unknown" }, expectedOutput: { status: 404 } },
    { input: {}, expectedOutput: { status: 400 } },
    { input: { method: "PUT" }, expectedOutput: { status: 405 } },
  ],
};
