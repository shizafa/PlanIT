import { AnimatePresence, motion } from 'framer-motion'
import AILoadingMessage from './AILoadingMessage.jsx'

const SWAP_MESSAGES = ['Looking for better options…', 'Comparing alternatives…', 'Almost there…']

function TimelineItem({ activity, index, isLast, expanded, onToggle, alternatives, loading, error, onSelectAlternative }) {
  return (
    <div className="relative pl-12">
      {!isLast && <span className="absolute left-[19px] top-10 bottom-0 w-px bg-warm-white/15" />}

      <motion.button
        type="button"
        onClick={onToggle}
        whileTap={{ scale: 0.9 }}
        className={`absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-semibold transition-colors ${
          expanded ? 'border-terracotta bg-terracotta text-warm-white' : 'border-warm-white/30 bg-charcoal text-warm-white'
        }`}
      >
        {index + 1}
      </motion.button>

      <motion.div
        initial={{ opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.06, duration: 0.3 }}
        className="pb-8"
      >
        <button type="button" onClick={onToggle} className="block w-full text-left">
          <motion.div
            whileHover={{ y: -2 }}
            className={`flex items-start justify-between gap-4 rounded-xl border p-4 transition-colors ${
              expanded ? 'border-terracotta/50 bg-warm-white/10' : 'border-warm-white/10 bg-warm-white/5 hover:bg-warm-white/10'
            }`}
          >
            <div>
              <p className="text-sm font-medium text-warm-white/60">{activity.time}</p>
              <p className="mt-0.5 text-warm-white">{activity.title}</p>
              {activity.description && (
                <p className="mt-1 text-sm text-warm-white/60">{activity.description}</p>
              )}
            </div>
            <span className="shrink-0 rounded-full bg-sand/20 px-3 py-1 text-xs font-semibold text-sand">
              {activity.estimatedCost}
            </span>
          </motion.div>
        </button>

        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.28, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="mt-3 space-y-2 rounded-xl border border-warm-white/10 bg-warm-white/5 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-warm-white/50">
                  Swap for
                </p>

                {loading && <AILoadingMessage messages={SWAP_MESSAGES} interval={1400} className="py-1" />}
                {error && <p className="text-sm text-terracotta">{error}</p>}

                {!loading &&
                  !error &&
                  alternatives.map((alt) => (
                    <motion.button
                      key={alt.title}
                      type="button"
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => onSelectAlternative(alt)}
                      className="w-full rounded-lg border border-warm-white/10 bg-warm-white/5 p-3 text-left transition-colors hover:border-terracotta/50"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-medium text-warm-white">{alt.title}</p>
                        <span className="shrink-0 rounded-full bg-sand/20 px-2.5 py-0.5 text-xs font-semibold text-sand">
                          {alt.estimatedCost}
                        </span>
                      </div>
                      {alt.description && (
                        <p className="mt-1 text-xs text-warm-white/60">{alt.description}</p>
                      )}
                    </motion.button>
                  ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

export default TimelineItem
