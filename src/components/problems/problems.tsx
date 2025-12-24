'use client'

import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'

export interface Problem {
  id: string
  title: string
  slug: string
  difficulty: 'easy' | 'medium' | 'hard'
  category: string
  tags: string[]
  description: string
  isPremium?: boolean
}

import {  dummyProblems } from '@/data/problems'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { CheckEffected } from './checke-effected'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Difficulty } from '@/lib/types'


const difficultyColors: Record<Difficulty, string> = {
  Beginner: 'text-green-400',
  Intermediate: 'text-yellow-400',
  Advanced: 'text-orange-400',
  Expert: 'text-red-500',
}


export default function Problems() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [difficulty, setDifficulty] = useState<'all' | Difficulty>('all')
  const [tag, setTag] = useState('all')
  const solvedIds:any[] = []
  const router = useRouter();

  const categories = useMemo(
    () => ['all', ...new Set(dummyProblems.map(p => p.category))],
    []
  )

  const tags = useMemo(
    () => ['all', ...new Set(dummyProblems.flatMap(p => p.tags))],
    []
  )

  const filteredProblems = useMemo(() => {
    return dummyProblems.filter(p => {
      const matchSearch =
        p.title.toLowerCase().includes(search.toLowerCase())

      const matchCategory =
        category === 'all' || p.category === category

      const matchDifficulty =
        difficulty === 'all' || p.difficulty === difficulty

      const matchTag =
        tag === 'all' || p.tags.includes(tag)

      return matchSearch && matchCategory && matchDifficulty && matchTag
    })
  }, [search, category, difficulty, tag])

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

        {/* Category */}
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Category" />
          </SelectTrigger>

          <SelectContent>
            {categories.map(c => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>


        {/* Difficulty */}
        <Select value={difficulty} onValueChange={(value) => setDifficulty(value as 'all' | Difficulty)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Difficulty" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">All Difficulty</SelectItem>
            <SelectItem value="Beginner">Beginner</SelectItem>
            <SelectItem value="Intermediate">Intermediate</SelectItem>
            <SelectItem value="Advanced">Advanced</SelectItem>
            <SelectItem value="Expert">Expert</SelectItem>
          </SelectContent>
        </Select>



        {/* Tags */}
        <Select value={tag} onValueChange={setTag}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Tag" />
          </SelectTrigger>

          <SelectContent>
            {tags.map(t => (
              <SelectItem key={t} value={t}>
                {t}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

      </div>

      {/* PROBLEMS LIST */}
      <div className="space-y-2">
        {filteredProblems.map((p, index) => {
          const isSolved = solvedIds.includes(p.id)

          return (
            <Link
              key={p.id}
              href={`/problems/${p.slug}`}
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
                  {/* Number */}
                  <span className="text-zinc-500 w-6 text-right shrink-0">
                    {index + 1}.
                  </span>

                  {/* Solved animation */}
                  <CheckEffected
                    isSolved={isSolved}
                    id={`problem-${p.id}`}
                  />

                  {/* Title */}
                  <h2 className="font-medium truncate">
                    {p.title}
                  </h2>
                </div>

                {/* RIGHT */}
                <div className="flex items-center gap-3 shrink-0">
                  <span
                    className={`text-sm font-medium ${difficultyColors[p.difficulty]}`}
                  >
                    {p.difficulty}
                  </span>



                  {/* {p.isPremium && (
                    <span className="text-xs px-2 py-1 rounded-full
                               bg-yellow-500/20 text-yellow-400">
                      Premium
                    </span>
                  )} */}
                </div>
              </motion.div>
            </Link>
          )
        })}
      </div>

    </div>
  )
}
