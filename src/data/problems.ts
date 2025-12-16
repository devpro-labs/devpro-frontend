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
  acceptanceRate?: number
  totalSubmissions?: number
  likes?: number
  isPremium?: boolean
}

export const dummyProblems: Problem[] = [
  {
    id: "1",
    title: "Build REST API with JWT Authentication",
    slug: "1-rest-api-jwt-auth",
    difficulty: "Intermediate",
    category: "Authentication",
    tags: ["Express.js", "JWT", "API", "Security"],
    description: "Create a RESTful API with JWT-based authentication including login, register, and protected routes.",
    acceptanceRate: 68.5,
    totalSubmissions: 2847,
    likes: 432,
  },
  {
    id: "2",
    title: "Implement PostgreSQL Database Migrations",
    slug: "2-postgres-migrations",
    difficulty: "Beginner",
    category: "Database",
    tags: ["PostgreSQL", "SQL", "Migrations"],
    description: "Set up database migrations for a user management system with proper foreign key relationships.",
    acceptanceRate: 82.3,
    totalSubmissions: 1923,
    likes: 289,
  },
  {
    id: "3",
    title: "Build Real-time Chat with WebSockets",
    slug: "3-realtime-chat-websockets",
    difficulty: "Advanced",
    category: "WebSockets",
    tags: ["Socket.io", "Node.js", "Real-time"],
    description: "Create a real-time chat application with room support, typing indicators, and message history.",
    acceptanceRate: 45.2,
    totalSubmissions: 3421,
    likes: 687,
    isPremium: true,
  },
  {
    id: "4",
    title: "Implement OAuth 2.0 with Google",
    slug: "4-oauth-google-integration",
    difficulty: "Intermediate",
    category: "Authentication",
    tags: ["OAuth", "Google API", "Security"],
    description: "Integrate Google OAuth 2.0 authentication flow into an existing application.",
    acceptanceRate: 71.8,
    totalSubmissions: 2156,
    likes: 521,
  },
  {
    id: "5",
    title: "Create RESTful CRUD API",
    slug: "5-restful-crud-api",
    difficulty: "Beginner",
    category: "API Development",
    tags: ["REST", "CRUD", "Express.js"],
    description: "Build a complete CRUD API for a blog system with proper HTTP methods and status codes.",
    acceptanceRate: 89.4,
    totalSubmissions: 4521,
    likes: 892,
  },
  {
    id: "6",
    title: "Implement Redis Caching Layer",
    slug: "6-redis-caching",
    difficulty: "Intermediate",
    category: "Caching",
    tags: ["Redis", "Performance", "Caching"],
    description: "Add Redis caching to improve API response times and reduce database load.",
    acceptanceRate: 63.7,
    totalSubmissions: 1789,
    likes: 345,
  },
  {
    id: "7",
    title: "Build GraphQL API with Apollo Server",
    slug: "7-graphql-apollo-server",
    difficulty: "Advanced",
    category: "API Development",
    tags: ["GraphQL", "Apollo", "Node.js"],
    description: "Create a GraphQL API with queries, mutations, and subscriptions using Apollo Server.",
    acceptanceRate: 52.3,
    totalSubmissions: 2934,
    likes: 612,
  },
  {
    id: "8",
    title: "Implement Rate Limiting Middleware",
    slug: "8-rate-limiting-middleware",
    difficulty: "Beginner",
    category: "Security",
    tags: ["Express.js", "Middleware", "Security"],
    description: "Create rate limiting middleware to prevent API abuse and DDoS attacks.",
    acceptanceRate: 76.9,
    totalSubmissions: 1432,
    likes: 267,
  },
  {
    id: "9",
    title: "Deploy Node.js App to AWS",
    slug: "9-deploy-nodejs-aws",
    difficulty: "Expert",
    category: "Deployment",
    tags: ["AWS", "EC2", "DevOps", "Deployment"],
    description: "Deploy a Node.js application to AWS with proper CI/CD pipeline and monitoring.",
    acceptanceRate: 41.5,
    totalSubmissions: 2678,
    likes: 534,
    isPremium: true,
  },
  {
    id: "10",
    title: "Write Integration Tests with Jest",
    slug: "10-integration-tests-jest",
    difficulty: "Intermediate",
    category: "Testing",
    tags: ["Jest", "Testing", "TDD"],
    description: "Create comprehensive integration tests for an API using Jest and Supertest.",
    acceptanceRate: 69.2,
    totalSubmissions: 1876,
    likes: 398,
  },
  {
    id: "11",
    title: "Implement MongoDB Aggregation Pipeline",
    slug: "11-mongodb-aggregation",
    difficulty: "Intermediate",
    category: "Database",
    tags: ["MongoDB", "NoSQL", "Aggregation"],
    description: "Build complex data aggregation queries using MongoDB aggregation pipeline.",
    acceptanceRate: 58.4,
    totalSubmissions: 2145,
    likes: 421,
  },
  {
    id: "12",
    title: "Create Microservices with Docker",
    slug: "12-microservices-docker",
    difficulty: "Expert",
    category: "Architecture",
    tags: ["Docker", "Microservices", "Architecture"],
    description: "Design and implement a microservices architecture using Docker containers.",
    acceptanceRate: 38.7,
    totalSubmissions: 3234,
    likes: 745,
    isPremium: true,
  },
]
