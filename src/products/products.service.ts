import { BadRequestException, Inject, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { PaginationDTO } from 'src/common/DTOs/pagination.dto';
import {validate as isUUID} from 'uuid'


@Injectable()
export class ProductsService {

  private readonly logger = new Logger('ProductsService')

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>
  ) { }


  async create(createProductDto: CreateProductDto) {
    try {
      const product = this.productRepository.create(createProductDto);
      await this.productRepository.save(product)
      return product

    } catch (error) {
      this.handleExceptions(error)
    }
  }

  async findAll(paginationDTO: PaginationDTO) {
    try {
      const {limit = 10, offset = 0} = paginationDTO

      return await this.productRepository.find({
        take: limit,
        skip: offset
      });
    } catch (error) {
      this.handleExceptions(error)
    }
  }

  async findOne(term: string) {

    let product: Product
    
    if(isUUID(term)){
      product = await this.productRepository.findOneBy({id: term })
    }else{
      const query = this.productRepository.createQueryBuilder()

      product = await query.where('UPPER(title) =:title or slug =:slug', {
        title: term.toUpperCase(),
        slug: term
      }).getOne()
    }

    if (!product)
      throw new NotFoundException('Product not found')
    return product
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const product = await this.productRepository.preload({
      id,
      ...updateProductDto
    })

    if (!product)
      throw new NotFoundException('Product not found')    
    
      try {
        await this.productRepository.save(product)
        
        return product
      } catch (error) {
        this.handleExceptions(error)
      }
  }

  async remove(id: string) {
      const product = await this.findOne(id)

      await this.productRepository.remove(product);
      return { msg: 'Product deleted' }   
  }

  private handleExceptions(error: any) {
    if (error.code === '23505')
      throw new BadRequestException(error.detail)

    this.logger.error(error)
    throw new InternalServerErrorException("Unexpected error, check log on console server.")
  }

}
