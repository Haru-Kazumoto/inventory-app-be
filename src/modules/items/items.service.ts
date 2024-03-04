import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { CreateItemDto } from './dto/create-item.dto';
import { IItemsService } from './items.service.interface';
import { ItemsRepository } from './repository/items.repository';
import { PageOptionsDto, PageDto } from 'src/utils/pagination.utils';
import { Item } from './entities/item.entity';
import { UpdateItemDto } from './dto/update-item.dto';
import { Transactional } from 'typeorm-transactional';
import { Request } from 'express';
import { generateRandomNumber } from 'src/utils/modules_utils/item.utils';
import { ClassRepository } from '../class/repositories/class.repository';
import { getSession } from '../user/entities/user.entity';
import { NotificationService } from '../notification/notification.service';
import { AuditLogsService } from '../audit-logs/audit-logs.service';
import { EditMethod } from 'src/enums/edit_methods.enum';
import { DataNotFoundException } from 'src/exceptions/data_not_found.exception';

@Injectable()
export class ItemsService implements IItemsService {
  constructor(
    private readonly itemRepository: ItemsRepository,
    private readonly classRepository: ClassRepository,
    private readonly notificationService: NotificationService,
    private readonly auditLogService: AuditLogsService,
  ) {}

  @Transactional()
  async createOne(request: Request, body: CreateItemDto): Promise<Item> {
    const session = getSession(request);
    try {
      const classEntity = await this.classRepository.findClassById(
        body.class_id,
      );

      const newItem = this.itemRepository.create({
        ...body,
        class: classEntity,
      });
      console.log(newItem);

      const resultData = await this.itemRepository.save(newItem);

      //CREATE AUDIT LOGS
      await this.auditLogService.createReport({
        edit_method: EditMethod.CREATE,
        edited_by: session.id,
        item_id: resultData.id,
      });

      //CREATE NOTIFICATION
      await this.notificationService.sendNotification({
        title: 'Item Baru Berhasil ditambahkan!',
        content: `Item ${
          body.name
        } baru telah berhasil ditambahkan ke inventory pada waktu ${new Date()}`,
        color: 'blue',
        user_id: session.id,
      });

      return resultData;
    } catch {
      throw new BadRequestException('Whoops, it seems like you have an error.');
    }
  }

  findMany(pageOptionsDto: PageOptionsDto): Promise<PageDto<Item>> {
    return this.itemRepository.findMany(pageOptionsDto);
  }

  @Transactional()
  public async updateOne(id: number, body: UpdateItemDto): Promise<Item> {
    const item = await this.itemRepository.findById(id);
    if (!item) throw new DataNotFoundException('Id item not found', 400);

    Object.assign(item, body);

    return await this.itemRepository.save(item);
  }

  public async deleteById(id: number): Promise<Record<any, any>> {
    const data = await this.itemRepository.findOne({ where: { id: id } });

    if (!data) {
      throw new DataNotFoundException('ID not found', 400);
    }

    await this.itemRepository.remove(data);
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
