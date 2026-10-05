import {
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service.js'
import { CreateCategoryDto } from './dto/create-category.dto.js'
import { UpdateCategoryDto } from './dto/update-category.dto.js'

@Injectable()
export class CategoriesService {
    constructor(private readonly prisma: PrismaService) {}

    async create(userId: string, dto: CreateCategoryDto) {
        const existingCategory = await this.prisma.category.findFirst({
            where: {
                userId,
                name: dto.name.trim(),
                type: dto.type,
            },
        })

        if (existingCategory) {
            throw new ConflictException(
                'Já existe uma categoria com esse nome e tipo.',
            )
        }

        return this.prisma.category.create({
            data: {
                name: dto.name.trim(),
                type: dto.type,
                color: dto.color,
                userId,
            },
        })
    }

    async findAll(userId: string) {
        return this.prisma.category.findMany({
            where: { userId },
            orderBy: { name: 'asc' },
        })
    }

    async findOne(userId: string, id: string) {
        const category = await this.prisma.category.findFirst({
            where: {
                id,
                userId,
            },
        })

        if (!category) {
            throw new NotFoundException('Categoria não encontrada.')
        }

        return category
    }

    async update(
        userId: string,
        id: string,
        dto: UpdateCategoryDto,
    ) {
        const category = await this.findOne(userId, id)

        const name = dto.name?.trim() ?? category.name
        const type = dto.type ?? category.type

        const existingCategory = await this.prisma.category.findFirst({
            where: {
                userId,
                name,
                type,
                NOT: {
                    id,
                },
            },
        })

        if (existingCategory) {
            throw new ConflictException(
                'Já existe uma categoria com esse nome e tipo.',
            )
        }

        const data: {
            name?: string
            type?: typeof category.type
            color?: string
        } = {}

        if (dto.name !== undefined) {
            data.name = dto.name.trim()
        }

        if (dto.type !== undefined) {
            data.type = dto.type
        }

        if (dto.color !== undefined) {
            data.color = dto.color
        }

        await this.prisma.category.updateMany({
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

        await this.prisma.category.deleteMany({
            where: {
                id,
                userId,
            },
        })

        return {
            message: 'Categoria excluída com sucesso.',
        }
    }
}