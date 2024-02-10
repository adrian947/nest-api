import { Entity, PrimaryGeneratedColumn } from "typeorm";
import { IsArray, IsBoolean, IsEmail, IsString, MinLength } from 'class-validator';

@Entity('users')
export class User {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @IsEmail()
    email: string

    @IsString()
    @MinLength(6)
    password: string

    @IsString()
    fullName: string

    @IsBoolean()
    isActive: boolean;


    @IsString({
        each: true
    })
    @IsArray()
    roles: string[]

}
