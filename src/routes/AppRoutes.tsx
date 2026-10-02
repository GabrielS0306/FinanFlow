
import {
    Routes,
    Route,
    Navigate,
} from 'react-router-dom'

function Page({
    title,
}: {
    title: string
}) {
    return (
        <main className="flex min-h-screen items-center justify-center bg-slate-100 p-6">
            <section className="w-full max-w-lg rounded-xl bg-white p-8 text-center shadow-sm">
                <h1 className="text-2xl font-bold text-slate-800">
                    {title}
                </h1>

                <p className="mt-2 text-sm text-slate-500">
                    FinanFlow — Suas finanças, mais organizadas.
                </p>
            </section>
        </main>
    )
}

export default function AppRoutes() {
    return (
        <Routes>
            <Route
                path="/"
                element={<Navigate to="/login" replace />}
            />

            <Route
                path="/login"
                element={<Page title="Entrar no FinanFlow" />}
            />

            <Route
                path="/cadastro"
                element={<Page title="Criar conta" />}
            />

            <Route
                path="/recuperar-senha"
                element={<Page title="Recuperar senha" />}
            />

            <Route
                path="/dashboard"
                element={<Page title="Dashboard" />}
            />

            <Route
                path="/transacoes"
                element={<Page title="Transações" />}
            />

            <Route
                path="/transacoes/nova"
                element={<Page title="Nova transação" />}
            />

            <Route
                path="/categorias"
                element={<Page title="Categorias" />}
            />

            <Route
                path="/relatorios"
                element={<Page title="Relatórios" />}
            />

            <Route
                path="/metas"
                element={<Page title="Metas financeiras" />}
            />

            <Route
                path="/configuracoes"
                element={<Page title="Configurações" />}
            />

            <Route
                path="*"
                element={<Page title="Página não encontrada" />}
            />
        </Routes>
    )
}