import { useAccounts } from '../../hooks/useAccounts'

export default function Dashboard() {
    const {
        accounts,
        loading,
        error,
        totalInitialBalance,
    } = useAccounts()

    const formatCurrency = (value: number) =>
        value.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        })

    if (loading) {
        return <p className="text-slate-500">Carregando suas contas...</p>
    }

    if (error) {
        return <p className="text-red-600">{error}</p>
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-800">
                    Visão geral
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                    Acompanhe suas contas financeiras.
                </p>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                <p className="text-sm text-slate-500">
                    Saldo inicial total
                </p>
                <p className="mt-2 text-3xl font-bold text-slate-800">
                    {formatCurrency(totalInitialBalance)}
                </p>
            </div>

            <section className="space-y-4">
                <h2 className="text-lg font-semibold text-slate-800">
                    Minhas contas
                </h2>

                {accounts.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center">
                        <p className="text-slate-500">
                            Você ainda não possui contas cadastradas.
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                        {accounts.map((account) => (
                            <div
                                key={account.id}
                                className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"
                            >
                                <p className="font-medium text-slate-700">
                                    {account.name}
                                </p>
                                <p className="mt-3 text-xl font-bold text-slate-800">
                                    {formatCurrency(
                                        Number(account.initialBalance),
                                    )}
                                </p>
                                <p className="mt-1 text-xs text-slate-500">
                                    {account.type}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    )
}