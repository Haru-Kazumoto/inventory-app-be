import { Injectable } from '@nestjs/common';
import { FilterParam, IExitLogsService } from './exit_logs.service.interface';
import { ExitLogsRepository } from './repositories/exit_logs.repository';
import { CreateExitLogDto } from './dtos/exit_logs.dto';
import { ExitLogs } from './entities/exit_logs.entity';
import { PageOptionsDto, PageDto } from 'src/utils/pagination.utils';
import { Transactional } from 'typeorm-transactional';
import { ItemDetailsRepository } from '../item_details/repositories/item_details.repository';

@Injectable()
export class ExitLogsService implements IExitLogsService {

    constructor(
        private readonly exitlogRepository: ExitLogsRepository,
        private readonly itemDetailsRepository: ItemDetailsRepository
    ){}

    @Transactional()
    async createLog(body: CreateExitLogDto): Promise<ExitLogs> {
        const createLog = this.exitlogRepository.create(body);
        const newLog = await this.exitlogRepository.save(createLog);

        //item_details
        const item_details = body.item_details.map(async (itemDetail) => {
            const createItemDetail = this.itemDetailsRepository.create(itemDetail);

            await this.itemDetailsRepository.save(createItemDetail);
        });

        await Promise.all(item_details);

        return newLog;
    }

    async findAllLogs(pageOptionsDto: PageOptionsDto, filter?: FilterParam): Promise<PageDto<ExitLogs>> {
        return null;
    }
}
