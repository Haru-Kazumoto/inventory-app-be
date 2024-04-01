import { Controller, Get, Delete, Res, Query, UseGuards, Patch } from '@nestjs/common';
import { NotificationService } from './notification.service';
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { Response } from 'express';
import { Status } from 'src/enums/response.enum';
import { AuthenticatedGuard } from 'src/security/guards/authenticated.guard';

@UseGuards(AuthenticatedGuard)
@ApiTags('Notification')
@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @ApiQuery({
    name: 'id',
    description: 'User id parameter',
    type: Number,
    required: true,
  })
  @ApiOkResponse({
    description: 'OK Response',
    isArray: true,
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 200 },
        message: { type: 'string', example: 'SUCCESS' },
        data: { type: 'array', example: { notifications: [{}] } },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'BAD_REQUEST Response',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: { type: 'string', example: 'Id not found' },
      },
    },
  })
  @Get('get-notifications')
  async getNotifications(@Query("id") userId: number): Promise<any> {
    const data = await this.notificationService.getNotifications(userId);

    return {
      [this.getNotifications.name]: data
    }
  }

  @ApiQuery({
    name: 'notif-id',
    description: 'Delete notification by id',
    type: Number,
    required: true,
  })
  @Delete('delete-notification')
  async deleteNotification(@Query('notif-id') notifId: number) {
    await this.notificationService.deleteNotification(notifId);
  }

  @ApiQuery({
    name: "notif-id",
    description: "get notification by id",
    type: Number,
    required: true
  })
  @Get("find-notif-by-id")
  async findNotifById(@Query('notif-id') notifId: number){
    const data = await this.notificationService.findNotificationById(notifId);

    return {
      [this.findNotifById.name]: data
    }
  }

  @ApiQuery({
    name: "user-id",
    description: "Change all notification to has read by user id",
    required: true,
    type: Number
  })
  @Patch('read-all')
  async readAllNotification(@Query('user-id') userId: number) {
    await this.notificationService.readAllNotification(userId);
  }
}
