import { Module } from '@nestjs/common';
import { PigletsController } from './piglets.controller';
import { AlertsController } from './alerts.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [PigletsController, AlertsController],
})
export class PigletsModule {}
