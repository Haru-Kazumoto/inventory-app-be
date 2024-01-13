import { Injectable } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { INotificationService } from './notification.service.interface';
import { NotificationRepository } from './repository/notification.repository';
import { UserRepository } from '../user/repository/user.repository';
import { DataNotFoundException } from 'src/exceptions/data_not_found.exception';
import { User } from '../user/entity/user.entity';
import { Transaction } from 'typeorm';
import { Transactional } from 'typeorm-transactional';

@Injectable()
export class NotificationService implements INotificationService{
  constructor(
    private readonly notificationRepository: NotificationRepository,
    private readonly userRepository: UserRepository
  ){}

  @Transactional()
  async sendNotification(options: CreateNotificationDto): Promise<any> {
    const userId: User = await this.userRepository.findById(options.user_id);
    if(!userId) throw new DataNotFoundException("User id not found", 400);

    const notifObject = this.notificationRepository.create({
      ...options,
      user: userId
    });

    return await this.notificationRepository.save(notifObject);
  }

}
