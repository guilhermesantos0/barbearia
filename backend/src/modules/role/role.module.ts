import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Role, RoleSchema } from './schemas/role.schema';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';

import { CounterModule } from '../counter/counter.module';
import { CounterService } from '../counter/counter.service';

@Module({
    imports: [
        // Importa o módulo que fornece o CounterService
        CounterModule,

        // Configura o schema com o useFactory e injeção de dependência
        MongooseModule.forFeatureAsync([
            {
                name: Role.name,
                imports: [CounterModule], // ⚠️ ESSENCIAL aqui também
                inject: [CounterService],
                useFactory: async (counterService: CounterService) => {
                    const schema = RoleSchema;

                    schema.pre('save', async function (next) {
                        if (!this.isNew || this._id) return next();

                        const nextId = await counterService.getNextSequence('role');
                        this._id = nextId;

                        next();
                    });

                    return schema;
                }
            }
        ]),
    ],
    providers: [RoleService],
    controllers: [RoleController],
})
export class RoleModule {}
