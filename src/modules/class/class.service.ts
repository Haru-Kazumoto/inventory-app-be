import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ClassRepository } from './repositories/class.repository';
import { Transactional } from 'typeorm-transactional/dist/decorators/transactional';
import { Class } from './entitites/class.entity';
import { classCreateContent } from '../notification/notification.constant';
import { AuthService } from '../auth/auth.service';
import { NotificationService } from '../notification/notification.service';
import { CreateClassDto, UpdateClassDto } from './dto/class.dto';
import { PageDto, PageOptionsDto } from 'src/utils/pagination.utils';
import { IClassService } from './interfaces/class.interface';
import { DataSource } from 'typeorm';

@Injectable()
export class ClassService implements IClassService {
  constructor(
    private readonly classRepository: ClassRepository,
    private readonly notificationService: NotificationService,
    private readonly authService: AuthService,
    private readonly dataSource: DataSource,
  ) {}

  @Transactional()
  public async createOne(body: CreateClassDto): Promise<Class> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const session = await this.authService.getSession();

      const findClass = this.classRepository.findOne({
        where: { class_name: body.class_name },
      });

      if (findClass) throw new ConflictException('Kelas sudah ada');

      const newClass = this.classRepository.create(body);

      const resultData = await this.classRepository.save(newClass);

      //SEND NOTIFICATION
      await this.notificationService.sendNotification({
        title: 'Kelas Baru',
        content: classCreateContent,
        color: 'clay',
        user_id: session.id,
      });

      await queryRunner.commitTransaction();

      return resultData;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  findMany(): Promise<Class[]> {
    try {
      const data = this.classRepository.find();

      if (!data) throw new NotFoundException('Kelas tidak ditemukan');

      return data;
    } catch (error) {
      throw error;
    }
  }

  async findById(id: number): Promise<Class> {
    return await this.classRepository.findClassById(id);
  }

  async deleteById(id: number): Promise<void> {
    const data = await this.classRepository.findOne({ where: { id: id } });

    if (!data) throw new NotFoundException('Kelas tidak ditemukan');

    await this.classRepository.remove(data);
  }

  @Transactional()
  public async updateOne(id: number, body: UpdateClassDto): Promise<Class> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const updateClass = await this.classRepository.findOne({
        where: { id: id },
      });

      if (!updateClass) throw new NotFoundException('Kelas tidak ditemukan');

      Object.assign(updateClass, body);

      const resultData = await this.classRepository.save(updateClass);

      await queryRunner.commitTransaction();

      return resultData;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
