import {
    Routes,
    Route,
    Navigate,
} from 'react-router-dom'

import DashboardLayout from '../layouts/DashboardLayout'
import Login from '../pages/auth/Login'
import Register from '../pages/auth/Register'
import ProtectedRoute from './ProtectedRouter'

import Dashboard from '../pages/dashboard/Dashboard'

function Page({ title }: { title: string }) {
    return (
        <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <h1 className="text-2xl font-bold text-slate-800">
                {title}
            </h1>

            <p className="mt-2 text-sm text-slate-500">
                Esta página está em desenvolvimento.
            </p>
        </section>
    )
}

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />

            {/* Autenticação */}
            <Route path="/login" element={<Login />} />
            <Route path="/cadastro" element={<Register />} />

            <Route
                path="/recuperar-senha"
                element={<Page title="Recuperar senha" />}
            />

            {/* Rotas protegidas */}
            <Route element={<ProtectedRoute />}>
                <Route element={<DashboardLayout />}>
                    <Route
                        path="/dashboard"
                        element={<Dashboard />}
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
                </Route>
            </Route>

            <Route
                path="*"
                element={<Page title="Página não encontrada" />}
            />
        </Routes>
    )
}