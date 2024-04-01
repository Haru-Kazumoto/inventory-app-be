import { DataSource, DataSourceOptions, Repository } from "typeorm";
import { Notification } from "../entities/notification.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Injectable } from "@nestjs/common";

@Injectable()
export class NotificationRepository extends Repository<Notification> {
    @InjectRepository(Notification) notificationRepository: Repository<Notification>;

    constructor(dataSource: DataSource){
        super(Notification, dataSource.createEntityManager());
    }

    async findAllNotifications(userId: number): Promise<Notification[] | undefined>{
        return await this.notificationRepository.find({
        where: {
            user_id: userId,
        },
        order: {
            created_at: "DESC"
        }
    });
    }
}