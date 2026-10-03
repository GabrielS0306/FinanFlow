import {
    createContext,
    useContext,
    useState,
    type ReactNode,
} from 'react'
import { authService, type AuthResponse } from '../services/authService'

type AuthUser = AuthResponse['user']

interface AuthContextData {
    user: AuthUser | null
    token: string | null
    isAuthenticated: boolean
    login: (email: string, password: string) => Promise<void>
    logout: () => void
}

const AuthContext = createContext<AuthContextData | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null)
    const [token, setToken] = useState<string | null>(null)

    async function login(email: string, password: string) {
        const response = await authService.login({ email, password })

        setUser(response.user)
        setToken(response.access_token)
    }

    function logout() {
        setUser(null)
        setToken(null)
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                isAuthenticated: Boolean(token),
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)

    if (!context) {
        throw new Error('useAuth deve ser utilizado dentro de AuthProvider')
    }

    return context
}