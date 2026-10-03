import { api } from './api'

export type AccountType =
    | 'CHECKING'
    | 'SAVINGS'
    | 'CASH'
    | 'INVESTMENT'
    | 'OTHER'

export interface Account {
    id: string
    name: string
    type: AccountType
    initialBalance: number | string
    userId: string
    createdAt: string
    updatedAt: string
}

export interface CreateAccountData {
    name: string
    type?: AccountType
    initialBalance?: number
}

export interface UpdateAccountData {
    name?: string
    type?: AccountType
    initialBalance?: number
}

export const accountService = {
    findAll(token: string) {
        return api<Account[]>('/accounts', { method: 'GET' }, token)
    },

    findById(id: string, token: string) {
        return api<Account>(`/accounts/${id}`, { method: 'GET' }, token)
    },

    create(data: CreateAccountData, token: string) {
        return api<Account>(
            '/accounts',
            {
                method: 'POST',
                body: JSON.stringify(data),
            },
            token,
        )
    },

    update(id: string, data: UpdateAccountData, token: string) {
        return api<Account>(
            `/accounts/${id}`,
            {
                method: 'PATCH',
                body: JSON.stringify(data),
            },
            token,
        )
    },

    remove(id: string, token: string) {
        return api<{ message: string }>(
            `/accounts/${id}`,
            { method: 'DELETE' },
            token,
        )
    },
}