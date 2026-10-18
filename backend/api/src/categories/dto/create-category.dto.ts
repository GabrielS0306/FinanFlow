import { IsEnum, IsString, MinLength } from 'class-validator'
import { TransactionType } from '@prisma/client'

export class CreateCategoryDto {
    @IsString()
    @MinLength(2)
    name: string

    @IsEnum(TransactionType)
    type: TransactionType

    @IsString()
    color: string
}