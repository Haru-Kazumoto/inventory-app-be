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
  requestUpdateContent,
} from '../notification/notification.constant';
import { User } from '../user/entities/user.entity';
import { ItemType } from 'src/enums/item_type.enum';
import { Major } from 'src/enums/majors.enum';

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
  // Membuat request item
  public async createRequest(body: CreateRequestItemDto): Promise<RequestItem> {
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
        class: classEntity,
        from_major: session.role.major
      });
      const resultData = await this.requestItemRepository.save(newRequest);

      await this.notificationService.sendNotification({
        title: 'Request Baru Berhasil Ditambahkan!',
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

  public async createRequestWithFile(body: CreateRequestItemDto, file: Express.Multer.File): Promise<RequestItem> {
    const queryRunner = this.dataSource.createQueryRunner();

    queryRunner.connect();
    queryRunner.startTransaction();

    try {
      const session = await this.authService.getSession();
      const classEntity = await this.classRepository.findClassById(body.class_id);

      const newRequest = this.requestItemRepository.create({
        ...body,
        class: classEntity,
        from_major: session.role.major,
        request_image: file ? file.path : null, // Path gambar
      });
      const resultData = await this.requestItemRepository.save(newRequest);

      await this.notificationService.sendNotification({
        title: 'Request Baru Berhasil Ditambahkan!',
        content: 'Request baru telah berhasil ditambahkan.', // sesuaikan sesuai kebutuhan Anda
        color: 'blue',
        user_id: session.id,
      });

      await queryRunner.commitTransaction();

      console.log({resultData});

      return resultData;
      // return newRequest;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
    
  }

  public async findById(request_item_id: number): Promise<RequestItem> {
    const data = this.requestItemRepository.findById(request_item_id);
    if(!data) throw new BadRequestException("Id not found");

    return data;
  }

  // Mencari semua request items, dengan filter nama class dan status request
  public findMany(
    majorName: Major,
    status: RequestStatus,
    item_type: ItemType,
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<RequestItem>> {
    return this.requestItemRepository.findMany(
      majorName,
      status,
      item_type,
      pageOptionsDto,
    );
  }

  // Mengupdate property request item seperti item_name, total request, description, dan class id dengan id
  @Transactional()
  public async updateRequest(
    id: number,
    body: UpdateRequestItemDto,
  ): Promise<RequestItem> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const session: User = await this.authService.getSession();

      const request = await this.requestItemRepository.findById(id);

      if (!request) throw new NotFoundException('Request tidak ditemukan');

      const mergeData: RequestItem = this.requestItemRepository.merge(
        request,
        body,
      );

      const resultData = await this.requestItemRepository.save(mergeData);

      await this.notificationService.sendNotification({
        title: 'Request Item Berhasil Diupdate!',
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

  //Menghapus request item dengan id
  public async deleteRequest(id: number): Promise<void> {
    const session = await this.authService.getSession();

    const data = await this.requestItemRepository.findOne({
      where: { id: id },
    });

    if (!data) throw new NotFoundException('Data tidak ditemukan');

    await this.requestItemRepository.remove(data);

    await this.notificationService.sendNotification({
      title: 'Request Item Berhasil Dihapus!',
      content: requestDeleteContent,
      color: 'blue',
      user_id: session.id,
    });

    return Promise.resolve();
  }

  // Mengupdate status request menjadi accepted
  @Transactional()
  public async acceptRequest(id: number): Promise<RequestItem> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const session = await this.authService.getSession();

      const request = await this.requestItemRepository.findById(id);

      if (!request) throw new NotFoundException('Request tidak ditemukan');

      // Hanya mengizinkan status pending agar request lain tidak bisa diubah menjadi accepted
      if (request.status === RequestStatus.PENDING) {
        const mergeData: RequestItem = this.requestItemRepository.merge(
          request,
          {
            status: RequestStatus.ACCEPTED,
            accepted_date: new Date(),
          },
        );

        const resultData = await this.requestItemRepository.save(mergeData);

        await this.notificationService.sendNotification({
          title: 'Status Request Berubah!',
          content: requestUpdateContent,
          color: 'blue',
          user_id: session.id,
        });

        await queryRunner.commitTransaction();

        return resultData;
      } else {
        throw new BadRequestException('Request tidak diterima');
      }
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  public pendingRequest(
    major: Major,
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<RequestItem>> {
    return this.requestItemRepository.pendingRequest(
      major,
      pageOptionsDto,
    );
  }
  // Mengupdate status request menjadi rejected
  @Transactional()
  public async rejectRequest(id: number): Promise<RequestItem> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const session = await this.authService.getSession();

      const request = await this.requestItemRepository.findById(id);

      if (!request) throw new NotFoundException('Request tidak ditemukan');

      // Hanya mengizinkan status pending agar request lain tidak bisa diubah menjadi reject
      if (request.status === RequestStatus.PENDING) {
        const mergeData: RequestItem = this.requestItemRepository.merge(
          request,
          {
            status: RequestStatus.REJECTED,
          },
        );

        const resultData = await this.requestItemRepository.save(mergeData);

        await this.notificationService.sendNotification({
          title: 'Status Request Berubah!',
          content: requestUpdateContent,
          color: 'blue',
          user_id: session.id,
        });

        await queryRunner.commitTransaction();
        return resultData;
      } else {
        throw new BadRequestException('Request tidak diterima.');
      }
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  // Mengupdate status request menjadi arrived
  @Transactional()
  public async arriveRequest(id: number): Promise<RequestItem> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const session = await this.authService.getSession();

      const request = await this.requestItemRepository.findById(id);

      if (!request) throw new NotFoundException('Request tidak ditemukan');

      // Cek apakah request sudah on the way, jika tidak maka mengembalikan error
      if (request.status === RequestStatus.ON_THE_WAY) {
        // mengubah is_arrive menjadi true, jika request sudah arrive
        const mergeData: RequestItem = this.requestItemRepository.merge(
          request,
          {
            status: RequestStatus.ARRIVED,
            arrive_date: new Date(),
            is_arrive: true,
          },
        );

        const resultData = await this.requestItemRepository.save(mergeData);

        await this.notificationService.sendNotification({
          title: 'Status Request Berubah!',
          content: requestUpdateContent,
          color: 'blue',
          user_id: session.id,
        });

        await queryRunner.commitTransaction();
        return resultData;
      } else {
        throw new BadRequestException('Request tidak diterima.');
      }
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  // Mengupdate status request menjadi on the way
  @Transactional()
  public async onTheWayRequest(id: number): Promise<RequestItem> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const session = await this.authService.getSession();

      const request = await this.requestItemRepository.findById(id);

      if (!request) throw new NotFoundException('Request tidak ditemukan');

      // Cek apakah request sudah diterima, jika tidak maka mengembalikan error
      if (request.status === RequestStatus.ACCEPTED) {
        // mengubah is_arrive menjadi false ketika request sedang on the way
        const mergeData: RequestItem = this.requestItemRepository.merge(
          request,
          {
            status: RequestStatus.ON_THE_WAY,
            is_arrive: false,
            on_the_way_date: new Date()
          },
        );

        const resultData = await this.requestItemRepository.save(mergeData);

        await this.notificationService.sendNotification({
          title: 'Status Request Berubah!',
          content: requestUpdateContent,
          color: 'blue',
          user_id: session.id,
        });

        await queryRunner.commitTransaction();
        return resultData;
      } else {
        throw new BadRequestException('Request tidak diterima.');
      }
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
