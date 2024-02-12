import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddColumnUserId1707744588139 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Agrega la columna 'userId' a la tabla 'products'
        await queryRunner.addColumn(
            'products',
            new TableColumn({
                name: 'userId',
                type: 'uuid',
                isNullable: true, // O cambia a 'false' si es obligatorio
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Si alguna vez necesitas revertir esta migración, aquí puedes revertir los cambios
        await queryRunner.dropColumn('products', 'userId');
    }

}
