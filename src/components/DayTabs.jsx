import { motion } from 'framer-motion'

function DayTabs({ days, activeDay, onSelect, className = '' }) {
  return (
    <div className={`flex flex-wrap gap-3 ${className}`}>
      {days.map((day) => {
        const isActive = activeDay === day.day
        const dateLabel = day.date
          ? new Date(`${day.date}T00:00:00`).toLocaleDateString('en-US', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })
          : null

        return (
          <button
            key={day.day}
            type="button"
            onClick={() => onSelect(day.day)}
            className={`relative overflow-hidden rounded-2xl border px-5 py-3 text-left transition-colors ${
              isActive ? 'border-transparent' : 'border-warm-white/15 bg-warm-white/10 hover:border-warm-white/30'
            }`}
          >
            {isActive && (
              <motion.span
                layoutId="active-day-tab"
                className="absolute inset-0 bg-terracotta"
                transition={{ type: 'spring', stiffness: 400, damping: 32 }}
              />
            )}
            <span className="relative z-10 block">
              <p className={`font-display text-base font-semibold ${isActive ? 'text-warm-white' : 'text-warm-white/70'}`}>
                Day {String(day.day).padStart(2, '0')}
              </p>
              {dateLabel && (
                <p className={`mt-0.5 text-xs ${isActive ? 'text-warm-white/80' : 'text-warm-white/50'}`}>
                  {dateLabel}
                </p>
              )}
            </span>
          </button>
        )
      })}
    </div>
  )
}

export default DayTabs
