import { NotFoundException } from '@nestjs/common'
import { AccountType, Prisma, TransactionType } from '@prisma/client'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { PrismaService } from '../prisma/prisma.service.js'
import { AccountsService } from './accounts.service.js'

const userId = '11111111-1111-4111-8111-111111111111'
const checkingId = '22222222-2222-4222-8222-222222222222'
const savingsId = '33333333-3333-4333-8333-333333333333'

function buildAccount(id: string, initialBalance: string) {
    return {
        id,
        name: id === checkingId ? 'Corrente' : 'Poupança',
        type: AccountType.CHECKING,
        initialBalance: new Prisma.Decimal(initialBalance),
        userId,
        createdAt: new Date('2026-10-01T00:00:00.000Z'),
        updatedAt: new Date('2026-10-01T00:00:00.000Z'),
    }
}

function createPrismaMock() {
    return {
        account: {
            create: vi.fn(),
            findMany: vi.fn(),
            findFirst: vi.fn(),
        },
        transaction: {
            groupBy: vi.fn(),
        },
    }
}

describe('AccountsService', () => {
    let prisma: ReturnType<typeof createPrismaMock>
    let service: AccountsService

    beforeEach(() => {
        prisma = createPrismaMock()
        // O mock implementa apenas os métodos usados nestes testes.
        service = new AccountsService(prisma as unknown as PrismaService)
    })

    it('calcula o saldo atual de cada conta com uma única consulta agrupada', async () => {
        prisma.account.findMany.mockResolvedValue([
            buildAccount(checkingId, '1000'),
            buildAccount(savingsId, '200'),
        ])
        prisma.transaction.groupBy.mockResolvedValue([
            {
                accountId: checkingId,
                type: TransactionType.INCOME,
                _sum: { amount: new Prisma.Decimal('500') },
            },
            {
                accountId: checkingId,
                type: TransactionType.EXPENSE,
                _sum: { amount: new Prisma.Decimal('120.30') },
            },
        ])

        const accounts = await service.findAll(userId)

        expect(prisma.transaction.groupBy).toHaveBeenCalledTimes(1)
        expect(prisma.transaction.groupBy).toHaveBeenCalledWith(
            expect.objectContaining({
                where: {
                    userId,
                    accountId: { in: [checkingId, savingsId] },
                },
            }),
        )
        expect(accounts.map((account) => account.currentBalance.toFixed(2)))
            .toEqual(['1379.70', '200.00'])
        expect(accounts[0].initialBalance.toFixed(2)).toBe('1000.00')
    })

    it('não consulta transações quando o usuário não tem contas', async () => {
        prisma.account.findMany.mockResolvedValue([])

        await expect(service.findAll(userId)).resolves.toEqual([])
        expect(prisma.transaction.groupBy).not.toHaveBeenCalled()
    })

    it('retorna o saldo atual no detalhe da conta', async () => {
        prisma.account.findFirst.mockResolvedValue(
            buildAccount(checkingId, '50'),
        )
        prisma.transaction.groupBy.mockResolvedValue([
            {
                accountId: checkingId,
                type: TransactionType.EXPENSE,
                _sum: { amount: new Prisma.Decimal('80') },
            },
        ])

        const account = await service.findOne(userId, checkingId)

        expect(account.currentBalance.toFixed(2)).toBe('-30.00')
    })

    it('rejeita conta de outro usuário', async () => {
        prisma.account.findFirst.mockResolvedValue(null)

        await expect(
            service.findOne(userId, checkingId),
        ).rejects.toBeInstanceOf(NotFoundException)
        expect(prisma.transaction.groupBy).not.toHaveBeenCalled()
    })
})
