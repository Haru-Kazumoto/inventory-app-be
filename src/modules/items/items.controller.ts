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
import { Request, Response } from 'express';
import { Item } from './entities/item.entity';
import { PageDto, PageOptionsDto } from 'src/utils/pagination.utils';
import { ApiPaginatedResponse } from 'src/decorator/paginate.decorator';
import { TransformInterceptor } from 'src/interceptors/transform.interceptor';
import { Status } from 'src/enums/response.enum';
import { ItemCategory } from 'src/enums/item_category.enum';
import { StatusItem } from 'src/enums/status_item.enum';
import { GetAllItemResponse } from './dto/response-item.dto';
import { plainToInstance } from 'class-transformer';

@UseGuards(AuthenticatedGuard)
@ApiTags('Item')
@Controller('items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

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
  @ApiBody({
    type: CreateItemDto,
    description: 'DTO Structure response from create one item',
  })
  @Post('create')
  async createOneItem(@Body() dto: CreateItemDto, @Res() response: Response) {
    const data = await this.itemsService.createOne(dto);

    return response.status(response.statusCode).json({
      statusCode: response.statusCode,
      message: 'OK',
      data: { item: data },
    });
  }

  @UseGuards(AuthenticatedGuard)
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
    required: false
  })
  @Get('get-all-items')
  public async findManyItemsWithNoPagination(
    @Query('item-category') filterCategory: ItemCategory, 
    @Res() response: Response
  ) {
      const items = await this.itemsService.findAllItems(filterCategory);

      const responseDto = items.map(item => new GetAllItemResponse(
        item.id,
        item.name,
        item.item_code,
        item.status_item
      ));

      console.log(responseDto);
      /*
       * note: if the return response is a object, u can use plainToInstance. 
       *       Otherwise use this way
       */

      // return plainToInstance(GetAllItemResponse, items);

      return response.status(200).json({
        statusCode: response.statusCode,
        message: "OK",
        data: {items: [responseDto]}
      });
  }

  @UseGuards(AuthenticatedGuard)
  @Get('find-by-item-name')
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
  public async findAllItemCodeByItemName(
    @Query('name') name: string,
    @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<Item>> {
    return this.itemsService.findAllItemCodeByItemName(name, pageOptionsDto);
  }

  @UseInterceptors(new TransformInterceptor())
  @Put('update')
  @UseGuards(AuthenticatedGuard)
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
  public async updateItem(
    @Query('id', ParseIntPipe) id: number,
    @Body() dto: UpdateItemDto,
    @Res() res: Response,
  ) {
    const instance = await this.itemsService.updateOne(id, dto);
    return res.status(200).json({
      statusCode: res.statusCode,
      message: Status.SUCCESS,
      data: { item: instance },
    });
  }

  @Delete('delete')
  @UseGuards(AuthenticatedGuard)
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
  public async deleteItem(@Query('id', ParseIntPipe) id: number) {
    await this.itemsService.deleteById(id);
  }
}
