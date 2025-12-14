"use client"

import { motion } from "framer-motion"

const frameworks = [
  { name: "Express.js", category: "Node.js" },
  { name: "Spring Boot", category: "Java" },
  { name: "FastAPI", category: "Python" },
]

export function Frameworks() {
  return (
    <section id="frameworks" className="min-h-screen min-w-full border-b border-border/40 py-16 sm:py-24">
      <div className="container flex justify-center items-center flex-col my-auto mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <p className="text-sm text-muted-foreground uppercase tracking-wider mb-4">
            Master real-world problems across
          </p>
          <h2 className="text-3xl font-bold">Popular Frameworks & Libraries</h2>
        </motion.div>

        <div className="flex justify-center items-center gap-4 flex-wrap">
          {frameworks.map((framework, index) => (
            <motion.div
              key={framework.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="flex flex-col items-center justify-center gap-2 rounded-lg border border-border bg-card p-6 hover:border-primary/50 transition-all w-50"
            >
              <div className="text-2xl font-mono font-bold text-primary">
                {framework.name.slice(0, 2).toUpperCase()}
              </div>
              <h3 className="font-semibold text-sm">{framework.name}</h3>
              <p className="text-xs text-muted-foreground">{framework.category}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
