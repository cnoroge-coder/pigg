import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AnimalsModule } from './animals/animals.module';
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
  ],
  controllers: [HealthController],
})
export class AppModule {}
