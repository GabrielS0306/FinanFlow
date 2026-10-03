
import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

interface PasswordInputProps {
    id: string
    label: string
    value: string
    onChange: (value: string) => void
    autoComplete?: string
}

export default function PasswordInput({
    id,
    label,
    value,
    onChange,
    autoComplete,
}: PasswordInputProps) {
    const [visible, setVisible] = useState(false)

    return (
        <div className="space-y-2">
            <label
                htmlFor={id}
                className="block text-sm font-medium text-slate-700"
            >
                {label}
            </label>

            <div className="relative">
                <input
                    id={id}
                    type={visible ? 'text' : 'password'}
                    value={value}
                    onChange={(event) => onChange(event.target.value)}
                    autoComplete={autoComplete}
                    required
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 pr-12 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-teal-600 focus:ring-4 focus:ring-teal-600/10"
                />

                <button
                    type="button"
                    onClick={() => setVisible((current) => !current)}
                    aria-label={visible ? 'Ocultar senha' : 'Mostrar senha'}
                    className="absolute inset-y-0 right-0 flex items-center px-4 text-slate-400 transition hover:text-teal-700"
                >
                    {visible ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
            </div>
        </div>
    )
}