import { ItemDetails } from 'src/modules/item_details/entities/item_details.entity';
import { BadRequestException, Inject, Injectable, NotFoundException, forwardRef } from '@nestjs/common';
import { FilterParam, IExitLogsService } from './exit_logs.service.interface';
import { ExitLogsRepository } from './repositories/exit_logs.repository';
import { CreateExitLogDto } from './dtos/exit_logs.dto';
import { ExitLogs } from './entities/exit_logs.entity';
import { PageOptionsDto, PageDto } from 'src/utils/pagination.utils';
import { ItemDetailsRepository } from '../item_details/repositories/item_details.repository';
import { DataSource } from 'typeorm';
import { Item } from '../items/entities/item.entity';
import { ItemsRepository } from '../items/repository/items.repository';
import { StatusExit } from 'src/enums/status_exit.enum';
import { StatusItem } from 'src/enums/status_item.enum';

@Injectable()
export class ExitLogsService implements IExitLogsService {

    constructor(
        private readonly exitlogRepository: ExitLogsRepository,
        private readonly itemDetailsRepository: ItemDetailsRepository,
        private readonly itemRepository: ItemsRepository,
        private dataSource: DataSource
    ){}

    async findLogById(logId: number): Promise<ExitLogs> {
        const findLog: ExitLogs = await this.exitlogRepository.findOne({
            where: {id: logId},
            relations: {redeem_code: true}
        });

        if(!findLog) throw new NotFoundException("Id log tidak ditemukan, hubungi developer segera");

        return findLog;
    }

    async findLogByBorrowerName(borrowerName: string): Promise<ExitLogs> {
        const findLog: ExitLogs = await this.exitlogRepository.findOne({
            where: {name: borrowerName},
            relations: {redeem_code: true}
        });

        if(!findLog) throw new NotFoundException("Nama peminjam tidak di temukan");

        return findLog;
    }

    async findAllLogs(pageOptionsDto: PageOptionsDto): Promise<PageDto<ExitLogs>> {
        return await this.exitlogRepository.findManyLogs(pageOptionsDto);
    }
}
