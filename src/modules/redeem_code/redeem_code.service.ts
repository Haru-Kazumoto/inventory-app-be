import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { IRedeemCodeService } from './redeem_code.service.interface';
import { RedeemCodeRepository } from './repositories/redeem_code.repository';
import { CreateRedeemCodeDto } from './dtos/redeem_code.dto';
import { RedeemCode } from './entities/redeem_code.entity';
import { DataSource } from 'typeorm';
import { CreateExitLogDto } from '../exit_logs/dtos/exit_logs.dto';
import { ItemsRepository } from '../items/repository/items.repository';
import { ItemDetailsRepository } from '../item_details/repositories/item_details.repository';
import { ExitLogsRepository } from '../exit_logs/repositories/exit_logs.repository';
import { ExitLogs } from '../exit_logs/entities/exit_logs.entity';
import { StatusExit } from 'src/enums/status_exit.enum';
import { StatusItem } from 'src/enums/status_item.enum';
import { Item } from '../items/entities/item.entity';
import { ItemDetails } from '../item_details/entities/item_details.entity';

@Injectable()
export class RedeemCodeService implements IRedeemCodeService{

    constructor(
        private readonly exitlogRepository: ExitLogsRepository,
        private readonly itemDetailsRepository: ItemDetailsRepository,
        private readonly itemRepository: ItemsRepository,
        private readonly redeemCodeRepository: RedeemCodeRepository,
        private dataSource: DataSource
    ){}

    async createRedeemCode(body: CreateExitLogDto): Promise<RedeemCode> {
        const queryRunner = this.dataSource.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const createLog = this.exitlogRepository.create(body);

            //Saving the exit log entity first
            const newLog = await queryRunner.manager.save(ExitLogs, createLog);

            //item_details
            const item_details = body.item_details.map(async (itemDetail) => {
                const createItemDetail = this.itemDetailsRepository.create({
                    item_id: itemDetail.item_id,
                    exit_log: newLog
                });

                const itemChoosen: Item = await this.itemRepository.findById(itemDetail.item_id);

                if(!itemChoosen) throw new NotFoundException(`Id item not found [${itemDetail.item_id}]`);

                if(itemChoosen.status_item !== StatusItem.TERSEDIA) {
                    throw new BadRequestException("Barang sedang tidak tersedia di inventory.");
                }

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

            //Wait the item_details flow done
            await Promise.all(item_details);

            //generate the number redeemcode first
            const redeemCodeNumber: string = this.generateRedeemCode();

            //create the redeemCode object
            const newRedeemCode = this.redeemCodeRepository.create({
                redeem_code: redeemCodeNumber,
                generated_date: new Date(),
                log_id: newLog.id,
                exitLog: newLog
            });

            const result = await queryRunner.manager.save(RedeemCode, newRedeemCode);

            await queryRunner.commitTransaction();
            
            return result;
        } catch(err) {
            await queryRunner.rollbackTransaction();

            throw err;
        } finally {
            await queryRunner.release();
        }
    }

    async useRedeemCode(redeemCode: string): Promise<ExitLogs> {
        throw new BadRequestException("Method hot implemented yet.");
    }   

    async findByRedeemCode(redeemCode: string): Promise<RedeemCode> {
        return await this.redeemCodeRepository.findByRedeemCode(redeemCode);
    }

    generateRedeemCode(): string {
        const chars = '1234567890';
        let redeemCode = '';

        for(let i = 0; i < 5; i++) {
            const randomIndex = Math.floor(Math.random() * chars.length);

            redeemCode += chars[randomIndex];
        }

        return redeemCode;
    }
}
