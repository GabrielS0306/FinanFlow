import { useState } from 'react'
import type { FormEvent } from 'react'

import { useAuth } from '../../contexts/AuthContext'

import {
    accountService,
    type AccountType,
} from '../../services/accountService'

interface NovaContaProps {
    aberto: boolean
    onFechar: () => void
    onSucesso: () => void
}

const accountTypes: {
    value: AccountType
    label: string
}[] = [
    {
        value: 'CHECKING',
        label: 'Conta corrente',
    },
    {
        value: 'SAVINGS',
        label: 'Poupança',
    },
    {
        value: 'CASH',
        label: 'Dinheiro',
    },
    {
        value: 'INVESTMENT',
        label: 'Investimento',
    },
    {
        value: 'OTHER',
        label: 'Outro',
    },
]

export default function NovaConta({
    aberto,
    onFechar,
    onSucesso,
}: NovaContaProps) {
    const { token } = useAuth()

    const [name, setName] = useState('')
    const [type, setType] =
        useState<AccountType>('CHECKING')
    const [initialBalance, setInitialBalance] = useState('')

    const [saving, setSaving] = useState(false)
    const [error, setError] = useState<string | null>(null)

    if (!aberto) {
        return null
    }

    async function handleSubmit(
        event: FormEvent<HTMLFormElement>,
    ) {
        event.preventDefault()

        if (!token) {
            setError('Você precisa estar autenticado.')
            return
        }

        if (!name.trim()) {
            setError('Informe o nome da conta.')
            return
        }

        const numericBalance = initialBalance
            ? Number(initialBalance.replace(',', '.'))
            : 0

        if (!Number.isFinite(numericBalance)) {
            setError('Informe um saldo inicial válido.')
            return
        }

        setSaving(true)
        setError(null)

        try {
            await accountService.create(
                {
                    name: name.trim(),
                    type,
                    initialBalance: numericBalance,
                },
                token,
            )

            setName('')
            setType('CHECKING')
            setInitialBalance('')

            onSucesso()
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : 'Não foi possível criar a conta.',
            )
        } finally {
            setSaving(false)
        }
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm"
            onMouseDown={onFechar}
        >
            <div
                className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl"
                onMouseDown={(event) =>
                    event.stopPropagation()
                }
            >
                <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">
                            Nova conta
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Cadastre uma conta para usar nas suas
                            transações.
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

                <form
                    onSubmit={handleSubmit}
                    className="space-y-5 p-6"
                >
                    {error && (
                        <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3">
                            <p className="text-sm text-red-600">
                                {error}
                            </p>
                        </div>
                    )}

                    <div>
                        <label
                            htmlFor="account-name"
                            className="mb-2 block text-sm font-medium text-slate-700"
                        >
                            Nome da conta
                        </label>

                        <input
                            id="account-name"
                            type="text"
                            value={name}
                            onChange={(event) =>
                                setName(event.target.value)
                            }
                            placeholder="Ex.: Nubank"
                            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="account-type"
                            className="mb-2 block text-sm font-medium text-slate-700"
                        >
                            Tipo da conta
                        </label>

                        <select
                            id="account-type"
                            value={type}
                            onChange={(event) =>
                                setType(
                                    event.target.value as AccountType,
                                )
                            }
                            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                        >
                            {accountTypes.map((accountType) => (
                                <option
                                    key={accountType.value}
                                    value={accountType.value}
                                >
                                    {accountType.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label
                            htmlFor="initial-balance"
                            className="mb-2 block text-sm font-medium text-slate-700"
                        >
                            Saldo inicial
                        </label>

                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                                R$
                            </span>

                            <input
                                id="initial-balance"
                                type="text"
                                inputMode="decimal"
                                value={initialBalance}
                                onChange={(event) =>
                                    setInitialBalance(
                                        event.target.value,
                                    )
                                }
                                placeholder="0,00"
                                className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                            />
                        </div>
                    </div>

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
                            disabled={saving}
                            className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {saving
                                ? 'Criando...'
                                : 'Criar conta'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}