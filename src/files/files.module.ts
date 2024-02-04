import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [CloudinaryModule, ConfigModule],
  controllers: [FilesController],
  providers: [FilesService],
})
export class FilesModule {}
