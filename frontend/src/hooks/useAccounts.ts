import { useCallback, useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import {
    accountService,
    type Account,
} from '../services/accountService'

export function useAccounts() {
    const { token } = useAuth()

    const [accounts, setAccounts] = useState<Account[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const loadAccounts = useCallback(async () => {
        if (!token) {
            setAccounts([])
            setLoading(false)
            return
        }

        setLoading(true)
        setError(null)

        try {
            const data = await accountService.findAll(token)
            setAccounts(data)
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : 'Não foi possível carregar as contas.',
            )
        } finally {
            setLoading(false)
        }
    }, [token])

    useEffect(() => {
        void loadAccounts()
    }, [loadAccounts])

    const totalInitialBalance = accounts.reduce(
        (total, account) =>
            total + Number(account.initialBalance),
        0,
    )

    return {
        accounts,
        loading,
        error,
        totalInitialBalance,
        refetch: loadAccounts,
    }
}