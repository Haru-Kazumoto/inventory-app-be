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

@UseGuards(AuthenticatedGuard)
@ApiTags('Item')
@Controller('items')
export class ItemsController {
  constructor(
    private readonly itemsService: ItemsService,
    private readonly itemsRepository: ItemsRepository,
    private readonly excelService: ExcelService
  ) {}

  public validationQueryIsNumber(query: string): void {
    if (query) {
      parseInt(query, 10); // Parse string to integer
      if (isNaN(query as unknown as number)) {
        throw new HttpException('Class must be an integer', 400);
      }
    }
  }

  @ApiOkResponse({
    description: 'Creating one item record',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'number', example: 200 },
        message: { type: 'string', example: 'OK' },
        data: { type: 'object', example: { item: {} } },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Bad Request',
    schema: {
      type: 'object',
      properties: {
        error: {
          type: 'array',
          example: ['itemname cannot be empty', 'email pattern not valid'],
        },
      },
    },
  })
  @ApiForbiddenResponse({
    description: 'Forbidden resource or ability',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 401 },
        message: { type: 'string', example: 'Not Authenticated' },
        error: { type: 'string', example: 'Forbidden' },
      },
    },
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal Server Error',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Internal server error' },
        status: { type: 'number', example: 500 },
      },
    },
  })
  @ApiBody({
    type: CreateItemDto,
    description: 'DTO Structure response from create one item',
  })
  @Post('create')
  async createOneItem(@Body() dto: CreateItemDto) {
    const data = await this.itemsService.createOne(dto);

    return {
      [this.createOneItem.name]: data
    }
  }

  @Get('find-all')
  @ApiOkResponse({
    description: 'Success get all items',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 200 },
        message: { type: 'string', example: 'OK' },
        data: { type: 'array', example: { items: [{}] } },
      },
    },
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal Server Error',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 500 },
        message: { type: 'string', example: 'Internal server error' },
      },
    },
  })
  @ApiPaginatedResponse(Item)
  @ApiQuery({
    name: 'category',
    description: 'Category of item',
    required: false,
    enum: ItemCategory
  })
  @ApiQuery({
    name: 'status',
    description: 'Status of item',
    required: false,
  })
  @ApiQuery({
    name: 'name',
    description: 'Name of item',
    required: false,
  })
  @ApiQuery({
    name: 'classId',
    description: 'Class Id of class item',
    required: false,
    type: Number,
  })
  public async findManyItem(
    @Query('category') category: ItemCategory,
    @Query('status') status: StatusItem,
    @Query('name') itemName: string,
    @Query('classId') classId: string,
    @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<Item>> {
    this.validationQueryIsNumber(classId);

    return this.itemsService.findMany(
      category,
      classId as unknown as number,
      itemName,
      status,
      pageOptionsDto,
    );
  }

  @ApiQuery({
    name: "item-category",
    description: "Find all items with filtering by item category",
    enum: ItemCategory,
    required: false
  })
  @Get('get-all-items')
  public async findManyItemsWithNoPagination(
    @Query('item-category') filterCategory: ItemCategory, 
  ) {
      const items = await this.itemsService.findAllItems(filterCategory);

      const responseDto = items.map(item => new GetAllItemResponse(
        item.id,
        item.name,
        item.item_code,
        item.status_item
      ));

      return {
        [this.findManyItemsWithNoPagination.name]: responseDto
      }
  }

  @ApiOkResponse({
    description: 'Success get all items',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 200 },
        message: { type: 'string', example: 'OK' },
        data: { type: 'array', example: { items: [{}] } },
      },
    },
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal Server Error',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 500 },
        message: { type: 'string', example: 'Internal server error' },
      },
    },
  })
  @ApiPaginatedResponse(Item)
  @Get('find-by-item-name')
  public async findAllItemCodeByItemName(@Query('name') name: string,@Query() pageOptionsDto: PageOptionsDto): Promise<PageDto<Item>> {
    return this.itemsService.findAllItemCodeByItemName(name, pageOptionsDto);
  }

  @Put('update')
  @ApiOkResponse({
    description: 'Success to update one record of item',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 200 },
        message: { type: 'string', example: 'SUCCESS' },
        data: { type: 'object', example: { item: {} } },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'There is something bad happend to request',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: { type: 'string', example: 'Not valid type' },
        data: { type: 'object', example: null },
      },
    },
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error response',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 500 },
        message: { type: 'string', example: 'Internal server error' },
      },
    },
  })
  @ApiBody({
    type: UpdateItemDto,
    description: 'DTO Request for update',
    required: true,
  })
  @ApiQuery({
    name: 'id',
    description: 'Id item for update',
    type: Number,
    required: true,
  })
  public async updateItem(@Query('id', ParseIntPipe) id: number,@Body() dto: UpdateItemDto) {
    const instance = await this.itemsService.updateOne(id, dto);

    return {
      [this.updateItem.name]: instance
    }
  }

  @ApiQuery({
    name: 'id',
    description: 'Id for delete item',
    type: Number,
    required: true,
  })
  @ApiBadRequestResponse({
    description: 'Bad request response',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: { type: 'string', example: 'Id item tidak ditemukan' },
      },
    },
  })
  @Delete('delete')
  public async deleteItem(@Query('id', ParseIntPipe) id: number) {
    await this.itemsService.deleteById(id);
  }

  // -------------------------- TESTING

  @ApiQuery({
    name: "item_category",
    description: "Mengambil data berdasarkan kategory dari barang",
    enum: ItemCategory,
    required: true
  })
  @ApiQuery({
    name: "major",
    description: "Mengambil data berdasarkan tempat barang berada",
    enum: Major,
    required: true
  })
  @Get('export-data-item')
  async exportExcel(
    @Query('item_category') item_category: ItemCategory,
    @Query('major') major: Major,
    @Res() response: Response
  ): Promise<void> {
    const data: Item[] = await this.itemsRepository.find({
      where: {
        category_item: item_category,
        class: {
          major: major
        }
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
        'class'
      ]
    });

    //initialize column
    const columns: Record<string, string>[] = [
      {header: "Nama Barang", key: "name"},
      {header: "Kode Barang", key: "item_code"},
      {header: "Status Barang", key: "status_item"},
      {header: "Sumber Dana", key: "source_fund"},
      {header: "Harga Per-Unit", key: "unit_price"},
      {header: "Kondisi Barang", key: "item_condition"},
      {header: "Kategori Barang", key: "category_item"},
      {header: "Tipe Barang", key: "item_type"},
      {header: "Kelas Barang", key: "class"}
    ]

    const date = new Date();
    const formattedDate = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
    const fileName: string = `data_item_${formattedDate}`;

    const buffer = await this.excelService.exportXLSX(data, columns);

    response.set({
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename=${fileName}.xlsx`
    });

    response.send(buffer);
  }
}
