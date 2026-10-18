import { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import {
    categoryService,
    type Category,
} from '../services/categoryService'

export function useCategories() {
    const { token } = useAuth()

    const [categories, setCategories] = useState<Category[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        let cancelled = false

        async function loadCategories() {
            if (!token) {
                setCategories([])
                setLoading(false)
                return
            }

            setLoading(true)
            setError(null)

            try {
                const data = await categoryService.getAll(token)

                if (!cancelled) {
                    setCategories(data)
                }
            } catch (err) {
                if (!cancelled) {
                    setError(
                        err instanceof Error
                            ? err.message
                            : 'Não foi possível carregar as categorias.',
                    )
                }
            } finally {
                if (!cancelled) {
                    setLoading(false)
                }
            }
        }

        void loadCategories()

        return () => {
            cancelled = true
        }
    }, [token])

    return {
        categories,
        loading,
        error,
    }
}