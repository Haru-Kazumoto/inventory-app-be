import { Module } from '@nestjs/common';
import { ExitLogsService } from './exit_logs.service';
import { ExitLogsController } from './exit_logs.controller';

@Module({
  controllers: [ExitLogsController],
  providers: [ExitLogsService]
})
export class ExitLogsModule {}
