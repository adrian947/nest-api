// import { config } from "dotenv";
// import { DataSource } from "typeorm";

// config()

// export default new DataSource({
//     type: 'postgres',
//     host: process.env.HOST_DB,
//     port: +process.env.PORT_DB,
//     username: process.env.USERNAME_DB,
//     password: process.env.PASSWORD_DB,
//     database: process.env.NAME_DB,
//     migrations: ["src/migrations/*.ts"],
//     entities: ['../**/*.entity.{ts,js}'],    
// })

import { registerAs } from "@nestjs/config";
import { config as dotenvConfig } from 'dotenv';
import { DataSource, DataSourceOptions } from "typeorm";

dotenvConfig({ path: '.env' });

const config = {
    type: 'postgres',
    host: `${process.env.HOST_DB}`,
    port: `${process.env.PORT_DB}`,
    username: `${process.env.USERNAME_DB}`,
    password: `${process.env.PASSWORD_DB}`,
    database: `${process.env.NAME_DB}`,
    entities: ["dist/**/*.entity{.ts,.js}"],
    migrations: ["dist/migrations/*{.ts,.js}"],
    autoLoadEntities: true,
    synchronize: false,
}

export default registerAs('typeorm', () => config)
export const connectionSource = new DataSource(config as DataSourceOptions);