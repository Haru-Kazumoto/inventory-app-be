import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuditLogsService } from './audit-logs.service';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthenticatedGuard } from 'src/security/guards/authenticated.guard';
import { CreateAuditLogsDto } from './dto/create-auditlogs.dto';
import { Request, Response } from 'express';

@ApiTags('AuditLog')
@UseGuards(AuthenticatedGuard)
@Controller('audit-logs')
export class AuditLogsController {
  constructor(private readonly auditLogsService: AuditLogsService) {}

  @ApiOkResponse({
    description: 'Creating audit log report',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'number', example: 200 },
        message: { type: 'string', example: 'OK' },
        data: { type: 'object', example: { audit: {} } },
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
          example: ['audit log report cannot be empty', 'pattern not valid'],
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
    type: CreateAuditLogsDto,
    description: 'DTO Structure response from create audit log',
  })
  @Post('create')
  async createAuditLogReport(
    @Body() dto: CreateAuditLogsDto,
    @Res() response: Response,
  ) {
    const data = await this.auditLogsService.createReport(dto);

    return response.status(response.statusCode).json({
      statusCode: response.statusCode,
      message: 'OK',
      data: { auditLog: data },
    });
  }
}
