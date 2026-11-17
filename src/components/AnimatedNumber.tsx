import { useEffect } from 'react'
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from 'motion/react'

interface AnimatedNumberProps {
  value: number
  format?: (value: number) => string
}

// Counts up from the current number to the new value
export default function AnimatedNumber({
  value,
  format = (n) => String(Math.round(n)),
}: AnimatedNumberProps) {
  const reduceMotion = useReducedMotion()
  const count = useMotionValue(reduceMotion ? value : 0)
  const text = useTransform(count, (latest) => format(latest))

  useEffect(() => {
    if (reduceMotion) {
      count.set(value)
      return
    }
    const controls = animate(count, value, { duration: 0.9, ease: 'easeOut' })
    return () => controls.stop()
  }, [count, value, reduceMotion])

  return <motion.span>{text}</motion.span>
}
