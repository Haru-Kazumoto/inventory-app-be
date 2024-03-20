import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { IRedeemCodeService } from './redeem_code.service.interface';
import { RedeemCodeRepository } from './repositories/redeem_code.repository';
import { RedeemCode } from './entities/redeem_code.entity';
import { DataSource } from 'typeorm';
import { CreateExitLogDto, UpdateExitLogDto } from '../exit_logs/dtos/exit_logs.dto';
import { ItemsRepository } from '../items/repository/items.repository';
import { ExitLogsRepository } from '../exit_logs/repositories/exit_logs.repository';
import { ExitLogs } from '../exit_logs/entities/exit_logs.entity';
import { StatusExit } from 'src/enums/status_exit.enum';
import { StatusItem } from 'src/enums/status_item.enum';
import { Item } from '../items/entities/item.entity';
import { PageOptionsDto, PageDto } from 'src/utils/pagination.utils';
import { ItemDetails } from '../item_details/entities/item_details.entity';
import { ItemCategory } from 'src/enums/item_category.enum';
import { StatusCode } from 'src/enums/status_code.enum';

@Injectable()
export class RedeemCodeService implements IRedeemCodeService {

    constructor(
        private readonly exitlogRepository: ExitLogsRepository,
        private readonly itemRepository: ItemsRepository,
        private readonly redeemCodeRepository: RedeemCodeRepository,
        private dataSource: DataSource
    ){}
        
