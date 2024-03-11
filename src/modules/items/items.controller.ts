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

@UseGuards(AuthenticatedGuard)
@ApiTags('Item')
@Controller('items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

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
    type: String,
    required: false,
  })
  @ApiQuery({
    name: 'class',
    description: 'Class of item',
    type: String,
    required: false,
  })
  @ApiQuery({
    name: 'name',
    description: 'Name of item',
    type: String,
    required: false,
  })
  @ApiQuery({
    name: 'status',
    description: 'Status of item',
    type: String,
    required: false,
  })
  public async findManyItem(
    @Query('category') category: ItemCategory,
    @Query('status') status: StatusItem,
    @Query('name') itemName: string,
    @Query('class') className: string,
    @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<Item>> {
    return this.itemsService.findMany(
      category,
      className,
      itemName,
      status,
      pageOptionsDto,
    );
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
