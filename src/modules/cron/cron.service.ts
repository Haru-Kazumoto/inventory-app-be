import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { DataSource } from 'typeorm';
import { Notification } from '../notification/entities/notification.entity';
import { RequestItem } from '../request_items/entities/request_item.entity';
import { RequestStatus } from 'src/enums/request_status.enum';
import { RedeemCode } from '../redeem_code/entities/redeem_code.entity';

@Injectable()
export class CronService {
    constructor(
        private readonly dataSource: DataSource,
    ){}

    private readonly logger = new Logger(CronService.name);

    /**
     * Deleting all notification that has 'hasRead' field is true for a weeks
     */
    @Cron(CronExpression.EVERY_WEEK)
    async deleteNotificationAfterAWeeks(){
        const queryBuilder = this.dataSource.getRepository(Notification);

        await queryBuilder.createQueryBuilder()
            .delete()
            .from(Notification)
            .where("hasRead = :is_read", {is_read: true})
            .execute();

        this.logger.warn(`Syncronizing all notification... `);
    }

    /**
     * Delete all request item that has 'request_status' is ARRIVED or REJECTED for a weeks
     */
    @Cron(CronExpression.EVERY_WEEK)
    async deleteRequestItemAfterAWeeks(){
        const queryBuilder = this.dataSource.getRepository(RequestItem);

        await queryBuilder.createQueryBuilder()
            .delete()
            .from(RequestItem)
            .where("status = :status_arrived OR status = :status_rejected", {
                status_arrived: RequestStatus.ARRIVED,
                status_rejected: RequestStatus.REJECTED
            })
            .execute();

        this.logger.warn(`Syncronizing all request item... `);
    }

    /**
     * Delete all redeem code who has not valid anymore for a weeks
     */
    @Cron(CronExpression.EVERY_WEEK)
    async deleteRedeemCodeAfterAWeeks(){
        const queryBuilder = this.dataSource.getRepository(RedeemCode);

        await queryBuilder.createQueryBuilder()
            .delete()
            .from(RedeemCode)
            .where("is_valid = :is_valid", {is_valid: false})
            .execute();

        this.logger.warn(`Syncronizing all redeem code... `);
    }
}
