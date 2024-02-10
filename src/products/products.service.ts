import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { PaginationDTO } from 'src/common/DTOs/pagination.dto';
import { validate as isUUID } from 'uuid'
import { ProductImage, Product } from './entities';


@Injectable()
export class ProductsService {

  private readonly logger = new Logger('ProductsService')

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,
    private readonly dataSource: DataSource
  ) { }


  async create(createProductDto: CreateProductDto) {
    try {
      const { images = [], ...restProductDto } = createProductDto

      const product = this.productRepository.create({
        ...restProductDto,
        images: images.map(url => this.productImageRepository.create({ url }))

      });
      await this.productRepository.save(product)
      return { ...product, images }

    } catch (error) {
      this.handleExceptions(error)
    }
  }

  async findAll(paginationDTO: PaginationDTO) {
    try {
      const { limit = 10, offset = 0 } = paginationDTO

      const products = await this.productRepository.find({
        take: limit,
        skip: offset,
        relations: {
          images: true
        }
      });


      return products.map(product => ({ ...product, images: product.images.map(image => image.url) }))


    } catch (error) {
      this.handleExceptions(error)
    }
  }

  async findOne(term: string) {

    let product: Product

    if (isUUID(term)) {
      product = await this.productRepository.findOneBy({ id: term })
    } else {
      const query = this.productRepository.createQueryBuilder('prod')

      product = await query.where('UPPER(title) =:title or slug =:slug', {
        title: term.toUpperCase(),
        slug: term
      }).leftJoinAndSelect('prod.images', 'prodImages').getOne()
    }

    if (!product)
      throw new NotFoundException('Product not found')
    return product
  }

  async findOnePlane(term: string) {
    const { images = [], ...rest } = await this.findOne(term)

    return { ...rest, images: images.map(image => image.url) }
  }


  async update(id: string, updateProductDto: UpdateProductDto) {

    const { images, ...rest } = updateProductDto;


    const product = await this.productRepository.preload({
      id,
      ...rest,
    })

    if (!product)
      throw new NotFoundException('Product not found')

    // create query runner
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      if (images) {
        await queryRunner.manager.delete(ProductImage, { product: { id } })
        product.images = images.map(image => this.productImageRepository.create({ url: image }))
      }

      await queryRunner.manager.save(product);
      // await this.productRepository.save(product)
      await queryRunner.commitTransaction();
      await queryRunner.release();
      return this.findOnePlane(id)
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      this.handleExceptions(error)
    }
  }

  async remove(id: string) {
    const product = await this.findOne(id)

    await this.productRepository.remove(product);
    return { msg: 'Product deleted' }
  }

  async deleteAllProducts() {

    const query = this.productRepository.createQueryBuilder('product')

    try {
      await query.delete().where({}).execute();
    } catch (error) {
      this.handleExceptions(error)
    }
  }

  private handleExceptions(error: any) {
    if (error.code === '23505')
      throw new BadRequestException(error.detail)

    this.logger.error(error)
    throw new InternalServerErrorException("Unexpected error, check log on console server.")
  }

}
