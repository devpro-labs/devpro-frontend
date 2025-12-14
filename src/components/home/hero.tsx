"use client"

import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import Link from "next/link"
import { Terminal, Play, Bug, Code } from "lucide-react"
import HeroBG from "./hero-bg"

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border/40">
      <HeroBG />
      {/* Grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f0f0f_1px,transparent_1px),linear-gradient(to_bottom,#0f0f0f_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />

      <div className="container relative mx-auto px-4 py-24 ">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-4xl text-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm text-primary"
          >
            <Terminal className="h-4 w-4" />
            <span>Production-Ready Challenges</span>
          </motion.div>

          <h1 className="mb-6 text-5xl font-bold tracking-tight text-balance sm:text-6xl lg:text-7xl">
            <div>
              Code. Run. Debug.{" "}
            </div>
            <span className="bg-gradient-to-r from-primary via-cyan-400 to-primary bg-clip-text text-transparent">
              Solve real dev challenges
            </span>
          </h1>

          <div className="p-4 bg-black/20 rounded-md text-xl">
            Become a Pro Developer
          </div>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" className="group" asChild>
              <Link href="/signup">
                Start Coding
                <Play className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="#features">Explore Challenges</Link>
            </Button>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="mt-16 grid grid-cols-3 gap-4 sm:gap-8"
          >
            {[
              { icon: Code, label: "Real-world APIs", color: "text-primary" },
              { icon: Bug, label: "Solve Bugs", color: "text-cyan-400" },
              { icon: Terminal, label: "Multiple Frameworks", color: "text-primary" },
            ].map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="flex flex-col items-center gap-2"
              >
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-lg border border-border bg-card ${item.color}`}
                >
                  <item.icon className="h-6 w-6" />
                </div>
                <p className="text-sm text-muted-foreground">{item.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
