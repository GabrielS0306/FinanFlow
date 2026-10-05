import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common'
import { Prisma, TransactionType } from '@prisma/client'
import { PrismaService } from '../prisma/prisma.service.js'
import { CreateTransactionDto } from './dto/create-transaction.dto.js'
import { UpdateTransactionDto } from './dto/update-transaction.dto.js'

@Injectable()
export class TransactionsService {
    constructor(private readonly prisma: PrismaService) {}

    async create(userId: string, dto: CreateTransactionDto) {
        const account = await this.prisma.account.findFirst({
            where: {
                id: dto.accountId,
                userId,
            },
        })

        if (!account) {
            throw new NotFoundException(
                'Conta não encontrada ou não pertence ao usuário.',
            )
        }

        if (dto.categoryId) {
            const category = await this.prisma.category.findFirst({
                where: {
                    id: dto.categoryId,
                    userId,
                },
            })

            if (!category) {
                throw new NotFoundException(
                    'Categoria não encontrada ou não pertence ao usuário.',
                )
            }
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
        })
    }

    async findAll(userId: string) {
        return this.prisma.transaction.findMany({
            where: {
                userId,
            },
            orderBy: {
                date: 'desc',
            },
        })
    }

    async findOne(userId: string, id: string) {
        const transaction = await this.prisma.transaction.findFirst({
            where: {
                id,
                userId,
            },
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
        await this.findOne(userId, id)

        if (dto.accountId) {
            const account = await this.prisma.account.findFirst({
                where: {
                    id: dto.accountId,
                    userId,
                },
            })

            if (!account) {
                throw new NotFoundException(
                    'Conta não encontrada ou não pertence ao usuário.',
                )
            }
        }

        if (dto.categoryId) {
            const category = await this.prisma.category.findFirst({
                where: {
                    id: dto.categoryId,
                    userId,
                },
            })

            if (!category) {
                throw new NotFoundException(
                    'Categoria não encontrada ou não pertence ao usuário.',
                )
            }
        }

        const data: Prisma.TransactionUpdateInput = {}

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
            data.account = {
                connect: {
                    id: dto.accountId,
                },
            }
        }

        if (dto.categoryId !== undefined) {
            data.category = dto.categoryId
                ? {
                    connect: {
                        id: dto.categoryId,
                    },
                }
                : {
                    disconnect: true,
                }
        }

        await this.prisma.transaction.updateMany({
            where: {
                id,
                userId,
            },
            data,
        })

        return this.findOne(userId, id)
    }

    async remove(userId: string, id: string) {
        await this.findOne(userId, id)

        await this.prisma.transaction.deleteMany({
            where: {
                id,
                userId,
            },
        })

        return {
            message: 'Transação excluída com sucesso.',
        }
    }
}