import { motion } from 'motion/react'
import React from 'react'

const HeadingPanal = (
  {
    title
  }: {
    title: string
  }
) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-3xl font-bold mb-6">
        {title}
      </h1>
    </motion.div>
  )
}

export default HeadingPanal