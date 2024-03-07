import { ItemDetails } from 'src/modules/item_details/entities/item_details.entity';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
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

    async createLog(body: CreateExitLogDto): Promise<ExitLogs> {
        const queryRunner = this.dataSource.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const createLog = this.exitlogRepository.create(body);
            const newLog = await queryRunner.manager.save(ExitLogs, createLog);

            //item_details
            const item_details = body.item_details.map(async (itemDetail) => {
                const createItemDetail = this.itemDetailsRepository.create({
                    item_id: itemDetail.item_id,
                    exit_log: newLog
                });

                const itemChoosen: Item = await this.itemRepository.findById(itemDetail.item_id);

                if(!itemChoosen) throw new NotFoundException(`Id item not found [${itemDetail.item_id}]`);

                if(body.item_category !== itemChoosen.category_item){
                    throw new BadRequestException("Kategory barang tidak sama dengan yang dipilih");
                }

                // Set the item status based on exit status
                itemChoosen.status_item = (body.status_exit === StatusExit.PEMINJAMAN)
                    ? StatusItem.SEDANG_DIPINJAM
                    : StatusItem.SEDANG_DIPAKAI;
            
                await queryRunner.manager.save(ItemDetails,createItemDetail);
                await queryRunner.manager.save(Item,itemChoosen);
            });

            await Promise.all(item_details);

            await queryRunner.commitTransaction();

            return newLog;
        } catch(err) {
            await queryRunner.rollbackTransaction();

            throw err;
        } finally {
            await queryRunner.release();
        }
    }

    async findExitLogByRedeemCode(redeemCode: string): Promise<ExitLogs> {
        const findRedeemCode: ExitLogs = await this.exitlogRepository.findExitLogByRedeemCode(redeemCode);
        console.log(findRedeemCode);
        if(!findRedeemCode) throw new NotFoundException("Redeem Code tidak ada.");

        return findRedeemCode;
    }
    
    async findAllLogs(pageOptionsDto: PageOptionsDto, filter?: FilterParam): Promise<PageDto<ExitLogs>> {
        return null;
    }
}
