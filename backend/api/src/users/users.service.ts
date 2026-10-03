import {
    ConflictException,
    Injectable,
} from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { hash } from 'bcryptjs'
import { PrismaService } from '../prisma/prisma.service.js'
import { CreateUserDto } from './dto/create-user.dto.js'

@Injectable()
export class UsersService {
    constructor(private readonly prisma: PrismaService) {}

    async create(dto: CreateUserDto) {
        const passwordHash = await hash(dto.password, 12)

        try {
            const user = await this.prisma.user.create({
                data: {
                    name: dto.name,
                    email: dto.email.toLowerCase().trim(),
                    passwordHash,
                },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    createdAt: true,
                },
            })

            return user
        } catch (error) {
            if (
                error instanceof Prisma.PrismaClientKnownRequestError &&
                error.code === 'P2002'
            ) {
                throw new ConflictException(
                    'Este e-mail já está cadastrado.',
                )
            }

            throw error
        }
    }
}