import { CreateNotificationDto } from "./dto/create-notification.dto";
import { Notification } from "./entities/notification.entity";

export interface INotificationService {
    sendNotification(options: CreateNotificationDto): Promise<any>
    getNotifications(userId: number): Promise<Notification[]>;
}