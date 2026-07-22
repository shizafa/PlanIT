import { useState } from 'react'
import { LockIcon, EyeIcon, EyeOffIcon } from './icons.jsx'

function PasswordInput({ id, value, onChange, autoComplete, minLength }) {
  const [visible, setVisible] = useState(false)

  return (
    <div className="relative mt-1">
      <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-warm-gray">
        <LockIcon className="h-4 w-4" />
      </span>
      <input
        id={id}
        type={visible ? 'text' : 'password'}
        autoComplete={autoComplete}
        required
        minLength={minLength}
        value={value}
        onChange={onChange}
        className="w-full rounded-lg border border-charcoal/15 bg-warm-white py-2.5 pl-10 pr-11 text-charcoal focus:border-forest focus:outline-none"
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        className="absolute inset-y-0 right-0 flex items-center pr-3 text-warm-gray hover:text-charcoal"
        aria-label={visible ? 'Hide password' : 'Show password'}
      >
        {visible ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
      </button>
    </div>
  )
}

export default PasswordInput
