import { CreateNotificationDto } from "./dto/create-notification.dto";
import { Notification } from "./entities/notification.entity";

export interface INotificationService {
    sendNotification(options: CreateNotificationDto): Promise<void>
    getNotifications(userId: number): Promise<Notification[]>;
    findNotificationById(notifId: number): Promise<Notification>;
    deleteNotification(notifId: number): Promise<void>;
    readAllNotification(userId: number): Promise<void>;
}