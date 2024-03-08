import { Injectable, NotFoundException } from '@nestjs/common';
import { ItemsRepository } from '../items/repository/items.repository';
import { IAuditLogsService } from './interfaces/audit-logs.service.interface';
import { PageOptionsDto, PageDto } from 'src/utils/pagination.utils';
import { CreateAuditLogsDto } from './dto/create-auditlogs.dto';
import { AuditLogs } from './entities/audit_logs.entity';
import { Transactional } from 'typeorm-transactional';
import { Item } from '../items/entities/item.entity';
import { AuditLogsRepository } from './repositories/audit-logs.repository';
import { DataSource } from 'typeorm';

@Injectable()
export class AuditLogsService implements IAuditLogsService {
  constructor(
    private readonly itemRepository: ItemsRepository,
    private readonly auditRepository: AuditLogsRepository,
    private readonly dataSource: DataSource,
  ) {}

  @Transactional()
  async createReport(body: CreateAuditLogsDto): Promise<AuditLogs> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const item: Item = await this.itemRepository.findOne({
        where: { id: body.item_id },
      });

      if (!item) throw new NotFoundException('Item tidak ditemukan');

      const createData = this.auditRepository.create({
        edited_by: body.edited_by,
        edit_method: body.edit_method,
        item_id: body.item_id,
        item: item,
      });

      const resultData = await this.auditRepository.save(createData);

      await queryRunner.commitTransaction();

      return resultData;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  getAllReport(): Promise<AuditLogs[]> {
    try {
      const data = this.auditRepository.find();

      if (!data) throw new NotFoundException('Data tidak ditemukan');

      return data;
    } catch (error) {
      throw error;
    }
  }

  async deleteOneReport(id: number): Promise<void> {
    try {
      const data = await this.auditRepository.findOne({ where: { id: id } });

      if (!data) throw new NotFoundException('Data tidak ditemukan');

      await this.auditRepository.delete(id);
    } catch (error) {
      throw error;
    }
  }
}
