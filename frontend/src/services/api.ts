const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

type ApiOptions = RequestInit

let unauthorizedHandler: (() => void) | null = null

// Permite que o contexto de autenticação reaja a um token
// expirado ou inválido sem acoplar este módulo ao React.
export function setUnauthorizedHandler(handler: (() => void) | null) {
    unauthorizedHandler = handler
}

export async function api<T>(
    endpoint: string,
    options: ApiOptions = {},
    token?: string,
): Promise<T> {
    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
            ...(token && {
                Authorization: `Bearer ${token}`,
            }),
        },
    })

    if (response.status === 401 && token) {
        unauthorizedHandler?.()

        throw new Error('Sua sessão expirou. Faça login novamente.')
    }

    if (!response.ok) {
        const error = await response.json().catch(() => null)

        const message = Array.isArray(error?.message)
            ? error.message.join(', ')
            : error?.message

        throw new Error(message || `Erro na requisição: ${response.status}`)
    }

    if (response.status === 204) {
        return undefined as T
    }

    return response.json() as Promise<T>
}