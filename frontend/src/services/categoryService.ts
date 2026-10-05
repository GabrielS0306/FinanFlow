import { api } from './api'

export type TransactionType = 'INCOME' | 'EXPENSE'

export interface Category {
    id: string
    name: string
    type: TransactionType
    color: string
    userId: string
    createdAt: string
    updatedAt: string
}

export interface CreateCategoryData {
    name: string
    type: TransactionType
    color: string
}

export interface UpdateCategoryData {
    name?: string
    type?: TransactionType
    color?: string
}

export const categoryService = {
    async getAll(token: string): Promise<Category[]> {
        return api<Category[]>('/categories', {
            method: 'GET',
        }, token)
    },

    async getById(id: string, token: string): Promise<Category> {
        return api<Category>(`/categories/${id}`, {
            method: 'GET',
        }, token)
    },

    async create(
        data: CreateCategoryData,
        token: string,
    ): Promise<Category> {
        return api<Category>('/categories', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        }, token)
    },

    async update(
        id: string,
        data: UpdateCategoryData,
        token: string,
    ): Promise<Category> {
        return api<Category>(`/categories/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        }, token)
    },

    async remove(id: string, token: string): Promise<void> {
        await api<void>(`/categories/${id}`, {
            method: 'DELETE',
        }, token)
    },
}