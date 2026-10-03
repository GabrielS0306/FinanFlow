import { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { accountService, type Account } from '../services/accountService'

export function useAccounts() {
    const { token } = useAuth()

    const [accounts, setAccounts] = useState<Account[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        let cancelled = false

        async function loadAccounts() {
            if (!token) {
                setAccounts([])
                setLoading(false)
                return
            }

            setLoading(true)
            setError(null)

            try {
                const data = await accountService.findAll(token)

                if (!cancelled) {
                    setAccounts(data)
                }
            } catch (err) {
                if (!cancelled) {
                    setError(
                        err instanceof Error
                            ? err.message
                            : 'Não foi possível carregar as contas.',
                    )
                }
            } finally {
                if (!cancelled) {
                    setLoading(false)
                }
            }
        }

        void loadAccounts()

        return () => {
            cancelled = true
        }
    }, [token])

    const totalInitialBalance = accounts.reduce(
        (total, account) => total + Number(account.initialBalance),
        0,
    )

    return {
        accounts,
        loading,
        error,
        totalInitialBalance,
    }
}