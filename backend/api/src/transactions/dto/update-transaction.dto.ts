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

export class UpdateTransactionDto {
    @IsOptional()
    @IsString()
    @MinLength(2)
    description?: string

    @IsOptional()
    @IsNumber({
        allowNaN: false,
        allowInfinity: false,
    })
    @Min(0.01)
    amount?: number

    @IsOptional()
    @IsEnum(TransactionType)
    type?: TransactionType

    @IsOptional()
    @IsDateString()
    date?: string

    @IsOptional()
    @IsString()
    notes?: string

    @IsOptional()
    @IsUUID()
    accountId?: string

    @IsOptional()
    @IsUUID()
    categoryId?: string
}