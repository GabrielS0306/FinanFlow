import { IsEnum, IsOptional, IsString, MinLength } from 'class-validator'
import { TransactionType } from '@prisma/client'

export class UpdateCategoryDto {
    @IsOptional()
    @IsString()
    @MinLength(2)
    name?: string

    @IsOptional()
    @IsEnum(TransactionType)
    type?: TransactionType

    @IsOptional()
    @IsString()
    color?: string
}