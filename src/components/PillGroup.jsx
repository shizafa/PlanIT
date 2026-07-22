function PillGroup({ options, value, onChange, multiple = false }) {
  function isActive(optionValue) {
    return multiple ? value.includes(optionValue) : value === optionValue
  }

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
            isActive(option.value)
              ? 'border-terracotta bg-terracotta text-warm-white'
              : 'border-charcoal/15 bg-warm-white text-charcoal hover:border-terracotta/50'
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}

export default PillGroup
