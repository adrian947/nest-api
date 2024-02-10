import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsModule } from './products/products.module';
import { CommonModule } from './common/common.module';
import { SeedModule } from './seed/seed.module';
import { FilesModule } from './files/files.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { AuthModule } from './auth/auth.module';
import typeorm from './config/typeorm.config';

@Module({
  imports: [
    ConfigModule.forRoot(
      {
        isGlobal: true,
        load: [typeorm]
      }
    ),
    // TypeOrmModule.forRoot({
    //   type: 'postgres',
    //   host: process.env.HOST_DB,
    //   port: +process.env.PORT_DB,
    //   username: process.env.USERNAME_DB,
    //   password: process.env.PASSWORD_DB,
    //   database: process.env.NAME_DB,
    //   autoLoadEntities: true,
    //   synchronize: false,    
    // }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => (configService.get('typeorm'))
    }),
    ProductsModule,
    CommonModule,
    SeedModule,
    FilesModule,
    CloudinaryModule,
    AuthModule,],
})

export class AppModule { }


