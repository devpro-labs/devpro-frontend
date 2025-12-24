import { ProblemDetail } from "@/lib/types";

export const expressCrudApi: ProblemDetail = {
  id: "2",
  title: "CRUD API with Express",
  slug: "2-express-crud-api",
  tech: "Express.js",
  difficulty: "Beginner",

  problemStatement:
    "Create a RESTful CRUD API using Express.js to manage users.",

  detailedExplanation:
    `You must implement the following APIs:

POST /api/users  
GET /api/users  
GET /api/users/:id  
PUT /api/users/:id  
DELETE /api/users/:id  

Each user should contain: { id, name }.  
Use proper HTTP status codes for success and errors.`,

  sampleTestCases: [
    {
      input: { method: "POST", endpoint: "/api/users", body: { name: "John" } },
      expectedOutput: { status: 201 },
    },
    {
      input: { method: "GET", endpoint: "/api/users/1" },
      expectedOutput: { status: 200, name: "John" },
    },
  ],

  hiddenTestCases: [
    { input: { endpoint: "/api/users/999" }, expectedOutput: { status: 404 } },
    { input: { body: {} }, expectedOutput: { status: 400 } },
    { input: { method: "DELETE", endpoint: "/api/users/1" }, expectedOutput: { status: 200 } },
  ],
};
