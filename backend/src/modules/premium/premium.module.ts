import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Premium, PremiumSchema } from './schemas/premium.schema';
import { PremiumService } from './premium.service';
import { PremiumController } from './premium.controller';

import { CounterModule } from '../counter/counter.module';
import { CounterService } from '../counter/counter.service';

@Module({
    imports: [
        MongooseModule.forFeatureAsync([
            {
                name: Premium.name,
                useFactory: (counterService: CounterService) => {
                    const schema = PremiumSchema;

                    schema.pre('save', async function (next) {
                        if (!this.isNew || this._id) return next();
                        const nextId = await counterService.getNextSequence('premium');
                        this._id = nextId;
                        next();
                    });

                    return schema;
                },
                inject: [CounterService],
            },
        ]),
        CounterModule,
    ],
    providers: [PremiumService],
    controllers: [PremiumController],
})
export class PremiumModule {}
