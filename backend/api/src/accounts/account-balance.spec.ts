import { Prisma, TransactionType } from '@prisma/client'
import { describe, expect, it } from 'vitest'
import { calculateCurrentBalance } from './account-balance.js'

const accountId = '22222222-2222-4222-8222-222222222222'

describe('calculateCurrentBalance', () => {
    it('retorna o saldo inicial quando não há transações', () => {
        const balance = calculateCurrentBalance(
            new Prisma.Decimal('1000.50'),
            [],
        )

        expect(balance.toFixed(2)).toBe('1000.50')
    })

    it('soma receitas e subtrai despesas do saldo inicial', () => {
        const balance = calculateCurrentBalance(
            new Prisma.Decimal('1000'),
            [
                {
                    accountId,
                    type: TransactionType.INCOME,
                    amount: new Prisma.Decimal('2500.75'),
                },
                {
                    accountId,
                    type: TransactionType.EXPENSE,
                    amount: new Prisma.Decimal('320.40'),
                },
            ],
        )

        expect(balance.toFixed(2)).toBe('3180.35')
    })

    it('permite saldo negativo', () => {
        const balance = calculateCurrentBalance(
            new Prisma.Decimal('100'),
            [
                {
                    accountId,
                    type: TransactionType.EXPENSE,
                    amount: new Prisma.Decimal('150.01'),
                },
            ],
        )

        expect(balance.toFixed(2)).toBe('-50.01')
    })

    it('não acumula erro de ponto flutuante', () => {
        const balance = calculateCurrentBalance(
            new Prisma.Decimal('0.10'),
            [
                {
                    accountId,
                    type: TransactionType.INCOME,
                    amount: new Prisma.Decimal('0.20'),
                },
            ],
        )

        expect(balance.toString()).toBe('0.3')
    })

    it('trata soma nula como zero', () => {
        const balance = calculateCurrentBalance(
            new Prisma.Decimal('10'),
            [
                {
                    accountId,
                    type: TransactionType.INCOME,
                    amount: null,
                },
            ],
        )

        expect(balance.toFixed(2)).toBe('10.00')
    })

    it('não altera o saldo inicial recebido', () => {
        const initialBalance = new Prisma.Decimal('500')

        calculateCurrentBalance(initialBalance, [
            {
                accountId,
                type: TransactionType.INCOME,
                amount: new Prisma.Decimal('100'),
            },
        ])

        expect(initialBalance.toFixed(2)).toBe('500.00')
    })
})
