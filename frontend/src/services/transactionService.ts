import { api } from './api'
import type { AccountType } from './accountService'

export type TransactionType = 'INCOME' | 'EXPENSE'

export interface TransactionAccount {
    id: string
    name: string
    type: AccountType
}

export interface TransactionCategory {
    id: string
    name: string
    type: TransactionType
    color: string
}

export interface Transaction {
    id: string
    description: string
    amount: string
    type: TransactionType
    date: string
    notes?: string | null
    userId: string
    accountId: string
    categoryId?: string | null
    account: TransactionAccount
    category: TransactionCategory | null
    createdAt: string
    updatedAt: string
}

export interface CreateTransactionData {
    description: string
    amount: number
    type: TransactionType
    date?: string
    notes?: string
    accountId: string
    categoryId?: string
}

export interface UpdateTransactionData {
    description?: string
    amount?: number
    type?: TransactionType
    date?: string
    notes?: string
    accountId?: string
    categoryId?: string | null
}

export const transactionService = {
    async getAll(token: string): Promise<Transaction[]> {
        return api<Transaction[]>('/transactions', {
            method: 'GET',
        }, token)
    },

    async getById(
        id: string,
        token: string,
    ): Promise<Transaction> {
        return api<Transaction>(`/transactions/${id}`, {
            method: 'GET',
        }, token)
    },

    async create(
        data: CreateTransactionData,
        token: string,
    ): Promise<Transaction> {
        return api<Transaction>('/transactions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        }, token)
    },

    async update(
        id: string,
        data: UpdateTransactionData,
        token: string,
    ): Promise<Transaction> {
        return api<Transaction>(`/transactions/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        }, token)
    },

    async remove(id: string, token: string): Promise<void> {
        await api<void>(`/transactions/${id}`, {
            method: 'DELETE',
        }, token)
    },
}