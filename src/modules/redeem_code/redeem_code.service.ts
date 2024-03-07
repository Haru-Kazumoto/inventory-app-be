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
import { PageOptionsDto, PageDto } from 'src/utils/pagination.utils';

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
            // Saving the exit log entity first
            const newLog = await queryRunner.manager.save(ExitLogs, createLog);

            newLog.item_details.map(async (itemDetail) => {
                const itemChoosen: Item = await this.itemRepository.findById(itemDetail.id);
                // if (!itemChoosen) {
                //     throw new NotFoundException(`Id item not found [${itemDetail.item_id}]`);
                // }
    
                if (itemChoosen.status_item !== StatusItem.TERSEDIA) {
                    throw new BadRequestException("Barang sedang tidak tersedia di inventory.");
                }
    
                if (body.item_category !== itemChoosen.category_item) {
                    throw new BadRequestException("Kategori barang tidak sama dengan yang dipilih");
                }
    
                // Set the item status based on exit status
                itemChoosen.status_item = (body.status_exit === StatusExit.PEMINJAMAN)
                    ? StatusItem.SEDANG_DIPINJAM
                    : StatusItem.SEDANG_DIPAKAI;

                await queryRunner.manager.save(Item, itemChoosen);
            });
    
            // generate the number redeemcode first
            const redeemCodeNumber: string = this.generateRedeemCode();
    
            // create the redeemCode object
            const newRedeemCode = this.redeemCodeRepository.create({
                redeem_code: redeemCodeNumber,
                generated_date: new Date(),
                log_id: newLog.id,
                exitLog: newLog
            });
    
            const result = await queryRunner.manager.save(RedeemCode, newRedeemCode);
            await queryRunner.commitTransaction();
    
            return result;
        } catch (err) {
            await queryRunner.rollbackTransaction();
            throw err;
        } finally {
            await queryRunner.release();
        }
    }
    
    async storeRedeemCode(redeemCode: string): Promise<RedeemCode> {
        const queryRunner = this.dataSource.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const findRedeemCode: RedeemCode = await this.redeemCodeRepository.findOne({
                where: {
                    redeem_code: redeemCode
                },
                relations: {
                    exitLog: true
                }
            })
            if(!findRedeemCode) throw new NotFoundException("Redeem code tidak ditemukan");

            if(findRedeemCode.generated_date !== null && findRedeemCode.is_valid === false){
                throw new BadRequestException("Redeem code telah di use");    
            }

            //changing status redeem code
            findRedeemCode.destroyed_date = new Date();
            findRedeemCode.is_valid = false;

            //set the status item to TERSEDIA back
            const changeStatusItems = findRedeemCode.exitLog.item_details.map(async (itemDetail) => {
                
                const findItem: Item = await this.itemRepository.findOne({
                    where: {
                        id: itemDetail.item_id
                    }
                });

                if(!findItem) throw new BadRequestException("Id item tidak ditemukan.");

                //change status item
                findItem.status_item = StatusItem.TERSEDIA;

                //saving the changes
                await queryRunner.manager.save(Item, findItem);
            })

            //Wait for the items changed
            await Promise.all(changeStatusItems);

            const result = await queryRunner.manager.save(RedeemCode, findRedeemCode);
        
            await queryRunner.commitTransaction();

            return result;

        } catch(err) {
            await queryRunner.rollbackTransaction();

            throw err;
        } finally {
            await queryRunner.release();
        }
    }   

    async findByRedeemCode(redeemCode: string): Promise<RedeemCode> {
        return await this.redeemCodeRepository.findByRedeemCode(redeemCode);
    }

    async findAllRedeemCodes(pageOptions: PageOptionsDto): Promise<PageDto<RedeemCode>> {
        return this.redeemCodeRepository.findManyPage(pageOptions);    
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
