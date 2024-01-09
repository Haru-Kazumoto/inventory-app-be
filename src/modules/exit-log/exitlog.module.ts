import { Module } from '@nestjs/common';
import { ExitlogService } from './exitlog.service';
import { ExitlogController } from './exitlog.controller';

@Module({
  controllers: [ExitlogController],
  providers: [ExitlogService]
})
export class ExitlogModule {}
