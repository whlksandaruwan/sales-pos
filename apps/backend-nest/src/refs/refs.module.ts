import { Module } from '@nestjs/common';
import { RefsService } from './refs.service';
import { RefsController } from './refs.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [RefsController],
  providers: [RefsService],
})
export class RefsModule {}


