import { ProblemDetail } from "@/lib/types";

export const expressJwtAuth: ProblemDetail = {
  id: "1",
  title: "JWT Authentication API",
  slug: "1-express-jwt-auth",
  tech: "Express.js",
  difficulty: "Intermediate",

  problemStatement:
    "Build an Express.js REST API that provides user authentication using JWT tokens.",

  detailedExplanation:
    `You must implement the following APIs:

POST /api/auth/register  
- Request body: { email, password }  
- Response: { message }

POST /api/auth/login  
- Request body: { email, password }  
- Response: { token }

GET /api/protected/profile  
- Header: Authorization: Bearer <jwt_token>  
- Response: { email }

The protected route must only be accessible with a valid JWT token.`,

  sampleTestCases: [
    {
      input: { endpoint: "/api/auth/login", body: { email: "test@mail.com", password: "1234" } },
      expectedOutput: { status: 200, token: "jwt-token" },
    },
    {
      input: { endpoint: "/api/protected/profile", headers: { Authorization: "Bearer jwt-token" } },
      expectedOutput: { status: 200 },
    },
  ],

  hiddenTestCases: [
    { input: { token: "expired-token" }, expectedOutput: { status: 401 } },
    { input: { token: "invalid-token" }, expectedOutput: { status: 401 } },
    { input: { body: {} }, expectedOutput: { status: 400 } },
  ],
};
