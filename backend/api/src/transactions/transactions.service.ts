import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common'
import { Prisma, TransactionType } from '@prisma/client'
import { PrismaService } from '../prisma/prisma.service.js'
import { CreateTransactionDto } from './dto/create-transaction.dto.js'
import { UpdateTransactionDto } from './dto/update-transaction.dto.js'

const transactionInclude = {
    account: {
        select: {
            id: true,
            name: true,
            type: true,
        },
    },
    category: {
        select: {
            id: true,
            name: true,
            type: true,
            color: true,
        },
    },
} satisfies Prisma.TransactionInclude

@Injectable()
export class TransactionsService {
    constructor(private readonly prisma: PrismaService) {}

    async create(userId: string, dto: CreateTransactionDto) {
        await this.ensureAccountBelongsToUser(userId, dto.accountId)

        if (dto.categoryId) {
            await this.ensureCategoryIsValid(
                userId,
                dto.categoryId,
                dto.type,
            )
        }

        return this.prisma.transaction.create({
            data: {
                description: dto.description.trim(),
                amount: new Prisma.Decimal(dto.amount),
                type: dto.type,
                date: dto.date ? new Date(dto.date) : new Date(),
                notes: dto.notes?.trim() || null,
                userId,
                accountId: dto.accountId,
                categoryId: dto.categoryId ?? null,
            },
            include: transactionInclude,
        })
    }

    async findAll(userId: string) {
        return this.prisma.transaction.findMany({
            where: {
                userId,
            },
            include: transactionInclude,
            orderBy: [
                { date: 'desc' },
                { createdAt: 'desc' },
            ],
        })
    }

    async findOne(userId: string, id: string) {
        const transaction = await this.prisma.transaction.findFirst({
            where: {
                id,
                userId,
            },
            include: transactionInclude,
        })

        if (!transaction) {
            throw new NotFoundException('Transação não encontrada.')
        }

        return transaction
    }

    async update(
        userId: string,
        id: string,
        dto: UpdateTransactionDto,
    ) {
        const transaction = await this.findOne(userId, id)

        if (dto.accountId !== undefined) {
            await this.ensureAccountBelongsToUser(userId, dto.accountId)
        }

        // A categoria final precisa ser compatível com o tipo final,
        // mesmo quando apenas um dos dois campos é alterado.
        const nextType = dto.type ?? transaction.type
        const nextCategoryId =
            dto.categoryId !== undefined
                ? dto.categoryId
                : transaction.categoryId

        if (nextCategoryId) {
            await this.ensureCategoryIsValid(
                userId,
                nextCategoryId,
                nextType,
            )
        }

        const data: Prisma.TransactionUncheckedUpdateManyInput = {}

        if (dto.description !== undefined) {
            data.description = dto.description.trim()
        }

        if (dto.amount !== undefined) {
            data.amount = new Prisma.Decimal(dto.amount)
        }

        if (dto.type !== undefined) {
            data.type = dto.type
        }

        if (dto.date !== undefined) {
            data.date = new Date(dto.date)
        }

        if (dto.notes !== undefined) {
            data.notes = dto.notes.trim() || null
        }

        if (dto.accountId !== undefined) {
            data.accountId = dto.accountId
        }

        if (dto.categoryId !== undefined) {
            data.categoryId = dto.categoryId || null
        }

        const result = await this.prisma.transaction.updateMany({
            where: {
                id,
                userId,
            },
            data,
        })

        if (result.count === 0) {
            throw new NotFoundException('Transação não encontrada.')
        }

        return this.findOne(userId, id)
    }

    async remove(userId: string, id: string) {
        await this.findOne(userId, id)

        const result = await this.prisma.transaction.deleteMany({
            where: {
                id,
                userId,
            },
        })

        if (result.count === 0) {
            throw new NotFoundException('Transação não encontrada.')
        }

        return {
            message: 'Transação excluída com sucesso.',
        }
    }

    private async ensureAccountBelongsToUser(
        userId: string,
        accountId: string,
    ) {
        const account = await this.prisma.account.findFirst({
            where: {
                id: accountId,
                userId,
            },
            select: {
                id: true,
            },
        })

        if (!account) {
            throw new NotFoundException(
                'Conta não encontrada ou não pertence ao usuário.',
            )
        }
    }

    private async ensureCategoryIsValid(
        userId: string,
        categoryId: string,
        type: TransactionType,
    ) {
        const category = await this.prisma.category.findFirst({
            where: {
                id: categoryId,
                userId,
            },
            select: {
                id: true,
                type: true,
            },
        })

        if (!category) {
            throw new NotFoundException(
                'Categoria não encontrada ou não pertence ao usuário.',
            )
        }

        if (category.type !== type) {
            throw new BadRequestException(
                type === TransactionType.INCOME
                    ? 'A categoria selecionada é de despesa e não pode ser usada em uma receita.'
                    : 'A categoria selecionada é de receita e não pode ser usada em uma despesa.',
            )
        }
    }
}
