import { Controller } from '@nestjs/common';
import { ExitLogsService } from './exit_logs.service';

@Controller('exit-logs')
export class ExitLogsController {
  constructor(private readonly exitLogsService: ExitLogsService) {}
}
