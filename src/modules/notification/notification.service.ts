import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { INotificationService } from './notification.service.interface';
import { NotificationRepository } from './repository/notification.repository';
import { UserRepository } from '../user/repository/user.repository';
import { DataNotFoundException } from '../../exceptions/data_not_found.exception';
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
      // user: adminId,
    });

    // If the notification must send to superadmins
    if(options.toSuperadmin){
      const superadmins: User[] = await this.userRepository.findUserByRole("SUPERADMIN");

      for (const superadmin of superadmins) {
        notifObject = this.notificationRepository.create({
          ...options,
          user_id: superadmin.id,
          superadmin_content: options.superadmin_content //if send to superadmin is true, fill the content of notification for superadmin side
        });

        await this.notificationRepository.save(notifObject);
      }
    }
  
    await this.notificationRepository.save(notifObject);
  }

  async findNotificationById(notifId: number): Promise<Notification> {
    const findNotif: Notification = await this.notificationRepository.findOne({
      where: {
        id: notifId
      }
    });

    const mergingData = this.notificationRepository.merge(findNotif, {
      hasRead: true
    });

    await this.notificationRepository.save(mergingData);

    if(!findNotif) throw new BadRequestException("ID not found");

    return findNotif;
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

  async deleteNotification(notifId: number): Promise<void> {
    const findNotif: Notification = await this.notificationRepository.findOne({where: {id: notifId}});
    if(!findNotif) throw new NotFoundException("Id notifikasi tidak di temukan");

    await this.notificationRepository.delete(notifId);
  }

  async readAllNotification(userId: number): Promise<void> {
    const findIdUser = await this.userRepository.findById(userId);

    const findNotification: Notification[] = await this.notificationRepository.find({
      where: {
        user_id: findIdUser.id
      }
    });

    await Promise.all(findNotification.map(async (notification: Notification) => {
      notification.hasRead = true;
      
      const merging = this.notificationRepository.merge(notification);

      await this.notificationRepository.save(merging);
    }));
  }

}
