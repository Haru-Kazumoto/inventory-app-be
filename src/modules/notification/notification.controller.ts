import { Controller, Get, Delete, Res, Query, UseGuards } from '@nestjs/common';
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
}
