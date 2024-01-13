import { CreateNotificationDto } from "./dto/create-notification.dto";

export interface INotificationService {
    sendNotification(options: CreateNotificationDto): Promise<any>
}