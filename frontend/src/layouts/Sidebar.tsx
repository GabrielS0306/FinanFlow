import { NavLink } from 'react-router-dom'
import {
    LayoutDashboard,
    ArrowLeftRight,
    Tags,
    ChartNoAxesCombined,
    Target,
    Settings,
    LogOut,
    Wallet,
} from 'lucide-react'

const menuItems = [
    {
        name: 'Dashboard',
        path: '/dashboard',
        icon: LayoutDashboard,
    },
    {
        name: 'Transações',
        path: '/transacoes',
        icon: ArrowLeftRight,
    },
    {
        name: 'Categorias',
        path: '/categorias',
        icon: Tags,
    },
    {
        name: 'Relatórios',
        path: '/relatorios',
        icon: ChartNoAxesCombined,
    },
    {
        name: 'Metas financeiras',
        path: '/metas',
        icon: Target,
    },
]

export default function Sidebar() {
    return (
        <aside className="flex h-screen w-64 shrink-0 flex-col bg-[#09221d] px-4 py-6 text-white">
            {/* Logo */}
            <div className="mb-10 flex items-center gap-3 px-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500">
                    <Wallet size={23} className="text-white" />
                </div>

                <h1 className="text-xl font-extrabold tracking-tight">
                    Finan<span className="text-emerald-400">Flow</span>
                </h1>
            </div>

        {/* Menu */}
            <nav className="flex-1 space-y-2">
                <p className="mb-4 px-3 text-xs font-semibold uppercase tracking-widest text-emerald-100/40">
                    Menu principal
                </p>

                {menuItems.map(({ name, path, icon: Icon }) => (
                    <NavLink
                        key={path}
                        to={path}
                        className={({ isActive }) =>
                            `flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all duration-200 ${
                                isActive
                                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-950/20'
                                : 'text-emerald-100/65 hover:bg-white/5 hover:text-white'
                            }`
                        }
                    >
                        <Icon size={19} strokeWidth={1.9} />

                        <span>{name}</span>
                    </NavLink>
                ))}
            </nav>

            {/* Configurações */}
            <div className="mb-4 border-t border-white/10 pt-4">
                <NavLink
                    to="/configuracoes"
                    className={({ isActive }) =>
                        `flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
                        isActive
                            ? 'bg-emerald-500 text-white'
                            : 'text-emerald-100/65 hover:bg-white/5 hover:text-white'
                        }`
                    }
                >

                <Settings size={19} />
                    Configurações
                </NavLink>
            </div>

            {/* Perfil */}
            <div className="border-t border-white/10 pt-4">
                <div className="flex items-center gap-3 rounded-xl p-2">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-800 text-sm font-bold text-emerald-100">
                        GA
                    </div>

                    <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-white">
                            Gabriel
                        </p>
                        <p className="truncate text-xs text-emerald-100/45">
                            Usuário
                        </p>
                    </div>

                    <LogOut
                        size={18}
                        className="shrink-0 cursor-pointer text-emerald-100/50 transition hover:text-red-400"
                        aria-label="Sair"
                    />
                </div>
            </div>
        </aside>
    )
}