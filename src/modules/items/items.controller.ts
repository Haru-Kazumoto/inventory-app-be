import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  Res,
  Req,
  Query,
  Put,
  ParseIntPipe,
  HttpException,
} from '@nestjs/common';
import { ItemsService } from './items.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { AuthenticatedGuard } from 'src/security/guards/authenticated.guard';
import { Item } from './entities/item.entity';
import { PageDto, PageOptionsDto } from 'src/utils/pagination.utils';
import { ApiPaginatedResponse } from 'src/decorator/paginate.decorator';
import { ItemCategory } from 'src/enums/item_category.enum';
import { StatusItem } from 'src/enums/status_item.enum';
import { GetAllItemResponse } from './dto/response-item.dto';
import { ExcelService } from 'src/utils/excel/excel.service';
import { Response } from 'express';
import { ItemsRepository } from './repository/items.repository';
import { Major } from 'src/enums/majors.enum';
import { ItemStatusCount } from './interfaces/item_status_count.interface';
import { CreateItemDecorator } from './decorator/create-item.decorator';
import { FindAllItemDecorator } from './decorator/find-all-item.decorator';
import { CountItemDecorator } from './decorator/count-item.decorator';
import { RequestItemsByStatusDecorator } from '../request_items/decorator/request-items-by-status.decorator';
import { ItemsStatusConditionDecorator } from './decorator/item-status-condition.decorator';
import { GetAllItemsDecorator } from './decorator/get-all-items.decorator';
import { FindByItemNameDecorator } from './decorator/find-by-item-name.decorator';
import { UpdateItemDecorator } from './decorator/update-item.decorator';
import { DeleteItemDecorator } from './decorator/delete-item.decorator';
import { ExportDataItemDecorator } from './decorator/export-data-item.decorator';
import { ItemStatusCondition } from 'src/enums/item_status_condition.enum';

import * as ExcelJs from 'exceljs';
import { UpdateStatusItemDecorator } from './decorator/update-status-item.decorator';

@UseGuards(AuthenticatedGuard)
@ApiTags('Item')
@Controller('items')
export class ItemsController {
  constructor(
    private readonly itemsService: ItemsService,
    private readonly itemsRepository: ItemsRepository,
    private readonly excelService: ExcelService,
  ) {}

  public validationQueryIsNumber(query: string): void {
    if (query) {
      parseInt(query, 10); // Parse string to integer
      if (isNaN(query as unknown as number)) {
        throw new HttpException('Class must be an integer', 400);
      }
    }
  }

  @CreateItemDecorator()
  @Post('create')
  async createOneItem(@Body() dto: CreateItemDto) {
    const data = await this.itemsService.createOne(dto);

    return {
      [this.createOneItem.name]: data,
    };
  }

  @FindAllItemDecorator()
  @Get('find-all')
  public async findManyItem(
    @Query('category') category: ItemCategory,
    @Query('status') status: StatusItem,
    @Query('name') itemName: string,
    @Query('major') major: Major,
    @Query('classId') classId: string,
    @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<Item>> {
    this.validationQueryIsNumber(classId);

    return this.itemsService.findMany(
      category,
      classId as unknown as number,
      itemName,
      major,
      status,
      pageOptionsDto,
    );
  }

  @CountItemDecorator()
  @Get('count-items')
  public async countItemByStatus(
    @Query('major') major: Major,
  ): Promise<ItemStatusCount> {
    return this.itemsService.countItemByStatus(major);
  }

  @ItemsStatusConditionDecorator()
  @Get('items-by-status')
  public async itemStatusCondition(
    @Query('status') status: ItemStatusCondition,
    @Query('major') major: Major,
    @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<any> {
    return this.itemsService.itemStatusCondition(status, major, pageOptionsDto);
  }

  @GetAllItemsDecorator()
  @Get('get-all-items')
  public async findManyItemsWithNoPagination(
    @Query('item-category') filterCategory: ItemCategory,
    @Query('major') major: Major,
  ) {
    const items = await this.itemsService.findAllItems(filterCategory, major);

    const responseDto = items.map(
      (item) =>
        new GetAllItemResponse(
          item.id,
          item.name,
          item.item_code,
          item.status_item,
        ),
    );

    return {
      [this.findManyItemsWithNoPagination.name]: responseDto,
    };
  }

  @UpdateStatusItemDecorator()
  @Patch('update-status-item-to-unavailable')
  public async updateStatusItem(@Query('id-item') id: number) {
    const result = await this.itemsService.updateStatusItem(id);

    return {
      [this.updateStatusItem.name]: result,
    };
  }

  @FindByItemNameDecorator()
  @Get('find-by-item-name')
  public async findAllItemCodeByItemName(
    @Query('name') name: string,
    @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<Item>> {
    return this.itemsService.findAllItemCodeByItemName(name, pageOptionsDto);
  }

  @Put('update')
  @UpdateItemDecorator()
  public async updateItem(
    @Query('id', ParseIntPipe) id: number,
    @Body() dto: UpdateItemDto,
  ) {
    const instance = await this.itemsService.updateOne(id, dto);

    return {
      [this.updateItem.name]: instance,
    };
  }

  @DeleteItemDecorator()
  @Delete('delete')
  public async deleteItem(@Query('id', ParseIntPipe) id: number) {
    await this.itemsService.deleteById(id);
  }

  // -------------------------- TESTING

  @ExportDataItemDecorator()
  @Get('export-data-item')
  async exportExcel(
    @Query('item_category') item_category: ItemCategory,
    @Query('major') major: Major,
    @Res() response: Response,
  ): Promise<void> {
    const data: Item[] = await this.itemsRepository.find({
      where: {
        category_item: item_category,
        class: {
          major: major,
        },
      },
      relations: ['class'],
      select: [
        'name',
        'item_code',
        'status_item',
        'source_fund',
        'unit_price',
        'item_condition',
        'category_item',
        'item_type',
      ],
    });

    data.forEach((item) => {
      item['major'] = item.class.major;
      item['class_name'] = item.class.class_name;
    });

    //initialize column
    const columns = [
      { header: 'Nama Barang', key: 'name', width: 50 },
      { header: 'Kode Barang', key: 'item_code', width: 40 },
      { header: 'Status Barang', key: 'status_item', width: 35 },
      { header: 'Sumber Dana', key: 'source_fund', width: 30 },
      { header: 'Harga Per-Unit', key: 'unit_price', width: 50 },
      { header: 'Kondisi Barang', key: 'item_condition', width: 30 },
      { header: 'Kategori Barang', key: 'category_item', width: 35 },
      { header: 'Tipe Barang', key: 'item_type', width: 40 },
      { header: 'Kelas Barang', key: 'class_name', width: 20 },
      { header: 'Jurusan', key: 'major', width: 15 },
    ];

    const date = new Date();
    const formattedDate = `${date.getDate()}-${
      date.getMonth() + 1
    }-${date.getFullYear()}`;
    const fileName: string = `data_item_${formattedDate}`;

    const buffer = await this.excelService.exportXLSX(data, columns);

    response.set({
      'Content-Type':
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename=${fileName}.xlsx`,
    });

    response.send(buffer);
  }
}
