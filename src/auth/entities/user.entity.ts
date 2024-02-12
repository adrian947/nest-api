import { ApiProperty } from "@nestjs/swagger";
import { Product } from "src/products/entities";
import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('users')
export class User {

    @ApiProperty({
        example: '18303ee6-6e62-4d59-8442-daa51a7968c6',
        description: 'Id user',
        type: 'string',
        uniqueItems: true
    })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({
        example: 'example@example.com',
        description: 'email user',
        type: 'string',
        uniqueItems: true
    })
    @Column('text', {
        unique: true
    })
    email: string

    @Column('text', {
        select: false
    })
    password: string

    @Column('text')
    fullname: string

    @Column('bool')
    isActive: boolean;

    @Column('text', {
        array: true,
        default: ['user']
    })
    roles: string[]


    @OneToMany(
        ()=> Product,
        (product)=>{
            product.user
        }
    )
    product: Product;


    @BeforeInsert()
    checkFieldsBeforeInsert(){
        this.email = this.email.toLocaleLowerCase().trim();
    }
    
    @BeforeUpdate()
    checkFieldsBeforeUpdate(){
        this.email = this.email.toLocaleLowerCase().trim();
    }

}
