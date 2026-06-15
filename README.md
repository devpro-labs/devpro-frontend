# DevPro Frontend

The main client application for the DevPro platform, providing an immersive and interactive online coding experience.

## Tech Stack
- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **UI & Styling:** Tailwind CSS v4, Radix UI, Framer Motion
- **Code Editor:** Monaco Editor (`@monaco-editor/react`)
- **State Management:** Zustand, TanStack React Query
- **Authentication:** Clerk

## Features
- **Interactive Code Editor:** Embedded Monaco editor with syntax highlighting, autocomplete, and multiple language/framework support.
- **Problem Dashboard:** Browse, filter, and search through coding challenges.
- **User Profiles:** View coding stats, heatmaps, badges, and streaks.
- **Real-time Execution:** Submit code and view real-time execution results, test case outputs, and performance metrics.

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   # or
   bun install
   ```

2. Set up environment variables for Clerk Auth and API endpoints in `.env`.

3. Run the development server:
   ```bash
   npm run dev
   # or
   bun dev
   ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.
