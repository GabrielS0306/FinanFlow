import {
    IsEnum,
    IsNumber,
    IsOptional,
    IsString,
    MinLength,
} from 'class-validator'
import { AccountType } from '@prisma/client'

export class CreateAccountDto {
    @IsString()
    @MinLength(2)
    name: string

    @IsOptional()
    @IsEnum(AccountType)
    type?: AccountType

    @IsOptional()
    @IsNumber({ allowNaN: false, allowInfinity: false })
    initialBalance?: number
}