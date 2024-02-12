import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProductImage } from "./product-image.entity";
import { User } from "src/auth/entities/user.entity";
import { ApiProperty } from "@nestjs/swagger";

@Entity({
    name: 'products'
})
export class Product {

    @ApiProperty({
        example: '18303ee6-6e62-4d59-8442-daa51a7968c6',
        description: 'Id product',
        type: 'string',
        uniqueItems: true
    })
    @PrimaryGeneratedColumn('uuid')
    id: string

    @ApiProperty({
        example: 't-shirt tesplo',
        description: 'Product title',
        type: 'string',
        uniqueItems: true
    })
    @Column('text', {
        unique: true
    })
    title: string;

    @ApiProperty({
        example: '100.99',
        description: 'Product price',
        type: 'numeric',        
    })
    @Column('numeric')
    price: number

    @ApiProperty({
        example: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
        description: 'Product description',
        type: 'string',        
    })
    @Column({
        type: 'text',
        nullable: true,
    })
    description: string

    @ApiProperty({
        example: 'women_cropped_puffer_jacket',
        description: 'Product slug',
        type: 'string',        
        uniqueItems: true
    })
    @Column({
        type: 'text',
        unique: true,
    })
    slug: string

    @ApiProperty({
        example: 4,
        description: 'Product stock',
        type: 'numeric',        
        default: 0
    })
    @Column('int', {
        default: 0
    })
    stock: number

    @ApiProperty({
        example: ['M', 'L'],
        description: 'Product size',
                        
    })
    @Column('text', {
        array: true
    })
    sizes: string[]

    @ApiProperty({
        example: ['kid', 'women'],
        description: 'Product gender',                        
    })
    @Column('text')
    gender: string

    @ApiProperty({
        example: ['shirt', 'hoodie'],
        description: 'Product tags',                        
    })
    @Column({
        type: 'text',
        array: true,
        default: []
    })
    tags: string[]

    @ApiProperty()
    @OneToMany(
        () => ProductImage,
        (productImage) => productImage.product,
        { cascade: true, eager: true }
    )
    images?: ProductImage[];

    @ManyToOne(
        () => User,
        (user) => {
            user.product
        },
        {eager: true} //carga automatica de la relacion
    )
    user: User;


    @BeforeInsert()
    checkSlugInsert() {
        if (!this.slug) {
            this.slug = this.title;
        }

        this.slug = this.slug
            .toLowerCase()
            .replaceAll(' ', '_')
            .replaceAll("'", '')
    }

    @BeforeUpdate()
    checkSlugupdate() {
        this.slug = this.slug
            .toLowerCase()
            .replaceAll(' ', '_')
            .replaceAll("'", '')
    }
}
