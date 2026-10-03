import {
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { PrismaService } from '../prisma/prisma.service.js'
import { CreateAccountDto } from './dto/create-account.dto.js'
import { UpdateAccountDto } from './dto/update-account.dto.js'

@Injectable()
export class AccountsService {
    constructor(private readonly prisma: PrismaService) {}

    async create(userId: string, dto: CreateAccountDto) {
        return this.prisma.account.create({
            data: {
                name: dto.name.trim(),
                type: dto.type,
                initialBalance: dto.initialBalance ?? 0,
                userId,
            },
        })
    }

    async findAll(userId: string) {
        return this.prisma.account.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        })
    }

    async findOne(userId: string, id: string) {
        const account = await this.prisma.account.findFirst({
            where: {
                id,
                userId,
            },
        })

        if (!account) {
            throw new NotFoundException('Conta não encontrada.')
        }

        return account
    }

    async update(
        userId: string,
        id: string,
        dto: UpdateAccountDto,
    ) {
        await this.findOne(userId, id)

        const data: Prisma.AccountUpdateManyMutationInput = {}

        if (dto.name !== undefined) {
            data.name = dto.name.trim()
        }

        if (dto.type !== undefined) {
            data.type = dto.type
        }

        if (dto.initialBalance !== undefined) {
            data.initialBalance = dto.initialBalance
        }

        const result = await this.prisma.account.updateMany({
            where: {
                id,
                userId,
            },
            data,
        })

        if (result.count === 0) {
            throw new NotFoundException('Conta não encontrada.')
        }

        return this.findOne(userId, id)
    }

    async remove(userId: string, id: string) {
        await this.findOne(userId, id)

        const transactionsCount = await this.prisma.transaction.count({
            where: {
                accountId: id,
                userId,
            },
        })

        if (transactionsCount > 0) {
            throw new ConflictException(
                'Não é possível excluir uma conta que possui transações.',
            )
        }

        const result = await this.prisma.account.deleteMany({
            where: {
                id,
                userId,
            },
        })

        if (result.count === 0) {
            throw new NotFoundException('Conta não encontrada.')
        }

        return {
            message: 'Conta excluída com sucesso.',
        }
    }
}