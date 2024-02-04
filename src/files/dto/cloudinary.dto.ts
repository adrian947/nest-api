import { Transform } from "class-transformer";
import { IsBoolean, IsDefined, IsOptional, IsString, } from "class-validator";

export class CloudinaryDTO {
    @IsDefined()
    @IsOptional()
    @IsBoolean()        
    cloudinary?: boolean;
}
