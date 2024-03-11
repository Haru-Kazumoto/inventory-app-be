import { CreateNotificationDto } from "./dto/create-notification.dto";
import { Notification } from "./entities/notification.entity";

export interface INotificationService {
    sendNotification(options: CreateNotificationDto): Promise<void>
    getNotifications(userId: number): Promise<Notification[]>;
    deleteNotification(notifId: number): Promise<void>;
}