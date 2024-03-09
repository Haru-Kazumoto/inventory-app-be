import { PageDto, PageOptionsDto } from 'src/utils/pagination.utils';
import { CreateItemDto } from './dto/create-item.dto';
import { Item } from './entities/item.entity';
import { UpdateItemDto } from './dto/update-item.dto';
import { Request } from 'express';
import { ItemCategory } from 'src/enums/item_category.enum';

export interface IItemsService {
  createOne(body: CreateItemDto): Promise<Item>;
  findMany(
    category: ItemCategory,
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<Item>>;
  updateOne(id: number, body: UpdateItemDto): Promise<Item>;
  deleteById(id: number): Promise<void>;
}
