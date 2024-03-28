import {
  Body,
  Controller,
  Delete,
  Get,
  ParseIntPipe,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuditLogsService } from './audit-logs.service';
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
import { CreateAuditLogsDto } from './dto/create-auditlogs.dto';

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
  async createAuditLogReport(@Body() dto: CreateAuditLogsDto) {
    const data = await this.auditLogsService.createReport(dto);

    return {
      [this.createAuditLogReport.name]: data
    }
  }

  @Get('find-all')
  @ApiOkResponse({
    description: 'Success get all audit log reports',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 200 },
        message: { type: 'string', example: 'OK' },
        data: { type: 'array', example: { reports: [{}] } },
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
  public async findManyAuditLogReport() {
    const reportData = await this.auditLogsService.getAllReport();

    return {
      [this.findManyAuditLogReport.name]: reportData
    }
  }

  @Delete('delete')
  @ApiQuery({
    name: 'id',
    description: 'Id for delete audit log',
    type: Number,
    required: true,
  })
  @ApiBadRequestResponse({
    description: 'Bad request response',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: { type: 'string', example: 'Id audit log tidak ditemukan' },
      },
    },
  })
  public async deleteAuditLogReport(@Query('id', ParseIntPipe) id: number): Promise<any> {
    return this.auditLogsService.deleteOneReport(id);
  }
}
