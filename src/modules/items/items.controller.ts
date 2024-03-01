import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors, ClassSerializerInterceptor, Res, Req } from '@nestjs/common';
import { ItemsService } from './items.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { ApiBadRequestResponse, ApiBody, ApiForbiddenResponse, ApiInternalServerErrorResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthenticatedGuard } from 'src/security/guards/authenticated.guard';
import { Request, Response } from 'express';
import { Item } from './entities/item.entity';

@UseGuards(AuthenticatedGuard)
@ApiTags('Item')
@Controller('items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}
  
  @ApiOkResponse({
    description: "Creating one item record",
    schema: {
      type: "object",
      properties: {
        status:{type: "number", example: 200},
        message:{type: "string", example: "OK"},
        data: {type: "object", example: {item:{}}}
      }
    }
  })
  @ApiBadRequestResponse({
    description: "Bad Request",
    schema: {
        type: "object",
        properties: {
            error: {type: "array", example:["username cannot be empty","email pattern not valid"]}
        }
    }
  })
  @ApiForbiddenResponse({
  description: "Forbidden resource or ability",
  schema: {
      type: "object",
      properties: {
          statusCode: {type: "number",example: 401},
          message: {type: "string", example: "Not Authenticated"},
          error: {type: "string", example: "Forbidden"}
      }
  }
  })
  @ApiInternalServerErrorResponse({
  description: "Internal Server Error",
  schema: {
      type: "object",
      properties: {
          message: {type: "string", example: "Internal server error"},
          status: {type: "number", example: 500}
      }
  }
  })
  @ApiBody({type: CreateItemDto, description: "DTO Structure response from create one item"})
  // @UseInterceptors(ClassSerializerInterceptor)
  @Post('create')
  async createOneItem(@Body() dto: CreateItemDto, @Req() request: Request, @Res() response: Response){
    const data = await this.itemsService.createOne(request,dto);

    return response.status(response.statusCode).json({
      statusCode: response.statusCode,
      message: "OK",
      data: {item: data}
    });
  }

}
