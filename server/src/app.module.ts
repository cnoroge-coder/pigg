import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AnimalsModule } from './animals/animals.module';
import { BreedingModule } from './breeding/breeding.module';
import { PrismaModule } from './prisma/prisma.module';
import { HealthController } from './health.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule,
    AnimalsModule,
    BreedingModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
