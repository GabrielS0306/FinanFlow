import { useState } from 'react'
import { useAccounts } from '../../hooks/useAccounts'
import NovaConta from './NovaConta'

export default function Accounts() {
    const {
        accounts,
        loading,
        error,
        totalInitialBalance,
        totalCurrentBalance,
    } = useAccounts()

    const [modalNovaConta, setModalNovaConta] = useState(false)

    const formatCurrency = (value: number) =>
        value.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        })

    return (
        <div className="space-y-6">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">
                        Contas
                    </h1>

                    <p className="mt-1 text-sm text-slate-500">
                        Gerencie suas contas e saldos.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => setModalNovaConta(true)}
                    className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                    + Nova conta
                </button>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                <p className="text-sm text-slate-500">
                    Saldo atual total
                </p>

                <p
                    className={`mt-2 text-3xl font-bold ${
                        totalCurrentBalance < 0
                            ? 'text-red-600'
                            : 'text-slate-800'
                    }`}
                >
                    {formatCurrency(totalCurrentBalance)}
                </p>

                <p className="mt-1 text-sm text-slate-400">
                    Saldo inicial total:{' '}
                    {formatCurrency(totalInitialBalance)}
                    {' · '}
                    {accounts.length}{' '}
                    {accounts.length === 1
                        ? 'conta cadastrada'
                        : 'contas cadastradas'}
                </p>
            </div>

            {loading && (
                <div className="rounded-2xl border border-slate-100 bg-white p-6">
                    <p className="text-sm text-slate-500">
                        Carregando suas contas...
                    </p>
                </div>
            )}

            {error && (
                <div className="rounded-2xl border border-red-100 bg-red-50 p-5">
                    <p className="text-sm text-red-600">
                        {error}
                    </p>
                </div>
            )}

            {!loading && !error && accounts.length === 0 && (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-center">
                    <h2 className="text-lg font-semibold text-slate-700">
                        Nenhuma conta cadastrada
                    </h2>

                    <p className="mt-2 text-sm text-slate-500">
                        Cadastre sua primeira conta para começar a
                        registrar suas transações.
                    </p>

                    <button
                        type="button"
                        onClick={() =>
                            setModalNovaConta(true)
                        }
                        className="mt-5 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
                    >
                        Criar primeira conta
                    </button>
                </div>
            )}

            {!loading && accounts.length > 0 && (
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {accounts.map((account) => (
                        <div
                            key={account.id}
                            className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <h2 className="font-semibold text-slate-800">
                                        {account.name}
                                    </h2>

                                    <p className="mt-1 text-xs text-slate-400">
                                        {account.type}
                                    </p>
                                </div>

                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                                    $
                                </div>
                            </div>

                            <div className="mt-6">
                                <p className="text-xs text-slate-400">
                                    Saldo atual
                                </p>

                                <p
                                    className={`mt-1 text-xl font-bold ${
                                        Number(account.currentBalance) < 0
                                            ? 'text-red-600'
                                            : 'text-slate-800'
                                    }`}
                                >
                                    {formatCurrency(
                                        Number(
                                            account.currentBalance,
                                        ),
                                    )}
                                </p>

                                <p className="mt-1 text-xs text-slate-400">
                                    Saldo inicial:{' '}
                                    {formatCurrency(
                                        Number(
                                            account.initialBalance,
                                        ),
                                    )}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <NovaConta
                aberto={modalNovaConta}
                onFechar={() =>
                    setModalNovaConta(false)
                }
                onSucesso={() =>
                    setModalNovaConta(false)
                }
            />
        </div>
    )
}