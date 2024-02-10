import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import { Logger } from '@nestjs/common';

export class CreateUserTable1623809750484 implements MigrationInterface {
    private readonly logger = new Logger(CreateUserTable1623809750484.name);
    public async up(queryRunner: QueryRunner): Promise<void> {        
        this.logger.log('Up');
        await queryRunner.createTable(
            new Table({
                name: 'users',
                columns: [
                    {
                        name: 'id',
                        type: 'uuid',
                        isPrimary: true,
                        generationStrategy: 'uuid',
                        default: 'uuid_generate_v4()',
                    },
                    {
                        name: 'email',
                        type: 'varchar',
                        isUnique: true,
                    },
                    {
                        name: 'password',
                        type: 'varchar',
                    },
                    {
                        name: 'fullname',
                        type: 'varchar',
                    },
                    {
                        name: 'isActive',
                        type: 'boolean',
                        default: true,
                    },
                    {
                        name: 'roles',
                        type: 'text',
                        isArray: true,
                        default: "'{user}'",
                    },
                ],
            }),
            true
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        this.logger.log('Down');
        await queryRunner.dropTable('users');
    }
}
