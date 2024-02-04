// cloudinary.service.ts

import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUD_NAME,
      api_key: process.env.CLOUD_API_KEY,
      api_secret: process.env.CLOUD_API_SECRET,
    });
  }

  async uploadFile(file: Express.Multer.File) {
    try {
      const cloudinaryResponse = await cloudinary.uploader.upload(file.path, {
        folder: 'nest',
        use_filename: true,
        unique_filename: false,
      });

      return cloudinaryResponse;
    } catch (error) {
      throw new Error(`Error uploading file to Cloudinary: ${error.message}`);
    }
  }

  async getImageUrl(imageName: string) {

    const imageUrl = await cloudinary.search
      .expression(imageName)
      .max_results(1)
      .execute();  

    return imageUrl;
  }

}
