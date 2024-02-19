import {
  Controller,
  Get,
  Post,
  Param,
  UploadedFile,
  UseInterceptors,
  MaxFileSizeValidator,
  ParseFilePipe,
  BadRequestException,
  Query,
  ParseBoolPipe,
  Res,
  NotFoundException
} from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileFilter } from './helpers/fileFilter';
import { diskStorage } from 'multer';
import { fileNamer } from './helpers/fileNamer';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { CloudinaryDTO } from './dto/cloudinary.dto';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { ValidRoles } from 'src/auth/interfaces/valid-roles-interface';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Files')
@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly cloudinaryService: CloudinaryService,
    private readonly configService: ConfigService,

  ) { }

  @Get('product/:imageName')
  @Auth(ValidRoles.all)
  async findOneImage(
    @Param('imageName') imageName: string,
    @Res() res: Response,
    @Query('cloudinary', new ParseBoolPipe({ optional: true })) cloudinary: CloudinaryDTO) {
    const path = this.filesService.getStaticProductImage(imageName)
    
    if (cloudinary) {
      const imageCloudinary = await this.cloudinaryService.getImageUrl(imageName)

      if (imageCloudinary.total_count === 0) {
        throw new NotFoundException('Image not found in cloudinary')
      }
      return res.status(200).json( imageCloudinary )
    }

    res.sendFile(path);
  }


  @Post('product')
  @Auth(ValidRoles.all)
  @UseInterceptors(FileInterceptor('file', {
    fileFilter: fileFilter,
    storage: diskStorage({
      destination: './static/products',
      filename: fileNamer
    })
  }))

  async uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 100000 }),
        ],
      }),
    ) file: Express.Multer.File,
    @Query('cloudinary', new ParseBoolPipe({ optional: true })) cloudinary: CloudinaryDTO) {

    if (!file) {
      throw new BadRequestException('make sure that the file is an image')
    }
    if (cloudinary) {
      const cloudinaryResponse = await this.cloudinaryService.uploadFile(file);


      return {
        ...file,
        path: `${this.configService.get('HOST_API')}/files/product/${file.filename}`,
        urlCloudinary: cloudinaryResponse.secure_url
      }
    }
    return {
      ...file,
      path: `${this.configService.get('HOST_API')}/files/product/${file.filename}`,
    }
  }
}
