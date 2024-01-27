import { Type } from "class-transformer"
import { IsInt, IsOptional, IsPositive, Min } from "class-validator"


export class PaginationDTO{
    @IsOptional()
    @IsInt()
    @IsPositive()
    @Type(()=> Number) // como es una query entra como string, de esta forma pasamos a number
    limit?: number

    @IsOptional()
    @IsInt()    
    @Type(()=> Number) // como es una query entra como string, de esta forma pasamos a number
    @Min(0)
    offset?: number
}