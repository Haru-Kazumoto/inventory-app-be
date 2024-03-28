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
import { CreateClassDto } from './dto/create-class.dto';
import { Class } from './entitites/class.entity';
import { ApiPaginatedResponse } from 'src/decorator/paginate.decorator';
import { Status } from 'src/enums/response.enum';
import { Response } from 'express';
import { UpdateClassDto } from './dto/update-class.dto';

@UseGuards(AuthenticatedGuard)
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
  async createOneClass(@Body() dto: CreateClassDto) {
    const data = await this.classService.createOne(dto);

    return {
      [this.createOneClass.name]: data
    }
  }

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
  public async findManyClass() {
    const classData = await this.classService.findMany();

    return {
      [this.findManyClass.name]: classData
    }
  }

  @Put('update')
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
  ) {
    const instance = await this.classService.updateOne(id, dto);
    
    return {
      [this.updateClass.name]: instance
    }
  }

  @Delete('delete')
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
