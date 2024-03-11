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
  @UseGuards(AuthenticatedGuard)
  @Get('get-notifications')
  async getNotifications(userId: number, @Res() res: Response): Promise<any> {
    return res.status(200).json({
      statusCode: res.statusCode,
      message: Status.SUCCESS,
      data: {
        notifications: await this.notificationService.getNotifications(userId),
      },
    });
  }

  @ApiQuery({
    name: 'notif-id',
    description: 'Delete notification by id',
    type: Number,
    required: true,
  })
  @UseGuards(AuthenticatedGuard)
  @Delete('delete-notification')
  async deleteNotification(
    @Query('notif-id') notifId: number,
    @Res() response: Response,
  ) {
    await this.notificationService.deleteNotification(notifId);

    return response.status(200).json({
      statusCode: 200,
      message: 'DELETED',
    });
  }
}
