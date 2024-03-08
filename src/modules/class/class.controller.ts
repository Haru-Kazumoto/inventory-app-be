import {
  Body,
  Controller,
  Delete,
  Get,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ClassService } from './class.service';
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
import { CreateClassDto, UpdateClassDto } from './dto/class.dto';
import { Class } from './entitites/class.entity';
import { ApiPaginatedResponse } from 'src/decorator/paginate.decorator';
import { PageDto, PageOptionsDto } from 'src/utils/pagination.utils';
import { Status } from 'src/enums/response.enum';
import { TransformInterceptor } from 'src/interceptors/transform.interceptor';
import { Response } from 'express';

@ApiTags('Class')
@Controller('class')
export class ClassController {
  constructor(private readonly classService: ClassService) {}

  @ApiOkResponse({
    description: 'Creating one class',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'number', example: 200 },
        message: { type: 'string', example: 'OK' },
        data: { type: 'object', example: { class: {} } },
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
          example: ['class name cannot be empty', 'email pattern not valid'],
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
    type: CreateClassDto,
    description: 'DTO Structure response from create one class',
  })
  @ApiBody({
    type: CreateClassDto,
    description: 'DTO Structure response from create one class',
  })
  @Post('create')
  async createOneClass(@Body() dto: CreateClassDto, @Res() response: Response) {
    const data = await this.classService.createOne(dto);

    return response.status(response.statusCode).json({
      statusCode: response.statusCode,
      message: 'OK',
      data: { class: data },
    });
  }

  @UseGuards(AuthenticatedGuard)
  @Get('find-all')
  @ApiOkResponse({
    description: 'Success get all class',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 200 },
        message: { type: 'string', example: 'OK' },
        data: { type: 'array', example: { class: [{}] } },
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
  @ApiPaginatedResponse(Class)
  public async findManyClass(@Res() response: Response) {
    const classData = await this.classService.findMany();

    return response.status(response.statusCode).json({
      statusCode: response.statusCode,
      message: 'OK',
      data: classData,
    });
  }

  @UseInterceptors(new TransformInterceptor())
  @Put('update')
  @UseGuards(AuthenticatedGuard)
  @ApiOkResponse({
    description: 'Success to update one record of class',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 200 },
        message: { type: 'string', example: 'SUCCESS' },
        data: { type: 'object', example: { class: {} } },
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
    type: UpdateClassDto,
    description: 'DTO Request for update',
    required: true,
  })
  @ApiQuery({
    name: 'id',
    description: 'Id class for update',
    type: Number,
    required: true,
  })
  public async updateClass(
    @Query('id', ParseIntPipe) id: number,
    @Body() dto: UpdateClassDto,
    @Res() res: Response,
  ) {
    const instance = await this.classService.updateOne(id, dto);
    return res.status(200).json({
      statusCode: res.statusCode,
      message: Status.SUCCESS,
      data: { class: instance },
    });
  }

  @Delete('delete')
  @UseGuards(AuthenticatedGuard)
  @ApiQuery({
    name: 'id',
    description: 'Id for delete class',
    type: Number,
    required: true,
  })
  @ApiBadRequestResponse({
    description: 'Bad request response',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: { type: 'string', example: 'Id class tidak ditemukan' },
      },
    },
  })
  public async deleteClass(@Query('id', ParseIntPipe) id: number) {
    await this.classService.deleteById(id);
  }
}
