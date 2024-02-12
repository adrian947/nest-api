import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsBoolean, IsDefined, IsOptional, IsString, } from "class-validator";

export class CloudinaryDTO {
    @ApiProperty()
    @IsDefined()
    @IsOptional()
    @IsBoolean()        
    cloudinary?: boolean;
}
