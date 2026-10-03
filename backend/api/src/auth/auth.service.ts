import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { compare } from 'bcryptjs'
import { PrismaService } from '../prisma/prisma.service.js'
import { LoginDto } from './dto/login.dto.js'

@Injectable()
export class AuthService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwtService: JwtService,
    ) {}

    async login(dto: LoginDto) {
        const email = dto.email.toLowerCase().trim()

        const user = await this.prisma.user.findUnique({
            where: { email },
        })

        if (!user) {
            throw new UnauthorizedException('E-mail ou senha inválidos.')
        }

        const passwordIsValid = await compare(
            dto.password,
            user.passwordHash,
        )

        if (!passwordIsValid) {
            throw new UnauthorizedException('E-mail ou senha inválidos.')
        }

        const accessToken = await this.jwtService.signAsync({
            sub: user.id,
            email: user.email,
        })

        return {
            access_token: accessToken,
            token_type: 'Bearer',
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            },
        }
    }
}