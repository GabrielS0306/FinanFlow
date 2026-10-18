import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from 'react'
import { setUnauthorizedHandler } from '../services/api'
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

const TOKEN_KEY = 'finanflow_token'
const USER_KEY = 'finanflow_user'

// Lê apenas o campo "exp" do JWT para descartar tokens vencidos.
// A validação de verdade continua sendo feita pela API.
function isTokenExpired(token: string) {
    try {
        const payload = token.split('.')[1]
        const base64 = payload.replace(/-/g, '+').replace(/_/g, '/')
        const { exp } = JSON.parse(atob(base64)) as { exp?: number }

        return typeof exp === 'number' && exp * 1000 <= Date.now()
    } catch {
        return true
    }
}

function getStoredToken() {
    const storedToken = localStorage.getItem(TOKEN_KEY)

    if (storedToken && isTokenExpired(storedToken)) {
        localStorage.removeItem(TOKEN_KEY)
        localStorage.removeItem(USER_KEY)
        return null
    }

    return storedToken
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const [token, setToken] = useState<string | null>(getStoredToken)

    const [user, setUser] = useState<AuthUser | null>(() => {
        const storedUser = localStorage.getItem(USER_KEY)

        if (!storedUser) {
            return null
        }

        try {
            return JSON.parse(storedUser) as AuthUser
        } catch {
            localStorage.removeItem(USER_KEY)
            return null
        }
    })

    async function login(email: string, password: string) {
        const response = await authService.login({
            email,
            password,
        })

        setUser(response.user)
        setToken(response.access_token)

        localStorage.setItem(
            USER_KEY,
            JSON.stringify(response.user),
        )

        localStorage.setItem(
            TOKEN_KEY,
            response.access_token,
        )
    }

    const logout = useCallback(() => {
        setUser(null)
        setToken(null)

        localStorage.removeItem(USER_KEY)
        localStorage.removeItem(TOKEN_KEY)
    }, [])

    useEffect(() => {
        setUnauthorizedHandler(logout)

        return () => {
            setUnauthorizedHandler(null)
        }
    }, [logout])

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
        throw new Error(
            'useAuth deve ser utilizado dentro de AuthProvider',
        )
    }

    return context
}