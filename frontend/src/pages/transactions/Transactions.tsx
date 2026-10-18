import { useState } from 'react'
import { Pencil, Trash2 } from 'lucide-react'

import { useAuth } from '../../contexts/AuthContext'
import { useTransactions } from '../../hooks/useTransactions'
import {
    transactionService,
    type Transaction,
} from '../../services/transactionService'
import { formatCalendarDate } from '../../utils/date'
import NovaTransacao from './NovaTransacao'

export default function Transactions() {
    const { token } = useAuth()

    const {
        transactions,
        loading,
        error,
        totalIncome,
        totalExpense,
        balance,
        refetch,
    } = useTransactions()

    const [modalNovaTransacao, setModalNovaTransacao] =
        useState(false)

    const [transacaoEmEdicao, setTransacaoEmEdicao] =
        useState<Transaction | null>(null)

    const [excluindoId, setExcluindoId] =
        useState<string | null>(null)

    const [erroAcao, setErroAcao] =
        useState<string | null>(null)

    const formatCurrency = (value: number) =>
        value.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        })

    function abrirNovaTransacao() {
        setTransacaoEmEdicao(null)
        setModalNovaTransacao(true)
    }

    function abrirEdicao(transaction: Transaction) {
        setErroAcao(null)
        setTransacaoEmEdicao(transaction)
        setModalNovaTransacao(true)
    }

    function fecharModal() {
        setModalNovaTransacao(false)
        setTransacaoEmEdicao(null)
    }

    async function excluirTransacao(transaction: Transaction) {
        if (!token || excluindoId) {
            return
        }

        const confirmado = window.confirm(
            `Excluir a transação "${transaction.description}"? Esta ação não pode ser desfeita.`,
        )

        if (!confirmado) {
            return
        }

        setExcluindoId(transaction.id)
        setErroAcao(null)

        try {
            await transactionService.remove(transaction.id, token)
            refetch()
        } catch (err) {
            setErroAcao(
                err instanceof Error
                    ? err.message
                    : 'Não foi possível excluir a transação.',
            )
        } finally {
            setExcluindoId(null)
        }
    }

    // Mostra o carregamento em tela cheia apenas na primeira carga,
    // para que as atualizações não escondam a lista.
    if (loading && transactions.length === 0) {
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
                    onClick={abrirNovaTransacao}
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

            {erroAcao && (
                <div className="rounded-2xl border border-red-100 bg-red-50 p-5">
                    <p className="text-sm text-red-600">
                        {erroAcao}
                    </p>
                </div>
            )}

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
                            onClick={abrirNovaTransacao}
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

                                        <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500">
                                            <span>
                                                {formatCalendarDate(
                                                    transaction.date,
                                                )}
                                            </span>

                                            <span aria-hidden="true">
                                                •
                                            </span>

                                            <span>
                                                {transaction.account.name}
                                            </span>

                                            {transaction.category && (
                                                <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2 py-0.5 text-slate-600">
                                                    <span
                                                        className="h-2 w-2 rounded-full"
                                                        style={{
                                                            backgroundColor:
                                                                transaction
                                                                    .category
                                                                    .color,
                                                        }}
                                                    />
                                                    {transaction.category.name}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex shrink-0 items-center gap-3">
                                        <p
                                            className={`font-semibold ${
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

                                        <div className="flex items-center gap-1">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    abrirEdicao(
                                                        transaction,
                                                    )
                                                }
                                                disabled={
                                                    excluindoId !== null
                                                }
                                                className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                                                aria-label={`Editar ${transaction.description}`}
                                                title="Editar"
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    void excluirTransacao(
                                                        transaction,
                                                    )
                                                }
                                                disabled={
                                                    excluindoId !== null
                                                }
                                                className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                                                aria-label={`Excluir ${transaction.description}`}
                                                title="Excluir"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </section>

            {/* Modal de criação e edição de transação */}
            <NovaTransacao
                aberto={modalNovaTransacao}
                transacao={transacaoEmEdicao}
                onFechar={fecharModal}
                onSucesso={() => {
                    fecharModal()
                    refetch()
                }}
            />
        </div>
    )
}
