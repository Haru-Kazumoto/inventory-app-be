import { Injectable } from '@nestjs/common';
import { CreateItemDto } from './dto/create-item.dto';
import { IItemsService } from './items.service.interface';
import { ItemsRepository } from './repository/items.repository';
import { PageOptionsDto, PageDto } from 'src/utils/pagination.utils';
import { Item } from './entities/item.entity';
import { UpdateItemDto } from './dto/update-item.dto';

@Injectable()
export class ItemsService implements IItemsService {
  constructor(
    private readonly itemRepository: ItemsRepository
  ){}

  async createOne(body: CreateItemDto): Promise<Item> {
    throw new Error('Method not implemented.');
  }

  findMany(category: any, pageOptionsDto: PageOptionsDto): Promise<PageDto<Item>> {
    throw new Error('Method not implemented.');
  }

  updateOne(id: number, body: UpdateItemDto): Promise<Item> {
    throw new Error('Method not implemented.');
  }

  deleteById(id: number): Promise<Record<any, any>> {
    throw new Error('Method not implemented.');
  }
}
