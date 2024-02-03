import { Injectable } from '@nestjs/common';
import { ProductsService } from '../products/products.service';
import { initialData } from './seed';


@Injectable()
export class SeedService {
  constructor(
    private readonly productsService: ProductsService,

  ) { }

  async runSeed() {
    await this.productsService.deleteAllProducts()
    const seedProducts = initialData.products


    const promisesProducts = []

    seedProducts.forEach(product => {
      promisesProducts.push(this.productsService.create(product))
    })


    Promise.all(promisesProducts)

    return `Se ejecuto con exito`;
  }


}
