import {
    IsDateString,
    IsEnum,
    IsNumber,
    IsOptional,
    IsString,
    IsUUID,
    Min,
    MinLength,
} from 'class-validator'
import { TransactionType } from '@prisma/client'

export class CreateTransactionDto {
    @IsString()
    @MinLength(2)
    description: string

    @IsNumber({
        allowNaN: false,
        allowInfinity: false,
    })
    @Min(0.01)
    amount: number

    @IsEnum(TransactionType)
    type: TransactionType

    @IsOptional()
    @IsDateString()
    date?: string

    @IsOptional()
    @IsString()
    notes?: string

    @IsUUID()
    accountId: string

    @IsOptional()
    @IsUUID()
    categoryId?: string
}