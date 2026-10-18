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
import { TransactionsService } from './transactions.service.js'
import { CreateTransactionDto } from './dto/create-transaction.dto.js'
import { UpdateTransactionDto } from './dto/update-transaction.dto.js'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js'
import { CurrentUser } from '../auth/current-user.decorator.js'
import type { AuthenticatedUser } from '../auth/interfaces/authenticated-user.interface.js'

@Controller('transactions')
@UseGuards(JwtAuthGuard)
export class TransactionsController {
    constructor(
        private readonly transactionsService: TransactionsService,
    ) {}

    @Post()
    create(
        @CurrentUser() user: AuthenticatedUser,
        @Body() dto: CreateTransactionDto,
    ) {
        return this.transactionsService.create(user.userId, dto)
    }

    @Get()
    findAll(@CurrentUser() user: AuthenticatedUser) {
        return this.transactionsService.findAll(user.userId)
    }

    @Get(':id')
    findOne(
        @CurrentUser() user: AuthenticatedUser,
        @Param('id') id: string,
    ) {
        return this.transactionsService.findOne(user.userId, id)
    }

    @Patch(':id')
    update(
        @CurrentUser() user: AuthenticatedUser,
        @Param('id') id: string,
        @Body() dto: UpdateTransactionDto,
    ) {
        return this.transactionsService.update(user.userId, id, dto)
    }

    @Delete(':id')
    remove(
        @CurrentUser() user: AuthenticatedUser,
        @Param('id') id: string,
    ) {
        return this.transactionsService.remove(user.userId, id)
    }
}