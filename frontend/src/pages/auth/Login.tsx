
import { useState, type FormEvent } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { ArrowRight, LoaderCircle } from 'lucide-react'
import AuthLayout from '../../components/auth/AuthLayout'
import PasswordInput from '../../components/auth/PasswordInput'
import { useAuth } from '../../contexts/AuthContext'

export default function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const { login, isAuthenticated } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()

    const from = location.state?.from?.pathname || '/dashboard'

    if (isAuthenticated) {
        return <Navigate to="/dashboard" replace />
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setError('')
        setLoading(true)

        try {
            await login(email, password)
            navigate(from, { replace: true })
        } catch (err) {
            setError(
                err instanceof Error
                ? err.message
                : 'Não foi possível entrar. Tente novamente.',
            )
        } finally {
            setLoading(false)
        }
    }

    return (
        <AuthLayout
            title="Bem-vindo de volta!"
            subtitle="Acesse sua conta e acompanhe suas finanças."
        >
            <form onSubmit={handleSubmit} className="space-y-5">
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
                        required
                        maxLength={150}
                        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-teal-600 focus:ring-4 focus:ring-teal-600/10"
                    />
                </div>

                <PasswordInput
                    id="password"
                    label="Senha"
                    value={password}
                    onChange={setPassword}
                    autoComplete="current-password"
                />

                <div className="flex justify-end">
                    <Link
                        to="/recuperar-senha"
                        className="text-sm font-medium text-teal-700 hover:text-teal-800 hover:underline"
                    >
                        Esqueceu a senha?
                    </Link>
                </div>

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
                            Entrando...
                        </>
                    ) : (
                        <>
                            Entrar
                            <ArrowRight size={18} />
                        </>
                    )}
                </button>
            </form>

            <p className="mt-7 text-center text-sm text-slate-500">
                Ainda não tem uma conta?{' '}
                <Link
                    to="/cadastro"
                    className="font-semibold text-teal-700 hover:text-teal-800 hover:underline"
                >
                    Cadastre-se
                </Link>
            </p>
        </AuthLayout>
    )
}