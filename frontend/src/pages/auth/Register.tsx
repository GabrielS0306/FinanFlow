
import { useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { ArrowRight, LoaderCircle } from 'lucide-react'
import AuthLayout from '../../components/auth/AuthLayout'
import PasswordInput from '../../components/auth/PasswordInput'
import { useAuth } from '../../contexts/AuthContext'
import { authService } from '../../services/authService'

export default function Register() {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const { isAuthenticated } = useAuth()
    const navigate = useNavigate()

    if (isAuthenticated) {
        return <Navigate to="/dashboard" replace />
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setError('')

        if (password !== confirmPassword) {
            setError('As senhas não coincidem.')
            return
        }

        if (password.length < 8) {
            setError('A senha deve ter pelo menos 8 caracteres.')
            return
        }

        setLoading(true)

        try {
            await authService.register({
                name: name.trim(),
                email: email.trim(),
                password,
            })

        navigate('/login', {
            replace: true,
            state: { registered: true },
        })
        } catch (err) {
            setError(
                err instanceof Error
                ? err.message
                : 'Não foi possível criar a conta. Tente novamente.',
            )
        } finally {
            setLoading(false)
        }
    }

    return (
        <AuthLayout
            title="Crie sua conta"
            subtitle="Comece a organizar suas finanças pessoais."
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                    <label
                        htmlFor="name"
                        className="block text-sm font-medium text-slate-700"
                    >
                        Nome completo
                    </label>

                    <input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        placeholder="Seu nome"
                        autoComplete="name"
                        minLength={2}
                        maxLength={100}
                        required
                        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-teal-600 focus:ring-4 focus:ring-teal-600/10"
                    />
                </div>

                <div className="space-y-2">
                    <label
                        htmlFor="email"
                        className="block text-sm font-medium text-slate-700"
                    >
                        E-mail
                    </label>

                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        placeholder="seuemail@exemplo.com"
                        autoComplete="email"
                        maxLength={150}
                        required
                        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-teal-600 focus:ring-4 focus:ring-teal-600/10"
                    />
                </div>

                <PasswordInput
                    id="password"
                    label="Senha"
                    value={password}
                    onChange={setPassword}
                    autoComplete="new-password"
                />

                <PasswordInput
                    id="confirmPassword"
                    label="Confirmar senha"
                    value={confirmPassword}
                    onChange={setConfirmPassword}
                    autoComplete="new-password"
                />

                {error && (
                    <p
                        role="alert"
                        className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700"
                    >
                        {error}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-teal-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-teal-800 focus:outline-none focus:ring-4 focus:ring-teal-600/20 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {loading ? (
                        <>
                            <LoaderCircle size={18} className="animate-spin" />
                            Criando conta...
                        </>
                    ) : (
                        <>
                            Criar conta
                            <ArrowRight size={18} />
                        </>
                    )}
                </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-500">
                Já possui uma conta?{' '}
                <Link
                    to="/login"
                    className="font-semibold text-teal-700 hover:text-teal-800 hover:underline"
                >
                    Entrar
                </Link>
            </p>
        </AuthLayout>
    )
}