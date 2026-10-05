import { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import {
    transactionService,
    type Transaction,
} from '../services/transactionService'

export function useTransactions() {
    const { token } = useAuth()

    const [transactions, setTransactions] = useState<Transaction[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        let cancelled = false

        async function loadTransactions() {
            if (!token) {
                setTransactions([])
                setLoading(false)
                return
            }

            setLoading(true)
            setError(null)

            try {
                const data = await transactionService.getAll(token)

                if (!cancelled) {
                    setTransactions(data)
                }
            } catch (err) {
                if (!cancelled) {
                    setError(
                        err instanceof Error
                            ? err.message
                            : 'Não foi possível carregar as transações.',
                    )
                }
            } finally {
                if (!cancelled) {
                    setLoading(false)
                }
            }
        }

        void loadTransactions()

        return () => {
            cancelled = true
        }
    }, [token])

    const totalIncome = transactions
        .filter((transaction) => transaction.type === 'INCOME')
        .reduce(
            (total, transaction) => total + Number(transaction.amount),
            0,
        )

    const totalExpense = transactions
        .filter((transaction) => transaction.type === 'EXPENSE')
        .reduce(
            (total, transaction) => total + Number(transaction.amount),
            0,
        )

    const balance = totalIncome - totalExpense

    return {
        transactions,
        loading,
        error,
        totalIncome,
        totalExpense,
        balance,
    }
}