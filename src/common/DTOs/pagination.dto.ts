import { ApiProperty } from "@nestjs/swagger"
import { Type } from "class-transformer"
import { IsInt, IsOptional, IsPositive, Min } from "class-validator"


export class PaginationDTO{

    @ApiProperty({
        default: 10,
        description: 'How many rows do you need'
    })
    @IsOptional()
    @IsInt()
    @IsPositive()
    @Type(()=> Number) // como es una query entra como string, de esta forma pasamos a number
    limit?: number

    @ApiProperty({
        default: 0,
        description: 'How many rows do you want skip'
    })
    @IsOptional()
    @IsInt()    
    @Type(()=> Number) // como es una query entra como string, de esta forma pasamos a number
    @Min(0)
    offset?: number
}