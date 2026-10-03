const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

export interface RegisterData {
    name: string
    email: string
    password: string
}

export interface LoginData {
    email: string
    password: string
}

export interface AuthResponse {
    access_token: string
    token_type: 'Bearer'
    user: {
        id: string
        name: string
        email: string
    }
}

async function request<T>(path: string, data: unknown): Promise<T> {
    const response = await fetch(`${API_URL}${path}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })

    const result = await response.json().catch(() => null)

    if (!response.ok) {
        const message = Array.isArray(result?.message)
            ? result.message.join(', ')
            : result?.message ?? 'Ocorreu um erro. Tente novamente.'

        throw new Error(message)
    }

    return result as T
}

export const authService = {
    register(data: RegisterData) {
        return request<{ id: string; name: string; email: string; createdAt: string }>(
            '/users',
            data,
        )
    },

    login(data: LoginData) {
        return request<AuthResponse>('/auth/login', data)
    },
}