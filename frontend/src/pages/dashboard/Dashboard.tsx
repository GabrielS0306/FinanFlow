import { useState } from 'react'

import { useAuth } from '../../contexts/AuthContext'
import { useAccounts } from '../../hooks/useAccounts'
import NovaConta from '../accounts/NovaConta'
import {
    accountService,
    type Account,
} from '../../services/accountService'

export default function Dashboard() {
    const { token } = useAuth()

    const {
        accounts,
        loading,
        error,
        totalInitialBalance,
        totalCurrentBalance,
        refetch,
    } = useAccounts()

    const [modalNovaConta, setModalNovaConta] = useState(false)

    const [contaSelecionada, setContaSelecionada] =
        useState<Account | null>(null)

    const [editandoConta, setEditandoConta] =
        useState(false)

    const [nomeEditado, setNomeEditado] = useState('')
    const [saldoEditado, setSaldoEditado] = useState('')

    const [salvandoConta, setSalvandoConta] =
        useState(false)

    const [erroEdicao, setErroEdicao] =
        useState<string | null>(null)

    const formatCurrency = (value: number) =>
        value.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        })

    if (loading) {
        return (
            <p className="text-slate-500">
                Carregando suas contas...
            </p>
        )
    }

    if (error) {
        return <p className="text-red-600">{error}</p>
    }

    function iniciarEdicao() {
        if (!contaSelecionada) return

        setNomeEditado(contaSelecionada.name)

        setSaldoEditado(
            String(contaSelecionada.initialBalance).replace(
                '.',
                ',',
            ),
        )

        setErroEdicao(null)
        setEditandoConta(true)
    }

    async function salvarEdicaoConta() {
        if (!contaSelecionada || !token) {
            return
        }

        const saldo = Number(
            saldoEditado.replace(',', '.'),
        )

        if (!nomeEditado.trim()) {
            setErroEdicao('Informe o nome da conta.')
            return
        }

        if (
            !Number.isFinite(saldo) ||
            saldo < 0
        ) {
            setErroEdicao(
                'Informe um saldo válido maior ou igual a zero.',
            )
            return
        }

        setSalvandoConta(true)
        setErroEdicao(null)

        try {
            const contaAtualizada =
                await accountService.update(
                    contaSelecionada.id,
                    {
                        name: nomeEditado.trim(),
                        initialBalance: saldo,
                    },
                    token,
                )

            setContaSelecionada(contaAtualizada)
            setEditandoConta(false)

            await refetch()
        } catch (err) {
            setErroEdicao(
                err instanceof Error
                    ? err.message
                    : 'Não foi possível atualizar a conta.',
            )
        } finally {
            setSalvandoConta(false)
        }
    }

    function fecharModalConta() {
        if (salvandoConta) return

        setContaSelecionada(null)
        setEditandoConta(false)
        setErroEdicao(null)
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
                </p>
            </div>

            <section className="space-y-4">
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                    <h2 className="text-lg font-semibold text-slate-800">
                        Minhas contas
                    </h2>

                    <button
                        type="button"
                        onClick={() =>
                            setModalNovaConta(true)
                        }
                        className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
                    >
                        + Nova conta
                    </button>
                </div>

                {accounts.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">
                        <p className="text-slate-500">
                            Você ainda não possui contas cadastradas.
                        </p>

                        <button
                            type="button"
                            onClick={() =>
                                setModalNovaConta(true)
                            }
                            className="mt-4 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
                        >
                            Criar primeira conta
                        </button>
                    </div>
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                        {accounts.map((account) => (
                            <button
                                key={account.id}
                                type="button"
                                onClick={() =>
                                    setContaSelecionada(account)
                                }
                                className="w-full rounded-2xl border border-slate-100 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-slate-200 hover:shadow-md"
                            >
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="font-medium text-slate-700">
                                            {account.name}
                                        </p>

                                        <p className="mt-1 text-xs text-slate-500">
                                            {account.type}
                                        </p>
                                    </div>

                                    <span className="text-slate-300">
                                        →
                                    </span>
                                </div>

                                <p
                                    className={`mt-5 text-xl font-bold ${
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
                            </button>
                        ))}
                    </div>
                )}
            </section>

            <NovaConta
                aberto={modalNovaConta}
                onFechar={() =>
                    setModalNovaConta(false)
                }
                onSucesso={() => {
                    setModalNovaConta(false)
                    void refetch()
                }}
            />

            {contaSelecionada && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm"
                    onMouseDown={fecharModalConta}
                >
                    <div
                        className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl"
                        onMouseDown={(event) =>
                            event.stopPropagation()
                        }
                    >
                        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
                            <div>
                                <h2 className="text-xl font-bold text-slate-800">
                                    {editandoConta
                                        ? 'Editar conta'
                                        : contaSelecionada.name}
                                </h2>

                                <p className="mt-1 text-sm text-slate-500">
                                    {editandoConta
                                        ? 'Atualize os dados da conta.'
                                        : 'Detalhes da conta'}
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={fecharModalConta}
                                disabled={salvandoConta}
                                className="flex h-9 w-9 items-center justify-center rounded-lg text-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                                aria-label="Fechar"
                            >
                                ×
                            </button>
                        </div>

                        <div className="space-y-5 p-6">
                            {erroEdicao && (
                                <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3">
                                    <p className="text-sm text-red-600">
                                        {erroEdicao}
                                    </p>
                                </div>
                            )}

                            {editandoConta ? (
                                <>
                                    <div>
                                        <label
                                            htmlFor="editar-nome-conta"
                                            className="mb-2 block text-sm font-medium text-slate-700"
                                        >
                                            Nome da conta
                                        </label>

                                        <input
                                            id="editar-nome-conta"
                                            type="text"
                                            value={nomeEditado}
                                            onChange={(event) =>
                                                setNomeEditado(
                                                    event.target.value,
                                                )
                                            }
                                            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                                        />
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="editar-saldo-conta"
                                            className="mb-2 block text-sm font-medium text-slate-700"
                                        >
                                            Saldo inicial
                                        </label>

                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                                                R$
                                            </span>

                                            <input
                                                id="editar-saldo-conta"
                                                type="text"
                                                inputMode="decimal"
                                                value={saldoEditado}
                                                onChange={(event) =>
                                                    setSaldoEditado(
                                                        event.target.value,
                                                    )
                                                }
                                                placeholder="0,00"
                                                className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex gap-3 pt-2">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setEditandoConta(false)
                                                setErroEdicao(null)
                                            }}
                                            disabled={salvandoConta}
                                            className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            Cancelar
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                void salvarEdicaoConta()
                                            }
                                            disabled={salvandoConta}
                                            className="flex-1 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                                        >
                                            {salvandoConta
                                                ? 'Salvando...'
                                                : 'Salvar alterações'}
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div>
                                        <p className="text-sm text-slate-500">
                                            Tipo
                                        </p>

                                        <p className="mt-1 font-medium text-slate-800">
                                            {contaSelecionada.type}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-slate-500">
                                            Saldo atual
                                        </p>

                                        <p
                                            className={`mt-1 text-2xl font-bold ${
                                                Number(
                                                    contaSelecionada.currentBalance,
                                                ) < 0
                                                    ? 'text-red-600'
                                                    : 'text-slate-800'
                                            }`}
                                        >
                                            {formatCurrency(
                                                Number(
                                                    contaSelecionada.currentBalance,
                                                ),
                                            )}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-slate-500">
                                            Saldo inicial
                                        </p>

                                        <p className="mt-1 font-medium text-slate-800">
                                            {formatCurrency(
                                                Number(
                                                    contaSelecionada.initialBalance,
                                                ),
                                            )}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-slate-500">
                                            Criada em
                                        </p>

                                        <p className="mt-1 font-medium text-slate-800">
                                            {new Date(
                                                contaSelecionada.createdAt,
                                            ).toLocaleDateString(
                                                'pt-BR',
                                            )}
                                        </p>
                                    </div>

                                    <div className="flex gap-3 pt-2">
                                        <button
                                            type="button"
                                            onClick={iniciarEdicao}
                                            className="flex-1 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                                        >
                                            Editar
                                        </button>

                                        <button
                                            type="button"
                                            onClick={fecharModalConta}
                                            className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                                        >
                                            Fechar
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}