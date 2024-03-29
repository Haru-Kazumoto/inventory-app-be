import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { IExitLogsService } from './exit_logs.service.interface';
import { ExitLogsRepository } from './repositories/exit_logs.repository';
import { UpdateExitLogDto } from './dtos/exit_logs.dto';
import { ExitLogs } from './entities/exit_logs.entity';
import { PageOptionsDto, PageDto } from 'src/utils/pagination.utils';
import { ItemDetailsRepository } from '../item_details/repositories/item_details.repository';
import { DataSource } from 'typeorm';
import { ItemsRepository } from '../items/repository/items.repository';
import { RedeemCode } from '../redeem_code/entities/redeem_code.entity';
import { ItemCategory } from 'src/enums/item_category.enum';
import { RedeemCodeRepository } from '../redeem_code/repositories/redeem_code.repository';

@Injectable()
export class ExitLogsService implements IExitLogsService {

    constructor(
        private readonly exitlogRepository: ExitLogsRepository,
        private readonly redeemCodeRepository: RedeemCodeRepository,
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

    async findAllLogs(filterCategory: ItemCategory, pageOptionsDto: PageOptionsDto): Promise<PageDto<ExitLogs>> {
        return await this.exitlogRepository.findManyLogs(filterCategory,pageOptionsDto);
    }

    async findExitLogById(logId: number): Promise<ExitLogs> {
        return await this.exitlogRepository.findOne({where: {id: logId}});
    }

    //develop, not testing yet
    async updateExitLog(redeemCode: string, body: UpdateExitLogDto): Promise<RedeemCode> {
        const queryRunner = this.dataSource.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();

        /**
         * find the redeem code first, and then store the exit log from redeem code relation to some variable.
         * Then update the exit log using .merge() method from typeorm. After the merging or updating is done
         * dont re-generate the redeem code, keep the redeem code cause we just have to update the exit log body.
        */
        try{
            const findRedeemCode = this.redeemCodeRepository
                .findByRedeemCode(redeemCode)
                .then((res) => {
                    if(!res.is_valid){
                        throw new BadRequestException("Kode redem tidak aktif");
                    }

                    return res;
                });

            //-------EXIT LOG UPDATING AREA---------//
            const currentExitLog = findRedeemCode.then((res) => {
                if(res.exitLog === null){
                    throw new BadRequestException("Exit log is null!");
                }

                return res.exitLog;
            });
            
            const mergingExitLog = currentExitLog.then((currentData) => {
                return this.exitlogRepository.merge(currentData, body);
            });

            //saving the updated data
            mergingExitLog.then((newData) => {
                return this.exitlogRepository.save(newData);
            });

            //-------REDEEM CODE UPDATING AREA---------//

            await queryRunner.commitTransaction();

            return findRedeemCode;
        } catch(err) {
            await queryRunner.rollbackTransaction();

            throw err;
        } finally {
            await queryRunner.release();
        }
    }
}
