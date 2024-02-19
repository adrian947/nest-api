import { Injectable } from '@nestjs/common';
import { ProductsService } from '../products/products.service';
import { initialData } from './seed';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/user.entity';
import { Repository } from 'typeorm';
import { hashSync } from 'bcrypt'


@Injectable()
export class SeedService {
  constructor(
    private readonly productsService: ProductsService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) { }

  async runSeed() {
    await this.productsService.deleteAllProducts()

    const queryBuilder = this.userRepository.createQueryBuilder();
    await queryBuilder
      .delete()
      .where({})
      .execute()

    const seedProducts = initialData.products
    const seedUsers = initialData.users
    

    const userWithHashPassword = seedUsers.map(user => ({
      ...user,
      password: hashSync(user.password, 10)
    }))

    const users = await this.userRepository.insert(userWithHashPassword)

    const promisesProducts = []

    seedProducts.forEach(product => {
      const randomUserIdIndex = Math.floor(Math.random() * users.identifiers.length);
      const randomUserId = users.identifiers[randomUserIdIndex].id;
      promisesProducts.push(this.productsService.create(product, randomUserId))
    })


    Promise.all(promisesProducts)

    return `Se ejecuto con exito`;
  }


}
