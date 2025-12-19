import { Module } from '@nestjs/common';
import { PregnanciesController, LittersController } from './breeding.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [PregnanciesController, LittersController],
})
export class BreedingModule {}
