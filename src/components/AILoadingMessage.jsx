import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

const DEFAULT_MESSAGES = [
  'Understanding your travel style…',
  'Finding the perfect destination…',
  'Optimizing your budget…',
  'Discovering hidden gems…',
  'Designing your journey…',
]

function AILoadingMessage({ messages = DEFAULT_MESSAGES, interval = 2000, className = '' }) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    setIndex(0)
    const timer = setInterval(() => {
      setIndex((current) => (current + 1) % messages.length)
    }, interval)
    return () => clearInterval(timer)
  }, [messages, interval])

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="flex gap-1">
        {[0, 1, 2].map((dot) => (
          <motion.span
            key={dot}
            className="h-1.5 w-1.5 rounded-full bg-terracotta"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.1, repeat: Infinity, delay: dot * 0.18, ease: 'easeInOut' }}
          />
        ))}
      </span>
      <div className="relative h-5 flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.p
            key={index}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="absolute inset-x-0"
          >
            {messages[index]}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  )
}

export default AILoadingMessage
