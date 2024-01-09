import { Module } from '@nestjs/common';
import { ExititemService } from './exititem.service';
import { ExititemController } from './exititem.controller';

@Module({
  controllers: [ExititemController],
  providers: [ExititemService]
})
export class ExititemModule {}
