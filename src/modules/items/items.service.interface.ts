import { PageDto, PageOptionsDto } from "src/utils/pagination.utils";
import { CreateItemDto } from "./dto/create-item.dto";
import { Item } from "./entities/item.entity";
import { UpdateItemDto } from "./dto/update-item.dto";
import { Request } from "express";

export interface IItemsService {
    createOne(request: Request, body: CreateItemDto): Promise<Item>;
    findMany(category: string | any, pageOptionsDto: PageOptionsDto): Promise<PageDto<Item>>;
    updateOne(id: number, body: UpdateItemDto): Promise<Item>;
    deleteById(id: number): Promise<Record<any, any>>;
}