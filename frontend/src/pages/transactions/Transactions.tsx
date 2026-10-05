import { useState } from 'react'

import { useTransactions } from '../../hooks/useTransactions'
import NovaTransacao from './NovaTransacao'

export default function Transactions() {
    const {
        transactions,
        loading,
        error,
        totalIncome,
        totalExpense,
        balance,
    } = useTransactions()

    const [modalNovaTransacao, setModalNovaTransacao] =
        useState(false)

    const formatCurrency = (value: number) =>
        value.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        })

    const formatDate = (date: string) =>
        new Date(date).toLocaleDateString('pt-BR')

    if (loading) {
        return (
            <p className="text-slate-500">
                Carregando suas transações...
            </p>
        )
    }

    if (error) {
        return (
            <div className="rounded-2xl border border-red-100 bg-red-50 p-5">
                <p className="text-sm text-red-600">{error}</p>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Cabeçalho */}
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">
                        Transações
                    </h1>

                    <p className="mt-1 text-sm text-slate-500">
                        Gerencie suas receitas e despesas.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => setModalNovaTransacao(true)}
                    className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                    + Nova transação
                </button>
            </div>

            {/* Resumo */}
            <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                    <p className="text-sm text-slate-500">
                        Receitas
                    </p>

                    <p className="mt-2 text-2xl font-bold text-emerald-600">
                        {formatCurrency(totalIncome)}
                    </p>
                </div>

                <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                    <p className="text-sm text-slate-500">
                        Despesas
                    </p>

                    <p className="mt-2 text-2xl font-bold text-red-600">
                        {formatCurrency(totalExpense)}
                    </p>
                </div>

                <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                    <p className="text-sm text-slate-500">
                        Saldo das transações
                    </p>

                    <p
                        className={`mt-2 text-2xl font-bold ${
                            balance >= 0
                                ? 'text-slate-800'
                                : 'text-red-600'
                        }`}
                    >
                        {formatCurrency(balance)}
                    </p>
                </div>
            </div>

            {/* Lista */}
            <section className="rounded-2xl border border-slate-100 bg-white shadow-sm">
                <div className="border-b border-slate-100 p-5">
                    <h2 className="font-semibold text-slate-800">
                        Histórico
                    </h2>
                </div>

                {transactions.length === 0 ? (
                    <div className="p-8 text-center">
                        <p className="text-slate-500">
                            Você ainda não possui transações.
                        </p>

                        <button
                            type="button"
                            onClick={() =>
                                setModalNovaTransacao(true)
                            }
                            className="mt-3 text-sm font-medium text-slate-900 hover:underline"
                        >
                            Criar primeira transação →
                        </button>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-100">
                        {transactions.map((transaction) => {
                            const isIncome =
                                transaction.type === 'INCOME'

                            return (
                                <div
                                    key={transaction.id}
                                    className="flex items-center justify-between gap-4 p-5 transition hover:bg-slate-50"
                                >
                                    <div className="min-w-0">
                                        <p className="truncate font-medium text-slate-800">
                                            {transaction.description}
                                        </p>

                                        <p className="mt-1 text-xs text-slate-500">
                                            {formatDate(
                                                transaction.date,
                                            )}
                                        </p>
                                    </div>

                                    <p
                                        className={`shrink-0 font-semibold ${
                                            isIncome
                                                ? 'text-emerald-600'
                                                : 'text-red-600'
                                        }`}
                                    >
                                        {isIncome ? '+' : '-'}{' '}
                                        {formatCurrency(
                                            Number(
                                                transaction.amount,
                                            ),
                                        )}
                                    </p>
                                </div>
                            )
                        })}
                    </div>
                )}
            </section>

            {/* Modal de nova transação */}
            <NovaTransacao
                aberto={modalNovaTransacao}
                onFechar={() =>
                    setModalNovaTransacao(false)
                }
                onSucesso={() => {
                    setModalNovaTransacao(false)
                }}
            />
        </div>
    )
}