    async createRedeemCode(body: CreateExitLogDto): Promise<RedeemCode> {
        const queryRunner = this.dataSource.createQueryRunner();
    
        await queryRunner.connect();
        await queryRunner.startTransaction();
    
        try {

            /**
             * The exit log data must be created first before redeem code
             */
            const createLog = this.exitlogRepository.create(body);
            const newLog = await queryRunner.manager.save(ExitLogs, createLog);

            if(body.total !== newLog.item_details.length) throw new BadRequestException("Total item tidak sama dengan yang diinginkan.");

            await Promise.all(newLog.item_details.map(async (itemDetail: ItemDetails) => {
                const itemChoosen: Item = await this.itemRepository.findById(itemDetail.item_id);
                
                if (!itemChoosen) throw new NotFoundException(`Barang dengan item id ${itemDetail.item_id} tidak ditemukan`)

                if (itemChoosen.status_item !== StatusItem.TERSEDIA) {
                    throw new BadRequestException("Barang sedang tidak tersedia di inventory.");
                }
    
                if (body.item_category !== itemChoosen.category_item) {
                    throw new BadRequestException("Kategori barang tidak sama dengan yang dipilih");
                }
    
                /**
                 * If the item category is "BARANG_TIDAK_HABIS_PAKAI" the status item will be always update 
                 * due to exit item, otherwise the status item will be managed by admin in data barang page (manually update)
                 */
                if(body.item_category === ItemCategory.BARANG_TIDAK_HABIS_PAKAI) {
                    itemChoosen.status_item = (body.status_exit === StatusExit.PEMINJAMAN)
                        ? StatusItem.SEDANG_DIPINJAM
                        : StatusItem.SEDANG_DIPAKAI;
                }

                itemDetail.category_item = itemChoosen.category_item;

                await queryRunner.manager.save(Item, itemChoosen);
            }));
    

            /**
             * If the item category is BARANG_HABIS_PAKAI whenever the item borrowed the redeem code must be generated,
             * otherwise only create the exit log but not the redeem code 
             * 
             */
            let newRedeemCode: RedeemCode;
            let result: RedeemCode;
            
            
            if(body.item_category === ItemCategory.BARANG_TIDAK_HABIS_PAKAI){
                // generate the number redeemcode first
                const redeemCodeNumber: string = this.generateRedeemCode();
        
                // create the redeemCode object
                newRedeemCode = this.redeemCodeRepository.create({
                    redeem_code: redeemCodeNumber,
                    generated_date: new Date(),
                    log_id: newLog.id,
                    exitLog: newLog
                });
        
                result = await queryRunner.manager.save(RedeemCode, newRedeemCode);

                //update the exit log
                newLog.redeem_code = result;

                await queryRunner.manager.save(ExitLogs, newLog);
            } else {
                newRedeemCode = this.redeemCodeRepository.create({
                    redeem_code: null,
                    generated_date: null,
                    is_valid: null,
                    destroyed_date: null,
                    log_id: newLog.id,
                    exitLog: newLog
                });
        
                result = await queryRunner.manager.save(RedeemCode, newRedeemCode);
            }
            

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

    async updateRedeemCode(redeemCode: string, body: UpdateExitLogDto): Promise<RedeemCode> {
        const queryRunner = this.dataSource.createQueryRunner();
    
        await queryRunner.connect();
        await queryRunner.startTransaction();
    
        try {
            const findRedeemCode: RedeemCode = await this.redeemCodeRepository.findOneOrFail({
                where: { redeem_code: redeemCode },
                relations: { exitLog: true }
            });
    
            const currentExitLog: ExitLogs = findRedeemCode.exitLog;
            
            await Promise.all(body.item_details.map(async (itemDetail: ItemDetails) => {
                //check is availability on inventory
                const itemChoosen: Item = await this.itemRepository.findById(itemDetail.item_id);
                if(!itemChoosen) throw new BadRequestException("Item tidak ada di inventory!");

                //check is the item availablel or not
                if (itemChoosen.status_item !== StatusItem.TERSEDIA) {
                    throw new BadRequestException("Barang sedang tidak tersedia di inventory.");
                }
    
                //check is the item type equals with the request
                if (body.item_category !== itemChoosen.category_item) {
                    throw new BadRequestException("Kategori barang tidak sama dengan yang dipilih");
                }
    
                //if the item is 'barang habis pakai' then change the status item with the type request
                if (body.item_category === ItemCategory.BARANG_TIDAK_HABIS_PAKAI) {
                    itemChoosen.status_item = (body.status_exit === StatusExit.PEMINJAMAN)
                        ? StatusItem.SEDANG_DIPINJAM
                        : StatusItem.SEDANG_DIPAKAI;
                }

                //set the category item to item detail object
                itemDetail.category_item = itemChoosen.category_item;
        
                await queryRunner.manager.save(Item, itemChoosen);
            }));
    
            const mergingExitLog: ExitLogs = this.exitlogRepository.merge(currentExitLog, body);
    
            // save the updated exit log
            await queryRunner.manager.save(ExitLogs, mergingExitLog);
    
            await queryRunner.commitTransaction();
    
            // return the current redeem code with updated exit log
            return findRedeemCode;
        } catch (err) {
            await queryRunner.rollbackTransaction();
            throw err;
        } finally {
            await queryRunner.release();
        }
    }
    

    async findByRedeemCode(redeemCode: string): Promise<RedeemCode> {
        return await this.redeemCodeRepository.findOne({
            where: {redeem_code: redeemCode},
            relations: {exitLog: true}
        });
    }

    async findAllRedeemCodes(filterStatus: StatusCode,pageOptions: PageOptionsDto): Promise<PageDto<RedeemCode>> {
        return this.redeemCodeRepository.findManyCode(filterStatus,pageOptions);
    }

    async findExitLogByRedeemCode(redeemCode: string): Promise<ExitLogs> {
        const findCode: RedeemCode = await this.redeemCodeRepository.findOne({
            where: {
                redeem_code: redeemCode
            },
            relations: {
                exitLog: true
            }
        });

        if(!findCode) throw new NotFoundException("Data barang keluar tidak ditemukan, masukan kode redeem dengan benar");

        return findCode.exitLog;
    }


    // ------------------ UTILS --------------------- //

    generateRedeemCode(): string {
        const chars = '1234567890';
        let redeemCode = '';

        for(let i = 0; i < 5; i++) {
            const randomIndex = Math.floor(Math.random() * chars.length);

            redeemCode += chars[randomIndex];
        }

        return redeemCode;
    }

    checkValidRedeemCode(redeemCode: RedeemCode) {
        if(!redeemCode.is_valid) {
            throw new BadRequestException("Kode redeem telah kadarluawasa, tidak bisa melakukan update!");
        }
    }
}
