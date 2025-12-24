import { Problem } from "@/lib/types";

export const dummyProblems: Problem[] = [
  {
    id: "1",
    title: "Build REST API with JWT Authentication (Express)",
    slug: "1-express-jwt-auth",
    difficulty: "Intermediate",
    category: "Authentication",
    tags: ["Express.js", "JWT", "REST API"],
    description:
      "Create a REST API using Express.js with JWT-based authentication including login, register, and protected routes.",
  },
  {
    id: "2",
    title: "CRUD REST API with Express.js",
    slug: "2-express-crud-api",
    difficulty: "Beginner",
    category: "API Development",
    tags: ["Express.js", "CRUD", "REST"],
    description:
      "Build a simple CRUD REST API using Express.js following RESTful conventions.",
  },
  {
    id: "3",
    title: "Build REST API using FastAPI",
    slug: "3-fastapi-rest-api",
    difficulty: "Beginner",
    category: "API Development",
    tags: ["FastAPI", "Python", "REST"],
    description:
      "Create a REST API using FastAPI with proper request and response models.",
  },
  {
    id: "4",
    title: "Request Validation with Pydantic (FastAPI)",
    slug: "4-fastapi-validation",
    difficulty: "Intermediate",
    category: "Backend Fundamentals",
    tags: ["FastAPI", "Pydantic", "Validation"],
    description:
      "Use Pydantic models to validate request data in FastAPI applications.",
  },

  {
    id: "5",
    title: "Spring Boot REST API",
    slug: "5-springboot-rest-api",
    difficulty: "Beginner",
    category: "API Development",
    tags: ["Spring Boot", "REST"],
    description:
      "Create REST endpoints using Spring Boot controllers.",
  },
  {
    id: "6",
    title: "Spring Boot JWT Authentication",
    slug: "6-springboot-jwt-auth",
    difficulty: "Advanced",
    category: "Authentication",
    tags: ["Spring Boot", "JWT", "Spring Security"],
    description:
      "Secure REST APIs using JWT and Spring Security.",
  },
];
