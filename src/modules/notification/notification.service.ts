import { Injectable } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { INotificationService } from './notification.service.interface';
import { NotificationRepository } from './repository/notification.repository';
import { UserRepository } from '../user/repository/user.repository';
import { DataNotFoundException } from 'src/exceptions/data_not_found.exception';
import { User } from '../user/entities/user.entity';
import { Transactional } from 'typeorm-transactional';
import { Notification } from './entities/notification.entity';

@Injectable()
export class NotificationService implements INotificationService{
  constructor(
    private readonly notificationRepository: NotificationRepository,
    private readonly userRepository: UserRepository
  ){}

  @Transactional()
  async sendNotification(options: CreateNotificationDto): Promise<void> {
    const adminId: User = await this.userRepository.findById(options.user_id);
    if(!adminId) throw new DataNotFoundException("User id not found", 400);
  
    //If notification not send to superadmin 
    let notifObject: Notification = this.notificationRepository.create({
      ...options,
      user: adminId,
    });

    //If the notification must send to superadmins
    if(options.toSuperadmin){
      const superadmins: User[] = await this.userRepository.findUserByRole("SUPERADMIN");

      for (const superadmin of superadmins) {
        notifObject = this.notificationRepository.create({
          ...options,
          user: superadmin,
        });

        await this.notificationRepository.save(notifObject);
      }
    }
  
    await this.notificationRepository.save(notifObject);
  }

  async getNotifications(userId: number): Promise<Notification[]> {
    await this.checkUserIdIsExists(userId);

    return await this.notificationRepository.findAllNotifications(userId);
  }

  async checkUserIdIsExists(userId: number): Promise<Boolean>{
    const findIdUser = await this.userRepository.findById(userId);
    if(!findIdUser) throw new DataNotFoundException("User id not found", 400);

    return true;
  };

}
