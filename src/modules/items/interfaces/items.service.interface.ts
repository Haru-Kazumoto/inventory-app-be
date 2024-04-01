import { PageDto, PageOptionsDto } from 'src/utils/pagination.utils';
import { CreateItemDto } from '../dto/create-item.dto';
import { Item } from '../entities/item.entity';
import { UpdateItemDto } from '../dto/update-item.dto';
import { ItemCategory } from 'src/enums/item_category.enum';
import { StatusItem } from 'src/enums/status_item.enum';
import { GetAllItemResponse } from '../dto/response-item.dto';
import { ItemStatusCount } from './item_status_count.interface';
import { Major } from 'src/enums/majors.enum';
import { ItemStatusCondition } from 'src/enums/item_status_condition.enum';

export interface IItemsService {
  createOne(body: CreateItemDto): Promise<Item>;
  findMany(
    category: ItemCategory,
    classId: number,
    itemName: string,
    status: StatusItem,
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<Item>>;
  findAllItemCodeByItemName(
    itemName: string,
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<Item>>;
  findAllItems(filterCategory: ItemCategory): Promise<Item[]>;
  itemByStatus(
    status: ItemStatusCondition,
    major: Major,
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<Item>>;
  countItemByStatus(major: Major): Promise<ItemStatusCount>;
  updateOne(id: number, body: UpdateItemDto): Promise<Item>;
  deleteById(id: number): Promise<void>;
}
