import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    UseGuards,
} from '@nestjs/common'

import { AccountsService } from './accounts.service.js'
import { CreateAccountDto } from './dto/create-account.dto.js'
import { UpdateAccountDto } from './dto/update-account.dto.js'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js'
import { CurrentUser } from '../auth/current-user.decorator.js'
import type { AuthenticatedUser } from '../auth/interfaces/authenticated-user.interface.js'

@Controller('accounts')
@UseGuards(JwtAuthGuard)
export class AccountsController {
    constructor(
        private readonly accountsService: AccountsService,
    ) {}

    @Post()
    create(
        @CurrentUser() user: AuthenticatedUser,
        @Body() dto: CreateAccountDto,
    ) {
        return this.accountsService.create(user.userId, dto)
    }

    @Get()
    findAll(@CurrentUser() user: AuthenticatedUser) {
        return this.accountsService.findAll(user.userId)
    }

    @Get(':id')
    findOne(
        @CurrentUser() user: AuthenticatedUser,
        @Param('id') id: string,
    ) {
        return this.accountsService.findOne(user.userId, id)
    }

    @Patch(':id')
    update(
        @CurrentUser() user: AuthenticatedUser,
        @Param('id') id: string,
        @Body() dto: UpdateAccountDto,
    ) {
        return this.accountsService.update(user.userId, id, dto)
    }

    @Delete(':id')
    remove(
        @CurrentUser() user: AuthenticatedUser,
        @Param('id') id: string,
    ) {
        return this.accountsService.remove(user.userId, id)
    }
}