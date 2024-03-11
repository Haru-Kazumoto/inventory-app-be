import { Body, Controller, Get, HttpStatus, Post, Query, Res, UseGuards } from '@nestjs/common';
import { ExitLogsService } from './exit_logs.service';
import { AuthenticatedGuard } from 'src/security/guards/authenticated.guard';
import { ApiBody, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CreateExitLogDto } from './dtos/exit_logs.dto';
import { Response } from 'express';
import { ApiPaginatedResponse } from 'src/decorator/paginate.decorator';
import { ExitLogs } from './entities/exit_logs.entity';
import { PageOptionsDto } from 'src/utils/pagination.utils';

@ApiTags('ExitLogs')
@UseGuards(AuthenticatedGuard)
@Controller('exit-logs')
export class ExitLogsController {
  constructor(private readonly exitLogsService: ExitLogsService) {}

  @Get('find-all')
  @ApiPaginatedResponse(ExitLogs)
  async findManyLogsWithPagination(@Query() pageOptionsDto: PageOptionsDto) {
    return await this.exitLogsService.findAllLogs(pageOptionsDto);
  }

  @ApiQuery({
    name: "borrower-name",
    description: "query for find log by borrower name",
    type: String,
    required: true
  })
  @Get('find-log-by-name')
  async findLogByBorrowerName(@Query("borrower-name") borrowerName: string) {
    return await this.exitLogsService.findLogByBorrowerName(borrowerName);
  }

}
