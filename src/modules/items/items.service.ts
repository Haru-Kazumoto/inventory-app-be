import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateItemDto, CreateItemDtoWithFile } from './dto/create-item.dto';
import { IItemsService } from './interfaces/items.service.interface';
import { ItemsRepository } from './repository/items.repository';
import { PageOptionsDto, PageDto } from 'src/utils/pagination.utils';
import { Item } from './entities/item.entity';
import { UpdateItemDto, UpdateItemDtoWithFile } from './dto/update-item.dto';
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
import {
  itemCreateContent,
  itemDeleteContent,
} from '../notification/notification.constant';
import { Class } from '../class/entitites/class.entity';
import { User } from '../user/entities/user.entity';
import { RequestItemsRepository } from '../request_items/repository/request_items.repository';
import { ItemStatusCount } from './interfaces/item-status-count.interface';
import { Major } from 'src/enums/majors.enum';
import { ItemStatusCondition } from 'src/enums/item_status_condition.enum';
import { ItemCountByMajor } from './interfaces/item-count-by-major.interface';

@Injectable()
export class ItemsService implements IItemsService {
  constructor(
    private readonly itemRepository: ItemsRepository,
    private readonly classRepository: ClassRepository,
    private readonly notificationService: NotificationService,
    private readonly auditLogService: AuditLogsService,
    private readonly requestItemRepository: RequestItemsRepository,
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
        content: itemCreateContent,
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

  async createOneWithFile(body: CreateItemDtoWithFile, file: Express.Multer.File): Promise<Item> {
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
        item_image: file.filename
      });
      const resultData = await this.itemRepository.save(newItem);

      await this.auditLogService.createReport({
        edit_method: EditMethod.CREATE,
        edited_by: session.id,
        item_id: resultData.id,
      });

      await this.notificationService.sendNotification({
        title: 'Item Baru Berhasil ditambahkan!',
        content: itemCreateContent,
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

  async countItemByMajor(): Promise<ItemCountByMajor> {
    const classData: Class[] = await this.classRepository.find();
    const result: ItemCountByMajor = {};

    for (const cls of classData) {
      const itemCount = await this.itemRepository.count({
        where: {
          class: cls,
        },
      });
      result[cls.major] = itemCount;
    }

    return result;
  }

  //ini ada bug nih, dia gak mau meresponse selalu muter muter. Ganti metode mapping nya cuy
  async findAllItems(
    filterCategory: ItemCategory,
    major: Major,
  ): Promise<Item[]> {
    const findItems: Item[] = await this.itemRepository.find({
      where: {
        category_item: filterCategory,
        status_item: StatusItem.TERSEDIA,
        class: { major },
      },
    });

    return findItems;
  }

  async findMany(
    category: ItemCategory,
    classId: number,
    itemName: string,
    major: Major,
    status: StatusItem,
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<Item>> {
    try {
      const data = await this.itemRepository.findMany(
        category,
        classId,
        itemName,
        major,
        status,
        pageOptionsDto,
      );
      if (!data) throw new NotFoundException('Data tidak ditemukan');
      return data;
    } catch (error) {
      throw error;
    }
  }

  public async countItemByStatus(major: Major): Promise<ItemStatusCount> {
    const goodItemCount = await this.itemRepository.countGoodItems(major);
    const lightlyDamagedItemCount =
      await this.itemRepository.countLightlyDamagedItems(major);
    const severelyDamagedItemCount =
      await this.itemRepository.countSeverelyDamagedItems(major);
    const outItemCount = await this.itemRepository.countOutItems(major);
    const totalItemCount = await this.itemRepository.countItems(major);
    const pendingRequestItemCount =
      await this.requestItemRepository.countPendingRequest(major);

    return {
      goodItemCount,
      lightlyDamagedItemCount,
      severelyDamagedItemCount,
      outItemCount,
      totalItemCount,
      pendingRequestItemCount,
    };
  }

  public async itemStatusCondition(
    status: ItemStatusCondition,
    major: Major,
    pageOptionsDto: PageOptionsDto,
  ): Promise<any> {
    const data = await this.itemRepository.itemStatusCondition(
      status,
      major,
      pageOptionsDto,
    );
    if (!data) throw new NotFoundException('Data tidak ditemukan');
    return data;
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

  async updateStatusItem(id: number): Promise<Item> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const session: User = await this.authService.getSession();

      const findItemToUpdate: Item = await this.itemRepository.findById(id);

      await this.notificationService.sendNotification({
        title: 'Item Berhasil diupdate!',
        content: `Item ${findItemToUpdate.name} berhasil update status barang`,
        color: 'red',
        user_id: session.id,
      });

      const mergeData: Item = this.itemRepository.merge(findItemToUpdate, {
        status_item: StatusItem.TIDAK_TERSEDIA,
      });

      const resultData: Item = await queryRunner.manager.save(mergeData);

      await queryRunner.commitTransaction();

      return resultData;
    } catch (err) {
      await queryRunner.rollbackTransaction();

      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  public async updateOne(id: number, body: UpdateItemDto): Promise<Item> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const session: User = await this.authService.getSession();

      const findItem: Item = await this.itemRepository.findById(id);
      if (!findItem) throw new NotFoundException('Item tidak ditemukan');

      const findClass: Class = await this.classRepository.findOne({
        where: { id: body.class_id },
      });
      if (!findClass) throw new NotFoundException('Class id tidak ditemukan');

      // Menggunakan merge untuk menggabungkan data yang baru dengan data yang ada di objek findItem
      const mergeData: Item = this.itemRepository.merge(findItem, {
        ...body,
        class: findClass,
      });

      const resultData = await this.itemRepository.save(mergeData);

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

  async updateOneWithFile(id: number, body: UpdateItemDtoWithFile, file: Express.Multer.File): Promise<Item> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const session: User = await this.authService.getSession();

      const findItem: Item = await this.itemRepository.findById(id);
      if (!findItem) throw new NotFoundException('Item tidak ditemukan');

      const findClass: Class = await this.classRepository.findOne({
        where: { id: body.class_id },
      });
      if (!findClass) throw new NotFoundException('Class id tidak ditemukan');

      // Menggunakan merge untuk menggabungkan data yang baru dengan data yang ada di objek findItem
      const mergeData: Item = this.itemRepository.merge(findItem, {
        ...body,
        class: findClass,
        item_image: file.filename
      });

      const resultData = await this.itemRepository.save(mergeData);

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
