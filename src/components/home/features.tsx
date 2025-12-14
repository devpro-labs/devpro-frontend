"use client"

import { motion } from "framer-motion"
import { Database, Lock, Zap, GitBranch, Cloud, FileCode } from "lucide-react"

const features = [
  {
    icon: Database,
    title: "Database Design",
    description: "Master SQL, NoSQL, and modern database architectures with real-world scenarios.",
  },
  {
    icon: Lock,
    title: "Authentication",
    description: "Build secure auth systems with OAuth, JWT, and session management.",
  },
  {
    icon: Zap,
    title: "API Integration",
    description: "Connect to REST, GraphQL, and WebSocket APIs like a senior developer.",
  },
  {
    icon: GitBranch,
    title: "Version Control",
    description: "Practice Git workflows, branching strategies, and collaborative coding.",
  },
  {
    icon: Cloud,
    title: "Deployment",
    description: "Learn CI/CD, containerization, and cloud deployment strategies.",
  },
  {
    icon: FileCode,
    title: "Code Review",
    description: "Get AI-powered feedback and learn from best practices in the industry.",
  },
]

export function Features() {
  return (
    <section id="features" className="border-b border-border/40 py-16 sm:py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-4">Real-World Development Skills</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Move beyond algorithm puzzles. Practice the skills you actually need in production.
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="group relative overflow-hidden rounded-lg border border-border bg-card p-6 hover:border-primary/50 transition-all"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
