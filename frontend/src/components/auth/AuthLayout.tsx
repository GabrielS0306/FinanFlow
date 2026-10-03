
import { Wallet } from 'lucide-react'
import type { ReactNode } from 'react'

interface AuthLayoutProps {
    children: ReactNode
    title: string
    subtitle: string
}

export default function AuthLayout({
    children,
    title,
    subtitle,
}: AuthLayoutProps) {
    return (
        <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
            <div className="w-full max-w-md">
                <div className="mb-8 flex items-center justify-center gap-2">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-700 text-white shadow-sm">
                        <Wallet size={23} />
                    </div>

                    <span className="text-2xl font-bold tracking-tight text-slate-900">
                        Finan<span className="text-teal-700">Flow</span>
                    </span>
                </div>

                <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-xl shadow-slate-200/50 sm:p-8">
                    <div className="mb-7 text-center">
                        <h1 className="text-2xl font-bold text-slate-900">
                            {title}
                        </h1>

                        <p className="mt-2 text-sm leading-relaxed text-slate-500">
                            {subtitle}
                        </p>
                    </div>

                    {children}
                </section>

                <p className="mt-6 text-center text-xs text-slate-400">
                    Organize suas finanças com mais clareza.
                </p>
            </div>
        </main>
    )
}