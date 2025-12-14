import { motion, type Transition } from 'motion/react'
import * as CheckboxPrimitive from '@radix-ui/react-checkbox'

const getPathAnimate = (isChecked: boolean) => ({
  pathLength: isChecked ? 1 : 0,
  opacity: isChecked ? 1 : 0,
})

const getPathTransition = (isChecked: boolean): Transition => ({
  pathLength: { duration: 0.8, ease: 'easeInOut' },
  opacity: {
    duration: 0.01,
    delay: isChecked ? 0 : 0.8,
  },
})

export function CheckEffected({
  isSolved,
  id,
}: {
  isSolved: boolean
  id: string
}) {
  return (
    <div className="relative flex items-center">
      {/* Checkbox */}
      <CheckboxPrimitive.Root
        checked={isSolved}
        disabled
        id={id}
        className="h-4 w-4 rounded border border-zinc-500 flex items-center justify-center"
      >
        <CheckboxPrimitive.Indicator className="text-green-500">
          ●
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>

      {/* Animated Path */}
      <motion.svg
        width="260"
        height="32"
        viewBox="0 0 260 32"
        className="absolute left-6 top-1/2 -translate-y-1/2 pointer-events-none z-10"
      >
        <motion.path
          d="M 5 16 s 50 -10 70 -10 c 18 0 -30 12 -20 20 c 10 7 80 -25 90 -15 c 7 8 -15 18 5 20 c 20 2 60 -15 60 -15"
          vectorEffect="non-scaling-stroke"
          strokeWidth={2}
          strokeLinecap="round"
          fill="none"
          initial={false}
          animate={getPathAnimate(isSolved)}
          transition={getPathTransition(isSolved)}
          className="stroke-neutral-900 dark:stroke-neutral-100"
        />
      </motion.svg>
    </div>
  )
}
