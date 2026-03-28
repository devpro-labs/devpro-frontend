'use client'

import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'

import { CheckEffected } from './checke-effected'

export interface Problem {
  id: string
  title: string
  difficulty: string
  tags: string[]
  description: string
  services?: string[]
  isPremium?: boolean
}

export interface ProblemListItem {
  problem: Problem
  isSolved: boolean
}

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty.toLowerCase()) {
    case 'casual':
    case 'beginner':
      return 'text-green-400'
    case 'pro':
      return 'text-yellow-400'
    case 'engineer':
      return 'text-orange-400'
    case 'pro_max':
      return 'text-red-500'
    default:
      return 'text-zinc-300'
  }
}


export default function Problems({ data }: { data: ProblemListItem[] }) {
  const normalizedProblems = useMemo(() => {
    return data.map(item => ({
      ...item.problem,
      isSolved: item.isSolved,
    }))
  }, [data])

  const [search, setSearch] = useState('')
  const [service, setService] = useState('all')
  const [difficulty, setDifficulty] = useState('all')
  const [tag, setTag] = useState('all')


  const services = useMemo(() => {
    return [
      'all',
      ...Array.from(
        new Set(
          normalizedProblems.flatMap(problem => problem.services ?? [])
        )
      ),
    ]
  }, [normalizedProblems])

  const difficulties = useMemo(() => {
    return ['all', ...Array.from(new Set(normalizedProblems.map(p => p.difficulty)))]
  }, [normalizedProblems])

  const tags = useMemo(() => {
    return ['all', ...Array.from(new Set(normalizedProblems.flatMap(p => p.tags)))]
  }, [normalizedProblems])

  const filteredProblems = useMemo(() => {
    return normalizedProblems.filter(p => {
      const matchSearch = p.title
        .toLowerCase()
        .includes(search.toLowerCase())

      const matchService =
        service === 'all' || (p.services ?? []).includes(service)

      const matchDifficulty =
        difficulty === 'all' || p.difficulty === difficulty

      const matchTag =
        tag === 'all' || p.tags.includes(tag)

      return matchSearch && matchService && matchDifficulty && matchTag
    })
  }, [normalizedProblems, search, service, difficulty, tag])


  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* HEADER */}
      <h1 className="text-3xl font-bold mb-6">Problems</h1>

      {/* FILTERS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {/* Search */}
        <input
          type="text"
          placeholder="Search problems..."
          className="px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-700 outline-none"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />

        {/* Service */}
        <Select value={service} onValueChange={setService}>
          <SelectTrigger>
            <SelectValue placeholder="Service" />
          </SelectTrigger>
          <SelectContent>
            {services.map((serviceName, idx) => (
              <SelectItem key={idx} value={serviceName}>
                {serviceName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Difficulty */}
        <Select
          value={difficulty}
          onValueChange={setDifficulty}
        >
          <SelectTrigger>
            <SelectValue placeholder="Difficulty" />
          </SelectTrigger>
          <SelectContent>
            {difficulties.map((difficultyValue, idx) => (
              <SelectItem key={idx} value={difficultyValue}>
                {difficultyValue}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Tags */}
        <Select value={tag} onValueChange={setTag}>
          <SelectTrigger>
            <SelectValue placeholder="Tag" />
          </SelectTrigger>
          <SelectContent>
            {tags.map((t, idx) => (
              <SelectItem key={idx} value={t}>
                {t}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        {filteredProblems.length === 0 && (
          <div className="text-zinc-500 text-center py-10">
            No problems found
          </div>
        )}

        {filteredProblems.map((p, index) => {
          return (
            <Link
              key={p.id}
              href={`/problems/${p.id}`}
              className="block"
            >
              <motion.div
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="flex items-center justify-between gap-4 p-4 rounded-2xl
                  bg-zinc-900 border border-zinc-800
                  hover:border-zinc-600 transition-colors"
              >
                {/* LEFT */}
                <div className="flex items-center gap-4 min-w-0">
                  <span className="text-zinc-500 w-6 text-right shrink-0">
                    {index + 1}.
                  </span>

                  <CheckEffected
                    isSolved={p.isSolved}
                    id={`problem-${p.id}`}
                  />

                  <h2 className="font-medium truncate">
                    {p.title}
                  </h2>
                </div>

                {/* RIGHT */}
                <div className="flex items-center gap-3 shrink-0">
                  <span
                    className={`text-sm font-medium ${getDifficultyColor(p.difficulty)}`}
                  >
                    {p.difficulty}
                  </span>

                  {p.isPremium && (
                    <span className="text-xs px-2 py-1 rounded-full
                      bg-yellow-500/20 text-yellow-400">
                      Premium
                    </span>
                  )}
                </div>
              </motion.div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
