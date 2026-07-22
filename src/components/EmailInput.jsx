import { MailIcon } from './icons.jsx'

function EmailInput({ id, value, onChange, autoComplete }) {
  return (
    <div className="relative mt-1">
      <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-warm-gray">
        <MailIcon className="h-4 w-4" />
      </span>
      <input
        id={id}
        type="email"
        autoComplete={autoComplete}
        required
        value={value}
        onChange={onChange}
        className="w-full rounded-lg border border-charcoal/15 bg-warm-white py-2.5 pl-10 pr-4 text-charcoal focus:border-forest focus:outline-none"
      />
    </div>
  )
}

export default EmailInput
