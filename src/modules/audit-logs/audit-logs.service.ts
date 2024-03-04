import { Injectable } from '@nestjs/common';
import { ItemsRepository } from '../items/repository/items.repository';
import { IAuditLogsService } from './interfaces/audit-logs.service.interface';
import { PageOptionsDto, PageDto } from 'src/utils/pagination.utils';
import { CreateAuditLogsDto } from './dto/create-auditlogs.dto';
import { AuditLogs } from './entities/audit_logs.entity';
import { Transactional } from 'typeorm-transactional';
import { Item } from '../items/entities/item.entity';
import { AuditLogsRepository } from './repositories/audit-logs.repository';

@Injectable()
export class AuditLogsService implements IAuditLogsService {
  constructor(
    private readonly itemRepository: ItemsRepository,
    private readonly auditRepository: AuditLogsRepository,
  ) {}

  @Transactional()
  async createReport(body: CreateAuditLogsDto): Promise<void> {
    const item: Item = await this.itemRepository.findOne({
      where: { id: body.item_id },
    });

    const createData = this.auditRepository.create({
      edited_by: body.edited_by,
      edit_method: body.edit_method,
      item_id: body.item_id,
      item: item,
    });

    await this.auditRepository.save(createData);
  }

  //not used yet
  getAllReport(pageOptionsDto: PageOptionsDto): Promise<PageDto<AuditLogs>> {
    return this.auditRepository.findMany(pageOptionsDto);
  }

  async deleteOneReport(id: number): Promise<void> {
    await this.auditRepository.delete(id);
  }
}
