import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'

import { useAuth } from '../../contexts/AuthContext'
import { useAccounts } from '../../hooks/useAccounts'
import { useCategories } from '../../hooks/useCategories'

import {
    transactionService,
    type Transaction,
    type TransactionType,
} from '../../services/transactionService'
import {
    toDateInputValue,
    todayAsInputValue,
} from '../../utils/date'

interface NovaTransacaoProps {
    aberto: boolean
    transacao?: Transaction | null
    onFechar: () => void
    onSucesso: () => void
}

export default function NovaTransacao({
    aberto,
    transacao = null,
    onFechar,
    onSucesso,
}: NovaTransacaoProps) {
    const editando = transacao !== null

    const { token } = useAuth()

    const {
        accounts,
        loading: accountsLoading,
    } = useAccounts()

    const {
        categories,
        loading: categoriesLoading,
    } = useCategories()

    const [type, setType] = useState<TransactionType>('EXPENSE')
    const [description, setDescription] = useState('')
    const [amount, setAmount] = useState('')
    const [accountId, setAccountId] = useState('')
    const [categoryId, setCategoryId] = useState('')

    const [date, setDate] = useState(todayAsInputValue)

    const [notes, setNotes] = useState('')

    const [saving, setSaving] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const filteredCategories = categories.filter(
        (category) => category.type === type,
    )

    // Preenche o formulário ao abrir: com os dados da transação
    // em edição ou com valores padrão para uma nova transação.
    useEffect(() => {
        if (!aberto) {
            return
        }

        setType(transacao?.type ?? 'EXPENSE')
        setDescription(transacao?.description ?? '')
        setAmount(
            transacao
                ? String(transacao.amount).replace('.', ',')
                : '',
        )
        setAccountId(transacao?.accountId ?? '')
        setCategoryId(transacao?.categoryId ?? '')
        setDate(
            transacao
                ? toDateInputValue(transacao.date)
                : todayAsInputValue(),
        )
        setNotes(transacao?.notes ?? '')
        setError(null)
    }, [aberto, transacao])

    useEffect(() => {
        if (categoriesLoading) {
            return
        }

        if (
            categoryId &&
            !categories.some(
                (category) =>
                    category.type === type &&
                    category.id === categoryId,
            )
        ) {
            setCategoryId('')
        }
    }, [type, categoryId, categories, categoriesLoading])

    useEffect(() => {
        if (accountsLoading) {
            return
        }

        if (!accounts.some((account) => account.id === accountId)) {
            setAccountId(accounts[0]?.id ?? '')
        }
    }, [accounts, accountId, accountsLoading])

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()

        if (!token) {
            setError('Você precisa estar autenticado.')
            return
        }

        if (!description.trim()) {
            setError('Informe uma descrição.')
            return
        }

        const numericAmount = Number(
            amount.replace(',', '.'),
        )

        if (
            !Number.isFinite(numericAmount) ||
            numericAmount <= 0
        ) {
            setError('Informe um valor válido maior que zero.')
            return
        }

        if (!accountId) {
            setError('Selecione uma conta.')
            return
        }

        setSaving(true)
        setError(null)

        try {
            if (transacao) {
                await transactionService.update(
                    transacao.id,
                    {
                        description: description.trim(),
                        amount: numericAmount,
                        type,
                        accountId,
                        categoryId: categoryId || null,
                        ...(date ? { date } : {}),
                        notes: notes.trim(),
                    },
                    token,
                )
            } else {
                await transactionService.create(
                    {
                        description: description.trim(),
                        amount: numericAmount,
                        type,
                        accountId,
                        ...(categoryId ? { categoryId } : {}),
                        ...(date ? { date } : {}),
                        ...(notes.trim()
                            ? { notes: notes.trim() }
                            : {}),
                    },
                    token,
                )
            }

            onSucesso()
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : editando
                        ? 'Não foi possível atualizar a transação.'
                        : 'Não foi possível criar a transação.',
            )
        } finally {
            setSaving(false)
        }
    }

    const loading = accountsLoading || categoriesLoading

    if (!aberto) {
        return null
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm"
            onMouseDown={onFechar}
        >
            <div
                className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl"
                onMouseDown={(event) =>
                    event.stopPropagation()
                }
            >
                {/* Cabeçalho */}
                <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">
                            {editando
                                ? 'Editar transação'
                                : 'Nova transação'}
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            {editando
                                ? 'Atualize os dados desta receita ou despesa.'
                                : 'Registre uma nova receita ou despesa.'}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onFechar}
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                        aria-label="Fechar"
                    >
                        ×
                    </button>
                </div>

                {/* Conteúdo */}
                <div className="max-h-[75vh] overflow-y-auto">
                    <form
                        onSubmit={handleSubmit}
                        className="space-y-6 p-6"
                    >
                        {/* Erro */}
                        {error && (
                            <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3">
                                <p className="text-sm text-red-600">
                                    {error}
                                </p>
                            </div>
                        )}

                        {/* Tipo */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                Tipo
                            </label>

                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setType('EXPENSE')
                                    }
                                    className={`rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                                        type === 'EXPENSE'
                                            ? 'border-red-200 bg-red-50 text-red-600'
                                            : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                                    }`}
                                >
                                    Despesa
                                </button>

                                <button
                                    type="button"
                                    onClick={() =>
                                        setType('INCOME')
                                    }
                                    className={`rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                                        type === 'INCOME'
                                            ? 'border-emerald-200 bg-emerald-50 text-emerald-600'
                                            : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                                    }`}
                                >
                                    Receita
                                </button>
                            </div>
                        </div>

                        {/* Descrição */}
                        <div>
                            <label
                                htmlFor="description"
                                className="mb-2 block text-sm font-medium text-slate-700"
                            >
                                Descrição
                            </label>

                            <input
                                id="description"
                                type="text"
                                value={description}
                                onChange={(event) =>
                                    setDescription(
                                        event.target.value,
                                    )
                                }
                                placeholder="Ex.: Mercado"
                                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                            />
                        </div>

                        {/* Valor */}
                        <div>
                            <label
                                htmlFor="amount"
                                className="mb-2 block text-sm font-medium text-slate-700"
                            >
                                Valor
                            </label>

                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                                    R$
                                </span>

                                <input
                                    id="amount"
                                    type="text"
                                    inputMode="decimal"
                                    value={amount}
                                    onChange={(event) =>
                                        setAmount(
                                            event.target.value,
                                        )
                                    }
                                    placeholder="0,00"
                                    className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                                />
                            </div>
                        </div>

                        {/* Conta e categoria */}
                        <div className="grid gap-5 md:grid-cols-2">
                            <div>
                                <label
                                    htmlFor="account"
                                    className="mb-2 block text-sm font-medium text-slate-700"
                                >
                                    Conta
                                </label>

                                <select
                                    id="account"
                                    value={accountId}
                                    onChange={(event) =>
                                        setAccountId(
                                            event.target.value,
                                        )
                                    }
                                    disabled={
                                        loading ||
                                        accounts.length === 0
                                    }
                                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100 disabled:bg-slate-50"
                                >
                                    <option value="">
                                        {accountsLoading
                                            ? 'Carregando contas...'
                                            : 'Selecione uma conta'}
                                    </option>

                                    {accounts.map((account) => (
                                        <option
                                            key={account.id}
                                            value={account.id}
                                        >
                                            {account.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label
                                    htmlFor="category"
                                    className="mb-2 block text-sm font-medium text-slate-700"
                                >
                                    Categoria
                                </label>

                                <select
                                    id="category"
                                    value={categoryId}
                                    onChange={(event) =>
                                        setCategoryId(
                                            event.target.value,
                                        )
                                    }
                                    disabled={loading}
                                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100 disabled:bg-slate-50"
                                >
                                    <option value="">
                                        Sem categoria
                                    </option>

                                    {filteredCategories.map(
                                        (category) => (
                                            <option
                                                key={category.id}
                                                value={category.id}
                                            >
                                                {category.name}
                                            </option>
                                        ),
                                    )}
                                </select>
                            </div>
                        </div>

                        {/* Data */}
                        <div>
                            <label
                                htmlFor="date"
                                className="mb-2 block text-sm font-medium text-slate-700"
                            >
                                Data
                            </label>

                            <input
                                id="date"
                                type="date"
                                value={date}
                                onChange={(event) =>
                                    setDate(event.target.value)
                                }
                                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                            />
                        </div>

                        {/* Observações */}
                        <div>
                            <label
                                htmlFor="notes"
                                className="mb-2 block text-sm font-medium text-slate-700"
                            >
                                Observações
                            </label>

                            <textarea
                                id="notes"
                                value={notes}
                                onChange={(event) =>
                                    setNotes(event.target.value)
                                }
                                rows={4}
                                placeholder="Opcional"
                                className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                            />
                        </div>

                        {/* Ações */}
                        <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
                            <button
                                type="button"
                                onClick={onFechar}
                                className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                            >
                                Cancelar
                            </button>

                            <button
                                type="submit"
                                disabled={saving || loading}
                                className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {saving
                                    ? 'Salvando...'
                                    : editando
                                        ? 'Salvar alterações'
                                        : 'Salvar transação'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}