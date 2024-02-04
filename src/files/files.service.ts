import { Injectable, NotFoundException } from '@nestjs/common';
import { existsSync } from 'fs';
import { join } from 'path';


@Injectable()
export class FilesService {

    getStaticProductImage(imageName: string) {
        const path = join(__dirname, '../../static/products', imageName)
        console.log("🚀 ~ path:", path)

        if (!existsSync(path)) {
            throw new NotFoundException('File not found')
        }

        return path
    }
}
