import {
    Body,
    Controller,
    Get,
    Post,
    UseGuards,
} from '@nestjs/common'

import { AuthService } from './auth.service.js'
import { LoginDto } from './dto/login.dto.js'
import { JwtAuthGuard } from './guards/jwt-auth.guard.js'
import { CurrentUser } from './current-user.decorator.js'
import type { AuthenticatedUser } from './interfaces/authenticated-user.interface.js'

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('login')
    login(@Body() dto: LoginDto) {
        return this.authService.login(dto)
    }

    @Get('me')
    @UseGuards(JwtAuthGuard)
    me(@CurrentUser() user: AuthenticatedUser) {
        return user
    }
}