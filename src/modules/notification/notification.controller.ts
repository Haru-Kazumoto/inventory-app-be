import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, ClassSerializerInterceptor, Res } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { ApiBadRequestResponse, ApiHideProperty, ApiOkResponse, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Notification } from './entities/notification.entity';
import { Response } from 'express';
import { Status } from 'src/enums/response.enum';

@ApiTags("Notification")
@UseInterceptors(ClassSerializerInterceptor)
@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @ApiQuery({
    name: "id",
    description: "User id parameter",
    type: Number,
    required: true
  })
  @ApiOkResponse({
    description: "OK Response",
    isArray: true,
    schema: {
      type: "object",
      properties: {
        statusCode: {type: "number", example: 200},
        message: {type: "string", example: "SUCCESS"},
        data: {type: "array", example: { notifications:[{}] }}
      }
    }
  })
  @ApiBadRequestResponse({
    description: "BAD_REQUEST Response",
    schema: {
      type: "object",
      properties: {
        statusCode: {type: "number", example: 400},
        message: {type: "string", example: "Id not found"}
      }
    }
  })
  @Get("get-notifications")
  async getNotifications(userId: number, @Res() res: Response): Promise<any> {
    return res.status(200).json({
      statusCode: res.statusCode,
      message: Status.SUCCESS,
      data: {
        notifications: await this.notificationService.getNotifications(userId)
      }
    });
  }
}
