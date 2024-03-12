import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateItemDto } from './dto/create-item.dto';
import { IItemsService } from './items.service.interface';
import { ItemsRepository } from './repository/items.repository';
import { PageOptionsDto, PageDto } from 'src/utils/pagination.utils';
import { Item } from './entities/item.entity';
import { UpdateItemDto } from './dto/update-item.dto';
import { Transactional } from 'typeorm-transactional';
import { generateRandomNumber } from 'src/utils/modules_utils/item.utils';
import { ClassRepository } from '../class/repositories/class.repository';
import { NotificationService } from '../notification/notification.service';
import { AuditLogsService } from '../audit-logs/audit-logs.service';
import { EditMethod } from 'src/enums/edit_methods.enum';
import { ItemCategory } from 'src/enums/item_category.enum';
import { DataSource } from 'typeorm';
import { AuthService } from '../auth/auth.service';
import { StatusItem } from 'src/enums/status_item.enum';
import { itemDeleteContent } from '../notification/notification.constant';
import { Class } from '../class/entitites/class.entity';

@Injectable()
export class ItemsService implements IItemsService {
  constructor(
    private readonly itemRepository: ItemsRepository,
    private readonly classRepository: ClassRepository,
    private readonly notificationService: NotificationService,
    private readonly auditLogService: AuditLogsService,
    private readonly authService: AuthService,
    private readonly dataSource: DataSource,
  ) {}

  @Transactional()
  async createOne(body: CreateItemDto): Promise<Item> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const session = await this.authService.getSession();
      const classEntity = await this.classRepository.findClassById(
        body.class_id,
      );
      const newItem = this.itemRepository.create({
        ...body,
        class: classEntity,
      });
      const resultData = await this.itemRepository.save(newItem);

      await this.auditLogService.createReport({
        edit_method: EditMethod.CREATE,
        edited_by: session.id,
        item_id: resultData.id,
      });

      await this.notificationService.sendNotification({
        title: 'Item Baru Berhasil ditambahkan!',
        content: `Item ${
          body.name
        } baru telah berhasil ditambahkan ke inventory pada waktu ${new Date()}`,
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

  async findMany(
    category: ItemCategory,
    classId: number,
    itemName: string,
    status: StatusItem,
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<Item>> {
    try {
      const data = await this.itemRepository.findMany(
        category,
        classId,
        itemName,
        status,
        pageOptionsDto,
      );
      if (!data) throw new NotFoundException('Data tidak ditemukan');
      return data;
    } catch (error) {
      throw error;
    }
  }

  async findAllItemCodeByItemName(
    itemName: string,
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<Item>> {
    try {
      const data = await this.itemRepository.findAllItemCodeByItemName(
        itemName,
        pageOptionsDto,
      );
      if (!data) throw new NotFoundException('Data tidak ditemukan');
      return data;
    } catch (error) {
      throw error;
    }
  }

  @Transactional()
  public async updateOne(id: number, body: UpdateItemDto): Promise<Item> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const session = await this.authService.getSession();

      const findItem = await this.itemRepository.findById(id);
      if (!findItem) throw new NotFoundException('Item tidak ditemukan');

      const findClass: Class = await this.classRepository.findOne({where: {id: body.class_id}});
      if(!findClass) throw new NotFoundException("Class id tidak di temukan");

      const createItem: Item = this.itemRepository.create({
        ...body,
        class: findClass
      });

      Object.assign(createItem, body);

      const resultData = await this.itemRepository.save(createItem);

      //UPDATE AUDIT LOGS
      await this.auditLogService.createReport({
        edit_method: EditMethod.UPDATE,
        edited_by: session.id,
        item_id: resultData.id,
      });

      //UPDATE NOTIFICATION
      await this.notificationService.sendNotification({
        title: 'Item Berhasil diupdate!',
        content: `Item ${
          body.name
        } baru telah berhasil diupdate ke inventory pada waktu ${new Date()}`,
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

  public async deleteById(id: number): Promise<void> {
    const session = await this.authService.getSession();

    const data = await this.itemRepository.findOne({ where: { id: id } });

    if (!data) throw new NotFoundException('Data tidak ditemukan');

    await this.auditLogService.createReport({
      edit_method: EditMethod.DELETE,
      edited_by: session.id,
      item_id: data.id,
    });

    await this.itemRepository.remove(data);

    await this.notificationService.sendNotification({
      title: 'Item Berhasil dihapus!',
      content: itemDeleteContent,
      color: 'blue',
      user_id: session.id,
    });

    return Promise.resolve();
  }

  //------------- UTILS

  async generateUniqueNumber(total: number): Promise<string> {
    let attempt = 0;
    let itemCode: any;
    let existingItem: Item;

    do {
      itemCode = await generateRandomNumber(total);
      existingItem = await this.itemRepository.findItemByItemCode(itemCode);

      attempt++;
    } while (existingItem);

    if (existingItem)
      throw new BadRequestException(
        'Failed generating code for a several time, please generate again.',
      );

    return itemCode;
  }
}
