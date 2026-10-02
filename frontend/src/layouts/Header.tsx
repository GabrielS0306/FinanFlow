import {
    Search,
    Bell,
    HelpCircle,
    ChevronDown,
} from 'lucide-react'

export default function Header() {
    return (
        <header className="flex min-h-[88px] items-center justify-between gap-4 border-b border-slate-200/80 bg-white px-8 py-4">
            {/* Saudação */}
            <div>
                <h2 className="text-xl font-bold tracking-tight text-slate-800">
                    Olá, Gabriel!
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                    Acompanhe sua vida financeira.
                </p>
            </div>

        {/* Ações */}
            <div className="flex items-center gap-5">
                {/* Pesquisa */}
                <div className="hidden w-64 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 md:flex">
                    <Search size={18} className="text-slate-400" />

                    <input
                        type="search"
                        placeholder="Pesquisar..."
                        aria-label="Pesquisar"
                        className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
                    />
                </div>

                {/* Ajuda e notificações */}
                <div className="flex items-center gap-3 text-slate-500">
                    <span
                        className="relative flex h-10 w-10 items-center justify-center rounded-xl transition hover:bg-slate-100"
                        title="Notificações"
                    >
                        <Bell size={20} />

                        <span className="absolute right-2 top-2 h-2 w-2 rounded-full border-2 border-white bg-emerald-500" />
                    </span>

                    <span
                        className="flex h-10 w-10 items-center justify-center rounded-xl transition hover:bg-slate-100"
                        title="Ajuda"
                    >
                        <HelpCircle size={20} />
                    </span>
                </div>

                {/* Usuário */}
                <div className="flex items-center gap-2 border-l border-slate-200 pl-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700">
                        GA
                    </div>

                    <div className="hidden lg:block">
                        <p className="text-sm font-semibold text-slate-700">
                            Gabriel
                        </p>

                        <p className="text-xs text-slate-400">
                            Minha conta
                        </p>
                    </div>

                    <ChevronDown
                        size={16}
                        className="hidden text-slate-400 lg:block"
                    />
                </div>
            </div>
        </header>
    )
}