import { Prisma, TransactionType } from '@prisma/client'

export interface AccountTransactionTotal {
    accountId: string
    type: TransactionType
    amount: Prisma.Decimal | null
}

// Saldo atual = saldo inicial + receitas − despesas.
// O valor é sempre calculado a partir das transações e nunca persistido,
// para que edições e exclusões de transações reflitam automaticamente.
// Todas as transações da conta entram no cálculo, inclusive as com data futura.
export function calculateCurrentBalance(
    initialBalance: Prisma.Decimal,
    totals: AccountTransactionTotal[],
) {
    return totals.reduce((balance, total) => {
        const amount = total.amount ?? new Prisma.Decimal(0)

        return total.type === TransactionType.INCOME
            ? balance.plus(amount)
            : balance.minus(amount)
    }, new Prisma.Decimal(initialBalance))
}
