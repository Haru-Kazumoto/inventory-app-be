import { Module, forwardRef } from '@nestjs/common';
import { AuditLogsService } from './audit-logs.service';
import { AuditLogsController } from './audit-logs.controller';
import { AuditLogsRepository } from './repositories/audit-logs.repository';
import { ItemsModule } from '../items/items.module';

@Module({
  imports: [
    forwardRef(() => ItemsModule)
  ],
  controllers: [AuditLogsController],
  providers: [AuditLogsService,AuditLogsRepository],
  exports: [AuditLogsService,AuditLogsRepository]
})
export class AuditLogsModule {}
