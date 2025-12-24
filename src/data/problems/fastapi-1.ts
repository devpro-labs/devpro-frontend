import { ProblemDetail } from "@/lib/types";

export const fastapiRestApi: ProblemDetail = {
  id: "3",
  title: "FastAPI REST API",
  slug: "3-fastapi-rest-api",
  tech: "FastAPI",
  difficulty: "Beginner",

  problemStatement:
    "Create a REST API using FastAPI to manage items.",

  detailedExplanation:
    `You must implement the following APIs:

GET /items  
POST /items  

POST request body: { name }  
Response should return created item with an ID.`,

  sampleTestCases: [
    {
      input: { endpoint: "/items", method: "GET" },
      expectedOutput: { status: 200 },
    },
    {
      input: { endpoint: "/items", method: "POST", body: { name: "Book" } },
      expectedOutput: { status: 201 },
    },
  ],

  hiddenTestCases: [
    { input: { body: null }, expectedOutput: { status: 422 } },
    { input: { name: "" }, expectedOutput: { status: 422 } },
    { input: { method: "DELETE" }, expectedOutput: { status: 405 } },
  ],
};
