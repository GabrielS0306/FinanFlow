import { BadRequestException, NotFoundException } from '@nestjs/common'
import { Prisma, TransactionType } from '@prisma/client'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { PrismaService } from '../prisma/prisma.service.js'
import { TransactionsService } from './transactions.service.js'

const userId = '11111111-1111-4111-8111-111111111111'
const accountId = '22222222-2222-4222-8222-222222222222'
const expenseCategoryId = '33333333-3333-4333-8333-333333333333'
const incomeCategoryId = '44444444-4444-4444-8444-444444444444'
const transactionId = '55555555-5555-4555-8555-555555555555'

function createPrismaMock() {
    return {
        account: {
            findFirst: vi.fn(),
        },
        category: {
            findFirst: vi.fn(),
        },
        transaction: {
            create: vi.fn(),
            findMany: vi.fn(),
            findFirst: vi.fn(),
            updateMany: vi.fn(),
            deleteMany: vi.fn(),
        },
    }
}

function buildTransaction(overrides: Record<string, unknown> = {}) {
    return {
        id: transactionId,
        description: 'Mercado',
        amount: new Prisma.Decimal('150.25'),
        type: TransactionType.EXPENSE,
        date: new Date('2026-10-18T00:00:00.000Z'),
        notes: null,
        userId,
        accountId,
        categoryId: expenseCategoryId,
        ...overrides,
    }
}

describe('TransactionsService', () => {
    let prisma: ReturnType<typeof createPrismaMock>
    let service: TransactionsService

    beforeEach(() => {
        prisma = createPrismaMock()
        // O mock implementa apenas os métodos usados pelo service.
        service = new TransactionsService(
            prisma as unknown as PrismaService,
        )

        prisma.account.findFirst.mockResolvedValue({ id: accountId })
        prisma.category.findFirst.mockImplementation(
            ({ where }: { where: { id: string } }) => {
                if (where.id === expenseCategoryId) {
                    return Promise.resolve({
                        id: expenseCategoryId,
                        type: TransactionType.EXPENSE,
                    })
                }

                if (where.id === incomeCategoryId) {
                    return Promise.resolve({
                        id: incomeCategoryId,
                        type: TransactionType.INCOME,
                    })
                }

                return Promise.resolve(null)
            },
        )
    })

    describe('create', () => {
        it('cria a transação vinculada ao usuário autenticado', async () => {
            prisma.transaction.create.mockResolvedValue(buildTransaction())

            await service.create(userId, {
                description: '  Mercado  ',
                amount: 150.25,
                type: TransactionType.EXPENSE,
                date: '2026-10-18',
                accountId,
                categoryId: expenseCategoryId,
            })

            expect(prisma.account.findFirst).toHaveBeenCalledWith(
                expect.objectContaining({
                    where: { id: accountId, userId },
                }),
            )

            const { data } = prisma.transaction.create.mock.calls[0][0]

            expect(data).toMatchObject({
                description: 'Mercado',
                type: TransactionType.EXPENSE,
                userId,
                accountId,
                categoryId: expenseCategoryId,
                notes: null,
            })
            expect(data.amount.toString()).toBe('150.25')
        })

        it('rejeita conta que não pertence ao usuário', async () => {
            prisma.account.findFirst.mockResolvedValue(null)

            await expect(
                service.create(userId, {
                    description: 'Mercado',
                    amount: 10,
                    type: TransactionType.EXPENSE,
                    accountId,
                }),
            ).rejects.toBeInstanceOf(NotFoundException)

            expect(prisma.transaction.create).not.toHaveBeenCalled()
        })

        it('rejeita categoria que não pertence ao usuário', async () => {
            await expect(
                service.create(userId, {
                    description: 'Mercado',
                    amount: 10,
                    type: TransactionType.EXPENSE,
                    accountId,
                    categoryId: '66666666-6666-4666-8666-666666666666',
                }),
            ).rejects.toBeInstanceOf(NotFoundException)

            expect(prisma.transaction.create).not.toHaveBeenCalled()
        })

        it('rejeita categoria de tipo diferente da transação', async () => {
            await expect(
                service.create(userId, {
                    description: 'Salário',
                    amount: 5000,
                    type: TransactionType.INCOME,
                    accountId,
                    categoryId: expenseCategoryId,
                }),
            ).rejects.toBeInstanceOf(BadRequestException)

            expect(prisma.transaction.create).not.toHaveBeenCalled()
        })
    })

    describe('update', () => {
        beforeEach(() => {
            prisma.transaction.findFirst.mockResolvedValue(
                buildTransaction(),
            )
            prisma.transaction.updateMany.mockResolvedValue({ count: 1 })
        })

        it('atualiza conta e categoria usando campos escalares', async () => {
            await service.update(userId, transactionId, {
                accountId,
                categoryId: expenseCategoryId,
            })

            expect(prisma.transaction.updateMany).toHaveBeenCalledWith({
                where: { id: transactionId, userId },
                data: {
                    accountId,
                    categoryId: expenseCategoryId,
                },
            })
        })

        it('remove a categoria quando recebe null', async () => {
            await service.update(userId, transactionId, {
                categoryId: null,
            })

            expect(prisma.category.findFirst).not.toHaveBeenCalled()
            expect(prisma.transaction.updateMany).toHaveBeenCalledWith({
                where: { id: transactionId, userId },
                data: { categoryId: null },
            })
        })

        it('rejeita trocar o tipo mantendo uma categoria incompatível', async () => {
            await expect(
                service.update(userId, transactionId, {
                    type: TransactionType.INCOME,
                }),
            ).rejects.toBeInstanceOf(BadRequestException)

            expect(prisma.transaction.updateMany).not.toHaveBeenCalled()
        })

        it('aceita trocar tipo e categoria juntos', async () => {
            await service.update(userId, transactionId, {
                type: TransactionType.INCOME,
                categoryId: incomeCategoryId,
            })

            expect(prisma.transaction.updateMany).toHaveBeenCalledWith({
                where: { id: transactionId, userId },
                data: {
                    type: TransactionType.INCOME,
                    categoryId: incomeCategoryId,
                },
            })
        })

        it('rejeita transação de outro usuário', async () => {
            prisma.transaction.findFirst.mockResolvedValue(null)

            await expect(
                service.update(userId, transactionId, {
                    description: 'Outro',
                }),
            ).rejects.toBeInstanceOf(NotFoundException)

            expect(prisma.transaction.updateMany).not.toHaveBeenCalled()
        })
    })

    describe('remove', () => {
        it('exclui apenas transações do usuário autenticado', async () => {
            prisma.transaction.findFirst.mockResolvedValue(
                buildTransaction(),
            )
            prisma.transaction.deleteMany.mockResolvedValue({ count: 1 })

            await expect(
                service.remove(userId, transactionId),
            ).resolves.toEqual({
                message: 'Transação excluída com sucesso.',
            })

            expect(prisma.transaction.deleteMany).toHaveBeenCalledWith({
                where: { id: transactionId, userId },
            })
        })
    })
})
