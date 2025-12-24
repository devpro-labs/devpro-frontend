import { ProblemDetail } from "@/lib/types";

export const springbootJwtAuth: ProblemDetail = {
  id: "6",
  title: "JWT Authentication in Spring Boot",
  slug: "6-springboot-jwt-auth",
  tech: "Spring Boot",
  difficulty: "Advanced",

  problemStatement:
    "Secure Spring Boot REST APIs using JWT authentication.",

  detailedExplanation:
    `You must implement the following APIs:

POST /api/auth/login  
- Request body: { username, password }
- Response: { token }

GET /api/secure/data  
- Header: Authorization: Bearer <jwt_token>
- Response: { data }

Unauthenticated requests must return 401.`,

  sampleTestCases: [
    { input: { token: "valid-jwt" }, expectedOutput: { status: 200 } },
    { input: { token: null }, expectedOutput: { status: 401 } },
  ],

  hiddenTestCases: [
    { input: { token: "expired" }, expectedOutput: { status: 401 } },
    { input: { token: "invalid" }, expectedOutput: { status: 401 } },
    { input: {}, expectedOutput: { status: 403 } },
  ],
};
