import { ProblemDetail } from "@/lib/types";

export const fastapiValidation: ProblemDetail = {
  id: "4",
  title: "Request Validation with Pydantic",
  slug: "4-fastapi-validation",
  tech: "FastAPI",
  difficulty: "Intermediate",

  problemStatement:
    "Validate incoming request data using Pydantic models in FastAPI.",

  detailedExplanation:
    `You must implement the following API:

POST /users  

Request body:
- name: string (min 3 chars)
- age: integer (18–60)

Invalid input must return HTTP 422.`,

  sampleTestCases: [
    { input: { age: 25, name: "John" }, expectedOutput: { status: 200 } },
    { input: { age: -1, name: "A" }, expectedOutput: { status: 422 } },
  ],

  hiddenTestCases: [
    { input: { age: "twenty" }, expectedOutput: { status: 422 } },
    { input: {}, expectedOutput: { status: 422 } },
    { input: { age: 150 }, expectedOutput: { status: 422 } },
  ],
};
