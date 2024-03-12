import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateRequestItemDto } from './dto/create-request_item.dto';
import { UpdateRequestItemDto } from './dto/update-request_item.dto';
import { IRequestItems } from './request_items.interface';
import { RequestStatus } from 'src/enums/request_status.enum';
import { PageDto, PageOptionsDto } from 'src/utils/pagination.utils';
import { RequestItem } from './entities/request_item.entity';
import { DataSource } from 'typeorm';
import { RequestItemsRepository } from './repository/request_items.repository';
import { AuthService } from '../auth/auth.service';
import { ClassRepository } from '../class/repositories/class.repository';
import { NotificationService } from '../notification/notification.service';
import { Transactional } from 'typeorm-transactional';
import {
  requestCreateContent,
  requestDeleteContent,
} from '../notification/notification.constant';

@Injectable()
export class RequestItemsService implements IRequestItems {
  constructor(
    private dataSource: DataSource,
    private requestItemRepository: RequestItemsRepository,
    private authService: AuthService,
    private classRepository: ClassRepository,
    private notificationService: NotificationService,
  ) {}

  @Transactional()
  public async createRequest(body): Promise<any> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const session = await this.authService.getSession();
      const classEntity = await this.classRepository.findClassById(
        body.class_id,
      );

      const newRequest = this.requestItemRepository.create({
        ...body,
        request_date: new Date(),
        status: RequestStatus.PENDING,
        class: classEntity,
      });
      const resultData = await this.requestItemRepository.save(newRequest);

      await this.notificationService.sendNotification({
        title: 'Request Baru Berhasil ditambahkan!',
        content: requestCreateContent,
        color: 'blue',
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

  public findMany(
    className: string,
    status: RequestStatus,
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<RequestItem>> {
    return this.requestItemRepository.findMany(
      className,
      status,
      pageOptionsDto,
    );
  }

  @Transactional()
  public async updateRequest(
    id: number,
    body: UpdateRequestItemDto,
  ): Promise<RequestItem> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const session = await this.authService.getSession();

      const request = await this.requestItemRepository.findById(id);

      if (!request) throw new NotFoundException('Request tidak ditemukan');

      Object.assign(request, body);

      const resultData = await this.requestItemRepository.save(request);

      await this.notificationService.sendNotification({
        title: 'Request Berhasil diupdate!',
        content: requestCreateContent,
        color: 'blue',
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

  public async deleteRequest(id: number): Promise<void> {
    const session = await this.authService.getSession();

    const data = await this.requestItemRepository.findOne({
      where: { id: id },
    });

    if (!data) throw new NotFoundException('Data tidak ditemukan');

    await this.requestItemRepository.remove(data);

    await this.notificationService.sendNotification({
      title: 'Request Berhasil dihapus!',
      content: requestDeleteContent,
      color: 'blue',
      user_id: session.id,
    });

    return Promise.resolve();
  }

  public async acceptRequest(id: number): Promise<RequestItem> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const session = await this.authService.getSession();

      const request = await this.requestItemRepository.findById(id);

      if (!request) throw new NotFoundException('Request tidak ditemukan');

      Object.assign(request, {
        status: RequestStatus.ACCEPTED,
        accepted_date: new Date(),
      });

      const resultData = await this.requestItemRepository.save(request);

      await this.notificationService.sendNotification({
        title: 'Request Berhasil diupdate!',
        content: requestCreateContent,
        color: 'blue',
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

  public async rejectRequest(id: number): Promise<RequestItem> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const session = await this.authService.getSession();

      const request = await this.requestItemRepository.findById(id);

      if (!request) throw new NotFoundException('Request tidak ditemukan');

      if (request.status == RequestStatus.ACCEPTED)
        throw new BadRequestException(
          'Request sudah di accept, tidak bisa di reject',
        );

      Object.assign(request, { status: RequestStatus.REJECTED });

      const resultData = await this.requestItemRepository.save(request);

      await this.notificationService.sendNotification({
        title: 'Request Berhasil diupdate!',
        content: requestCreateContent,
        color: 'blue',
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

  public async arriveRequest(id: number): Promise<RequestItem> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const session = await this.authService.getSession();

      const request = await this.requestItemRepository.findById(id);

      if (!request) throw new NotFoundException('Request tidak ditemukan');

      Object.assign(request, {
        status: RequestStatus.ARRIVED,
        arrive_date: new Date(),
        is_arrive: true,
      });

      const resultData = await this.requestItemRepository.save(request);

      await this.notificationService.sendNotification({
        title: 'Request Berhasil diupdate!',
        content: requestCreateContent,
        color: 'blue',
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

  public async onTheWayRequest(id: number): Promise<RequestItem> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const session = await this.authService.getSession();

      const request = await this.requestItemRepository.findById(id);

      if (!request) throw new NotFoundException('Request tidak ditemukan');

      Object.assign(request, {
        status: RequestStatus.ON_THE_WAY,
        is_arrive: false,
      });

      const resultData = await this.requestItemRepository.save(request);

      await this.notificationService.sendNotification({
        title: 'Request Berhasil diupdate!',
        content: requestCreateContent,
        color: 'blue',
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
}
