import { Controller, UseGuards } from '@nestjs/common';
import { AuditLogsService } from './audit-logs.service';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthenticatedGuard } from 'src/security/guards/authenticated.guard';

@ApiTags('AuditLog')
@UseGuards(AuthenticatedGuard)
@Controller('audit-logs')
export class AuditLogsController {
  constructor(private readonly auditLogsService: AuditLogsService) {}

}
