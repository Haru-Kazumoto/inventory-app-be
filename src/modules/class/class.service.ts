import { Injectable } from '@nestjs/common';
// import { ClassRepository } from './repositories/class.repository';
// import { Request } from 'express';
// import { Transactional } from 'typeorm-transactional/dist/decorators/transactional';
// import { Class } from './entitites/class.entity';
// import { ClassCreateDto } from './dto/class.dto';
// import { classCreateContent } from '../notification/notification.constant';
// import { AuthService } from '../auth/auth.service';
// import { NotificationService } from '../notification/notification.service';
// import { DataNotFoundException } from 'src/exceptions/data_not_found.exception';

@Injectable()
export class ClassService {
  // constructor(
  //   private readonly classRepository: ClassRepository,
  //   private readonly notificationService: NotificationService,
  //   private readonly authService: AuthService,
  // ) {}

  // @Transactional()
  // public async createOne(body: ClassCreateDto): Promise<Class> {
  //   const session = await this.authService.getSession();

  //   const newClass = this.classRepository.create(body);

  //   //SEND NOTIFICATION
  //   await this.notificationService.sendNotification({
  //     title: 'Kelas Baru',
  //     content: classCreateContent,
  //     color: 'clay',
  //     user_id: session.id,
  //   });

  //   return await this.classRepository.save(newClass);
  // }

  // findMany(): Promise<Class[]> {
  //   return this.classRepository.find();
  // }

  // async deleteById(id: number): Promise<void> {
  //   const data = await this.classRepository.findOne({ where: { id: id } });

  //   if (!data) {
  //     throw new DataNotFoundException('ID not found', 400);
  //   }

  //   await this.classRepository.remove(data);
  // }

  // @Transactional()
  // public async updateOne(id: number, body: ClassCreateDto): Promise<Class> {
  //   const newClass = await this.classRepository.findOne({
  //     where: { id: id },
  //   });

  //   if (!newClass) throw new DataNotFoundException('Id class not found', 400);

  //   Object.assign(newClass, body);

  //   return await this.classRepository.save(newClass);
  // }
}
